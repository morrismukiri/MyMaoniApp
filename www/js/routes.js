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
      .state('polls', {
        url: '/polls',
        templateUrl: 'templates/polls-container.html',
        abstract: true,
        controller: 'addPollCtrl'
      })
      .state('polls.addPoll', {
        url: '/addpoll',
        views: {
          'form': {
            templateUrl: 'templates/add-poll.html',

          }
        }
      })
      .state('polls.viewPoll', {
        url: '/view/:pollId',
        views: {
          'form': {
            templateUrl: 'templates/view-poll.html',
            controller: 'viewPollCtrl'
          }
        }
      })
      .state('polls.addanswers', {
        url: '/addanswers',
        views: {
          'form': {
            templateUrl: 'templates/add-poll-answers.html',
          }
        }
      })

      .state('tabsController.home', {
        url: '/home',
        views: {
          'tab1': {
            templateUrl: 'templates/home.html',
            controller: 'homeCtrl'
          }
        }
      })

      .state('tabsController.polls', {
        url: '/polls',
        views: {
          'tab2': {
            templateUrl: 'templates/polls.html',
            controller: 'pollsCtrl'
          }
        }
      })

      .state('tabsController.communityDiscussion', {
        url: '/talk',
        views: {
          'tab3': {
            templateUrl: 'templates/communityDiscussion.html',
            controller: 'communityDiscussionCtrl'
          }
        }
      })

      .state('tabsController', {
        url: '/tabs',
        templateUrl: 'templates/tabsController.html',
        abstract: true
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup/signup-container.html',
        abstract: true,
        controller: 'signupCtrl'
      })
      .state('signup.basic', {
        url: '/basic',
        views: {
          'form': {
            templateUrl: 'templates/signup/signup-basic.html',

          }
        }
      })
    // $urlRouterProvider.otherwise('/page1/home')
    $urlRouterProvider.otherwise('/tabs/home');


  });
