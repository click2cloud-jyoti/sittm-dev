var app = angular.module('individualApp', []);

app.controller('individualCntrl', function($scope, $http, $window) {
    console.log('individualCard');


    async function pageRefreshLog() {
        window.parent.location.reload(true);
    }

    $scope.new_activity = "";
    $scope.inprocess_activity = "";
    $scope.blocker_activity = "";
    $scope.success_activity = "";

    $scope.talentDocuments = [];
    $scope.activities = ''
    $scope.firsttime = true
    $scope.fileExtention = {
        ".pdf": "images/fileicon/pdf_icon.svg",
        ".html": "images/fileicon/html_icon.svg",
        ".avi": "images/fileicon/avi_icon.svg",
        ".doc": "images/fileicon/doc_icon.svg",
        ".docx": "images/fileicon/doc_icon.svg",
        ".exe": "images/fileicon/exe_icon.svg",
        ".mp3": "images/fileicon/mp3_icon.svg",
        ".mp4": "images/fileicon/mp4_icon.svg",
        ".txt": "images/fileicon/txt_icon.svg",
        ".xls": "images/fileicon/xls_icon.svg",
        ".xlsx": "images/fileicon/xls_icon.svg"

    }
    $scope.LoadFn = {
        Load: async function() {
            $('#btnid').show();
        },
        UnLoad: async function() {
            $('#btnid').hide();
        }
    }
    $scope.LoadDiscription = {
        Load2: async function() {
            $('#btnid2').show();
        },
        UnLoad2: async function() {
            $('#btnid2').hide();
        }
    }
    $scope.userInit = async function(user) {
        var tempVar = JSON.parse(user);
        $scope.UserInfo = tempVar;
    }

    $scope.individual_loader = true;
    $scope.showContainer = false;
    $scope.init = async function(data) {
        try {
            $scope.individual_loader = true;
            $scope.showContainer = false;

            $scope.talentcopy = data
            $scope.talentInfo = JSON.parse(data);
            console.log($scope.talentInfo);
            $scope.savetalentinfo = $scope.talentInfo;
            $scope.talentDetails = [];
            $scope.projectDetails = [];

            $http({
                method: 'POST',
                url: 'api/individualTalentDetails',
                data: $scope.talentInfo
            }).then(async function(data) {
                if (data.data) {
                    var resTemp = data.data || {};

                    if (!resTemp.login) {
                        pageRefreshLog();
                    } else {
                        $scope.activities = resTemp.data.activities;
                        if ($scope.activities.length != 0) {
                            $scope.saved_activity_info = angular.copy($scope.activities)

                        }

                        $scope.talentDetails = resTemp.data.talent[0];
                        $scope.projectDetails = resTemp.data.project || [];
                        $scope.foundationInfo = (resTemp.data.foundation && resTemp.data.foundation[0]) || {
                            "is_mobile_status": null,
                            "is_mobile_description": null,
                            "tolarance_description": null,
                            "tolarance_status": null,
                            "rotation_status": null,
                            "rotation_description": null,
                            "intent_to_stay_status": null,
                            "current_state_status": null,
                            "previous_awards": null,
                            "aspiring_to_awards": null,
                            "manager_note": null,
                            "talent_id": $scope.talentDetails.talent_id,
                            "stay_or_move_status": null,
                            "email": $scope.talentDetails.email
                        };
                        if ($scope.foundationInfo.is_mobile_status == "null") {
                            $scope.foundationInfo.is_mobile_status = null
                        }
                        if ($scope.foundationInfo.tolarance_status == "null") {
                            $scope.foundationInfo.tolarance_status = null
                        }
                        $scope.foundationAwards = resTemp.data.awards || [];
                        $scope.primary_area = resTemp.data.primary_area || [];
                        $scope.tech_skills = resTemp.data.tech_skills || [];
                        $scope.non_tech_skills = resTemp.data.non_tech_skills || [];
                        $scope.ms_certificate = resTemp.data.ms_certificate || [];
                        $scope.certificate3rd = resTemp.data.certificate3rd || [];

                        $scope.user_certificate = (resTemp.data.user_certificate && resTemp.data.user_certificate[0]) || {
                            "certificate3rd": null,
                            "created_at": null,
                            "email": $scope.talentDetails.email,
                            "industry_certificate": null,
                            "ms_certificate": null,
                            "non_tech_skills": null,
                            "primary_tech": null,
                            "talent_id": $scope.talentDetails.talent_id,
                            "tech_skills": null
                        };
                        $scope.othercertificate = $scope.user_certificate.industry_certificate || [];
                        $scope.development = (resTemp.data.development && resTemp.data.development[0]) || {
                            "key_actions_priorities": null,
                            "lessons_learned_last_quarter": null,
                            "lessons_learned_next_quarter": null,
                            "description": null,
                            "common_internal_motivators": null,
                            "common_external_motivators": null,
                            "motivator_notes": null,
                            "top_soft_skillS_assign_for_development": null,
                            "top_soft_skillS_assign_for_development_note": null,
                            "common_external_internal_motivators_notes": null,
                            "talent_is_on_rotation": null,
                            "note_for_rotation_detail_status": null,
                            "talent_needs_rotation": null,
                            "note_for_rotation_plan": null,
                            "talent_is_on_which_success_plan": null,
                            "current_program_attendence_status": null,
                            "consider_future_program_attendence_status": null,
                            "talent_id": $scope.talentDetails.talent_id,
                            "past_program_attendence": null,
                            "training_opportunities": null,
                            "who_is_on_the_succession_on_the_plan": null,
                            "email": $scope.talentDetails.email,
                            "month3": null,
                            "month6": null,
                            "month9": null,
                            "talent_needs_rotaion": null,
                        };
                        if ($scope.development.training_cert == "null") {
                            $scope.development.training_cert = null
                        }

                        $scope.common_tags = resTemp.data.common_tags || [];
                        $scope.past_prog_att = resTemp.data.past_prog_att || [];
                        $scope.current_prog_att = resTemp.data.current_prog_att || [];
                        $scope.future_prog_att = resTemp.data.future_prog_att || [];
                        $scope.bootcamps = resTemp.data.bootcamps || [];
                        $scope.soft_skills = resTemp.data.soft_skills || [];
                        $scope.external_skills = resTemp.data.external_skills || [];
                        $scope.internal_skills = resTemp.data.internal_skills || [];
                        $scope.training_cert = resTemp.data.training_cert || [];
                        $scope.talentDocuments = resTemp.data.talentDocuments || [];
                        $scope.tagGroup = ($scope.common_tags && $scope.common_tags[0] && $scope.common_tags[0].tags) || null;

                        // $scope.profilePic = 'profiles/' + $scope.talentDetails.profilepic || 'images/placeholder_image.svg';
                        $scope.profilePic = ($scope.talentDetails.profilepic ? 'profiles/' + $scope.talentDetails.profilepic : 'images/placeholder_image.svg');
                        console.log($scope.profilePic)
                        $scope.firsttime = true
                        $scope.tagCalloutFunct($scope.tagGroup, null);
                        $scope.dataMotivator($scope.tagGroup);

                        $scope.individual_loader = false;
                        $scope.showContainer = true;
                    }
                }
            }, function(err) {
                // alert('somethong went wrong.')
                $scope.showModal('error', 'Server is busy please. Please try after some time.')
                $scope.individual_loader = false;
                $scope.showContainer = true;

            })
        } catch (error) {
            $scope.talentInfo = null;
            $scope.individual_loader = false;
            $scope.showContainer = true;
        }

    }

    $scope.progressBarParameter = async function() {
        $scope.progresscount = 10;
        projectcount = 0;
        foundationcount = 0;
        skillcount = 0;
        activitycount = 0;
        developmentcount = 0;
        tagcount = 0;
        taggroupcount = 0;
        documentcount = 0;

        //project
        if ($scope.projectDetails.length != 0) {
            $('#projectbox').removeClass('no_data_found_border');
            document.getElementById('project_no_data').hidden = true
            $scope.progresscount = parseInt($scope.progresscount + 10)
            projectcount = 10
        } else {
            $('#projectbox').addClass('no_data_found_border');
            document.getElementById('project_no_data').hidden = false
        }
        console.log("Project total is " + projectcount)

        //foundation data
        if ($scope.foundationInfo != null && $scope.foundationInfo != "") {
            //Mobility
            if ($scope.foundationInfo.is_mobile_status != "" && $scope.foundationInfo.is_mobile_status != null && $scope.foundationInfo.is_mobile_status != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 3)
                foundationcount = foundationcount + 3
            }
            //Travel Tolerance
            if ($scope.foundationInfo.tolarance_status != "" && $scope.foundationInfo.tolarance_status != null && $scope.foundationInfo.tolarance_status != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 2)
                foundationcount = foundationcount + 2
            }
            //Rotation
            if ($scope.foundationInfo.rotation_status != "" && $scope.foundationInfo.rotation_status != null && $scope.foundationInfo.rotation_status != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 2)
                foundationcount = foundationcount + 2
            }
            //Current State
            if ($scope.foundationInfo.stay_or_move_status != "" && $scope.foundationInfo.stay_or_move_status != null && $scope.foundationInfo.stay_or_move_status != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 2)
                foundationcount = foundationcount + 2
            }
            if ($scope.foundationInfo.current_state_status != "" && $scope.foundationInfo.current_state_status != null && $scope.foundationInfo.current_state_status != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 2)
                foundationcount = foundationcount + 2
            }
            //Award and recognition
            if ($scope.foundationInfo.previous_awards != "" && $scope.foundationInfo.previous_awards != null && $scope.foundationInfo.previous_awards != "null") {
                if ($scope.foundationInfo.previous_awards.length != 0) {
                    $scope.progresscount = parseInt($scope.progresscount + 2)
                    foundationcount = foundationcount + 2
                }
            }
            if ($scope.foundationInfo.aspiring_to_awards != "" && $scope.foundationInfo.aspiring_to_awards != null && $scope.foundationInfo.aspiring_to_awards != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 2)
                foundationcount = foundationcount + 2
            }
        }
        console.log("Foundation total is " + foundationcount)
        if (foundationcount == 0) {
            $('#foundationbox').addClass('no_data_found_border');
        } else {
            $('#foundationbox').removeClass('no_data_found_border');
        }

        //Current Skill mapping
        if ($scope.user_certificate != "" && $scope.user_certificate != null) {
            //Technology
            if ($scope.user_certificate.primary_tech != "" && $scope.user_certificate.primary_tech != null && $scope.user_certificate.primary_tech != "null") {
                if ($scope.user_certificate.primary_tech.length != 0) {
                    $scope.progresscount = parseInt($scope.progresscount + 3)
                    skillcount = skillcount + 3
                }
            }
            //Certifications
            if ($scope.user_certificate.ms_certificate != "" && $scope.user_certificate.ms_certificate != null && $scope.user_certificate.ms_certificate != "null") {
                if ($scope.user_certificate.ms_certificate.length != 0) {
                    $scope.progresscount = parseInt($scope.progresscount + 1)
                    skillcount = skillcount + 1
                }
            }
            if ($scope.user_certificate.certificate3rd != "" && $scope.user_certificate.certificate3rd != null && $scope.user_certificate.certificate3rd != "null") {
                if ($scope.user_certificate.certificate3rd.length != 0) {
                    $scope.progresscount = parseInt($scope.progresscount + 1)
                    skillcount = skillcount + 1
                }
            }
            if ($scope.user_certificate.industry_certificate != "" && $scope.user_certificate.industry_certificate != null && $scope.user_certificate.industry_certificate != "null") {
                if ($scope.user_certificate.industry_certificate.length != 0) {
                    $scope.progresscount = parseInt($scope.progresscount + 1)
                    skillcount = skillcount + 1
                }
            }
            //Unique Technical Skills
            if ($scope.user_certificate.tech_skills != "" && $scope.user_certificate.tech_skills != null && $scope.user_certificate.tech_skills != "null") {
                if ($scope.user_certificate.tech_skills.length != 0) {
                    $scope.progresscount = parseInt($scope.progresscount + 2)
                    skillcount = skillcount + 2
                }
            }
            //Non-Technical Skills
            if ($scope.user_certificate.non_tech_skills != "" && $scope.user_certificate.non_tech_skills != null && $scope.user_certificate.non_tech_skills != "null") {
                if ($scope.user_certificate.non_tech_skills.length != 0) {
                    $scope.progresscount = parseInt($scope.progresscount + 2)
                    skillcount = skillcount + 2
                }

            }
        }
        console.log("Skill total is " + skillcount)
        if (skillcount == 0) {
            $('#skillbox').addClass('no_data_found_border');
        } else {
            $('#skillbox').removeClass('no_data_found_border');
        }

        //activities
        if ($scope.activities != "" && $scope.activities != null && $scope.activities != "null") {
            if ($scope.activities.length != 0) {
                $scope.progresscount = parseInt($scope.progresscount + 11)
                activitycount = activitycount + 11
            }
        }
        console.log("Activity total is " + activitycount)

        if (activitycount == 0) {
            $('#activitybox').addClass('no_data_found_border');
        } else {
            $('#activitybox').removeClass('no_data_found_border');
        }

        //development plan
        if ($scope.development != "" && $scope.development != null && $scope.development != "null") {
            //Lession learned
            if ($scope.development.lessons_learned_last_quarter != "" && $scope.development.lessons_learned_last_quarter != null && $scope.development.lessons_learned_last_quarter != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 1)
                developmentcount = developmentcount + 1
            }
            if ($scope.development.lessons_learned_next_quarter != "" && $scope.development.lessons_learned_next_quarter != null && $scope.development.lessons_learned_next_quarter != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 1)
                developmentcount = developmentcount + 1
            }
            //Rotation and Succession
            if ($scope.development.talent_is_on_rotation != "" && $scope.development.talent_is_on_rotation != null && $scope.development.talent_is_on_rotation != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 1)
                developmentcount = developmentcount + 1
            }
            //Rotation Option
            if ($scope.development.note_for_rotation_plan != "" && $scope.development.note_for_rotation_plan != null && $scope.development.note_for_rotation_plan != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 1)
                developmentcount = developmentcount + 1
            }
            //Succession Plan
            if ($scope.development.talent_is_on_which_success_plan != "" && $scope.development.talent_is_on_which_success_plan != null && $scope.development.talent_is_on_which_success_plan != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 1)
                developmentcount = developmentcount + 1
            }
            if ($scope.development.who_is_on_the_succession_on_the_plan != "" && $scope.development.who_is_on_the_succession_on_the_plan != null && $scope.development.who_is_on_the_succession_on_the_plan != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 1)
                developmentcount = developmentcount + 1
            }
            //People Program
            if ($scope.development.past_program_attendence != "" && $scope.development.past_program_attendence != null && $scope.development.past_program_attendence != "null") {
                if ($scope.development.past_program_attendence.length != 0) {
                    $scope.progresscount = parseInt($scope.progresscount + 1)
                    developmentcount = developmentcount + 1
                }
            }
            if ($scope.development.current_program_attendence_status != "" && $scope.development.current_program_attendence_status != null && $scope.development.current_program_attendence_status != "null") {
                if ($scope.development.current_program_attendence_status.length != 0) {
                    $scope.progresscount = parseInt($scope.progresscount + 1)
                    developmentcount = developmentcount + 1
                }
            }
            if ($scope.development.consider_future_program_attendence_status != "" && $scope.development.consider_future_program_attendence_status != null && $scope.development.consider_future_program_attendence_status != "null") {
                if ($scope.development.consider_future_program_attendence_status.length != 0) {
                    $scope.progresscount = parseInt($scope.progresscount + 1)
                    developmentcount = developmentcount + 1
                }
            }
            //Training Opportunities
            if ($scope.development.bootcamps != "" && $scope.development.bootcamps != null && $scope.development.bootcamps != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 1)
                developmentcount = developmentcount + 1
            }
            if ($scope.development.external_skills != "" && $scope.development.external_skills != null && $scope.development.external_skills != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 1)
                developmentcount = developmentcount + 1
            }
            if ($scope.development.internal_skills != "" && $scope.development.internal_skills != null && $scope.development.internal_skills != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 1)
                developmentcount = developmentcount + 1
            }
            if ($scope.development.training_cert != "" && $scope.development.training_cert != null && $scope.development.training_cert != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 1)
                developmentcount = developmentcount + 1
            }
            if ($scope.development.soft_skills != "" && $scope.development.soft_skills != null && $scope.development.soft_skills != "null") {
                $scope.progresscount = parseInt($scope.progresscount + 1)
                developmentcount = developmentcount + 1
            }
        }
        console.log("Development total is " + developmentcount)
        if (developmentcount == 0) {
            $('#developmentbox').addClass('no_data_found_border');
        } else {
            $('#developmentbox').removeClass('no_data_found_border');
        }
        //tags
        if ($scope.common_tags != "" && $scope.common_tags != null && $scope.common_tags != "null") {
            if ($scope.common_tags.length != 0) {
                $scope.progresscount = parseInt($scope.progresscount + 10)
                tagcount = tagcount + 10
            }
        }
        console.log("Tags total is " + tagcount)
        if (tagcount == 0) {
            $('#tagsbox').addClass('no_data_found_border');
            document.getElementById('tags_no_data').hidden = false
        } else {
            $('#tagsbox').removeClass('no_data_found_border');
            document.getElementById('tags_no_data').hidden = true
        }

        //tag group
        if ($scope.tagGroup != "" && $scope.tagGroup != null && $scope.tagGroup != "null") {
            if ($scope.group_tags.length != 0) {
                $scope.progresscount = parseInt($scope.progresscount + 10)
                taggroupcount = taggroupcount + 10
            }
        }
        console.log("TagGroup total is " + taggroupcount)
        if (taggroupcount == 0) {
            $('#taggroupbox').addClass('no_data_found_border');
            document.getElementById('taggroup_no_data').hidden = false
        } else {
            $('#taggroupbox').removeClass('no_data_found_border');
            document.getElementById('taggroup_no_data').hidden = true
        }

        //documents
        if ($scope.talentDocuments != "" && $scope.talentDocuments != null && $scope.talentDocuments != "null") {
            if ($scope.talentDocuments.length != 0) {
                $scope.progresscount = parseInt($scope.progresscount + 10)
                documentcount = documentcount + 10
            }
        }
        if (documentcount == 0) {
            $('#documentbox').addClass('no_data_found_border');
            document.getElementById('document_no_data').hidden = false
        } else {
            $('#documentbox').removeClass('no_data_found_border');
            document.getElementById('document_no_data').hidden = true
        }
        console.log("Documents total is " + documentcount)

        //progress bar colour
        if ($scope.classname != undefined) {
            $('#status_progress').removeClass($scope.classname);
        }
        if ($scope.progresscount > 75) {
            $scope.classname = 'bg-success'
            $('#status_progress').addClass('bg-success')
        } else if ($scope.progresscount <= 75 && $scope.progresscount >= 40) {
            $scope.classname = 'bg-warning'
            $('#status_progress').addClass('bg-warning')
        } else if ($scope.progresscount < 40) {
            $scope.classname = 'bg-danger'
            $('#status_progress').addClass('bg-danger')
        } else {
            $scope.classname = 'bg-info'
            $('#status_progress').addClass('bg-info')
        }

        console.log("Total Progress is " + $scope.progresscount)
    }

    // devlopment plan

    $scope.save_plane = async function(mode) {
        console.log(" save_plane ===>>", mode)
        var talentDetails = $scope.talentDetails;
        var talentInfo = $scope.talentInfo;


        $http({
            method: 'POST',
            url: 'api/savePlane',
            data: {
                mode: mode,
                data: talentDetails,
                talentInfo: talentInfo
            }
        }).then(function(data) {

            if (data.data.status == true) {
                console.log(" data true block ", data.data.data);

                if (data.data.data.length != 0) {
                    $scope.planedata = data.data.data || []
                    var planeData = data.data.data || [];

                    var data = ['Q1']
                    q1result = planeData.filter(i => data.includes(i.scheduled_on))
                    $scope.Q1DATA = q1result

                    var data2 = ['Q2']
                    q2data = planeData.filter(i => data2.includes(i.scheduled_on))
                    $scope.Q2DATA = q2data

                    var data3 = ['Q3']
                    q3data = planeData.filter(i => data3.includes(i.scheduled_on))
                    $scope.Q3DATA = q3data

                    var data4 = ['Q4']
                    q4data = planeData.filter(i => data4.includes(i.scheduled_on))
                    $scope.Q4DATA = q4data


                    var data5 = ['Immediate Activity']
                    immediatedata = planeData.filter(i => data5.includes(i.scheduled_on))
                    $scope.Q5DATA = immediatedata

                }
            } else {
                console.log("data false block ==>>", data.data.status);
                console.log(data.data.msg)
            }
        }, function(err) {
            // alert('somethong went wrong.')
            $scope.showModal('error', 'Server is busy please. Please try after some time.')
        })

    }

    $scope.update_devlopmentplan = async function(mode) {

            var talentDetails = $scope.talentDetails;
            var talentInfo = $scope.talentInfo;
            $http({
                method: 'POST',
                url: 'api/UpdateDevlopementData',
                data: {
                    mode: mode,
                    data: talentDetails,
                    talentInfo: talentInfo,
                    Q1DATA: $scope.Q1DATA,
                    Q2DATA: $scope.Q2DATA,
                    Q3DATA: $scope.Q3DATA,
                    Q4DATA: $scope.Q4DATA,
                    Q5DATA: $scope.Q5DATA
                }
            }).then(function(data) {

                if (data.data.status == true) {
                    console.log(" update data-->", data.data.data);
                } else {
                    console.log(data.data.msg)
                }

            }, function(err) {
                // alert('something went to wrong')
                $scope.showModal('error', 'Server is busy please. Please try after some time.')

            })
        }
        // devlopment plan end

    //delete talent starts
    $scope.confirmDeleteTalent = async function(talent) {
            if (talent) {
                talent["id"] = $scope.talentDetails.talent_id
                $http({
                    "method": "POST",
                    "url": "api/cardDeleteTalent",
                    "data": talent
                }).then(function(response) {
                    console.log(response);
                    if (!response.data.login) {
                        pageRefreshLog();
                    } else {
                        var resTemp = response.data.data
                        if (resTemp == null || resTemp == "") {
                            window.history.back();
                        } else {
                            console.log(resTemp);
                        }
                    }

                }, function(err) {
                    $scope.showModal('error', 'Something went wrong.')
                })
            } else {
                $scope.showModal('error', 'Something went wrong.')
            }
        }
        //delete talent ends

    //activity cancel starts
    $scope.editCancelActivityFunct = async function(method, mode, index) {

            // if (method[0] != undefined) {
            //     if (mode == 'cancel') {

            //             // $scope.activities = method
            //         $scope.saved_activity_info = angular.copy(method[index])
            //         document.getElementById('buttoncancel' + index).hidden = true
            //         document.getElementById('buttonsave' + index).hidden = true
            //         $scope.activities[index].is_blocker_description = method[index].is_blocker_description
            //     }
            // } else {
            if (mode == 'cancel') {

                // $scope.activities = method
                $scope.saved_activity_info = angular.copy(method)
                document.getElementById('buttoncancel' + index).hidden = true
                document.getElementById('buttonsave' + index).hidden = true
                $scope.activities[index].is_blocker_description = method[index].is_blocker_description
            }
            //  }

        }
        //activity cancel ends

    //activity button enable starts
    $scope.disableSaveButton = async function(index) {
            if (index == 'data') {

                for (i = 0; i < $scope.activities.length; i++) {
                    //$scope.activities[i].is_blocker_description = angular.copy($scope.saved_activity_info[i].is_blocker_description)
                    document.getElementById('buttoncancel' + i).hidden = true
                    document.getElementById('buttonsave' + i).hidden = true
                }
            } else {
                document.getElementById('buttoncancel' + index).hidden = false
                document.getElementById('buttonsave' + index).hidden = false
            }

        }
        //activity button enable ends

    //activity submit details note starts
    $scope.saveActivityStatusNote = async function(info, mode, index) {

            if (mode == 'Blocker') {
                if (info[index]) {
                    if (info[index].is_blocker_description != null && info[index].is_blocker_description != "") {
                        $scope.saved_activity_info = angular.copy(info)
                        send_data = info[index]
                        console.log(JSON.stringify(send_data))
                        $http({
                            method: 'POST',
                            url: 'api/saveActivityNote',
                            data: send_data
                        }).then(function(response) {
                            if (response) {
                                console.log(response);
                                if (!response.data.login) {
                                    pageRefreshLog();
                                } else {
                                    if (response.data.data == "Updated") {
                                        $scope.olddata = angular.copy($scope.activities)
                                        $scope.showModal('success', 'Data saved.')
                                        document.getElementById('buttoncancel' + index).hidden = true
                                        document.getElementById('buttonsave' + index).hidden = true
                                    } else {
                                        console.log("Data not updated for activity")
                                        $scope.showModal('error', 'Data not updated for activity')
                                        document.getElementById('buttoncancel' + index).hidden = false
                                        document.getElementById('buttonsave' + index).hidden = false
                                    }
                                }

                                // $scope.foundationInfo = data.data[0];
                            }
                            // $scope.$apply();
                        }, function(err) {
                            $scope.showModal('error', 'Server is busy please. Please try after some time.')
                        })
                    } else {
                        $scope.showModal('error', 'Please enter text')
                    }

                }
            }
        }
        //activity submit details note ends

    $scope.editCancelFunct = async function(method, mode) {
        if (mode == 'initialise') {
            if (method == 'foundation')
                foundationInfo_prev = angular.copy($scope.foundationInfo);
            else if (method == 'certificate')
                user_certificate_prev = angular.copy($scope.user_certificate);
            else if (method == 'development')
                development_prev = angular.copy($scope.development);
        } else if (mode == 'cancel') {
            if (method == 'foundation')
                $scope.foundationInfo = foundationInfo_prev
            else if (method == 'foundation')
                $scope.user_certificate = user_certificate_prev
            else if (method == 'development')
                $scope.development = development_prev
        }
    }

    $scope.talentProjectFunct = async function(project, talent, mode, proj_id) {
        $scope.individual_loader = true;
        $scope.showContainer = false;
        if (talent && project) {
            talent.project = project;
            talent.mode = mode;
            talent.proj_id = proj_id;
            console.log('project');
            console.log(talent);
            $scope.projectDetails = []
            $http({
                method: 'POST',
                url: 'api/insertProjectDetails',
                data: talent
            }).then(function(response) {
                if (response.data.length != 0) {
                    console.log(response);
                    var resTemp = response.data || [];
                    if (!resTemp.login) {
                        pageRefreshLog();
                    } else {
                        $scope.projectDetails = resTemp.data || [];
                        if (mode != "remove_project") {
                            $scope.showModal('success', 'Project added.')
                        }
                        $scope.individual_loader = false;
                        $scope.showContainer = true;
                        $scope.init($scope.talentcopy);
                    }
                }
            }, function(err) {
                // alert('somethong went wrong.')
                $scope.showModal('error', 'Server is busy please. Please try after some time.')
                $scope.individual_loader = false;
                $scope.showContainer = true;

            })
        }
    }

    $scope.escalateModelFunct = async function(talent) {
        $scope.escalateModel = {};
        if (talent) {
            console.log(talent);
            $scope.escalateModel = {
                'name': talent.full_name,
                'email': talent.email,
                'title': talent.standard_title,
                'p_id': talent.personnel_nbr,
                'comment': talent.comment,
                'manager': talent.manager,
                'create_at': talent.create_at,
                'email_id': $scope.UserInfo.email
            }
        }
    }

    $scope.escalateTalentFunct = async function(talent, mode) {
        if (talent) {
            var talentData = {};
            talent.mode = mode;
            console.log(talent);
            $http({
                method: 'POST',
                url: 'api/escalateTalent',
                data: talent
            }).then(function(response) {
                    if (response.data) {
                        console.log(response);
                        var resJson = response.data || [];
                        if (!resJson.login) {
                            pageRefreshLog();
                        } else {
                            talentData = resJson.data[0] || {};
                            $scope.talentDetails.status = talentData.status;
                            $scope.talentDetails.comment = talentData.comment;
                            $scope.talentDetails.create_at = talentData.create_at;
                        }
                    }
                },
                function(err) {
                    $scope.showModal('error', 'Server is busy please. Please try after some time.')
                })
        }
    }

    $scope.submitIndividualDetails = async function(info, mode) {
        $scope.individual_loader = true;
        $scope.showContainer = false;

        if (mode == 'foundation') {
            if (info) {

                console.log(JSON.stringify(info))

                $http({
                    method: 'POST',
                    url: 'api/foundationInfoUpdate',
                    data: info
                }).then(function(response) {
                    if (response) {
                        console.log(response);
                        var resTemp = response.data;
                        if (!resTemp.login) {
                            pageRefreshLog();
                        } else {
                            $scope.foundationInfo = resTemp.data[0];
                            $scope.showModal('success', 'Foundation data saved.')
                            $scope.individual_loader = false;
                            $scope.showContainer = true;
                            $scope.init($scope.talentcopy);
                        }
                    }
                    // $scope.$apply();
                }, function(err) {
                    $scope.showModal('error', 'Server is busy please. Please try after some time.')
                    $scope.individual_loader = false;
                    $scope.showContainer = true;
                })

            }
        } else if (mode == 'certificate') {
            if (info) {
                $http({
                    method: 'POST',
                    url: 'api/certificateInfoUpdate',
                    data: info
                }).then(function(data) {
                    if (data) {
                        console.log(data);
                        $scope.user_certificate = data.data[0];
                        $scope.showModal('success', 'Skills data saved.')
                        $scope.individual_loader = false;
                        $scope.showContainer = true;
                        $scope.init($scope.talentcopy);
                    }
                    // $scope.$apply();
                }, function(err) {
                    $scope.showModal('error', 'Server is busy please. Please try after some time.')
                    $scope.individual_loader = false;
                    $scope.showContainer = true;
                })
            }
        } else if (mode == 'development') {
            if (info) {
                $http({
                    method: 'POST',
                    url: 'api/developmentInfoUpdate',
                    data: info
                }).then(function(data) {
                    if (data) {
                        console.log(data);
                        $scope.development = data.data[0];
                        $scope.showModal('success', 'Development data saved.')
                        $scope.individual_loader = false;
                        $scope.showContainer = true;
                        $scope.init($scope.talentcopy);
                    }
                    // $scope.$apply();
                }, function(err) {
                    $scope.showModal('error', 'Server is busy please. Please try after some time.')
                    $scope.individual_loader = false;
                    $scope.showContainer = true;
                })
            }
        }

    }

    $scope.save_tags = async function(tag, mode, description, tag_id) {
        $scope.individual_loader = true;
        $scope.showContainer = false;
        if (true) {
            if (tag && mode) {
                $http({
                    method: 'POST',
                    url: 'api/saveCommonTag',
                    data: {
                        tag: tag,
                        mode: mode,
                        description: description,
                        tag_id: tag_id,
                        email: $scope.talentDetails.email
                    }
                }).then(async function(data) {
                    if (data) {
                        console.log(data);

                        if (mode == 'save_tag' || mode == 'remove_tag') {
                            console.log(" $$$$$$");
                            $scope.common_tags = data.data;
                            var tagsarr = $scope.common_tags
                            $scope.tagGroup = ($scope.common_tags && $scope.common_tags[0] && $scope.common_tags[0].tags) || null;
                            await $scope.dataMotivator($scope.tagGroup);
                            await $scope.tagCalloutFunct($scope.tagGroup, null);

                            $scope.LoadFn.Load();

                            if (tagsarr.length == 0) {

                                console.log("all tag remove ");

                                $scope.LoadFn.UnLoad();
                                $scope.LoadDiscription.UnLoad2();

                            }
                            $scope.individual_loader = false;
                            $scope.showContainer = true;
                            $scope.init($scope.talentcopy);
                        } else if (mode == 'tag_description' || mode == 'remove_description') {
                            $scope.group_tags = data.data;
                            $scope.individual_loader = false;
                            $scope.showContainer = true;
                            $scope.init($scope.talentcopy);
                        }

                        // tagCalloutFunct($scope.tagGroup, null)

                    }
                }, function(err) {
                    $scope.showModal('error', 'Server is busy please. Please try after some time.')
                    $scope.individual_loader = false;
                    $scope.showContainer = true;
                })

            } else {
                $scope.showModal('warning', 'Please add a tag.')
                $scope.individual_loader = false;
                $scope.showContainer = true;
            }
        } else {
            $scope.individual_loader = false;
            $scope.showContainer = true;
        }
    }

    $scope.tagCalloutFunct = async function(tag, ele) {
        $scope.individual_loader = true;
        $scope.showContainer = false;
        $scope.group_tags = [];
        $scope.tagGroup = tag;
        if ($scope.tagGroup) {
            $scope.showGroupTag = true;

            await $http({
                method: 'POST',
                url: 'api/callGroupTag',
                data: {
                    tag: tag,
                    email: $scope.talentDetails.email
                }
            }).then(async function(data) {
                if (data) {
                    await console.log(" SSS ", data);
                    $scope.group_tags = data.data || [];
                    if ($scope.firsttime == true) {
                        $scope.firsttime = false
                        $scope.progressBarParameter()
                    }
                } else {
                    $scope.group_tags = [];
                    if ($scope.firsttime == true) {
                        $scope.firsttime = false
                        $scope.progressBarParameter()
                    }
                }
            }, function(err) {
                console.log('user save tag error')
                if ($scope.firsttime == true) {
                    $scope.firsttime = false
                    $scope.progressBarParameter()
                }
            })
        } else {
            $scope.showGroupTag = false;
            $scope.group_tags = [];
            if ($scope.firsttime == true) {
                $scope.firsttime = false
                $scope.progressBarParameter()
            }
        }
    }

    $scope.uploadProfilePic = async function() {


        var filedata = document.getElementById('profilepicid')
        var fileinfo = filedata.files[0]
        console.log(fileinfo)

        if (fileinfo) {
            var fileJson = {
                name: fileinfo.name,
                extension: '.' + fileinfo.name.split('.').pop(),
                size: fileinfo.size,
                loading: true
            }

            var fd = new FormData();
            fd.append('file', fileinfo);
            fd.append('userdata', JSON.stringify($scope.talentInfo))

            if (fileinfo.size < (1024 * 1024 * 1024)) {
                // $scope.talentDocuments.push(fileJson);
                $http({
                    method: 'POST',
                    url: 'api/uploadProfilePicture',
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity,
                    data: fd
                }).then(function(response) {
                    console.log(response)
                        // console.log(fileStatus)
                    var resTemp = response.data || {};
                    if (!resTemp.error) {
                        if (!resTemp.login) {
                            pageRefreshLog();
                        } else {
                            // $scope.profilePic = 'profiles/' + resTemp.data.profilepic || 'images/placeholder_image.svg';
                            $scope.profilePic = (resTemp.data.profilepic ? 'profiles/' + resTemp.data.profilepic : 'images/placeholder_image.svg');
                            console.log($scope.profilePic, "Profile")
                        }
                    } else {
                        $scope.showModal('warning', resTemp.msg);
                    }

                }, function(err) {
                    $scope.showModal('error', 'Server is busy please. Please try after some time.')
                })
            } else {
                $scope.showModal('warning', 'File should be less than 1GB.')
            }
            document.getElementById('profilepicid').innerHTML = document.getElementById('profilepicid').innerHTML;
        }
    };


    // upload file //
    $scope.getFileDetails = async function(tagId) {


        var filedata = document.getElementById('fileid')
        var fileinfo = filedata.files[0]
        console.log(fileinfo)

        if (fileinfo) {
            var fileJson = {
                name: fileinfo.name,
                extension: '.' + fileinfo.name.split('.').pop(),
                size: fileinfo.size,
                loading: true
            }

            var fd = new FormData();
            fd.append('file', fileinfo);
            fd.append('userdata', JSON.stringify($scope.talentInfo))

            if (fileinfo.size < (1024 * 1024 * 1024)) {
                $scope.talentDocuments.push(fileJson);
                $http({
                    method: 'POST',
                    url: 'api/uploadfile',
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity,
                    data: fd
                }).then(function(response) {
                    console.log(response)
                    var fileStatus = response.data;
                    // console.log(fileStatus)
                    if (!fileStatus.error) {
                        $scope.talentDocuments = fileStatus.data || []
                        $scope.init($scope.talentcopy);
                    } else {
                        $scope.showModal('error', fileStatus.msg);
                    }

                }, function(err) {
                    $scope.showModal('error', 'Server is busy please. Please try after some time.')
                    $scope.talentDocuments.pop()
                })
            } else {
                $scope.showModal('warning', 'File should be less than 1GB.')
            }
            document.getElementById(tagId).innerHTML = document.getElementById(tagId).innerHTML;
        }
    };
    // upload file end

    $scope.deleteDocumentFunc = async function(data, mode) {
        $scope.deleteDocument = null;
        console.log(data)
        if (data) {
            $scope.deleteDocument = data;
            $scope.showModal('confirm', `Are you sure you want to delete '${data.name}'?`);

        }
    }

    $scope.documentFucniton = async function(data, mode) {
        var tempData = data;
        tempData.mode = mode;

        // $window.open(`api/documentDownlaod?newfilename=${tempData.newfilename}&mode=${mode}&email=${tempData.email}&id=${tempData.id}&talent_id=${tempData.talent_id}`)

        $http({
            method: 'POST',
            url: `api/documentDownlaod`,
            // url: `api/documentDownlaod?newfilename=${tempData.newfilename}&mode=${mode}&email=${tempData.email}&id=${tempData.id}&talent_id=${tempData.talent_id}`,
            data: tempData
        }).then(function(response) {
            console.log(response)
            if (mode != 'download') {
                $scope.talentDocuments = response.data || [];
                $scope.init($scope.talentcopy);
            } else {
                $window.open('api/downloadDocument?path=' + response.data)
            }
        }, function(err) {
            console.log(err)
        })
    }


    //Activity
    $scope.saveActivity = async function(mode) {
        $scope.individual_loader = true;
        $scope.showContainer = false;
        var p_mode = mode;
        var email = $scope.talentDetails.email;
        var activity_name = $scope.activity;
        var scheduled_on = $scope.schedulded_on;
        var created_by = $scope.talentDetails.manager;
        var manager_email = $scope.talentDetails.manager_email;
        var standard_title = $scope.talentDetails.standard_title;
        console.log('standard_title', standard_title)
        console.log('scheduled_on', scheduled_on)
        console.log(p_mode, activity_name, scheduled_on, email, created_by, manager_email, standard_title)
        if (activity_name != "" && scheduled_on != "") {
            $http({
                method: 'POST',
                url: 'api/addActivity',
                data: {
                    p_mode: p_mode,
                    activity_name: activity_name,
                    scheduled_on: scheduled_on,
                    email: email,
                    created_by: created_by,
                    manager_email: manager_email,
                    standard_title: standard_title
                }
            }).then(function(data) {
                if (data) {
                    console.log(data);
                    $scope.activity = '';
                    $scope.schedulded_on = '';
                    listActivityStatus()
                }
            }, function(err) {
                console.log('user save tag error')
                $scope.individual_loader = false;
                $scope.showContainer = true;
            })
        } else {
            $scope.showModal('error', 'Please fill the details.')
            $scope.individual_loader = false;
            $scope.showContainer = true;
        }
    }

    $scope.submitfun = async function(status, index) {
        // debugger;

        var curr_status = angular.element(this);

        curr_status.removeClass("status_new");
        curr_status.removeClass("status_inprocess");
        curr_status.removeClass("status_blocker");
        curr_status.removeClass("status_success");

        if (status == "New") {
            curr_status.addClass("status_new");
        } else if (status == "InProcess") {
            curr_status.addClass("status_inprocess");
        } else if (status == "Blocker") {
            curr_status.addClass("status_blocker");
        } else {
            curr_status.addClass("status_success");
        }


        // alert('status' +status)
        console.log('status', status)
            // alert('index' +$scope.activities[index].name)
        console.log('activity', $scope.activities[index].name)
        var activity_status = status;
        var activity_name = $scope.activities[index].name;

        updateActivityStatus(activity_status, activity_name)
    }


    async function updateActivityStatus(activity_status, activity_name) {

        var email = $scope.talentDetails.email;
        console.log('activity_name', activity_name)
        $http({
            method: 'POST',
            url: 'api/updateActivityStatus',
            data: {
                name: activity_name,
                status: activity_status,
                email: email
            }
        }).then(function(data) {
            if (data) {
                console.log(data);
            }
        }, function(err) {
            console.log('user save tag error')
        })
    }

    async function listActivityStatus() {
        var email = $scope.talentDetails.email;
        console.log('email', email)
        $http({
            method: 'POST',
            url: 'api/listActivityStatus',
            data: {
                email: email
            }
        }).then(function(data) {
            if (data) {
                console.log('data', data.data[0]._sittm_save_activities);
                console.log('data.data.activitylist----', data[0])
                    // console.log('data.data.activitylist----', data[0]._sittm_save_activities[5].activity_name)
                $scope.activities = data.data[0]._sittm_save_activities || [];

                $scope.saved_activity_info = angular.copy($scope.activities)
                $scope.showModal('success', 'Activity saved.')
                $scope.individual_loader = false;
                $scope.showContainer = true;
                // window.location.reload();
                $scope.init($scope.talentcopy);
            }
        }, function(err) {
            console.log('user save tag error')
            $scope.individual_loader = false;
            $scope.showContainer = true;
        })
    }

    // drop down//
    $scope.dataMotivator = async function(data) {
        $scope.individual_loader = true;
        $scope.showContainer = false;
        console.log(" dataMotivator ==>>", data);
        var tag = data
        if (tag == 'Motivators' || tag == 'Skill') {
            console.log(" in if condition");

            var tagname = tag;

            await $http({
                method: 'POST',
                url: 'api/data_Motivator',
                data: {
                    tag: tagname
                }
            }).then(async function(data) {
                if (data.data.length != 0) {
                    await console.log("## ", data);
                    $scope.tagsdescriptionDATA = data.data || [];
                    $scope.individual_loader = false;
                    $scope.showContainer = true;
                } else {
                    console.log("## else ");
                    $scope.individual_loader = false;
                    $scope.showContainer = true;
                }
            }, function(err) {
                console.log(" err ", err);
                $scope.individual_loader = false;
                $scope.showContainer = true;
            })
        } else {
            console.log(" tag == ", tag);
            $scope.tagsdescriptionDATA = []
            $scope.individual_loader = false;
            $scope.showContainer = true;
        }
    }


    $scope.showModal = async function(alertType, message1) {
        $scope.primary_alert_msg = message1;

        if (alertType.toLowerCase() == 'error') {
            angular.element("#errorModal").modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });

        } else if (alertType.toLowerCase() == 'information') {
            angular.element("#infoModal").modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });
        } else if (alertType.toLowerCase() == 'confirm') {
            angular.element("#confirmModal").modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });
        } else if (alertType.toLowerCase() == 'success') {
            angular.element("#successModal").modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });
            // $scope.$apply()
        } else if (alertType.toLowerCase() == 'warning') {
            angular.element("#warningModal").modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });
        }
    }
});