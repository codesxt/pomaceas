angular.module('PomaceasWebApp')
.controller('navigationCtrl', navigationCtrl);

function navigationCtrl($location, authSvc, $rootScope){
  var vm = this;
  vm.currentPath = $location.path();
  vm.isLoggedIn = authSvc.isLoggedIn();
  vm.currentUser = authSvc.currentUser();
  vm.logout = function() {
    authSvc.logout();
    vm.isLoggedIn = authSvc.isLoggedIn();
    console.log(vm.isLoggedIn);
    $location.path('/');
  };
  $rootScope.$on("UserLoggedIn", function(){
    vm.isLoggedIn = authSvc.isLoggedIn();
    vm.currentUser = authSvc.currentUser();
  });
}
