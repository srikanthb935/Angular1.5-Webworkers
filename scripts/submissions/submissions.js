(function () {
  var app = angular.module("CtzCodeCafe");
  app.component("submissions", {
    templateUrl: 'scripts/submissions/submissions.template.html',
    bindings: {
      data: "=",
      languageMappings: "=",
      statusFilter: "=",
      search: "=",
      limit: '='
    },
    controller: ['config', function (config) {
      var vm = this;
      this.maxPageSize = config.maxPageSize;
      this.getIamge = function (language) {
        var iconSrc = "", i, length = this.languageMappings.length;
        for (i = 0; i < length; i++) {
          if (this.languageMappings[i].language === language) {
            iconSrc = this.languageMappings[i].icon;
            break;
          }
        }
        return iconSrc;
      };

      this.submissionFilter = function (value) {
        var isFilterApplied = false;
        var found = false, filter = vm.statusFilter;
        for (var key in filter) {
          if (filter.hasOwnProperty(key)) {
            if (filter[key] === true) {
              isFilterApplied = true;
            }
            if (value['compiler_status'].toLowerCase().indexOf(key) !== -1 && filter[key] === true) {
              found = true;
            }
          }
        }
        if (!isFilterApplied) {
          return value;
        }
        if (found) {
          return value;
        }
      };
    }],
    controllerAs: 'vm'
  });
})();