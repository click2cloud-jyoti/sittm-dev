angular.module('NominateViewApp', []).controller('NominateViewCntrl', function($scope, $http) {

    $scope.checkUserMsg = '';
    $scope.TalentVar = function() {
        $scope.talentForm = {
            alias: '',
            manager: null,
            travel_tolerance: null,
            project: '',
            mobility: null,
            training: null,
            area_of_interest: '',
            quick_facts: '',
            delivberables: '',
        }
    }

    function pageRefreshLog() {
        window.parent.location.reload(true);
    }

    $scope.init = function(data) {
        try {
            userData = JSON.parse(data);
            $scope.User = userData.user;
            console.log($scope.User);
            $scope.TalentVar();
            if ($scope.User.email) {
                $http({
                    method: 'POST',
                    url: 'api/nominateTalentDetails',
                    data: {
                        value: true
                    }
                }).then((res) => {
                    console.log(res);
                    var resTemp = res.data || {};
                    if (!resTemp.login) {
                        pageRefreshLog();
                    } else {
                        $scope.certificateList = resTemp.data.certificates || [];
                        $scope.managerLists = resTemp.data.managers || [];
                    }
                }, (err) => {
                    $scope.showModal('error', 'Something went wrong. Please try again.');
                })
            }
        } catch (err) {
            console.log(err);
            $scope.User = undefined;

        }
    }

    $scope.updateErrorMsg = function(msg) {
        // $scope.checkUserMsg = msg;
        document.getElementById('aliasMsg').innerHTML = msg;
    }

    $scope.submitTalent = function(mode, formDetails) {
        console.log(mode);
        console.log(formDetails);
        formDetails.user = $scope.User
        if (/^[a-zA-Z0-9]{4,}$/.test(formDetails.alias) && formDetails.manager) {
            $http({
                method: 'POST',
                url: 'api/nominateTalentAliasCheck',
                data: formDetails
            }).then((res) => {
                console.log(res);
                var resTemp = res.data || {};
                if (!resTemp.login) {
                    pageRefreshLog();
                } else {
                    var aliasExists = resTemp.data.exists;
                    if (aliasExists) {
                        // $scope.checkUserMsg = 'Alias already exists.';
                        $scope.updateErrorMsg('Alias already exists.');
                    } else {
                        // $scope.checkUserMsg = '';
                        $scope.updateErrorMsg('');
                        if (mode == 'save') {
                            formDetails.mode = mode;
                            $http({
                                method: 'POST',
                                url: 'api/nominateTalentInsertDetails',
                                data: formDetails
                            }).then((res) => {
                                var insertRes = res.data;
                                if (!insertRes.login) {
                                    pageRefreshLog();
                                } else {
                                    if (insertRes.data.successful) {
                                        $scope.TalentVar();
                                        $scope.showModal('success', 'Successfully talent added.');
                                    } else
                                        $scope.showModal('error', 'Something went wrong, Please try again.');
                                }
                            }, (err) => {
                                $scope.showModal('error', 'Something went wrong, Please try again.');
                            });
                        }
                    }
                }
            }, (err) => {
                $scope.showModal('error', 'Something went wrong, Please try again.');
            })
        } else {
            $scope.updateErrorMsg('Alias does not require special characters or white spaces.<br> Alias Length should be greater than 4 characters.');
        }
    }

    // ------ Alert message method ------//
    $scope.showModal = function(alertType, message1) {
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