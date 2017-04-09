angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout,  $location, $ionicPopup, $state, AuthService, AUTH_EVENTS, $stateParams, ionicMaterialInk,ionicMaterialMotion) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  //--------------------------------------------
  //  $scope.login = function(user) {

	// 	if(typeof(user)=='undefined'){
	// 		$scope.showAlert('Please fill username and password to proceed.');
	// 		return false;
	// 	}

	// 	if(user.username=='demo@gmail.com' && user.password=='demo'){
	// 		$location.path('/app/dashboard');
	// 	}else{
	// 		$scope.showAlert('Invalid username or password.');
	// 	}

	// };
    $scope.data = {};

    $scope.login = function(data) {
      AuthService.login(data.username, data.password).then(function(authenticated) {
        $state.go('app.dashboard', {}, {reload: true});
        $scope.setCurrentUsername(data.username);
      }, function(err) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
    };
  //--------------------------------------------
  $scope.logout = function() {
    AuthService.logout();
     $state.go('app.login');
   };
  //--------------------------------------------
   // An alert dialog
	 $scope.showAlert = function(msg) {
	   var alertPopup = $ionicPopup.alert({
		 title: 'Warning Message',
		 template: msg
	   });
	 };
  //--------------------------------------------
  $scope.username = AuthService.username();

  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });

  $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };
})

.controller('ProfilesCtrl', function($scope , Profiles) {
    $scope.profiles = Profiles.all();
})

// .controller('ProfileCtrl', function($scope, $stateParams , Profiles) {
// 	$scope.profile = Profiles.get($stateParams.profileId);
// })
.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, Profiles) {
    // Set Header

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
	$scope.profile = Profiles.get($stateParams.profileId);
    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})


.controller('DashCtrl', function($scope, $stateParams , Profiles,ionicMaterialInk) {
	$scope.profiles = Profiles.all();
});

