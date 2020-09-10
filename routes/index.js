'use strict';
var express = require('express');
var router = express.Router();
var config = require('../config');
const {
    json
} = require('body-parser');
const e = require('express');

function sessionCheck(req, res, next) {
    if (req.user) {
        config.postgresQueryExecute(`select exists (select 1 from sittm_users where email = '${req.user.profile.email}' and is_deleted != true);
        select to_char((select time from (select oid, time from sittm_session where jsonb(details) -> 'profile' ->> 'email' = '${req.user.profile.email}'
        order by time desc limit 2)t1 order by t1.time asc limit 1)::timestamp, 'MM/DD/YYYY HH:MI');
        select alias, position, personnel_nbr from sittm_users where email = '${req.user.profile.email}' and is_deleted != true;`, (res) => {

            const exists = (res[0].rows && res[0].rows[0] && res[0].rows[0].exists) || false;
            if (exists) {
                req.sessionTimeUser = (res[1].rows && res[1].rows[0] && res[1].rows[0].to_char) || null;
                req.userExDetails = {
                    'alias' : (res[2].rows && res[2].rows[0] && res[2].rows[0].alias) || null,
                    'position' : (res[2].rows && res[2].rows[0] && res[2].rows[0].position) || null,
                    'personnel_nbr' : (res[2].rows && res[2].rows[0] && res[2].rows[0].personnel_nbr) || null,
                }
                console.log(req.userExDetails)
                console.log('session time ', req.sessionTimeUser)
                next();
            } else {
                req.session.destroy(function (err) {
                    req.logout();
                    next();
                });
            }
        }, (err) => {
            console.log(err);
        })
    } else {
        next();
    }
}

router.get('/', sessionCheck, function (req, res, next) {
    var tempUser = {
        displayName: null,
        email: null,
        lastLoginTime: null
    };

    if (req.user) {
        tempUser = {
            displayName: req.user.profile.displayName,
            email: req.user.profile.email,
            lastLoginTime: req.sessionTimeUser
        }
        console.log(tempUser)
        res.render('index', {
            data: {
                user: tempUser
            }
        });

    } else {
        res.render('index', {
            data: {
                user: tempUser
            }
        });
    }

});

router.get('/home', sessionCheck, function (req, res, next) {

    var tempUser = {
        displayName: null,
        email: null,
        lastLoginTime: null
    };
    if (req.user) {
        tempUser = {
            displayName: req.user.profile.displayName,
            email: req.user.profile.email,
            lastLoginTime: req.sessionTimeUser
        }
    }
    res.render('home', {
        data: {
            user: tempUser
        }
    });
});

router.get('/individual-card-manager', sessionCheck, function (req, res, next) {

    if (!req.isAuthenticated()) {
        res.redirect('/')
    } else {
        if (req.userExDetails.position.toLowerCase() == 'level3' || req.userExDetails.position.toLowerCase() == 'admin') {
            var tempUser = {
                displayName: null,
                email: null,
                lastLoginTime: null
            };
            if (req.user) {
                tempUser = {
                    displayName: req.user.profile.displayName,
                    email: req.user.profile.email,
                    lastLoginTime: req.sessionTimeUser,
                    level : req.userExDetails.position.toLowerCase()
                }
            }

            res.render('smml', {
                data: JSON.stringify({
                    err: false,
                    msg: '',
                    data: [],
                    user: tempUser
                })
            });

        } else if(req.userExDetails.position.toLowerCase() == 'level2') {

            var manager_id = req.userExDetails.personnel_nbr;
            var manager = req.userExDetails.alias;

            if (manager && manager_id) {
                res.render('manager-view', {
                    data: {
                        manager: manager,
                        manager_id: manager_id,
                        lastLoginTime: req.sessionTimeUser,
                        level : req.userExDetails.position.toLowerCase()
                    }
                });
            }
        }
    }
});

router.get('/manager-view', sessionCheck, function (req, res, next) {

    if (!req.isAuthenticated()) {
        res.redirect('/')
    } else {
        try {
            var tempData = req.query.data;
            var manager = decodeURIComponent(tempData);
            var parseManager = JSON.parse(manager);

            var manager_id = parseManager.personnel_nbr;
            var manager = parseManager.email;

            if (manager && manager_id) {
                res.render('manager-view', {
                    data: {
                        manager: manager,
                        manager_id: manager_id,
                        lastLoginTime: req.sessionTimeUser
                    }
                });
            } else {
                res.redirect('/');
            }
        } catch (error) {
            res.redirect('/');
        }
    }


});

router.get('/individual-card', sessionCheck, function (req, res, next) {
    if (!req.isAuthenticated()) {
        // if (!true) {
        res.redirect('/')
    } else {
        try {
            var tempUser = {
                displayName: null,
                email: null,
                lastLoginTime: null
            };
            if (req.user) {
                tempUser = {
                    displayName: req.user.profile.displayName,
                    email: req.user.profile.email,
                    lastLoginTime: req.sessionTimeUser
                }
            }

            var tempData = req.query.data;
            var talent = decodeURIComponent(tempData);
            var parseTalent = JSON.parse(talent);
            console.log(parseTalent)
            if (parseTalent.personnel_nbr && parseTalent.email) {
                res.render('individual_card', {
                    data: talent,
                    data1: tempUser
                });
            } else {
                res.redirect('/')
            }
        } catch (error) {
            console.log('catch block')
            res.redirect('/')
        }
    }
});

router.get('/dashboard', sessionCheck, function (req, res, next) {
    res.render('dashboard.html');
});

router.get('/nominate-talent', sessionCheck, function (req, res, next) {
    res.render('globalView.html');
});

router.get('/add_manager', sessionCheck, function (req, res, next) {
    res.render('add_manager');
});

module.exports = router;