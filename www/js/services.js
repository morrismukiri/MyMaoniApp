angular.module('starter.services', [])

  .service('AuthService', function ($q, $http, USER_ROLES, API, jwtHelper) {
    var LOCAL_TOKEN_KEY = 'token';
    var username = '';
    var isAuthenticated = false;
    var role = '';
    var authToken;
    var userId;

    function loadUserCredentials() {
      var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
      if (token) {
        useCredentials(token);
      }
    }

    function storeUserCredentials(token) {
      window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
      useCredentials(token);
    }

    function useCredentials(token) {
      username = token.split('.')[0];
      userId = jwtHelper.decodeToken(token).sub;
      isAuthenticated = true;
      authToken = token;

      // Set the token as header for your requests!
      $http.defaults.headers.common['Authorization'] = token;
    }

    function destroyUserCredentials() {
      authToken = undefined;
      username = '';
      userId = undefined;
      isAuthenticated = false;
      $http.defaults.headers.common['X-Auth-Token'] = undefined;
      window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    var login = function (email, password) {
      return $q(function (resolve, reject) {
        var data = {
          "email": email,
          "password": password
        }
        console.log('login data:', data);
        $http.post(API.root + 'authenticate', data).then(function (result) {

          storeUserCredentials('Bearer ' + result.data.token);
          resolve('Login success.');
        }, function (result) {
          {
            reject('Login Failed.');
          }
        })

      });
    };
    var signup = function (data) {
      return $q(function (resolve, reject) {
        $http.post(API.root + "signup", data).then(function (res) {
          storeUserCredentials('Bearer ' + res.data.token);
          console.log(res.data.data);
          resolve('signup success.');
        }, function (err) {
          console.log(err);
          reject('Signup Failed.');
        })
      })
    };
    var logout = function () {
      destroyUserCredentials();
    };

    var isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
    };

    var getUserId = function () {
      return userId;
    }

    loadUserCredentials();

    return {
      login: login,
      signup: signup,
      logout: logout,
      isAuthorized: isAuthorized,
      isAuthenticated: function () { return isAuthenticated; },
      username: function () { return username; },
      role: function () { return role; },
      getUserId: getUserId
    };
  })
  .service("categories", function ($q, $http, USER_ROLES, API, $rootScope) {
    var categories = {};
    return {
      get: function () {
        var deferred = $q.defer();
        if (!angular.equals(categories, {})) {
          deferred.resolve(categories);
        } else {
          $http.get(API.root + 'categories').then(function (res) {
            console.log(res.data.data)
            categories = res.data.data;
            deferred.resolve(res.data.data);
            $rootScope.$$phase || $rootScope.apply();
          }, function (err) {
            console.log(err);
            deferred.reject(err);
          })
        }
        return deferred.promise;
      }
    }
  })
  //Not the best way to do it. Used chained data from API instead.
  .filter("userDetails", function ($q, $http, USER_ROLES, API) {
    var cached = {};
    function fetch(id, field) {
      name = "Mg";
      if (id) {
        if (id in cached) {
          // avoid returning a promise!
          return typeof cached[id].then !== 'function' ? cached[id][field] : undefined;
        } else {
          cached[id] = $http.get(API.root + 'userdetail/' + id)
            .then(function (result) {
              // console.log('user detail for ', id, ' retrieved successfully', result.data.data.name);
              cached[id] = result.data.data;
            }, function (result) {
              console.log('Fetching userdetail failed', result);
            })
        }
      }

    }
    fetch.$stateful = true;
    return fetch;
  });
