angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout, $location, $ionicPopup, $state, AuthService, AUTH_EVENTS, $stateParams, ionicMaterialInk, ionicMaterialMotion, API, $http) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    //--------------------------------------------
    $scope.data = {};
    console.log("api", API);
    $scope.login = function (data) {
      AuthService.login(data.username, data.password).then(function (authenticated) {
        $state.go('tabsController.home', {}, { reload: true });
        $scope.setCurrentUsername(data.username);
      }, function (err) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
        // to activate ink on modal
        $timeout(function () {
          ionicMaterialInk.displayEffect();
        }, 0);
      });
    };
    //--------------------------------------------
    $scope.logout = function () {
      AuthService.logout();
      $state.go('app.login');
    };
    //--------------------------------------------
    // An alert dialog
    $scope.showAlert = function (msg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Warning Message',
        template: msg
      });
      // to activate ink on modal
      $timeout(function () {
        ionic.material.ink.displayEffect();
      }, 0);
    };
    //--------------------------------------------
    $scope.username = AuthService.username();

    $scope.$on(AUTH_EVENTS.notAuthorized, function (event) {
      var alertPopup = $ionicPopup.alert({
        title: 'Unauthorized!',
        template: 'You are not allowed to access this resource.'
      });
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
      if ($state.is('app.login')) return;
      AuthService.logout();
      $state.go('app.login');

      var alertPopup = $ionicPopup.alert({
        title: 'Session Lost!',
        template: 'Sorry, You have to login again.'
      });
    });

    $scope.setCurrentUsername = function (name) {
      $scope.username = name;
    };
  })
  .controller('ProfileCtrl', function ($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, Profiles) {
    // Set Header

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.profile = Profiles.get($stateParams.profileId);
    // Set Motion
    $timeout(function () {
      ionicMaterialMotion.slideUp({
        selector: '.slide-up'
      });
    }, 300);

    $timeout(function () {
      ionicMaterialMotion.fadeSlideInRight({
        startVelocity: 3000
      });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
  })


  // .controller('DashCtrl', function ($scope, $stateParams, Profiles, ionicMaterialInk) {
  //   $scope.profiles = Profiles.all();
  // })


  .controller('menuCtrl', ['$scope', '$stateParams', '$state', 'AuthService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $state, AuthService) {
      //--------------------------------------------
      $scope.logout = function () {
        AuthService.logout();
        $state.go('app.login');
      };

    }])

  .controller('homeCtrl', ['$scope', '$stateParams', 'API', '$http', 'AuthService',
    function ($scope, $stateParams, API, $http, AuthService) {

      $http.get(API.root + "polls").then(
        function (result) {
          $scope.polls = result.data.data;

          console.log(result.data.message, $scope.polls);
        },
        function (response) {
          console.log(response);
        }
      )

    }])
  .controller('addPollCtrl', ['$scope', '$state', '$stateParams', 'API', '$http', 'AuthService', 'moment', 'ionicDatePicker', 'categories',
    function ($scope, $state, $stateParams, API, $http, AuthService, moment, ionicDatePicker, categories) {
      $scope.data = {
        "title": "",
        "categoryId": 1,
        "description": "",
        "openTime": "",
        "closeTime": "",
        "targetGroup": 2,
        "type": "open",
        "userId": 3  //TODO get from token
      };
      $scope.answers = [{
        text: ""
      }];
      $scope.addAnswer = function () {
        $scope.answers.push({
          text: "",
        });
      }
      $scope.removeAnswer = function (index) {
        $scope.answers.splice(index, 1);
      }
      categories.get().then(function (res) {
        $scope.categories = res;
      }, function () {
        $scope.categories = undefined;
      })
      var fromCallback = {
        callback: function (val) {  //Mandatory
          $scope.data.closeTime = moment(val).format("YYYY-MM-DD hh:mm:ss");
        }
      }
      $scope.data.openTime = moment().format("YYYY-MM-DD hh:mm:ss");
      $scope.fromDatepicker = function () {
        ionicDatePicker.openDatePicker({
          callback: function (val) {  //Mandatory
            $scope.data.openTime = moment(val).format("YYYY-MM-DD hh:mm:ss");
          },
          from: moment().format("YYYY-MM-DD hh:mm:ss")
        });
      };

      $scope.toDatepicker = function () {
        ionicDatePicker.openDatePicker({
          callback: function (val) {  //Mandatory
            $scope.data.closeTime = moment(val).format("YYYY-MM-DD hh:mm:ss");
          },
          from: $scope.data.openTime
        });
      };
      $scope.save = function () {

        $http.post(API.root + "polls", $scope.data).then(
          function (result) {
            $scope.polls = result.data.data;
            console.log('Saved successfully');
            console.log(result.data.message, JSON.stringify($scope.polls));
            $scope.answers.map(function (answer) {
              return answer.pollId = result.data.data.id;
            })
            console.log(angular.toJson($scope.answers));
            var data = JSON.parse(angular.toJson($scope.answers))//remove the angular index
            $http.post(API.root + "answers", data).then(
              function (res) {
                console.log('Answers saved successfully');
                console.log(result.data.message, $scope.answers);
                $state.go('tabsController.home', {}, { reload: true });
              },
              function (err) {
                console.log(err);
              })
          },
          function (response) {
            console.log(response);
          }
        )
      }
    }])

  .controller('viewPollCtrl', ['$scope', '$state', '$stateParams', 'API', '$http', 'AuthService', 'moment', 'ionicDatePicker', '$rootScope', '$ionicScrollDelegate',
    function ($scope, $state, $stateParams, API, $http, AuthService, moment, ionicDatePicker, $rootScope, $ionicScrollDelegate) {
      $scope.poll = {};
      $http.get(API.root + "polls/" + $stateParams.pollId).then(function (res) {
        $scope.poll = res.data.data;
        $rootScope.$$phase || $rootScope.apply();
        console.log($scope.poll);
      }, function (err) {
        console.log(err);
      })
      $scope.addComment = function (message) {
        var data = {
          "pollId": $scope.poll.id,
          "comment": $scope.message,
          "userId": 3 //TODO get from token
        }
        $http.post(API.root + 'opinions', data).then(
          function (res) {
            console.log(res.data.data);
            $scope.poll.opinions.push(res.data.data);
            $scope.message = "";
            $ionicScrollDelegate.scrollBottom(true);
          }, function (err) {
            console.log("ERROR :", err);
            console.log("Data :", data);
          }
        )
      }
    }])

  .controller('pollsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])

  .controller('communityDiscussionCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])
  ;

