angular.module('starter')

  .constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })

  .constant('USER_ROLES', {
    admin: 'admin_role',
    public: 'public_role'
  })

  .constant('API', {
    // root:'http://localhost:8000/api/v1/'
    root: 'http://admin.mymaoni.com/api/v1/'
    // root: 'http://40.10.10.148/mymaoniback/public/index.php/api/v1/'
  });
