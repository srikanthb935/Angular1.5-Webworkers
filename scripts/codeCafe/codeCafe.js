(function () {
  var app = angular.module("CtzCodeCafe");
  app.component("codeCafe", {
    templateUrl: 'scripts/codeCafe/codeCafe.template.html',
    bindings: {
      data: "="
    },
    controller: ['codeCafeService', 'config', '$scope', function (codeCafeService, config, $scope) {
      this.filter = {
        accepted: false,
        skipped: false,
        memory: false,
        runtime: false,
        wrong: false
      };
      this.pageNo = 1;
      this.search = "";
      this.pages = [];
      this.languageMappings = [];
      this.limit = config.initialLimit;
      this.pagination = {
        start: 1,
        end: config.maxPages
      };
      this.statistics = {
        "top-5-languages-used": [],
        "top-2-submissions-attempted": [],
        "submissions-per-level": []
      };
      var vm = this;

      this.getSubmissionDetails = function (pgNo) {
        this.pageNo = (pgNo) ? pgNo : 1;
        this.limit = config.initialLimit;
        codeCafeService.getDetails(this.pageNo).then(function (response) {
          vm.submissions = response.data.websites;
        }).catch(function () {
          console.log('error');
        });
      };

      this.getStatistics = function () {
        if (typeof (Worker) !== "undefined") {
          worker = new Worker("/scripts/codeCafe/codeCafeStatisticsWorker.js");
          worker.onmessage = function (event) {
            vm.statistics = event.data.result;
            if (!$scope.$$phase) {
              $scope.$apply()
            }
            if (event.data.canTerminate) {
              worker.terminate();
            }
          };
        } else {
          document.getElementById("statistics").innerHTML = "Sorry, your browser does not support Web Workers...";
        }
      };

      this.getLanguageMappings = function () {
        codeCafeService.getLanguageMappings().then(function (response) {
          vm.languageMappings = response.data;
        });
      }

      this.filterPages = function (number) {
        if (number >= vm.pagination.start && number <= vm.pagination.end) {
          return true
        }
      };

      this.nextPage = function () {
        if (this.pagination.end < this.pages.length) {
          this.pagination.end += 1;
          this.pagination.start += 1;
          this.activePage(this.pageNo + 1);
        }
      };

      this.previousPage = function () {
        if (this.pagination.start > 1) {
          this.pagination.start -= 1;
          this.pagination.end -= 1;
          this.activePage(this.pageNo - 1);
        }
      };

      this.activePage = function (pageNo) {
        this.getSubmissionDetails(pageNo);
      };

      this.getPages = function () {
        for (var count = 1, pages = []; count <= 1347; count++) {
          pages.push(count);
        }
        vm.pages = pages;
      };

      this.init = function () {
        this.getSubmissionDetails(this.pageNo);
        this.getStatistics();
        this.getLanguageMappings();
        this.getPages();
      };

      this.init();
    }],
    controllerAs: 'vm'
  });
})();