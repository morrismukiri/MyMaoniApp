angular.module('starter.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      //--------------------------------------

      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html'
            // templateUrl: 'templates/tab-signin.html'
          }
        },
        authStatus: false
      })
      .state('app.signup', {
        url: '/signup',
        views: {
          'menuContent': {
            templateUrl: 'templates/tab-signup.html',
          }
        },
        authStatus: false
      })
      //--------------------------------------


      .state('app.dashboard', {
        url: '/dashboard',
        views: {
          'menuContent': {
            templateUrl: 'templates/dashboard.html',
            controller: 'DashCtrl'
          }
        },
        authStatus: true
      })


      .state('app.profiles', {
        url: '/profiles',
        views: {
          'menuContent': {
            // templateUrl: 'templates/profiles.html',
            templateUrl: 'templates/profile.html',
            controller: 'ProfilesCtrl'
          }
        }
      })

      .state('app.profile', {
        url: '/profile/:profileId',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile-detail.html',
            controller: 'ProfileCtrl'
          }
        }
      })
      // if none of the above states are matched, use this as the fallback


    //   .state('tabsController.home', {
    //     url: '/home',
    //     views: {
    //       'tab1': {
    //         templateUrl: 'templates/home.html',
    //         controller: 'homeCtrl'
    //       }
    //     }
    //   })

    //   .state('tabsController.polls', {
    //     url: '/polls',
    //     views: {
    //       'tab2': {
    //         templateUrl: 'templates/polls.html',
    //         controller: 'pollsCtrl'
    //       }
    //     }
    //   })

    //   .state('tabsController.communityDiscussion', {
    //     url: '/talk',
    //     views: {
    //       'tab3': {
    //         templateUrl: 'templates/communityDiscussion.html',
    //         controller: 'communityDiscussionCtrl'
    //       }
    //     }
    //   })

    //   .state('tabsController', {
    //     url: '/page1',
    //     templateUrl: 'templates/tabsController.html',
    //     abstract: true
    //   })

    // // $urlRouterProvider.otherwise('/page1/home')
    $urlRouterProvider.otherwise('/app/login');


  });
