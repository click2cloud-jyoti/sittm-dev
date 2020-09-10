var config = require('../../config').pool;

var uniqid = require('uniqid');
var async = require('async')
const {
    Aborter,
    BlockBlobURL,
    ContainerURL,
    ServiceURL,
    SharedKeyCredential,
    StorageURL,
    uploadStreamToBlockBlob,
    uploadFileToBlockBlob
} = require('@azure/storage-blob');

const fs = require("fs");
const path = require("path");
require('dotenv').config();

function UploadProfilePicture(req, res, next) {
    var fileData = {}
    try {
        var uploadedFile = req.files.file;
        var talentInfo = JSON.parse(req.body.userdata);
        fileData.email = talentInfo.email;
        // fileData.email = req.body.email;
        fileData.oldFilename = uploadedFile.name;
        fileData.extension = path.extname(fileData.oldFilename) || '';
        uploadedFile.name = `${fileData.email}_${Date.now()}${fileData.extension}`;
        fileData.uniqid = Date.now() || '';
        fileData.newFilename = uploadedFile.name || '';
        fileData.size = uploadedFile.size || 0;
        console.log('new file name--', fileData);

        if (fileData.extension == '.png' || fileData.extension == '.jpg' || fileData.extension == '.jpeg') {

            uploadedFile.mv("./public/profiles/" + uploadedFile.name, function(error, result) {

                if (error) {
                    res.json({
                        error: true,
                        msg: "File failed to upload.",
                        data: [],
                        login: true
                    })
                } else {
                    config.connect((err, client, done) => {
                        if (err) {
                            console.log(err);
                            res.json({
                                error: true,
                                msg: "File failed to upload.",
                                data: [],
                                login: true
                            })
                        } else {

                            var queryStr = `SELECT public._sittm_upload_profilepic(
                                '${fileData.oldFilename}',
                                '${fileData.email}',
                                ${fileData.id || 0},
                                ${fileData.size},
                                '${fileData.newFilename}',
                                '${fileData.extension}',
                                '${req.user.profile.email}'
                            )`;
                            console.log(queryStr);
                            client.query(queryStr, (err, response) => {
                                done();
                                if (err) {
                                    console.log(err);
                                    res.json({
                                        error: true,
                                        msg: "File failed to upload.",
                                        data: [],
                                        login: true
                                    })
                                } else {
                                    res.json({
                                        error: false,
                                        msg: "File uploaded.",
                                        data: (response.rows && response.rows[0] && response.rows[0]._sittm_upload_profilepic && response.rows[0]._sittm_upload_profilepic[0]) || {},
                                        login: true
                                    })
                                }
                            })
                        }
                    })

                }
            })
        } else {
            res.json({
                error: true,
                msg: "Uploaded image file format not supported.",
                data: [],
                login: true
            })
        }
    } catch (error) {
        res.json({
            error: true,
            msg: "File failed to upload.",
            data: [],
            login: true
        })
    }
}
exports.UploadProfilePicture = UploadProfilePicture;


function IndividualDetails(req, res, next) {
    var responseJson = {
        err: false,
        data: null,
        login: true,
        msg: null
    }

    var datalist = {
        talent: [],
        project: [],
        foundation: [],
        awards: [],
        primary_area: [],
        tech_skills: [],
        non_tech_skills: [],
        ms_certificate: [],
        certificate3rd: [],
        user_certificate: [],
        development: [],
        common_tags: [],
        past_prog_att: [],
        current_prog_att: [],
        future_prog_att: [],
        bootcamps: [],
        soft_skills: [],
        external_skills: [],
        internal_skills: [],
        training_cert: [],
        talentDocuments: [],
        activities: [],
    };

    try {

        var mode = '',
            id = null,
            manager = '',
            email = '';

        if (req.body.personnel_nbr) {
            id = req.body.personnel_nbr;
        }
        if (req.body.email) {
            email = req.body.email;
        }

        config.connect((err, client, done) => {
            if (err) throw err;
            var qurStr = `select _sittm_individual_details_modify('get_talent_info', '${email}', ${id})`;
            console.log(qurStr);
            client.query(qurStr, (err, data) => {
                done()
                if (err) throw err;
                else {
                    console.log(data)
                    if (data.rows.length != 0)
                        datalist = {
                            talent: data.rows[0]._sittm_individual_details_modify || [],
                            project: data.rows[1]._sittm_individual_details_modify || [],
                            foundation: data.rows[2]._sittm_individual_details_modify || [],
                            awards: data.rows[3]._sittm_individual_details_modify || [],
                            primary_area: data.rows[4]._sittm_individual_details_modify || [],
                            tech_skills: data.rows[5]._sittm_individual_details_modify || [],
                            non_tech_skills: data.rows[6]._sittm_individual_details_modify || [],
                            ms_certificate: data.rows[7]._sittm_individual_details_modify || [],
                            certificate3rd: data.rows[8]._sittm_individual_details_modify || [],
                            user_certificate: data.rows[9]._sittm_individual_details_modify || [],
                            development: data.rows[10]._sittm_individual_details_modify || [],
                            common_tags: data.rows[11]._sittm_individual_details_modify || [],
                            past_prog_att: data.rows[12]._sittm_individual_details_modify || [],
                            current_prog_att: data.rows[13]._sittm_individual_details_modify || [],
                            future_prog_att: data.rows[14]._sittm_individual_details_modify || [],
                            bootcamps: data.rows[15]._sittm_individual_details_modify || [],
                            soft_skills: data.rows[16]._sittm_individual_details_modify || [],
                            external_skills: data.rows[17]._sittm_individual_details_modify || [],
                            internal_skills: data.rows[18]._sittm_individual_details_modify || [],
                            training_cert: data.rows[19]._sittm_individual_details_modify || [],
                            talentDocuments: data.rows[20]._sittm_individual_details_modify || [],
                            activities: data.rows[21]._sittm_individual_details_modify || [],
                        };
                    responseJson.data = datalist
                    res.send(responseJson);
                }
            })
        })
    } catch (err) {
        console.log(err);
        responseJson.err = true;
        responseJson.msg = error;
        responseJson.data = datalist;
        res.send(responseJson);
    }

}
exports.IndividualDetails = IndividualDetails;


function IndividualProjectDetails(req, res, next) {

    var datalist = [];
    var responseJson = {
        err: false,
        data: null,
        login: true,
        msg: null
    }

    try {

        var mode = '',
            id = null,
            project = '',
            talent_id = '',
            email = '',
            proj_id = null;

        if (req.body.personnel_nbr) {
            id = req.body.personnel_nbr;
        }
        if (req.body.email) {
            email = req.body.email;
        }
        if (req.body.project) {
            project = req.body.project;
        }
        if (req.body.talent_id) {
            talent_id = req.body.talent_id;
        }
        if (req.body.mode) {
            mode = req.body.mode;
        }
        if (req.body.proj_id) {
            proj_id = req.body.proj_id || null;
        }

        config.connect((err, client, done) => {
            if (err) throw err;
            var qurStr = `select _sittm_insert_individual_details('${mode}', '${email}', ${id}, '${project}',${talent_id},${proj_id || null})`;
            console.log(qurStr);
            client.query(qurStr, (err, data) => {
                done()
                if (err) throw err;
                else {
                    console.log(data)
                    if (data.rows.length != 0) {
                        datalist = data.rows[0]._sittm_insert_individual_details || [];
                        responseJson.data = datalist;
                    }
                    res.send(responseJson);
                }
            })
        })
    } catch (err) {
        console.log(err);
        responseJson.err = true;
        responseJson.msg = error;
        responseJson.data = datalist;
        res.send(responseJson);
    }

}
exports.IndividualProjectDetails = IndividualProjectDetails;
// devlopement plan start


function savePlane_details(req, res, next) {

    try {
        var p_activity_status = '';
        var p_description = '';
        var p_scheduled_on = '';
        var created_by = '';
        var designation = '';
        var p_manager_email = '';
        var p_activity_details = ''
        var p_id = null;
        var p_scheduled_on = '';
        var mode = '';
        var full_name = ''

        if (req.body.p_activity_status) {
            p_activity_status = req.body.p_activity_status;
        }
        if (req.body.id) {
            p_id = req.body.id;
        }
        if (req.body.p_description) {
            p_description = req.body.p_description;
        }
        if (req.body.p_scheduled_on) {
            p_scheduled_on = req.body.p_scheduled_on;
        }
        if (req.body.data.manager) {
            created_by = req.body.data.manager;
        }
        if (req.body.designation) {
            designation = req.body.designation;
        }
        if (req.body.p_activity_details) {
            p_activity_details = req.body.p_activity_details;
        }
        if (req.body.data.full_name) {
            full_name = req.body.data.full_name;
        }
        if (req.body.data.email) {
            email = req.body.data.email;
        }
        if (req.body.data.talent_id) {
            talent_id = req.body.data.talent_id;
        }
        if (req.body.data.manager_email) {
            p_manager_email = req.body.data.manager_email;
        }
        if (req.body.data.manager_email) {
            p_manager_email = req.body.data.manager_email;
        }
        if (req.body.mode) {
            mode = req.body.mode;
        }

        config.connect((err, client, done) => {
            if (err) throw err;
            var qurStr = `select _sittm_useractivity('${mode}','${p_activity_status}','${p_activity_details}', ${talent_id},'${email}','${full_name}',${p_id},'${p_scheduled_on}','${created_by}','${designation}','${p_manager_email}')`;
            client.query(qurStr, (err, response) => {
                done()
                if (err) throw err;
                if (response.rows[0]._sittm_useractivity != null) {

                    dataList = response.rows[0]._sittm_useractivity || [];
                    res.send({
                        data: dataList,
                        status: true,
                        msg: 'data fetched'
                    });
                } else {
                    res.send({
                        data: [],
                        status: false,
                        msg: 'data not present'
                    });

                }

            })
        })

    } catch (err) {
        console.log(err);
        res.send(err);
    }
}
exports.savePlane_details = savePlane_details



function UpdateDevlopement_detail(req, res, next) {
    console.log(" Update   Devlopement_detail ##### -->", req.body);
    var Q1DATA = req.body.Q1DATA || [];
    var Q2DATA = req.body.Q2DATA || [];
    var Q3DATA = req.body.Q3DATA || [];
    var Q4DATA = req.body.Q4DATA || [];
    var Q5DATA = req.body.Q5DATA || [];

    var concatarr = Q1DATA.concat(Q2DATA);
    var concatarr2 = concatarr.concat(Q3DATA);
    var concatarr3 = concatarr2.concat(Q4DATA);
    var concatarr4 = concatarr3.concat(Q5DATA);

    var array = [];
    array = concatarr4

    try {
        var p_activity_status = '';
        var p_description = '';
        var p_scheduled_on = '';
        var created_by = '';
        var designation = '';
        var p_manager_email = '';
        var p_activity_details = ''
        var p_id = null;
        var p_scheduled_on = '';
        var mode = '';

        if (req.body.p_activity_status) {
            p_activity_status = req.body.p_activity_status;
        }
        if (req.body.id) {
            p_id = req.body.id;
        }
        if (req.body.p_description) {
            p_description = req.body.p_description;
        }
        if (req.body.p_scheduled_on) {
            p_scheduled_on = req.body.p_scheduled_on;
        }
        if (req.body.data.manager) {
            created_by = req.body.data.manager;
        }
        if (req.body.designation) {
            designation = req.body.designation;
        }
        if (req.body.p_activity_details) {
            p_activity_details = req.body.p_activity_details;
        }
        if (req.body.data.full_name) {
            full_name = req.body.data.full_name;
        }
        if (req.body.data.email) {
            email = req.body.data.email;
        }
        if (req.body.data.talent_id) {
            talent_id = req.body.data.talent_id;
        }
        if (req.body.data.manager_email) {
            p_manager_email = req.body.data.manager_email;
        }
        if (req.body.data.manager_email) {
            p_manager_email = req.body.data.manager_email;
        }
        if (req.body.mode) {
            mode = req.body.mode;
        }
        var count = 0;
        if (array.length) {
            async.eachSeries(array, function(eachelement, next) {
                var p_id = eachelement.id;
                var talent_id = eachelement.talent_id;
                var mode = 'update';
                var name = eachelement.name;
                var email = eachelement.email;
                var p_scheduled_on = eachelement.scheduled_on;

                // var qurStr = `select _sittm_useractivity('${mode}','${email}',${idd},${talent_id},'${name}','${scheduled_on}')`;

                var qurStr = `select _sittm_useractivity('${mode}','${p_activity_status}','${p_activity_details}', ${talent_id},'${email}','${name}',${p_id},'${p_scheduled_on}','${created_by}','${designation}','${p_manager_email}')`;
                console.log(" qurStr ==>>", qurStr);
                config.connect((err, client, done) => {
                    if (err) throw err;

                    client.query(qurStr, (err, response) => {
                        done()
                            // exit
                        count++;
                        next();
                        if (count == array.length) {
                            dataList = response.rows[0]._sittm_useractivity || [];
                            console.log(" ###### =>", dataList);
                            res.send({
                                data: dataList,
                                status: true,
                                msg: 'data updated sucessfully'
                            });


                        }

                    })

                })
            })
        } else {
            res.send({
                data: [],
                status: false,
                msg: 'data not Available'
            });

        }
    } catch (error) {
        console.log(error)
        res.send(dataList);
    }


}
exports.UpdateDevlopement_detail = UpdateDevlopement_detail

// devlopment plan end
function arrayToPostgresArray(arr) {
    return JSON.stringify(arr).replace('[', '{').replace(']', '}').replace(/["']/g, '')
}

function FoundationDataUpdate(req, res, next) {

    var responseJson = {
        err: false,
        data: null,
        login: true,
        msg: null
    }
    var data = [];
    var is_mobile_status = '',
        is_mobile_description = '',
        tolarance_status = '',
        tolarance_description = '',
        rotation_status = '',
        rotation_description = '',
        intent_to_stay_status = '',
        current_state_status = '',
        previous_awards = '{}',
        aspiring_to_awards = '',
        manager_note = '',
        talent_id = null,
        stay_or_move_status = '',
        email = '';

    try {
        if (req.body.is_mobile_status)
            is_mobile_status = req.body.is_mobile_status || '';
        if (req.body.is_mobile_description)
            is_mobile_description = req.body.is_mobile_description || '';
        if (req.body.tolarance_description)
            tolarance_description = req.body.tolarance_description || '';
        if (req.body.tolarance_status)
            tolarance_status = req.body.tolarance_status || '';
        if (req.body.rotation_status)
            rotation_status = req.body.rotation_status || '';
        if (req.body.rotation_description)
            rotation_description = req.body.rotation_description || '';
        if (req.body.intent_to_stay_status)
            intent_to_stay_status = req.body.intent_to_stay_status || '';
        if (req.body.current_state_status)
            current_state_status = req.body.current_state_status || '';
        if (req.body.previous_awards)
            previous_awards = arrayToPostgresArray(req.body.previous_awards) || '{}';
        if (req.body.aspiring_to_awards)
            aspiring_to_awards = req.body.aspiring_to_awards || '';
        if (req.body.manager_note)
            manager_note = req.body.manager_note || '';
        if (req.body.talent_id)
            talent_id = req.body.talent_id || 0;
        if (req.body.stay_or_move_status)
            stay_or_move_status = req.body.stay_or_move_status || '';
        if (req.body.email)
            email = req.body.email;

        config.connect((err, client, done) => {
            if (err) throw err;
            else {
                var qurStr = `select _sittm_foundation_info('${is_mobile_status}','${is_mobile_description}','${tolarance_description}','${tolarance_status}','${rotation_status}','${rotation_description}','${intent_to_stay_status}','${current_state_status}','${previous_awards}','${aspiring_to_awards}','${manager_note}',${talent_id},'${stay_or_move_status}','${email}')`;
                console.log(qurStr);
                client.query(qurStr, (err, response) => {
                    done();
                    if (err) throw err;
                    if (response) {
                        data = response.rows[0]._sittm_foundation_info || [];
                        responseJson.data = data;
                        res.send(responseJson);
                    }
                })
            }
        })

    } catch (error) {
        console.log(error);
        responseJson.err = true;
        responseJson.msg = error;
        responseJson.data = data;
        res.send(responseJson);
    }

}
exports.FoundationDataUpdate = FoundationDataUpdate;

function CertificateDataUpdate(req, res, next) {

    var dataList = [];

    var certificate3rd = '{}',
        email = '',
        industry_certificate = '{}',
        ms_certificate = '{}',
        non_tech_skills = '{}',
        primary_tech = '{}',
        talent_id = 0,
        tech_skills = '{}';

    try {

        if (req.body.certificate3rd)
            certificate3rd = arrayToPostgresArray(req.body.certificate3rd) || '{}';
        if (req.body.email)
            email = req.body.email
        if (req.body.industry_certificate)
            industry_certificate = arrayToPostgresArray(req.body.industry_certificate) || '{}';
        if (req.body.ms_certificate)
            ms_certificate = arrayToPostgresArray(req.body.ms_certificate) || '{}';
        if (req.body.non_tech_skills)
            non_tech_skills = arrayToPostgresArray(req.body.non_tech_skills) || '{}';
        if (req.body.primary_tech)
            primary_tech = arrayToPostgresArray(req.body.primary_tech) || '{}';
        if (req.body.talent_id)
            talent_id = req.body.talent_id || 0;
        if (req.body.tech_skills)
            tech_skills = arrayToPostgresArray(req.body.tech_skills) || '{}';

        config.connect((err, client, done) => {
            if (err) throw err;
            else {
                var qurStr = `select _sittm_certificate_info('${certificate3rd}','${email}','${industry_certificate}','${ms_certificate}','${non_tech_skills}','${primary_tech}',${talent_id},'${tech_skills}')`;
                console.log(qurStr);
                client.query(qurStr, (err, response) => {
                    done();
                    if (err) throw err;
                    if (response) {
                        dataList = response.rows[0]._sittm_certificate_info || [];
                        res.send(dataList);
                    }
                })
            }
        })

    } catch (error) {
        console.log(error)
        res.send(dataList);
    }


}
exports.CertificateDataUpdate = CertificateDataUpdate;


function DevelopmentDataUpdate(req, res, next) {

    var dataList = [];

    var key_actions_priorities = '',
        lessons_learned_last_quarter = '',
        lessons_learned_next_quarter = '',
        description = '',
        common_internal_motivators = '',
        common_external_motivators = '',
        motivator_notes = '',
        top_soft_skillS_assign_for_development = '',
        top_soft_skillS_assign_for_development_note = '',
        common_external_internal_motivators_notes = '',
        talent_is_on_rotation = '',
        note_for_rotation_detail_status = '',
        note_for_rotation_plan = '',
        talent_is_on_which_success_plan = '',
        current_program_attendence_status = '{}',
        consider_future_program_attendence_status = '{}',
        talent_id = null,
        past_program_attendence = '{}',
        training_opportunities = '',
        who_is_on_the_succession_on_the_plan = '',
        email = '',
        month3 = '',
        month6 = '',
        month9 = '',
        talent_needs_rotation = '';
    bootcamps = '';
    external_skills = '';
    internal_skills = '';
    soft_skills = '';
    training_cert = '';

    try {

        if (req.body.key_actions_priorities)
            key_actions_priorities = req.body.key_actions_priorities;
        if (req.body.lessons_learned_last_quarter)
            lessons_learned_last_quarter = req.body.lessons_learned_last_quarter;
        if (req.body.lessons_learned_next_quarter)
            lessons_learned_next_quarter = req.body.lessons_learned_next_quarter;
        if (req.body.description)
            description = req.body.description;
        if (req.body.common_internal_motivators)
            common_internal_motivators = req.body.common_internal_motivators;
        if (req.body.common_external_motivators)
            common_external_motivators = req.body.common_external_motivators;
        if (req.body.motivator_notes)
            motivator_notes = req.body.motivator_notes;
        if (req.body.top_soft_skillS_assign_for_development)
            top_soft_skillS_assign_for_development = req.body.top_soft_skillS_assign_for_development;
        if (req.body.top_soft_skillS_assign_for_development_note)
            top_soft_skillS_assign_for_development_note = req.body.top_soft_skillS_assign_for_development_note;
        if (req.body.common_external_internal_motivators_notes)
            common_external_internal_motivators_notes = req.body.common_external_internal_motivators_notes;
        if (req.body.talent_is_on_rotation)
            talent_is_on_rotation = req.body.talent_is_on_rotation;
        if (req.body.note_for_rotation_detail_status)
            note_for_rotation_detail_status = req.body.note_for_rotation_detail_status;
        if (req.body.note_for_rotation_plan)
            note_for_rotation_plan = req.body.note_for_rotation_plan;
        if (req.body.talent_is_on_which_success_plan)
            talent_is_on_which_success_plan = req.body.talent_is_on_which_success_plan;
        if (req.body.current_program_attendence_status)
            current_program_attendence_status = arrayToPostgresArray(req.body.current_program_attendence_status) || '{}';
        if (req.body.consider_future_program_attendence_status)
            consider_future_program_attendence_status = arrayToPostgresArray(req.body.consider_future_program_attendence_status) || '{}';
        if (req.body.talent_id)
            talent_id = req.body.talent_id || 0;
        if (req.body.past_program_attendence)
            past_program_attendence = arrayToPostgresArray(req.body.past_program_attendence) || '{}';
        if (req.body.training_opportunities)
            training_opportunities = req.body.training_opportunities;
        if (req.body.who_is_on_the_succession_on_the_plan)
            who_is_on_the_succession_on_the_plan = req.body.who_is_on_the_succession_on_the_plan;
        if (req.body.email)
            email = req.body.email;
        if (req.body.month3)
            month3 = req.body.month3;
        if (req.body.month6)
            month6 = req.body.month6;
        if (req.body.month9)
            month9 = req.body.month9;
        if (req.body.talent_needs_rotation)
            talent_needs_rotation = req.body.talent_needs_rotation;
        if (req.body.bootcamps)
            bootcamps = req.body.bootcamps;
        if (req.body.external_skills)
            external_skills = req.body.external_skills;
        if (req.body.internal_skills)
            internal_skills = req.body.internal_skills;
        if (req.body.soft_skills)
            soft_skills = req.body.soft_skills;
        if (req.body.training_cert)
            training_cert = req.body.training_cert;

        config.connect((err, client, done) => {
            if (err) throw err;
            else {
                var qurStr = `select _sittm_development_info('${email}',${talent_id},'${key_actions_priorities}','${lessons_learned_last_quarter}','${lessons_learned_next_quarter}','${description}','${common_internal_motivators}','${common_external_motivators}','${motivator_notes}','${top_soft_skillS_assign_for_development}','${top_soft_skillS_assign_for_development_note}','${common_external_internal_motivators_notes}','${talent_is_on_rotation}','${note_for_rotation_detail_status}','${note_for_rotation_plan}','${talent_is_on_which_success_plan}','${current_program_attendence_status}','${consider_future_program_attendence_status}','${past_program_attendence}','${training_opportunities}','${who_is_on_the_succession_on_the_plan}','${month3}','${month6}','${month9}','${talent_needs_rotation}','${bootcamps}','${external_skills}','${internal_skills}','${soft_skills}','${training_cert}')`;
                console.log(qurStr);
                client.query(qurStr, (err, response) => {
                    done();
                    if (err) throw err;
                    if (response) {
                        dataList = response.rows[0]._sittm_development_info || [];
                        res.send(dataList);
                    }
                })
            }
        })

    } catch (error) {
        console.log(error)
        res.send(dataList);
    }
}
exports.DevelopmentDataUpdate = DevelopmentDataUpdate;

function SaveCommonTags(req, res, next) {

    var dataList = [];

    var tag = '',
        mode = '',
        email = '',
        description = '',
        tag_id = null
    try {

        if (req.body.tag)
            tag = req.body.tag
        if (req.body.mode)
            mode = req.body.mode
        if (req.body.email)
            email = req.body.email
        if (req.body.description)
            description = req.body.description
        if (req.body.tag_id)
            tag_id = req.body.tag_id

        config.connect((err, client, done) => {
            if (err) throw err;
            else {
                var qurStr = `select _sittm_save_tags('${mode}','${tag}','${email}',${tag_id},'${description}')`;
                console.log(qurStr);
                client.query(qurStr, (err, response) => {
                    done();
                    if (err) throw err;
                    if (response) {
                        dataList = response.rows[0]._sittm_save_tags || [];
                        res.send(dataList);
                    }
                })
            }
        })


    } catch (error) {
        console.log(error)
        res.send(dataList);
    }

}
exports.SaveCommonTags = SaveCommonTags;

function CallGroupTags(req, res, next) {

    var dataList = []
    var email, tag;

    try {

        if (req.body.tag)
            tag = req.body.tag
        if (req.body.email)
            email = req.body.email

        config.connect((err, client, done) => {
            if (err) throw err;
            else {
                var qurStr = `select * from user_tags where email = '${email}' and tag_name = '${tag}' and description<>'' `;
                console.log(qurStr);
                client.query(qurStr, (err, response) => {
                    done();
                    if (err) throw err;
                    if (response) {
                        dataList = response.rows || [];
                        res.send(dataList);
                    }
                })
            }
        })

    } catch (error) {
        console.log(error);
        res.send(dataList);
    }

}
exports.CallGroupTags = CallGroupTags;

// upload file//


const STORAGE_ACCOUNT_NAME = process.env.STG_ACC_NAME;
const ACCOUNT_ACCESS_KEY = process.env.STG_ACC_KEY;

const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
const pipeline = StorageURL.newPipeline(credentials);
const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline);

const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const ONE_MINUTE = 60 * 1000;

async function showContainerNames(aborter, serviceURL) {
    let marker = undefined;

    do {
        const listContainersResponse = await serviceURL.listContainersSegment(aborter, marker);
        marker = listContainersResponse.nextMarker;
        for (let container of listContainersResponse.containerItems) {
            console.log(` - ${ container.name }`);
        }
    } while (marker);
}

async function uploadLocalFile(aborter, containerURL, filePath) {
    filePath = path.resolve(filePath);

    const fileName = path.basename(filePath);
    const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

    return await uploadFileToBlockBlob(aborter, filePath, blockBlobURL);
}

async function uploadStream(aborter, containerURL, filePath) {
    filePath = path.resolve(filePath);

    const fileName = path.basename(filePath).replace('.md', '-STREAM.md');
    const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

    const stream = fs.createReadStream(filePath, {
        highWaterMark: FOUR_MEGABYTES,
    });

    const uploadOptions = {
        bufferSize: FOUR_MEGABYTES,
        maxBuffers: 5,
    };

    return await uploadStreamToBlockBlob(
        aborter,
        stream,
        blockBlobURL,
        uploadOptions.bufferSize,
        uploadOptions.maxBuffers);
}

async function showBlobNames(aborter, containerURL) {
    let marker = undefined;

    do {
        const listBlobsResponse = await containerURL.listBlobFlatSegment(Aborter.none, marker);
        marker = listBlobsResponse.nextMarker;
        for (const blob of listBlobsResponse.segment.blobItems) {
            console.log(` - ${ blob.name }`);
        }
    } while (marker);
}

// A helper method used to read a Node.js readable stream into string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", data => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });
}






function UploadFile(req, res, next) {

    var fileData = {}

    try {
        var uploadedFile = req.files.file;
        var talentInfo = JSON.parse(req.body.userdata);
        fileData.email = talentInfo.email;
        fileData.manager = talentInfo.manager;
        fileData.oldFilename = uploadedFile.name;
        fileData.extension = path.extname(fileData.oldFilename) || '';
        var uid = uniqid();
        uploadedFile.name = `${fileData.email}_${uid}${fileData.extension}`;
        fileData.uniqid = uid || '';
        fileData.newFilename = uploadedFile.name || '';
        fileData.size = uploadedFile.size || 0;
        console.log('new file name--', fileData);

        uploadedFile.mv("./public/upload/" + uploadedFile.name, function(error, result) {

            if (error) {
                res.json({
                    error: true,
                    msg: "File failed to upload.",
                    data: []
                })
            } else {
                console.log(result);
                manager = req.body.userdata.manager;

                async function execute() {

                    const containerName = "sittm-manager-vrogavf";
                    var localFilePath = "./public/upload/" + uploadedFile.name;
                    const content = "hello!";

                    const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
                    const pipeline = StorageURL.newPipeline(credentials);
                    const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline);

                    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
                    // const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);

                    const aborter = Aborter.timeout(30 * ONE_MINUTE);

                    await uploadLocalFile(aborter, containerURL, localFilePath);
                    console.log(`Local file "${localFilePath}" is uploaded`);

                    console.log(`Blobs in "${containerName}" container:`);
                    await showBlobNames(aborter, containerURL);
                    fs.unlinkSync(localFilePath);

                }
                execute().then(() => {
                    console.log("Done")
                    config.connect((err, client, done) => {
                        if (err) {
                            console.log(err);
                            res.json({
                                error: true,
                                msg: "File failed to upload.",
                                data: []
                            })
                        } else {

                            var queryStr = `SELECT public._sittm_document_details('upload_file', '${fileData.email}', null, '${fileData.oldFilename}','${fileData.extension}',${fileData.size},'${fileData.uniqid}','${fileData.newFilename}', '${fileData.manager}', null)`;
                            console.log(queryStr);
                            client.query(queryStr, (err, response) => {
                                done();
                                if (err) {
                                    console.log(err);
                                    res.json({
                                        error: true,
                                        msg: "File failed to upload.",
                                        data: []
                                    })
                                } else {
                                    res.json({
                                        error: false,
                                        msg: "File uploaded.",
                                        data: (response.rows && response.rows[0]._sittm_document_details) || []
                                    })
                                }
                            })
                        }
                    })
                }).catch((e) => {
                    console.log(e);
                    console.log(err);
                    res.json({
                        error: true,
                        msg: "File failed to upload.",
                        data: []
                    })
                });

            }
        })
    } catch (error) {
        res.json({
            error: true,
            msg: "File failed to upload.",
            data: []
        })
    }
}
exports.UploadFile = UploadFile;
// uploade file end//

function DocumentFunction(req, res, next) {

    try {

        // var extension = req.body.extension || '';
        var id = req.body.id || null;
        // var name = req.body.name || '';
        var newfilename = req.body.newfilename || '';
        var blobName = newfilename;
        // var size = req.body.size || null;
        var talent_id = req.body.talent_id || null;
        var mode = req.body.mode || '';
        var email = req.body.email || '';



        if (mode == 'delete') {
            var queryStr = `SELECT public._sittm_document_details('${mode}', '${email}', ${talent_id}, null,null,null,null,null,null, ${id})`;
            postgresQueryExecute(queryStr, (response) => {
                res.send((response.rows && response.rows[0]._sittm_document_details) || []);
            }, (err) => {
                console.log(err);
                res.send([]);
            })
        } else if (mode == 'download') {
            async function execute() {

                const containerName = "sittm-manager-vrogavf";

                const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
                const pipeline = StorageURL.newPipeline(credentials);
                const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline);

                const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
                const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);

                const aborter = Aborter.timeout(30 * ONE_MINUTE);

                const downloadResponse = await blockBlobURL.download(aborter, 0);
                // console.log(downloadResponse);
                // res.pipe(downloadResponse.readableStreamBody);
                // downloadResponse.readableStreamBody.pipe(res);
                // res.download(downloadResponse.readableStreamBody);
                // const downloadedContent = await streamToString(downloadResponse.readableStreamBody);
                // console.log(`Downloaded blob content: "${downloadedContent}"`);

                // res.download(downloadResponse);
                // downloadResponse.pipe(res);



                var writeFile = fs.createWriteStream('./public/download/' + newfilename);
                downloadResponse.readableStreamBody.pipe(writeFile);
                // res.download('./public/download/get-info.txt');
                // res.download('./public/download/' + newfilename);
                res.send(newfilename);
                // fs.unlinkSync('./public/download/' + name);

            }
            execute().then(() => {
                console.log("Done")

            }).catch((e) => {
                console.log(e);
                console.log(err);
                res.json({
                    error: true,
                    msg: "failed to download",
                    data: []
                })
            });
        }

    } catch (error) {
        res.send([])
    }
}
exports.DocumentFunction = DocumentFunction;

function postgresQueryExecute(queryStr, callback, callbackerr) {
    config.connect((err, client, done) => {
        if (err) {
            console.log(err);
            callbackerr(err)
        } else {
            // var queryStr = `SELECT public._sittm_document_details('${mode}', '${email}', ${talent_id}, null,null,null,null,null,null, ${id})`;
            console.log(queryStr);
            client.query(queryStr, (err, response) => {
                done();
                if (err) {
                    console.log(err);
                    callbackerr(err)
                } else {
                    // res.send((response.rows && response.rows[0]._sittm_document_details) || []);
                    callback(response || [])
                }
            })
        }
    })
}

//activity


function AddActivity(req, res, next) {
    try {
        console.log("Add Activity")
        var p_mode = ''
        var activity_name = ''
        var scheduled_on = ''
        var email = ''
        var created_by = ''
        var manager_email = ''
        var designation = ''

        if (req.body.p_mode) {
            p_mode = req.body.p_mode;
            console.log(p_mode)
        }
        if (req.body.activity_name) {
            activity_name = req.body.activity_name;
            console.log(activity_name)
        }

        if (req.body.scheduled_on) {
            scheduled_on = req.body.scheduled_on;
            console.log(scheduled_on)
        }
        if (req.body.email) {
            email = req.body.email;
            console.log(email)
        }
        if (req.body.created_by) {
            created_by = req.body.created_by;
            console.log(created_by)
        }
        if (req.body.manager_email) {
            manager_email = req.body.manager_email;
            console.log(manager_email)
        }
        if (req.body.standard_title) {
            designation = req.body.standard_title;
            console.log(designation)
        }



        config.connect((err, client, done) => {
            if (err) throw err;
            else {
                var queryStr = `SELECT public._sittm_save_activities('${p_mode}', '${activity_name}','${scheduled_on}','${email}','new','${created_by}','${manager_email}','${designation}')`;
                console.log(queryStr);
                client.query(queryStr, (err, response) => {
                    done();
                    if (err) throw err;
                    if (response) {
                        dataList = response.rows || [];
                        res.send(dataList);
                    }
                })
            }
        })
    } catch (error) {
        res.send([])
    }

}
exports.AddActivity = AddActivity;

function updateActivityStatus(req, res, next) {

    console.log('name', name)
    var name = ''
    var status = ''
    var email = ''
    var p_mode = 'update'
    if (req.body.name) {
        name = req.body.name;
        console.log(name)
    }
    if (req.body.status) {
        status = req.body.status;
        console.log(status)
    }
    if (req.body.email) {
        email = req.body.email;
        console.log(email)
    }

    console.log(name, status, email)
    config.connect((err, client, done) => {
        if (err) throw err;
        else {
            var queryStr = `SELECT public._sittm_save_activities('${p_mode}','${name}',null,'${email}','${status}',null,null,null)`;
            console.log(queryStr);
            client.query(queryStr, (err, response) => {
                done();
                if (err) throw err;
                if (response) {
                    dataList = response.rows || [];
                    res.send(dataList);
                }
            })
        }
    })
}
exports.updateActivityStatus = updateActivityStatus;

function listActivityStatus(req, res, next) {
    console.log('listActivityStatusController')
    if (req.body.email) {
        email = req.body.email;
        console.log(email)
    }
    config.connect((err, client, done) => {
        if (err) throw err;
        else {
            var queryStr = `SELECT public._sittm_save_activities('get_activities',null,null,'${email}',null,null,null,null)`;
            console.log(queryStr);
            client.query(queryStr, (err, response) => {
                done();
                if (err) throw err;
                if (response) {
                    dataList = response.rows || [];
                    console.log('dataList', dataList)
                    res.send(dataList);
                }
            })
        }
    })

}
exports.listActivityStatus = listActivityStatus


function dataMotivator_details(req, res, next) {
    console.log(" dataMotivator_details ==>", req.body)
    try {
        if (req.body.tag) {
            var tagname = req.body.tag
        }
        config.connect((err, client, done) => {
            if (err) throw err;
            else {
                var qurStr = `select _sittm_motivatordiscription('${tagname}')`;
                console.log(qurStr);
                client.query(qurStr, (err, response) => {
                    done();
                    if (err) throw err;
                    if (response) {
                        console.log(" response ==>", response);
                        datalist = response.rows[0]._sittm_motivatordiscription || [];
                        res.send(datalist);
                    }
                })
            }
        })

    } catch (err) {
        console.log(err);
        res.send(datalist);
    }

}
exports.dataMotivator_details = dataMotivator_details;


function updateNoteActivityFunc(req, res, next) {
    var responseJson = {
        err: false,
        data: null,
        login: true,
        msg: null
    }
    try {
        var manager_email = req.body.manager_email || '';
        var talent_id = req.body.talent_id || 0;
        var email = req.body.email || '';
        var name = req.body.name || '';
        var activity_status = req.body.activity_status || '';

        valuetext = req.body.is_blocker_description || '';
        spName = "_sittm_activity_note_modify"
        mode = 'update_details'
        config.connect((err, client, done) => {
            if (err) throw err;
            client.query("select * from " + spName + "('" + manager_email + "','" + talent_id + "','" + email + "','" + name + "','" + activity_status + "','" + valuetext + "','" + mode + "');", function(err, result, fields) {
                done()
                if (err) throw err;
                else {
                    console.log(result);
                    if (result.rows[0]._sittm_activity_note_modify != null) {
                        output = result.rows[0]._sittm_activity_note_modify[0].is_blocker_description
                        if (output == valuetext)
                            responseJson.data = "Updated"
                        else
                            responseJson.data = "Not Updated"
                    } else {
                        responseJson.data = "Not Updated"
                    }

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
exports.updateNoteActivityFunc = updateNoteActivityFunc;