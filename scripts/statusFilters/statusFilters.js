(function () {
  var app = angular.module("CtzCodeCafe");
  app.component("statusFilters", {
    templateUrl: 'scripts/statusFilters/statusFilters.template.html',
    bindings: {
      filter: "="
    },
    controller: [function () {
    }],
    controllerAs: 'vm'
  });
})();