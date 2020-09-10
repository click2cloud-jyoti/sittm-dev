var createError = require('http-errors');
// const {
//   Client,
//   Pool
// } = require('pg');

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'ROOT#123',
//   port: 5432
// });
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
require('dotenv').config();

// var sleep = require('sleep');

const config = require('./config');
// var PGStore = require('connect-pg')

var passport = require('passport');
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

var pgSession = require('connect-pg-simple')(session);

var users = {};

passport.serializeUser(function (user, done) {

  done(null, user.profile.oid);
});

passport.deserializeUser(function (id, done) {
  try {
    var queryStr = `select * from sittm_session where oid = '${id}' and is_expired = false`
    config.postgresQueryExecute(queryStr, (response) => {
      var session = response.rows[0].details
      done(null, JSON.parse(session));
    }, (err) => {
      done(err, null);
    });
  } catch (error) {
    done(error, null);
  }

});

const oauth2 = require('simple-oauth2').create({
  client: {
    id: process.env.OAUTH_APP_ID,
    secret: process.env.OAUTH_APP_PASSWORD
  },
  auth: {
    tokenHost: process.env.OAUTH_AUTHORITY,
    authorizePath: process.env.OAUTH_AUTHORIZE_ENDPOINT,
    tokenPath: process.env.OAUTH_TOKEN_ENDPOINT
  }
});

async function signInComplete(iss, sub, profile, accessToken, refreshToken, params, done) {
  if (!profile.oid) {
    return done(new Error("No OID found in user profile."));
  }

  try {
    const user = await graph.getUserDetails(accessToken);
    console.log("user details", user)
    if (user) {
      // Add properties to profile
      profile['email'] = user.mail ? user.mail : user.userPrincipalName;
    }
  } catch (err) {
    return done(err);
  }

  // Create a simple-oauth2 token from raw tokens
  let oauthToken = oauth2.accessToken.create(params);

  var details = {
    profile,
    oauthToken
  }
  try {
    var queryStr = `insert into sittm_session(oid, details, time, is_expired, sign_in_user) 
  values('${profile.oid || ''}', '${JSON.stringify(details) || ''}', timezone('utc', now())::text, false, '${profile.displayName || ''}')`
    config.postgresQueryExecute(queryStr, (response) => {
      return done(null, details);
    }, (err) => {
      return done(err, null);
    });
  } catch (error) {
    return done(error, null);
  }
}
// </SignInCompleteSnippet>

// Configure OIDC strategy
passport.use(new OIDCStrategy({
    identityMetadata: `${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}`,
    clientID: process.env.OAUTH_APP_ID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: process.env.OAUTH_REDIRECT_URI,
    allowHttpForRedirectUrl: true,
    clientSecret: process.env.OAUTH_APP_PASSWORD,
    validateIssuer: false,
    passReqToCallback: false,
    scope: process.env.OAUTH_SCOPES.split(' ')
  },
  signInComplete
));

// file upload
const fileUpload = require('express-fileupload');

var graph = require('./graph');

var authRouter = require('./routes/auth');
var routes = require('./routes/index');
var apicall = require('./routes/apis');
var users = require('./routes/users');

const helmet = require('helmet');

const app = express();

app.locals.angularJS = "https://ajax.googleapis.com/ajax/libs/angularjs/1.8.0/angular.min.js";

// file upload
app.use(fileUpload({
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024
  },
}));

// app.set('trust proxy', 1) 

app.use(session({
  secret: 'your_secret_value_here',
  resave: false,
  store: new pgSession({
    pool: config.pool,
    tableName: 'session'
  }),
  saveUninitialized: false,
  unset: 'destroy',
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}));
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware
app.use(flash());

// Set up local vars for template layout
app.use(function (req, res, next) {
  // in the response locals
  res.locals.error = req.flash('error_msg');

  var errs = req.flash('error');
  for (var i in errs) {
    res.locals.error.push({
      message: 'An error occurred',
      debug: errs[i]
    });
  }

  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views/sample-view/'));

// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/api', apicall);
app.use('/users', users);
app.use('/auth', authRouter);

// app.use(loginCheckFunc)

// function loginCheckFunc(req, res, next) {
//   if (req.user) {
//     var email = (req.user && req.user.profile && req.user.profile.email) || '';
//     config.postgresQueryExecute(`select exists(select 1 from sittm_users where email = '${email}' and is_deleted != true)`, (res) => {
//       console.log(res.rows);
//       const exists = (res.rows && res.rows[0] && res.rows[0].exists) || false;
//       if (exists)
//         next();
//       else {
//         req.session.destroy(function (err) {
//           req.logout();
//           res.redirectUrl('/')
//           // res.redirect(req.get('referer'));
//         });
//       }

//     }, (err) => {
//       console.log('redirecting back to home page.')
//       return res.redirect('/')
//     })
//   } else {
//     console.log('redirecting back to home page.')
//     req.session.destroy(function (err) {
//       req.logout();
//       return res.redirect('/')
//       // res.redirect(req.get('referer'));
//     });
//   }
// }

app.use(function (req, res, next) {
  // Set the authenticated user in the
  // template locals
  if (req.user) {
    res.locals.user = JSON.stringify(req.user.profile) || null;
    // console.log('res.locals.user', res.locals.user)
    next();
  } else {
    next();
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(JSON.stringify(err))
  res.status(err.status || 500);
  res.render('error');
  // res.end();
});


app.set('port', process.env.NODE_PORT || 8080);

var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + server.address().port);
});