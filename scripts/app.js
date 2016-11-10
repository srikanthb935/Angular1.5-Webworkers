(function () {
  var app = angular.module("CtzCodeCafe", ['hljs']);
  app.config(function (hljsServiceProvider) {
    hljsServiceProvider.setOptions({
      // replace tab with 2 spaces
      tabReplace: '  '
    });
  });
  app.constant("config", {
    "serviceUrls": {
      "submissionDetails": "https://hackerearth.0x10.info/api/ctz_coders?type=json&query=list_submissions&page=",
      "languageMapping": "https://hackerearth.0x10.info/api/ctz_coders?type=json&query=list_compiler_image"
    },
    "initialLimit": 10,
    "maxPageSize": 50,
    "maxPages": 10
  });
})();