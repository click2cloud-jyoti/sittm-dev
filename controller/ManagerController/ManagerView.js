var config = require('../../config').pool;

const sendMail = require('../common-controller/CommonMail');

function ManagerView(req, res, next) {
    var responseJson = {
        err: false,
        data : {},
        login : true,
        msg : null
    }

    var managerData = {
        "manager": [],
        "talent": []
    };

    try {
        var mode, id, manager;

        if (req.body.mode) {
            mode = req.body.mode;
        }
        if (req.body.id) {
            id = req.body.id;
        }
        if (req.body.manager) {
            manager = req.body.manager;
        }

        config.connect((err, client, done) => {
            if (err) throw err;
            console.log(`select _sittm_manager_details('${mode}', '${manager}', ${id})`);
            client.query(`select _sittm_manager_details('${mode}', '${manager}', ${id})`, (err, data) => {
                done()
                if (err) throw err;
                else {
                    managerData = {
                        "manager": data.rows[0]._sittm_manager_details || [],
                        "talent": data.rows[1]._sittm_manager_details || [],
                        "count" : data.rows[2]._sittm_manager_details[0] || {}
                    }
                    responseJson.data = managerData;
                    res.send(responseJson);
                }
            })
        })
    } catch (err) {
        console.log(err);
        responseJson.err = true,
        responseJson.msg = err
        res.send(responseJson);
    }
}
exports.ManagerView = ManagerView;


function EscalateTalent(req, res, next) {
    var datalist = [];
    var responseJson = {
        err: false,
        data : [],
        login : true,
        msg : null
    }

    try {
        var mode, id, manager, email, comment, email_id;

        console.log(req.body)

        if (req.body.p_id) {
            id = req.body.p_id;
        }
        if (req.body.mode) {
            mode = req.body.mode;
        }
        if (req.body.manager) {
            manager = req.body.manager;
        }
        if (req.body.email) {
            email = req.body.email;
        }
        if (req.body.comment) {
            comment = req.body.comment;
        }
        if (req.body.email_id) {
            email_id = req.body.email_id;
        }

        config.connect((err, client, done) => {
            if (err) throw err;
            var qurStr = `select _sittm_escalate_talent('${mode}', '${manager}', ${id}, '${email}', '${comment}')`;
            console.log(qurStr);
            client.query(qurStr, (err, data) => {
                done()
                if (err) throw err;
                else {
                    responseJson.data = (data.rows && data.rows[0] && data.rows[0]._sittm_escalate_talent) || [];
                     var mailHtml = '';
                     var mailSub = '';
                     if (mode == 'escalate_talent' || mode == 'individual_escalate_talent') {
                         mailHtml = `Hello,<br><br>The risk flag has been escalated for ${email} by ${req.user.profile.displayName} (${req.user.profile.email || '-'}).<br>Comment/ Reason: ${comment}<br><br>Please take prior actions to retain this talent.<br><br>Thank You,<br>Azure cloud and AI`;
                         mailSub = `Flag Escalation - ${email}`
                     } else if (mode == 'remove_escalation' || mode == 'individual_remove_escalation') {
                         mailHtml = `Hello,<br><br>The risk flag escalation has been removed for ${email} by ${req.user.profile.displayName} (${req.user.profile.email || '-'}).<br>Comment/ Reason: ${comment}<br><br>Thank You,<br>Azure cloud and AI `;
                         mailSub = `Remove Flag Escalation - ${email}`;
                     }

                     var mailBody = {
                         from: 'cloudbrain-support@click2cloud.net',
                         to: email_id,
                         cc: "jyoti.tumsare@click2cloud.net, pratik.khadse@click2cloud.net, v-sijune@microsoft.com, v-kalrka@microsoft.com",
                        //  cc: "pinara@microsoft.com, mknudsen@microsoft.com ",
                         subject: mailSub,
                         text: 'SITTM Escalation Details',
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
    } catch (err) {
        console.log(err);
        responseJson.err = true;
        responseJson.msg = err;
        res.send(responseJson);
    }
}
exports.EscalateTalent = EscalateTalent;


function SmmlManagerView(req, res, next) {
    var mailid = req.body.mail_id

    var responseJson = {
        err: false,
        data : null,
        login : true,
        msg : null
    }

    try {
        if (mailid) {
            config.connect((err, client, done) => {
                if (err) throw err;
                var queryStr = `select _sittm_user_access('${mailid}');`
                console.log(queryStr);
                client.query(queryStr, (err, response) => {
                    done()
                    if (err) throw err;
                    else {
                        const exists = (response.rows && response.rows[0] && response.rows[0]._sittm_user_access && response.rows[0]._sittm_user_access[0] && response.rows[0]._sittm_user_access[0].exists) || false;
                        if (exists) {
                            responseJson.data = (response.rows && response.rows[1] && response.rows[1]._sittm_user_access) || []
                            res.send(responseJson);
                        } else {
                            // res.send([]);
                            req.session.destroy(function (err) {
                                req.logout();
                                responseJson.login = false;
                                res.send(responseJson);
                                // res.redirect(req.get('referer'));
                            });
                        }
                    }
                })
            })
        } else {
            res.send([]);
        }
    } catch (error) {
        res.send([]);
    }
}
exports.SmmlManagerView = SmmlManagerView;

function smmlDeleteTalent(req, res, next) {

    var responseJson = {
        err: false,
        data: null,
        login: true,
        msg: null
    }

    try {
        var manager = req.body.manager || '';
        var id = req.body.id || 0;
        var email = req.body.email || '';
        var dataList = [];
        spName = "_sittm_manager_card_delete_talent"
        mode = 'update_details'
        config.connect((err, client, done) => {
            if (err) throw err;
            client.query("select * from " + spName + "('" + manager + "','" + id + "','" + email + "','" + mode + "');", function(err, result, fields) {
                done()
                if (err) throw err;
                else {
                    console.log(result);
                    responseJson.data = result.rows[0]._sittm_manager_card_delete_talent
                    res.send(responseJson);
                }
            })
        })
    } catch (error) {
        responseJson.err = true;
        responseJson.msg = error;
        responseJson.data = [];
        res.send(responseJson);
    }

}
exports.smmlDeleteTalent = smmlDeleteTalent;

function cardDeleteTalentFunc(req, res, next) {
    var responseJson = {
        err: false,
        data: null,
        login: true,
        msg: null
    }
    try {
        var manager = req.body.manager || '';
        var id = req.body.id || 0;
        var email = req.body.email || '';
        var dataList = [];
        spName = "_sittm_individual_card_delete_talent"
        mode = 'update_details'
        config.connect((err, client, done) => {
            if (err) throw err;
            client.query("select * from " + spName + "('" + manager + "','" + id + "','" + email + "','" + mode + "');", function(err, result, fields) {
                done()
                if (err) throw err;
                else {
                    console.log(result);
                    responseJson.data = result.rows[0]._sittm_individual_card_delete_talent
                    res.send(responseJson);
                }
            })
        })
    } catch (error) {
        responseJson.err = true;
        responseJson.msg = error;
        responseJson.data = [];
        res.send(responseJson);
    }

}
exports.cardDeleteTalentFunc = cardDeleteTalentFunc;