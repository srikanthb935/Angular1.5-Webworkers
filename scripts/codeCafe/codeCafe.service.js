(function () {
  var app = angular.module("CtzCodeCafe");
  app.service("codeCafeService", ['$http', 'config', function ($http, config) {
    this.getLanguageMappings = function () {
      return $http.get(config.serviceUrls.languageMapping);
    };
    this.getDetails = function (pageNo) {
      return $http.get(config.serviceUrls.submissionDetails + pageNo);
    };
  }]);
})();