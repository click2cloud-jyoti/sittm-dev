var config = require('../../config').pool;
const sendMail = require('../common-controller/CommonMail');

function NominateTalentDetails(req, res, next) {

    var responseJson = {
        err: false,
        data: {
            certificates: [],
            managers: []
        },
        login: true,
        msg: null
    }

    try {

        config.connect((err, client, done) => {
            if (err) throw err;
            else {
                var qurStr = `select _sittm_nominate_talent_v2('nominate','','','','','','','','','','','','','','true',0)`;
                console.log(qurStr);
                client.query(qurStr, (err, response) => {
                    done();
                    if (err) throw err;
                    console.log(response.rows)
                    responseJson.data.certificates = (response.rows && response.rows[0] && response.rows[0]._sittm_nominate_talent_v2) || [];
                    responseJson.data.managers = (response.rows && response.rows[1] && response.rows[1]._sittm_nominate_talent_v2) || [];
                    res.send(responseJson);
                })
            }
        })

    } catch (err) {
        console.log(err);
        responseJson.err = true;
        responseJson.msg = err;
        res.send(responseJson);
    }

}
exports.NominateTalentDetails = NominateTalentDetails;


function NominateTalentAliasCheck(req, res, next) {
    var responseJson = {
        err: false,
        data: {
            exists: true
        },
        login: true,
        msg: null
    }
    try {

        var alias = req.body.alias || '';

        config.connect((err, client, done) => {
            if (err) throw err;
            else {
                var qurStr = `select _sittm_nominate_talent_v2('check_alias','${alias}','','','','','','','','','','','','','true',0)`;
                console.log(qurStr);
                client.query(qurStr, (err, response) => {
                    done();
                    if (err) throw err;
                    console.log(response.rows[0]._sittm_nominate_talent_v2);
                    responseJson.data.exists = (response.rows && response.rows[0] && response.rows[0]._sittm_nominate_talent_v2 && response.rows[0]._sittm_nominate_talent_v2[0] && response.rows[0]._sittm_nominate_talent_v2[0].exists);
                    res.send(responseJson);
                })
            }
        })

    } catch (err) {
        console.log(err);
        responseJson.err = true;
        responseJson.msg = err;
        res.send(responseJson);
    }
}
exports.NominateTalentAliasCheck = NominateTalentAliasCheck;

function NominateTalentInsertDetails(req, res, next) {
    var responseJson = {
        err: false,
        data: {
            successful: false
        },
        login: true,
        msg: null
    }

    try {
        //notification extra
        var user_name = req.body.user.displayName
        var user_email = req.body.user.email
        var datetime = new Date();
        var today = datetime.toISOString()

        var mode = req.body.mode || '';
        var alias = req.body.alias || '';
        var mobility = req.body.mobility || null;
        var travel_tolerance = req.body.travel_tolerance || null;
        var project = req.body.project || '';
        var motivators = req.body.motivators || '';
        var quick_facts = req.body.quick_facts || '';
        var delievarables = req.body.delievarables || '';
        var label_motivational_factor = req.body.label_motivational_factor || '';
        var label_deliverables = req.body.label_deliverables || '';
        var label_quick_facts = req.body.label_quick_facts || '';
        var training = req.body.training || null;
        var area_of_interest = req.body.area_of_interest || '';
        var manager = req.body.manager || null;
        var personnel_nbr = getRandomString() || 0;
        config.connect((err, client, done) => {
            if (err) throw err;
            else {
                var qurStr = `select _sittm_nominate_talent_v2('save','${alias}','${mobility}','${travel_tolerance}','${project}','','${quick_facts}','${delievarables}',null,null,null,'${training}','${area_of_interest}','${manager}','true',${personnel_nbr})`;
                console.log(qurStr);
                client.query(qurStr, (err, response) => {
                    // done();
                    if (err) throw err;
                    console.log(response.rows);
                    responseJson.data = response;
                    responseJson.data.successful = (response.rows && response.rows[0] && response.rows[0]._sittm_nominate_talent_v2 && response.rows[0]._sittm_nominate_talent_v2[0] && response.rows[0]._sittm_nominate_talent_v2[0].exists) || false;

                    var qurStr = `select _sittm_notifications_save('save','${personnel_nbr}','${alias}','${user_name}','${user_email}','${manager}','Pending','${today}','false')`;
                    console.log(qurStr);
                    client.query(qurStr, (err, response) => {
                        // done();
                        if (err) throw err;
                        console.log(response.rows);

                        //email
                        var qurStr = `select distinct name,email from sittm_admins inner join sittm_users on sittm_admins.adminid=sittm_users.id`;
                        console.log(qurStr);
                        client.query(qurStr, (err, response) => {
                            done();
                            if (err) throw err;
                            console.log(response.rows);
                            if (response.rows != null)
                                if (response.rows.length != 0) {
                                    admin = []
                                    for (k = 0; k < response.rows.length; k++) {
                                        admin.push(response.rows[k].email)
                                    }
                                    adminmails = admin.toString()

                                    //mail
                                    var mailcc = user_email + ", " + "pratiksha.shrivas@click2cloud.net"
                                    var mailSub = `Talent Nominated:  ${alias}`
                                    mailHtml = `Hello,<br><br>${alias} has been nominated by ${user_name} for reporting authority ${manager}.<br><br>Thank You,<br>Azure cloud and AI`;
                                    var mailBody = {
                                        from: 'cloudbrain-support@click2cloud.net',
                                        to: adminmails,
                                        cc: mailcc,
                                        //  cc: "pinara@microsoft.com, mknudsen@microsoft.com ",
                                        subject: mailSub,
                                        text: 'SITTM Nomination Details',
                                        html: mailHtml
                                            // html body'
                                    }
                                    sendMail.sendMail(mailBody, (response) => {
                                        console.log('Mail response', response)
                                    }, (err) => {
                                        console.log('Mail error', err)
                                    })
                                    res.send(responseJson);
                                }
                        })
                    })

                })
            }
        })

    } catch (err) {
        console.log(err);
        responseJson.err = true;
        responseJson.msg = err;
        res.send(responseJson);
    }
}
exports.NominateTalentInsertDetails = NominateTalentInsertDetails;

function NominateTalent(req, res, next) {
    var nominate = '';
    var is_deleted = false
    console.log('HomeController')
    if (req.body.nominate) {
        nominate = req.body.nominate;

    }
    console.log('nominate', nominate)
    config.connect((err, client, done) => {
        if (err) throw err;
        else {
            var qurStr = `select _sittm_nominate_talent('${nominate}','','','','','','','','','','','','','','${is_deleted}',0)`;
            console.log(qurStr);
            client.query(qurStr, (err, response) => {
                done();
                // console.log('dataList',dataList)
                if (err) throw err;
                if (response) {
                    // dataList = response.rows[0]
                    // response.rows[0]
                    console.log('dataList', response)
                        // dataList = response.rows[0]._sittm_nominate_talent || [];
                    res.send(response);
                }
            })
        }
    })
}

exports.NominateTalent = NominateTalent;

function saveTalent(req, res, next) {
    console.log('HomeController saveTalent..')
    var p_mode = '';
    var p_alias = '';
    var p_mobility = '';
    var p_travel_tolerance = '';
    var p_project = '';
    var p_motivator = '';
    var p_training_opportunities = '';
    var p_area_of_interest = '';
    var p_quick_facts = '';
    var p_delivberables = '';
    var p_tagname = '';
    var p_label_motivational_factor = '';
    var p_label_deliverables = '';
    var p_label_quick_facts = '';
    var p_manager = '';
    if (req.body.p_mode) {
        p_mode = req.body.p_mode;
        console.log(p_mode)
    }
    if (req.body.alias) {
        p_alias = req.body.alias;
        console.log(p_alias)
    }
    if (req.body.mobility) {
        p_mobility = req.body.mobility;
        console.log(p_mobility)
    }
    if (req.body.travel_tolerance) {

        p_travel_tolerance = req.body.travel_tolerance;
        console.log(p_travel_tolerance)
    }
    if (req.body.project) {
        p_project = req.body.project;
        console.log(p_project)
    }
    if (req.body.motivator) {
        p_motivator = req.body.motivator;
        console.log(p_motivator)
    }
    if (req.body.training_opportunities) {
        p_training_opportunities = req.body.training_opportunities;
        console.log(p_training_opportunities)
    }
    if (req.body.area_of_interest) {
        p_area_of_interest = req.body.area_of_interest;
        console.log(p_area_of_interest)
    }
    if (req.body.facts) {
        p_quick_facts = req.body.facts;
        console.log(p_quick_facts)
    }

    if (req.body.delivberables) {
        p_delivberables = req.body.delivberables;
        console.log(p_delivberables)
    }

    if (req.body.label_motivational_factor) {
        p_label_motivational_factor = req.body.label_motivational_factor;
        console.log("p_label_motivational_factor", p_label_motivational_factor)
    }
    if (req.body.label_deliverables) {
        p_label_deliverables = req.body.label_deliverables;
        console.log("p_label_deliverables", p_label_deliverables)
    }
    if (req.body.label_quick_facts) {
        p_label_quick_facts = req.body.label_quick_facts;
        console.log("p_label_quick_facts", p_label_quick_facts)
    }

    if (req.body.manager) {
        p_manager = req.body.manager;
        console.log("manager", p_manager)
    }


    var personnel_nbr = getRandomString();
    console.log('personnel_nbr', personnel_nbr)
    config.connect((err, client, done) => {
        if (err) throw err;
        else {
            var qurStr = `select _sittm_nominate_talent('${p_mode}','${p_alias}',
            '${p_mobility}','${p_travel_tolerance}','${p_project}','${p_motivator}','${p_quick_facts}','${p_delivberables}',
            '${p_label_motivational_factor}','${p_label_deliverables}','${p_label_quick_facts}','${p_training_opportunities}','${p_area_of_interest}','${p_manager}',false,'${personnel_nbr}')`;
            console.log(qurStr);
            client.query(qurStr, (err, response) => {
                done();
                // console.log('dataList',dataList)
                if (err) throw err;
                if (response) {
                    dataList = response.rows[0]
                    console.log('dataList', response)
                        // dataList = response.rows[0]._sittm_nominate_talent || [];
                    res.send(dataList);
                }
            })
        }
    })
}

exports.saveTalent = saveTalent;

function getTalentinfo(req, res, next) {
    var is_deleted = false
    var p_mode = '';
    console.log(req.body.p_mode)
    p_mode = req.body.p_mode;
    config.connect((err, client, done) => {
        if (err) throw err;
        else {
            var qurStr = `select _sittm_nominate_talent('${p_mode}','',
            '','','','','','',
            '','','','','','','${is_deleted}',0)`;
            console.log(qurStr);
            client.query(qurStr, (err, response) => {
                done();
                // console.log('dataList',dataList)
                if (err) throw err;
                if (response) {
                    dataList = response.rows[0]
                    console.log('dataList', response)
                        // dataList = response.rows[0]._sittm_nominate_talent || [];
                    res.send(dataList);
                }
            })
        }
    })
}
exports.getTalentinfo = getTalentinfo;

function getRandomString() {
    const uniqueRandom = require('unique-random');
    const random = uniqueRandom(1, 100000);
    return random();
}
exports.getRandomString = getRandomString;


//notifications
function checkAdminConsent(req, res, next) {
    var responseJson = {
        err: false,
        data: {
            successful: false
        },
        login: true,
        msg: null
    }

    try {
        var user_email = req.body.user.email

        config.connect((err, client, done) => {
            if (err) throw err;
            else {
                var qurStr = `select distinct name,email from sittm_admins inner join sittm_users on sittm_admins.adminid=sittm_users.id where  email='${user_email}'`;
                console.log(qurStr);
                client.query(qurStr, (err, response) => {
                    done();
                    if (err) throw err;
                    console.log(response.rows);
                    responseJson.data = response.rows;
                    res.send(responseJson);
                })
            }
        })

    } catch (err) {
        console.log(err);
        responseJson.err = true;
        responseJson.msg = err;
        res.send(responseJson);
    }
}
exports.checkAdminConsent = checkAdminConsent;


function getNotificationEntries(req, res, next) {
    var responseJson = {
        err: false,
        data: {
            successful: false
        },
        login: true,
        msg: null
    }

    try {
        config.connect((err, client, done) => {
            if (err) throw err;
            else {
                var qurStr = `select _sittm_notifications_save('get_entries',null,'','','','','','','false')`;
                console.log(qurStr);
                client.query(qurStr, (err, response) => {
                    done();
                    if (err) throw err;
                    console.log(response.rows);
                    responseJson.data = response.rows[0]._sittm_notifications_save;
                    res.send(responseJson);
                })
            }
        })
    } catch (err) {
        console.log(err);
        responseJson.err = true;
        responseJson.msg = err;
        res.send(responseJson);
    }
}
exports.getNotificationEntries = getNotificationEntries;

function updateNotificationEntries(req, res, next) {
    var responseJson = {
        err: false,
        data: {
            successful: false
        },
        login: true,
        msg: null
    }

    try {
        var user_name = req.body.user.displayName
        var user_email = req.body.user.email
        var datetime = new Date();
        var today = datetime.toISOString()
        var status = req.body.status || '';
        var alias = req.body.name || '';
        var manager = req.body.manager || null;
        var reporting_authority = req.body.reporting_authority || null;
        config.connect((err, client, done) => {
            if (err) throw err;
            else {
                var qurStr = `select _sittm_notifications_save('update',null,'${alias}','${user_name}','${reporting_authority}','${manager}','${status}','${today}','false')`;
                console.log(qurStr);
                client.query(qurStr, (err, response) => {
                    //done();
                    if (err) throw err;
                    console.log(response.rows);
                    responseJson.data = response.rows[0]._sittm_notifications_save;

                    //email
                    var qurStr = `select distinct name,email from sittm_admins inner join sittm_users on sittm_admins.adminid=sittm_users.id`;
                    console.log(qurStr);
                    client.query(qurStr, (err, response) => {
                        done();
                        if (err) throw err;
                        console.log(response.rows);
                        if (response.rows != null)
                            if (response.rows.length != 0) {
                                admin = []
                                for (k = 0; k < response.rows.length; k++) {
                                    admin.push(response.rows[k].email)
                                }
                                adminmails = admin.toString()

                                //mail
                                var mailcc = user_email + ", " + "pratiksha.shrivas@click2cloud.net"
                                var mailSub = `Talent ${alias} status: ${status}`
                                mailHtml = `Hello,<br><br>${alias} nominated by ${manager} for reporting authority ${reporting_authority} has been ${status} by ${user_name}.<br><br>Thank You,<br>Azure cloud and AI`;
                                var mailBody = {
                                    from: 'cloudbrain-support@click2cloud.net',
                                    to: adminmails,
                                    cc: mailcc,
                                    //  cc: "pinara@microsoft.com, mknudsen@microsoft.com ",
                                    subject: mailSub,
                                    text: 'SITTM Nomination Status',
                                    html: mailHtml
                                        // html body'
                                }
                                sendMail.sendMail(mailBody, (response) => {
                                    console.log('Mail response', response)
                                }, (err) => {
                                    console.log('Mail error', err)
                                })
                                res.send(responseJson);
                            }
                    })
                })
            }
        })

    } catch (err) {
        console.log(err);
        responseJson.err = true;
        responseJson.msg = err;
        res.send(responseJson);
    }
}
exports.updateNotificationEntries = updateNotificationEntries;