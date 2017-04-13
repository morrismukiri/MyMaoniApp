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
  .controller('addPollCtrl', ['$scope', '$stateParams', 'API', '$http', 'AuthService', 'moment', 'ionicDatePicker',
    function ($scope, $stateParams, API, $http, AuthService, moment, ionicDatePicker) {
      $scope.data = {
        "title": "",
        "categoryId": 1,
        "description": "",
        "openTime": "",
        "closeTime": "",
        "targetGroup": 2,
        "type": "open",
        "userId": 3
      };
      $scope.categories = [
        {
          "id": 1,
          "name": "nisi",
          "description": "Non explicabo quis nulla sint eaque. Et aliquid nulla sit. Eius est quia eos.",
          "parentId": 0,
          "created_at": "2017-04-04 19:33:10",
          "updated_at": "2017-04-04 19:33:10"
        },
        {
          "id": 2,
          "name": "repellendus",
          "description": "Est enim et fuga ea eos consequuntur. Et quisquam nostrum ducimus consequatur illum voluptatem. Non minima cupiditate velit. Autem consequatur officiis similique nesciunt.",
          "parentId": 0,
          "created_at": "2017-04-04 19:33:10",
          "updated_at": "2017-04-04 19:33:10"
        },
        {
          "id": 3,
          "name": "quasi",
          "description": "Id id sunt et ipsam. Dignissimos voluptatem vero consequatur in et. Incidunt vitae dolores dolore aspernatur eum deserunt quidem.",
          "parentId": 0,
          "created_at": "2017-04-04 19:33:10",
          "updated_at": "2017-04-04 19:33:10"
        },
        {
          "id": 4,
          "name": "est",
          "description": "Omnis dolorem qui voluptatem earum doloribus. Provident debitis voluptate veritatis vel sit laboriosam aut. Ut maiores pariatur ipsum maxime voluptatem maxime non. Beatae delectus voluptas aut est.",
          "parentId": 0,
          "created_at": "2017-04-04 19:33:10",
          "updated_at": "2017-04-04 19:33:10"
        },
        {
          "id": 5,
          "name": "exercitationem",
          "description": "Et placeat ea reiciendis voluptas quia aut blanditiis. Voluptas aut exercitationem eos voluptatem sit vel.",
          "parentId": 0,
          "created_at": "2017-04-04 19:33:10",
          "updated_at": "2017-04-04 19:33:10"
        }];
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
            // $scope.polls = result.data.data;
            console.log('Saved successfully');
            console.log(result.data.message, $scope.polls);
          },
          function (response) {
            console.log(response);
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

