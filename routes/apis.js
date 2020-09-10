'use strict';
var express = require('express');
var router = express.Router();

const fs = require("fs");

const Manager = require('../controller/ManagerController/ManagerView')
const IndividualCard = require('../controller/IndividualCardController/IndividualCard')
const HomeController = require('../controller/HomeController/HomeNominateTalent')

function apiAuthentication(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send({
            data: [],
            err: true,
            login: false,
            msg: 'User logout'
        })
    }
}

router.get('/test', apiAuthentication, function(req, res, next) {
    res.send(`APIs is working for user <b>${req.user.profile.displayName}</b>`);
});

router.post('/uploadProfilePicture', apiAuthentication, function(req, res, next) {
    IndividualCard.UploadProfilePicture(req, res, next);
});

// devlopment plan
router.post('/savePlane', function(req, res, next) {
    IndividualCard.savePlane_details(req, res, next);
});
router.post('/UpdateDevlopementData', function(req, res, next) {
    IndividualCard.UpdateDevlopement_detail(req, res, next);
});
// devlopment plan end
router.post('/managerViewsDetails', apiAuthentication, function(req, res, next) {
    Manager.ManagerView(req, res, next);
});

router.post('/smmlManagerViewsDetails', apiAuthentication, function(req, res, next) {
    Manager.SmmlManagerView(req, res, next);
});

router.post('/smmlDeleteTalent', apiAuthentication, function(req, res, next) {
    Manager.smmlDeleteTalent(req, res, next);
});

router.post('/escalateTalent', apiAuthentication, function(req, res, next) {
    Manager.EscalateTalent(req, res, next);
});

router.post('/individualTalentDetails', apiAuthentication, function(req, res, next) {
    IndividualCard.IndividualDetails(req, res, next);
});

router.post('/insertProjectDetails', apiAuthentication, function(req, res, next) {
    IndividualCard.IndividualProjectDetails(req, res, next);
});

router.post('/foundationInfoUpdate', apiAuthentication, function(req, res, next) {
    IndividualCard.FoundationDataUpdate(req, res, next);
});

router.post('/certificateInfoUpdate', function(req, res, next) {
    IndividualCard.CertificateDataUpdate(req, res, next);
});

router.post('/developmentInfoUpdate', function(req, res, next) {
    IndividualCard.DevelopmentDataUpdate(req, res, next);
});

router.post('/saveCommonTag', function(req, res, next) {
    IndividualCard.SaveCommonTags(req, res, next);
});

router.post('/callGroupTag', function(req, res, next) {
    IndividualCard.CallGroupTags(req, res, next);
});

router.post('/documentDownlaod', function(req, res, next) {
    IndividualCard.DocumentFunction(req, res, next);
});

router.get('/downloadDocument', function(req, res, next) {
    res.download('./public/download/' + req.query.path);
});

// upload file
router.post('/uploadfile', function(req, res, next) {
    IndividualCard.UploadFile(req, res, next);
});
// upload file end

router.post('/nominateTalentDetails', apiAuthentication, function(req, res, next) {
    HomeController.NominateTalentDetails(req, res, next);
});

router.post('/nominateTalentAliasCheck', apiAuthentication, function(req, res, next) {
    HomeController.NominateTalentAliasCheck(req, res, next);
});

router.post('/nominateTalentInsertDetails', apiAuthentication, function(req, res, next) {
    HomeController.NominateTalentInsertDetails(req, res, next);
});

router.post('/saveTalent', function(req, res, next) {
    HomeController.saveTalent(req, res, next);
});

router.post('/getTalentinfo', function(req, res, next) {
    HomeController.getTalentinfo(req, res, next);
});


router.post('/addActivity', function(req, res, next) {
    IndividualCard.AddActivity(req, res, next);
});
router.post('/updateActivityStatus', function(req, res, next) {
    IndividualCard.updateActivityStatus(req, res, next);
});

router.post('/listActivityStatus', function(req, res, next) {
    IndividualCard.listActivityStatus(req, res, next);
});

router.post('/data_Motivator', function(req, res, next) {
    IndividualCard.dataMotivator_details(req, res, next);
});

//individual card delete
router.post('/cardDeleteTalent', apiAuthentication, function(req, res, next) {
    Manager.cardDeleteTalentFunc(req, res, next);
});

//save activity note
router.post('/saveActivityNote', apiAuthentication, function(req, res, next) {
    IndividualCard.updateNoteActivityFunc(req, res, next);
});

//notifications
router.post('/check_admin', apiAuthentication, function(req, res, next) {
    HomeController.checkAdminConsent(req, res, next);
});
router.post('/getNotificationsList', apiAuthentication, function(req, res, next) {
    HomeController.getNotificationEntries(req, res, next);
});

router.post('/updateNotificationEntries', apiAuthentication, function(req, res, next) {
    HomeController.updateNotificationEntries(req, res, next);
});


module.exports = router;