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


      .state('polls', {
        url: '/polls',
        templateUrl: 'templates/polls/polls-container.html',
        abstract: true,
        controller: 'addPollCtrl'
      })
      .state('polls.addPoll', {
        url: '/addpoll',
        views: {
          'form': {
            templateUrl: 'templates/polls/add-poll.html',

          }
        }
      })
      .state('polls.viewPoll', {
        url: '/view/:pollId',
        views: {
          'form': {
            templateUrl: 'templates/polls/view-poll.html',
            controller: 'viewPollCtrl'
          }
        }
      })
      .state('polls.addanswers', {
        url: '/addanswers',
        views: {
          'form': {
            templateUrl: 'templates/polls/add-poll-answers.html',
          }
        }
      })
      .state('polls.vote', {
        url: '/vote/:pollId',
        views: {
          'form': {
            templateUrl: 'templates/vote.html',
            controller: 'voteCtrl'
          }
        }
      })
      .state('polls.result', {
        url: '/result/:pollId',
        views: {
          'form': {
            templateUrl: 'templates/polls/poll-result.html',
            controller: 'PollResultCtrl'
          }
        }
      })

      // .state('tabsController.home', {
      //   url: '/home',
      //   views: {
      //     'tab1': {
      //       templateUrl: 'templates/home.html',
      //       controller: 'homeCtrl'
      //     }
      //   }
      // })
      .state('tabsController.home', {
        url: '/home',
        views: {
          'tab1': {
            templateUrl: 'templates/surveys/list-surveys.html',
            controller: 'surveyCtrl'
          }
        }
      })

      .state('tabsController.polls', {
        url: '/polls',
        views: {
          'tab2': {
            templateUrl: 'templates/polls/polls.html',
            controller: 'pollsCtrl'
          }
        }
      })

      .state('tabsController.communityDiscussion', {
        url: '/talk',
        views: {
          'tab2': {
            // templateUrl: 'templates/communityDiscussion.html',
            // controller: 'communityDiscussionCtrl'
            templateUrl: 'templates/contribution.html',
            controller: 'contributionCtrl'
          }
        }
      })
      .state('tabsController.profile', {
        url: '/profile',
        views: {
          'tab3': {
            templateUrl: 'templates/profile-detail.html',
            controller: 'ProfileCtrl'
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
      .state('signup.verify_phone', {
        url: '/verify_phone',
        views: {
          'form': {
            templateUrl: 'templates/signup/verify_phone.html',

          }
        }
      })
      .state('signup.additional', {
        url: '/additional',
        views: {
          'form': {
            templateUrl: 'templates/signup/additional.html',

          }
        }
      })
      .state('surveys', {
        url: '/surveys',
        templateUrl: 'templates/surveys/survey-container.html',
        abstract: true,
        controller: 'surveyCtrl'
      })
      .state('surveys.list', {
        url: '/list',
        views: {
          'form': {
            templateUrl: 'templates/surveys/list-surveys.html',

          }
        }
      })
      .state('surveys.vote', {
        url: '/vote/:surveyId',
        views: {
          'form': {
            templateUrl: 'templates/surveys/vote.html',
            controller: 'surveyVoteCtrl'
          }
        }
      })
      .state('surveys.viewsurvey', {
        url: '/view/:surveyId',
        views: {
          'form': {
            templateUrl: 'templates/surveys/view-survey.html',
            controller: 'viewSurveyCtrl'
          }
        }
      })
       .state('surveys.result', {
        url: '/result/:surveyId',
        views: {
          'form': {
            templateUrl: 'templates/surveys/survey-result.html',
            controller: 'SurveyResultCtrl'
          }
        }
      })
    // $urlRouterProvider.otherwise('/page1/home')
    $urlRouterProvider.otherwise('/tabs/home');


  });
