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
    $scope.acceptsTerms = false;
    console.log("api", API);
    $scope.login = function () {
      if ($scope.data.email && $scope.data.password) {
        AuthService.login($scope.data.email, $scope.data.password).then(function (authenticated) {
          console.log('authenticated:', authenticated);
          // $state.go('tabsController.home', {}, { reload: true });
          $state.transitionTo('tabsController.home', $stateParams, {
            reload: true,
            inherit: false,
            notify: true
          });
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
      } else {
        var alertPopup = $ionicPopup.alert({
          title: 'Required!',
          template: 'Please check your credentials!'
        });
      }
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

  })
  .controller('ProfileCtrl', function ($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, API, $http, $state, AuthService, ionicToast) {

    $scope.disableEdit = true;

    $scope.profile = {
      "name": "",
      "email": "",
      "phone": "",
      "gender": "",
      "address": "",
      "county": "",
      "constituency": "",
      "ward": "",
      "dob": "",
      "password": ""
    };

    $http.get(API.root + "userdetail/" + AuthService.getUserId()).then(
      function (result) {
        $scope.profile = result.data.data;

        console.log(result.data.message, $scope.profile);
      },
      function (response) {
        console.log(response);
      }
    )




    $scope.toggleEdit = function () {
      $scope.disableEdit = !$scope.disableEdit;
      console.log('$scope.disableEdit:', $scope.disableEdit)
    }


    wardsData = [];
    $scope.counties = [];
    $scope.constituencies = [];
    $scope.wards = [];
    $http.get('js/wards.json').then(function (data) {
      wardsData = data.data;
      console.log("wards data:", wardsData);
      $scope.counties = _(wardsData).map("County").uniq().value();
      console.log(' $scope.counties', $scope.counties)
    });
    $scope.filterConstituency = function () {
      $scope.constituencies = _(wardsData).filter({ County: $scope.profile.county }).map("Constituency").uniq().value();
      console.log(' $scope.constituencies', $scope.constituencies)
    }
    $scope.filterWard = function () {
      $scope.wards = _(wardsData).filter({ County: $scope.profile.county, Constituency: $scope.profile.constituency }).map("WardName").uniq().value();
    }
    $scope.saveProfile = function () {
      $http.put(API.root + "userdetail/" + AuthService.getUserId(), $scope.profile).then(
        function (result) {
          // $scope.profile = result.data.data;
          ionicToast.show('Your profile details have been saved!', 'bottom', false, 3000);
          $scope.disableEdit = true;

          console.log(result.data.message, $scope.profile, "\n result:", result.data.data);
        },
        function (response) {
          console.log(response);
        }
      )
    };


    // Set Ink
    ionicMaterialInk.displayEffect();
  })


  // .controller('DashCtrl', function ($scope, $stateParams, Profiles, ionicMaterialInk) {
  //   $scope.profiles = Profiles.all();
  // })


  .controller('menuCtrl', ['$scope', '$stateParams', '$state', 'AuthService', 'API', '$http', '$ionicSideMenuDelegate',
    function ($scope, $stateParams, $state, AuthService, API, $http, $ionicSideMenuDelegate) {
      //--------------------------------------------
      $scope.logout = function () {
        $ionicSideMenuDelegate.toggleLeft();
        AuthService.logout();
        $state.go('app.login');
      };
      $scope.user = {};
      $scope.devicePlatform = ionic.Platform;
      if (AuthService.isAuthenticated()) {
        $http.get(API.root + "userdetail/" + AuthService.getUserId()).then(
          function (user) {
            $scope.user = user.data.data;
            console.log("menu user detail", $scope.user)

            console.log(user.data.message, $scope.profile);
          },
          function (response) {
            console.log(response);
          }
        )
      }


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
      $scope.doRefresh = function () {
        $http.get(API.root + "polls").then(
          function (result) {
            $scope.polls = result.data.data;

            console.log(result.data.message, $scope.polls);
          },
          function (response) {
            console.log(response);
          }
        )
          .finally(function () {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
      };

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
        "userId": AuthService.getUserId()
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
          "userId": AuthService.getUserId()
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
  .controller('voteCtrl', ['$scope', '$state', '$stateParams', 'API', '$http', 'AuthService', 'moment', 'ionicDatePicker', '$rootScope', '$ionicScrollDelegate',
    function ($scope, $state, $stateParams, API, $http, AuthService, moment, ionicDatePicker, $rootScope, $ionicScrollDelegate) {
      $scope.poll = {};
      $scope.data = {};
      $scope.selection = null;
      $http.get(API.root + "polls/" + $stateParams.pollId).then(function (res) {
        $scope.poll = res.data.data;
        $rootScope.$$phase || $rootScope.apply();
        console.log($scope.poll);
      }, function (err) {
        console.log(err);
      });
      $scope.addVote = function () {
        var data = [{
          "pollId": $scope.poll.id,
          "answerId": $scope.data.selection,
          "comment": $scope.data.comment ? $scope.data.comment : null,
          "userId": AuthService.getUserId()
        }];
        $http.post(API.root + 'vote', data).then(
          function (res) {
            console.log(JSON.stringify(res.data.data));
            $state.go('tabsController.home', {}, { reload: true });
          }, function (err) {
            console.log("ERROR :", err);
            console.log("Data :", JSON.stringify(data));
          }
        )
      }
    }])
  .controller('PollResultCtrl', ['$scope', '$state', '$stateParams', 'API', '$http', 'AuthService', 'moment', 'ionicDatePicker', '$rootScope', '$ionicScrollDelegate',
    function ($scope, $state, $stateParams, API, $http, AuthService, moment, ionicDatePicker, $rootScope, $ionicScrollDelegate) {
      $scope.labels = [];
      $scope.data = [];
      $scope.colors = ['#387ef5', '#33cd5f', '#ef473a', '#ffc900', '#4D5360', '#11c1f3', '#886aea'];
      $scope.options = { legend: { display: true, position: 'bottom', } };
      $scope.poll = {};
      // ChartJsProvider.setOptions({ colors : [ '#387ef5', '#11c1f3', '#33cd5f', '#ffc900', '#ef473a', '#886aea', '#4D5360'] });
      $http.get(API.root + "polls/" + $stateParams.pollId).then(function (res) {
        $scope.poll = res.data.data;
        $rootScope.$$phase || $rootScope.apply();
        console.log($scope.poll);
      }, function (err) {
        console.log(err);
      })
      $scope.voteResult = null;
      $http.get(API.root + "pollresultnumbers/" + $stateParams.pollId).then(function (res) {
        $scope.voteResult = res.data.data;

        var labels = [];
        var dataSet = [];
        $scope.answersFromVotes = [];
        for (var i = 0; i < $scope.voteResult.length; i++) {
          $scope.answersFromVotes.push($scope.voteResult[i].answer.text);
          $scope.labels.push($scope.voteResult[i].answer.text);
          $scope.data.push($scope.voteResult[i].totalVotes);
        }
        console.log("Answers from Votes: ", $scope.answersFromVotes);
        console.log('labels: ', labels);
        console.log('dataSet: ', dataSet);
        // $rootScope.$$phase || $rootScope.apply();
        // console.log(JSON.stringify($scope.voteResult), $scope.voteResult);
      }, function (err) {
        console.log(err);
      });


      $scope.labels1 = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      $scope.data1 = [300, 500, 100];

      // $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
      // $scope.series = ['Series A', 'Series B'];
      // $scope.data = [
      //   [65, 59, 80, 81, 56, 55, 40],
      //   [28, 48, 40, 19, 86, 27, 90]
      // ];

      // }
    }])
  .controller('signupCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout, $location, $ionicPopup, $state, AuthService, AUTH_EVENTS, $stateParams, ionicMaterialInk, ionicMaterialMotion, API, $http, ionicDatePicker) {
    $scope.data = {
      "name": "",
      "email": "",
      "phone": "",
      "gender": "",
      "address": "",
      "county": "",
      "constituency": "",
      "ward": "",
      "dob": "",
      "password": ""
    };
    wardsData = [];
    $scope.counties = [];
    $scope.constituencies = [];
    $scope.wards = [];
    $http.get('js/wards.json').then(function (data) {
      wardsData = data.data;
      console.log("wards data:", wardsData);
      $scope.counties = _(wardsData).map("County").uniq().value();
    });
    $scope.filterConstituency = function () {
      $scope.constituencies = _(wardsData).filter({ County: $scope.data.county }).map("Constituency").uniq().value();
    }
    $scope.filterWard = function () {
      $scope.wards = _(wardsData).filter({ County: $scope.data.county, Constituency: $scope.data.constituency }).map("WardName").uniq().value();
    }

    $scope.send_verification = function (phone) {
      var data = {
        "phone": phone
      };
      //TODO show dialog
      $http.post(API.root + "send_verification", data).then(function (res) {
        console.log(res.data.data);
      }, function (err) {
        console.log(err);
      })
    }

    $scope.check_verification = function (phone) {
      var data = {
        "phone": $scope.data.phone,
        "code": $scope.data.verificationCode
      };
      //TODO show dialog
      $http.post(API.root + "check_verification", data).then(function (res) {
        console.log(res.data.data);
      }, function (err) {
        console.log(err);
      })
    };
    $scope.validateBasic =function(){
     if(!$scope.data.name || !$scope.data.phone || !$scope.data.county || !$scope.data.constituency || !$scope.data.ward){
      var alertPopup = $ionicPopup.alert({
        title: 'You missed something!',
        template: 'Please check your details!'
      });

     }else{
      $state.go('signup.verify_phone', {}, { reload: true });
     }
    }

    $scope.do_signup = function () {
      console.log('Signup data :', JSON.stringify($scope.data))
      AuthService.signup($scope.data).then(function (res) {
        console.log(res);
        $state.go('tabsController.home', {}, { reload: true });
      }, function (err) {
        var alertPopup = $ionicPopup.alert({
          title: 'Signup failed!',
          template: 'Please check your details!'
        });
        // to activate ink on modal
        $timeout(function () {
          ionicMaterialInk.displayEffect();
        }, 0);
      });
    }
    $scope.dobDatePicker = function () {
      ionicDatePicker.openDatePicker({
        callback: function (val) {  //Mandatory
          $scope.data.dob = moment(val).format("YYYY-MM-DD");
        },
        to: moment().format("YYYY-MM-DD")
      });
    };

  })

  .controller('pollsCtrl', ['$scope', '$stateParams', 'API', '$http', 'AuthService',
    function ($scope, $stateParams, API, $http, AuthService) {

      $http.get(API.root + "pollsbyuser/" + AuthService.getUserId()).then(
        function (result) {
          $scope.polls = result.data.data;

          console.log(result.data.message, $scope.polls);
        },
        function (response) {
          console.log(response);
        }
      )
      $scope.doRefresh = function () {
        $http.get(API.root + "pollsbyuser/" + AuthService.getUserId()).then(
          function (result) {
            $scope.polls = result.data.data;

            console.log(result.data.message, $scope.polls);
          },
          function (response) {
            console.log(response);
          }
        )
          .finally(function () {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
      };

    }])
  .controller('surveyCtrl', ['$scope', '$stateParams', 'API', '$http', 'AuthService',
    function ($scope, $stateParams, API, $http, AuthService) {
      $scope.devicePlatform = ionic.Platform;
      $http.get(API.root + "surveys").then(
        function (result) {
          $scope.surveys = result.data.data;

          console.log(result.data.message, $scope.surveys);
        },
        function (response) {
          console.log(response);
        }
      )
      $scope.doRefresh = function () {
        $http.get(API.root + "surveys").then(
          function (result) {
            $scope.surveys = result.data.data;

            console.log(result.data.message, $scope.surveys);
          },
          function (response) {
            console.log(response);
          }
        )
          .finally(function () {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
      };

    }])

  .controller('communityDiscussionCtrl', ['$scope', '$stateParams', 'API', '$http', 'AuthService',
    function ($scope, $stateParams, API, $http, AuthService) {

      $http.get(API.root + "usercontribution/" + AuthService.getUserId()).then(
        function (result) {
          $scope.opinions = result.data.data.opinions
          $scope.votes = result.data.data.votes;

          console.log(result.data.message, $scope.polls);
        },
        function (response) {
          console.log(response);
        }
      )
      $scope.doRefresh = function () {
        $http.get(API.root + "usercontribution/" + AuthService.getUserId()).then(
          function (result) {
            $scope.polls = result.data.data;

            console.log(result.data.message, $scope.polls);
          },
          function (response) {
            console.log(response);
          }
        )
          .finally(function () {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
      };

    }])
  .controller('surveyVoteCtrl', ['$scope', '$state', '$stateParams', 'API', '$http', 'AuthService', 'moment', 'ionicDatePicker', '$rootScope', '$ionicScrollDelegate', '$ionicPopup', 'ionicToast', '$ionicHistory',
    function ($scope, $state, $stateParams, API, $http, AuthService, moment, ionicDatePicker, $rootScope, $ionicScrollDelegate, $ionicPopup, ionicToast, $ionicHistory) {
      $scope.poll = {};
      $scope.data = {};
      $scope.selection = null;

      $scope.canNotParticipate = true;
      $scope.surveyIsOpen = false;
      $scope.beforeOpen = true;
      $scope.afterClose = true;

      $http.get(API.root + "surveys/" + $stateParams.surveyId).then(function (res) {
        $scope.survey = res.data.data;
        $rootScope.$$phase || $rootScope.apply();

        $scope.beforeOpen = moment().isBefore($scope.survey.openTime);
        $scope.afterClose = moment().isAfter($scope.survey.closeTime);
        $scope.surveyIsOpen = !$scope.beforeOpen && !$scope.aftereClose;
        console.log('Survey Opens at ', $scope.survey.openTime, ' closes at  ', $scope.survey.closeTime, ' isOpen=', $scope.surveyIsOpen);
        console.log('Before:', $scope.beforeOpen, ' After:', $scope.survey.closeTime, $scope.afterClose);
        $scope.canNotParticipate = $scope.surveyIsOpen;

        // console.log($scope.survey);
      }, function (err) {
        console.log(err);
      });
      $scope.goBack = function () {
        $ionicHistory.goBack();
      };
      $scope.hideToast = function () {
        ionicToast.hide();
      };
      $scope.submitVote = function () {

        var data = [];
        console.log('selection:', JSON.stringify($scope.data));
        var completed = true;
        $scope.survey.polls.forEach(function (element) {
          // try {
          if ($scope.data.selection && $scope.data.selection[element.id]) {
            data.push({
              "pollId": element.id,
              "answerId": $scope.data.selection[element.id],
              "comment": $scope.data.comment && $scope.data.comment[element.id] ? $scope.data.comment[element.id] : null,
              "userId": AuthService.getUserId()
            });
          } else {
            completed = false;
          }
        }, this);
        console.log('data:', JSON.stringify(data));
        if (completed) {
          $http.post(API.root + 'vote', data).then(
            function (res) {
              console.log(res.data.data);
              $state.go('tabsController.home', {}, { reload: true });
              ionicToast.show('Your contribution has been saved. Thanks!', 'bottom', false, 3000);
            }, function (err) {
              console.log("ERROR :", err);
              console.log("Data :", data);
              ionicToast.show('Sorry! Something went wrong. please try again', 'bottom', false, 3000);
            }
          )
        } else {
          var alertPopup = $ionicPopup.alert({
            title: 'You Missed some polls ',
            template: 'Please answer all the polls'
          });
          return false;
        }
      }
    }])
  .controller('viewSurveyCtrl', ['$scope', '$state', '$stateParams', 'API', '$http', 'AuthService', 'moment', 'ionicDatePicker', '$rootScope', '$ionicScrollDelegate',
    function ($scope, $state, $stateParams, API, $http, AuthService, moment, ionicDatePicker, $rootScope, $ionicScrollDelegate) {
      $scope.survey = {};
      $http.get(API.root + "surveys/" + $stateParams.surveyId).then(function (res) {
        $scope.survey = res.data.data;
        $rootScope.$$phase || $rootScope.apply();
        console.log($scope.survey);
      }, function (err) {
        console.log(err);
      })
      $scope.addComment = function (message) {
        var data = {
          "surveyId": $scope.survey.id,
          "comment": $scope.message,
          "userId": AuthService.getUserId()
        }
        $http.post(API.root + 'comments', data).then(
          function (res) {
            console.log(res.data.data);
            $scope.survey.comments.push(res.data.data);
            $scope.message = "";
            $ionicScrollDelegate.scrollBottom(true);
          }, function (err) {
            console.log("ERROR :", err);
            console.log("Data :", data);
          }
        )
      }
    }])

  .controller('contributionCtrl', ['$scope', '$stateParams', 'API', '$http', 'AuthService',
    function ($scope, $stateParams, API, $http, AuthService) {

      $http.get(API.root + "usercontributedsurveys/" + AuthService.getUserId()).then(
        function (result) {
          $scope.surveys = result.data.data;
          // $scope.opinions = result.data.data.opinions
          // $scope.votes = result.data.data.votes;

          console.log('User contributed to these surveys:', result.data.message, $scope.surveys);
        },
        function (response) {
          console.log(response);
        }
      )
      $scope.doRefresh = function () {
        $http.get(API.root + "usercontributedsurveys/" + AuthService.getUserId()).then(
          function (result) {
            $scope.surveys = result.data.data;

            console.log(result.data.message, $scope.surveys);
          },
          function (response) {
            console.log(response);
          }
        )
          .finally(function () {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
      };

    }])

  .controller('SurveyResultCtrl', ['$scope', '$state', '$stateParams', 'API', '$http', 'AuthService', 'moment', 'ionicDatePicker', '$rootScope', '$ionicScrollDelegate',
    function ($scope, $state, $stateParams, API, $http, AuthService, moment, ionicDatePicker, $rootScope, $ionicScrollDelegate) {
      $scope.labels = [];
      $scope.data = [];
      $scope.colors = ['#387ef5', '#33cd5f', '#ef473a', '#ffc900', '#4D5360', '#11c1f3', '#886aea'];
      $scope.options = { legend: { display: true, position: 'bottom', } };
      $scope.poll = {};
      $scope.voteResult = [];
      // ChartJsProvider.setOptions({ colors : [ '#387ef5', '#11c1f3', '#33cd5f', '#ffc900', '#ef473a', '#886aea', '#4D5360'] });
      $http.get(API.root + "surveys/result/" + $stateParams.surveyId).then(function (res) {
        $scope.survey = res.data.data;
        $rootScope.$$phase || $rootScope.apply();
        console.log($scope.survey);

        $scope.survey.polls.forEach(function (poll, i) {
          poll.results = _(poll.votes)
            .groupBy('answerId')
            .map(function (items, answerId) {
              return { answerId: answerId, totalVotes: items.length, answer: items[0].answer };
            }).value();
          poll.data = [];
          poll.labels = [];
          poll.results.forEach(function (result, i) {

            poll.labels.push(result.answer.text);
            poll.data.push(result.totalVotes);

          })
        });


        console.log('voteResult :', $scope.survey);

      }, function (err) {
        console.log(err);
      })


    }])
  ;

