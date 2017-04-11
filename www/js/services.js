angular.module('starter.services', [])

  .factory('Profiles', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var profiles = [{
      id: 0,
      name: 'Anoop Kumar',
      deseg: 'Team Lead',
      face: 'img/150x165/anoop-kumar.png'
    }, {
      id: 1,
      name: 'Vijay Kumar',
      deseg: 'Project Manager',
      face: 'img/150x165/vijay-kumar.png'
    }, {
      id: 2,
      name: 'Durgesh Soni',
      deseg: 'Team Lead',
      face: 'img/150x165/durgesh-soni.png'
    }, {
      id: 3,
      name: 'Manish Mittal',
      deseg: 'Project Manager',
      face: 'img/150x165/manish-mittal.png'
    }, {
      id: 4,
      name: 'Vinay Kumar',
      deseg: 'UI Designer',
      face: 'img/150x165/vinay-kumar.png'
    }, {
      id: 5,
      name: 'Ankit Gera',
      deseg: 'System Administrator',
      face: 'img/150x165/ankit-gera.png'
    }];

    return {
      all: function () {
        return profiles;
      },
      remove: function (id) {
        profiles.splice(profiles.indexOf(id), 1);
      },
      get: function (profileId) {
        for (var i = 0; i < profiles.length; i++) {
          if (profiles[i].id === parseInt(profileId)) {
            return profiles[i];
          }
        }
        return null;
      }
    };
  })
  .service('AuthService', function ($q, $http, USER_ROLES, API) {
    var LOCAL_TOKEN_KEY = 'token';
    var username = '';
    var isAuthenticated = false;
    var role = '';
    var authToken;

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
      isAuthenticated = true;
      authToken = token;

      if (username == 'admin') {
        role = USER_ROLES.admin
      }
      if (username == 'user') {
        role = USER_ROLES.public
      }

      // Set the token as header for your requests!
      $http.defaults.headers.common['Authorization'] = token;
    }

    function destroyUserCredentials() {
      authToken = undefined;
      username = '';
      isAuthenticated = false;
      $http.defaults.headers.common['X-Auth-Token'] = undefined;
      window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    var login = function (name, pw) {
      return $q(function (resolve, reject) {
        $http.post(API.root + 'authenticate', {
          "email": name,
          "password": pw
        }).then(function (result) {

          storeUserCredentials('Bearer ' + result.data.token);
          resolve('Login success.');
        }, function (result) {
          {
            reject('Login Failed.');
          }
        })

        // if ((name == 'admin' && pw == '1') || (name == 'user' && pw == '1')) {
        //   // Make a request and receive your auth token from your server
        //   storeUserCredentials(name + '.yourServerToken');
        //   resolve('Login success.');
        // } else {
        //   reject('Login Failed.');
        // }
      });
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

    loadUserCredentials();

    return {
      login: login,
      logout: logout,
      isAuthorized: isAuthorized,
      isAuthenticated: function () { return isAuthenticated; },
      username: function () { return username; },
      role: function () { return role; }
    };
  })
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
