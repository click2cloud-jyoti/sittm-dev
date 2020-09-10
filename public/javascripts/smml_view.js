angular.module('smmlApp', []).controller('smmlController', function ($scope, $http) {

    $scope.deleteTalentFunc = function (talent) {
        if (talent) {
            console.log(talent);
            $scope.deleteTalent = talent;
        } else {
            $scope.deleteTalent = null;
        }
    }

    function pageRefreshLog() {
        window.parent.location.reload(true);
    }

    $scope.smml_loader = false
    $scope.showContainer = false;

    $scope.confirmDeleteTalent = function (talent) {
        $scope.smml_loader = true
        $scope.showContainer = false;
        if (talent) {
            $http({
                "method": "POST",
                "url": "api/smmlDeleteTalent",
                "data": talent
            }).then(function (response) {
                console.log(response);
                var resTemp = response.data || {};
                if (!resTemp.login) {
                    pageRefreshLog();
                } else {
                    $scope.talentList = resTemp.data || [];
                    $scope.totalTalentCount.totaltalent -= 1;
                    $scope.totalTalentCount.lefttalent += 1;
                    $scope.getProgressStatus()
                    $scope.smml_loader = false
                    $scope.showContainer = true;
                }
            }, function (err) {
                $scope.showModal('error', 'Something went wrong.')
                $scope.smml_loader = false
                $scope.showContainer = true;
            })
        } else {
            $scope.showModal('error', 'Something went wrong.')
            $scope.smml_loader = false
            $scope.showContainer = true;
        }
    }

    $scope.init = function (data) {
        $scope.smml_loader = true
        $scope.showContainer = false;
        var parseData = JSON.parse(data);
        console.log(parseData);

        if (parseData.err) {
            $scope.showModal('error', parseData.msg);
        }

        $scope.UserInfo = parseData.user;

        if (parseData.user) {
            $http({
                "method": "POST",
                "url": "api/smmlManagerViewsDetails",
                "data": {
                    "mail_id": $scope.UserInfo.email,
                }
            }).then(function (response) {
                console.log(response);
                var resData = response.data
                if (!resData.login) {
                    pageRefreshLog();
                } else {
                    $scope.managerInfoList = resData.data || [];
                    console.log($scope.managerInfoList);

                    $scope.selectedManager = $scope.managerInfoList[0] || {};
                    if ($scope.managerInfoList.length != 0)
                        $scope.getManagerInfo($scope.selectedManager);

                    $scope.smml_loader = false
                    $scope.showContainer = true;
                }

            }, function (err) {
                $scope.showModal('error', 'Something went wrong.')
                $scope.smml_loader = false
                $scope.showContainer = true;
            })
        } else {
            $scope.showModal('error', 'Something went wrong.')
            $scope.smml_loader = false
            $scope.showContainer = true;
        }


    }

    $scope.getManagerInfo = async function (manager) {
        $scope.smml_loader = true
        $scope.showContainer = false;

        $scope.selectedManager = manager;
        $scope.managerDetails = {};
        $scope.talentList = [];

        if (manager.email && manager.personnel_nbr) {
            $http({
                "method": "POST",
                "url": "api/managerViewsDetails",
                "data": {
                    "manager": manager.email,
                    "id": manager.personnel_nbr,
                    "mode": "get_manager_info"
                }
            }).then(function (response) {
                console.log(response);
                var tempJson = response.data || {};
                if (!tempJson.login) {
                    pageRefreshLog();
                } else {
                    $scope.managerDetails = (tempJson.data && tempJson.data.manager[0]) || {};
                    $scope.talentList = (tempJson.data && tempJson.data.talent) || [];
                    $scope.totalTalentCount = (tempJson.data && tempJson.data.count) || {
                        "totaltalent": 0,
                        "lefttalent": 0,
                        "last30days": 0,
                    };
                    $scope.getProgressStatus()
                    $scope.smml_loader = false
                    $scope.showContainer = true;
                }
            }, function (err) {
                $scope.showModal('error', 'Something went wrong.')
                $scope.smml_loader = false
                $scope.showContainer = true;
            })
        } else {
            $scope.showModal('error', 'Something went wrong.')
            $scope.smml_loader = false
            $scope.showContainer = true;
        }
    }


    $scope.getProgressStatus = async function () {
        $scope.smml_loader = true
        $scope.showContainer = false;
        try {
            if ($scope.talentList.length != 0) {
                $scope.collectprogress = []
                for (j = 0; j < $scope.talentList.length; j++) {

                    $scope.talentInfo = $scope.talentList[j]
                    console.log($scope.talentInfo);
                    $scope.savetalentinfo = $scope.talentInfo;
                    $scope.talentDetails = [];
                    $scope.projectDetails = [];

                    await $http({
                        method: 'POST',
                        url: 'api/individualTalentDetails',
                        data: $scope.talentInfo
                    }).then(async function (data) {
                            if (data.data) {
                                var resTemp = await data.data || {};

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
                                    await $scope.tagCalloutFunct($scope.tagGroup, null);
                                    console.log("loop no " + j)
                                    $scope.talentList[j]["progress_state"] = $scope.progresscount
                                    // $scope.dataMotivator($scope.tagGroup);
                                }
                            }
                        },
                        function (err) {
                            // alert('somethong went wrong.')
                            $scope.showModal('error', 'Server is busy please. Please try after some time.')

                        })
                }
                console.log("Progress status")
                console.log($scope.collectprogress)
                console.log($scope.talentList)
                $scope.smml_loader = false
                $scope.showContainer = true;
            } else {
                $scope.smml_loader = false
                $scope.showContainer = true;
            }
        } catch (error) {
            $scope.talentInfo = null;
            $scope.smml_loader = true
            $scope.showContainer = false;
        }
    }

    $scope.tagCalloutFunct = async function (tag, ele) {

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
            }).then(async function (data) {
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
                },
                function (err) {
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

    $scope.progressBarParameter = async function () {
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
            $scope.progresscount = parseInt($scope.progresscount + 10)
            projectcount = 10
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

        //activities
        if ($scope.activities != "" && $scope.activities != null && $scope.activities != "null") {
            if ($scope.activities.length != 0) {
                $scope.progresscount = parseInt($scope.progresscount + 11)
                activitycount = activitycount + 11
            }
        }
        console.log("Activity total is " + activitycount)

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

        //tags
        if ($scope.common_tags != "" && $scope.common_tags != null && $scope.common_tags != "null") {
            if ($scope.common_tags.length != 0) {
                $scope.progresscount = parseInt($scope.progresscount + 10)
                tagcount = tagcount + 10
            }
        }
        console.log("Tags total is " + tagcount)

        //tag group
        if ($scope.tagGroup != "" && $scope.tagGroup != null && $scope.tagGroup != "null") {
            if ($scope.group_tags.length != 0) {
                $scope.progresscount = parseInt($scope.progresscount + 10)
                taggroupcount = taggroupcount + 10
            }
        }
        console.log("TagGroup total is " + taggroupcount)

        //documents
        if ($scope.talentDocuments != "" && $scope.talentDocuments != null && $scope.talentDocuments != "null") {
            if ($scope.talentDocuments.length != 0) {
                $scope.progresscount = parseInt($scope.progresscount + 10)
                documentcount = documentcount + 10
            }
        }
        console.log("Documents total is " + documentcount)
        console.log("Total Progress is " + $scope.progresscount)
        $scope.collectprogress.push({
            "progress": $scope.progresscount
        })
    }


    $scope.hrefDirectFunct = function (data) {
        if (data)
            return encodeURIComponent(JSON.stringify(data));
    }

    $scope.escalateModelFunct = function (talent) {
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

    $scope.escalateTalentFunct = function (talent, mode) {
        $scope.smml_loader = true
        $scope.showContainer = false;
        if (talent) {
            talent.mode = mode;
            console.log(talent);
            $http({
                method: 'POST',
                url: 'api/escalateTalent',
                data: talent
            }).then(function (response) {
                    if (response.data) {
                        var resTemp = response.data || {};
                        if (!resTemp.login) {
                            pageRefreshLog();
                        } else {
                            $scope.talentList = resTemp.data || [];
                            $scope.getProgressStatus()
                            $scope.smml_loader = false
                            $scope.showContainer = true;
                        }
                    }
                },
                function (err) {
                    // alert('Somenthing went wrong')
                    $scope.showModal('error', 'Something went wrong. Please try again.')
                    $scope.smml_loader = false
                    $scope.showContainer = true;
                })
        }
    }

    $scope.showModal = function (alertType, message1) {
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