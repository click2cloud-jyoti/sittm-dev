angular.module('ManagerViewApp', []).controller('ManagerViewCntrl', function ($scope, $http) {
    console.log('ManagerView');

    function pageRefreshLog() {
        window.parent.location.reload(true);
    }

    $scope.init = function (data) {

        console.log(data);
        var talentInfo = JSON.parse(data);

        $scope.lastLogin = talentInfo.lastLoginTime || null;

        if (talentInfo.manager && talentInfo.manager_id) {
            $http({
                "method": "POST",
                "url": "api/managerViewsDetails",
                "data": {
                    "manager": talentInfo.manager,
                    "id": talentInfo.manager_id,
                    "mode": "get_manager_info"
                }
            }).then(function (response) {
                console.log(response);
                var resTemp = response.data || {}
                if (!resTemp.login) {
                    pageRefreshLog();
                } else {
                    $scope.managerDetails = (resTemp.data && resTemp.data.manager[0]) || {};
                    $scope.talentList = (resTemp.data && resTemp.data.talent) || [];
                    $scope.managername = $scope.managerDetails.full_name
                    $scope.aliasmanager = $scope.managerDetails.alias;
                }
            }, function (err) {
                // alert('Something went wrong.');
                $scope.showModal('error', 'Something went wrong.')
            })
        } else {
            // alert('manager is not present')
            $scope.showModal('error', 'Something went wrong.')
        }
    }

    // console.log(data);

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
                'create_at': talent.create_at
            }
        }
    }

    $scope.escalateTalentFunct = function (talent, mode) {
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
                        }
                    }
                },
                function (err) {
                    // alert('Somenthing went wrong')
                    $scope.showModal('error', 'Something went wrong. Please try again.')
                })
        }
    }

    $scope.hrefDirectFunct = function (data) {
        if (data)
            return encodeURIComponent(JSON.stringify(data));
    }

    // ------ Alert message method ------//
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