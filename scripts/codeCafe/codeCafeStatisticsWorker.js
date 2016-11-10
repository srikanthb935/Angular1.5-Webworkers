(function () {
  var db;
  var intervals = [1, 10, 20];
  for (var i = 40; i < 1320; i = i + 30) {
    intervals.push(i);
  }
  intervals.push(1347);
  var intervalCounter = 0, initialCheck = true;
  var statisticsModel = {
    languages: {},
    submissions: {},
    levels: {}
  };

  function getSubmissions(pgNo) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var result = JSON.parse(this.response);
        addAll(result.websites, pgNo);
      }
    };
    xhttp.open("GET", "https://hackerearth.0x10.info/api/ctz_coders?type=json&query=list_submissions&page=" + pgNo, true);
    xhttp.send();
  };

  function init() {
    //prefixes of implementation that we want to test
    indexedDB = indexedDB || mozIndexedDB || webkitIndexedDB || msIndexedDB;
    var request = indexedDB.open("submissionsDatabase", 1);

    request.onerror = function (event) {
      console.log("error");
    };

    request.onsuccess = function (event) {
      db = request.result;
      console.log("success");
      loadSubmissions();
    };

    request.onupgradeneeded = function (event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore("submissions", { keyPath: "id" });
      console.log("first time");
    }
  };

  function loadSubmissions() {
    var objectStore = db.transaction("submissions").objectStore("submissions");
    objectStore.getAll().onsuccess = function (event) {
      var noOfRecords = (event.target.result) ? event.target.result.length : 0;
      var pageNo = noOfRecords / 50 + 1, index = 0, length = intervals.length;
      for (index; index < length; index++) {
        if (pageNo <= intervals[index]) {
          intervalCounter = index;
          break;
        }
      }
      getSubmissions(pageNo);
    };
  }

  function getStatistics() {
    var objectStore = db.transaction("submissions").objectStore("submissions");
    objectStore.getAll().onsuccess = function (event) {
      var submissionsData = event.target.result;
      var index = 0, length = submissionsData.length;
      var statistics = {
        "top-5-languages-used": [],
        "top-2-submissions-attempted": [],
        "submissions-per-level": [],
        "total-submissions": length
      };
      var previousInterval = intervalCounter - 1;
      if (!initialCheck && previousInterval > 0) {
        index = intervals[previousInterval - 1] * 50 - 1;
      }
      initialCheck = false;

      for (index; index < length; index++) {
        if (typeof statisticsModel.languages[submissionsData[index].language] === "undefined") {
          statisticsModel.languages[submissionsData[index].language] = 1;
        } else {
          statisticsModel.languages[submissionsData[index].language]++;
        }
        if (typeof statisticsModel.submissions[submissionsData[index].title] === "undefined") {
          statisticsModel.submissions[submissionsData[index].title] = 1;
        } else {
          statisticsModel.submissions[submissionsData[index].title]++;
        }
        if (typeof statisticsModel.levels[submissionsData[index].level] === "undefined") {
          statisticsModel.levels[submissionsData[index].level] = 1;
        } else {
          statisticsModel.levels[submissionsData[index].level]++;
        }
      }

      var languages = [], submissions = [], language, title, level;
      for (language in statisticsModel.languages) {
        languages.push({
          "language": language,
          "submissions": statisticsModel.languages[language]
        });
      }
      for (title in statisticsModel.submissions) {
        submissions.push({
          "title": title,
          "submissions": statisticsModel.submissions[title]
        });
      }
      for (level in statisticsModel.levels) {
        statistics['submissions-per-level'].push({
          "level": level,
          "submissions": statisticsModel.levels[level]
        });
      }
      languages.sort(function (a, b) {
        return b.submissions - a.submissions;
      });
      submissions.sort(function (a, b) {
        return b.submissions - a.submissions;
      });
      statistics["top-5-languages-used"] = languages.slice(0, 5);
      statistics["top-2-submissions-attempted"] = submissions.slice(0, 2);
      console.log(statistics);
      var canTerminate = false;
      if (previousInterval === intervals.length) {
        canTerminate = true;
      }
      postMessage({ result: statistics, canTerminate: canTerminate });
    }
  }

  function addAll(submissions, pgNo) {
    var request = db.transaction(["submissions"], "readwrite")
      .objectStore("submissions");

    request.onerror = function (event) {
      console.log("Unable to add data in your database! ");
    };

    for (var item in submissions) {
      if (submissions.hasOwnProperty(item)) {
        request.add({ id: submissions[item].id, language: submissions[item].language, title: submissions[item].title, level: submissions[item].metadata.level });
      }
    }
    if (pgNo >= intervals[intervalCounter]) {
      intervalCounter++;
      getStatistics();
    }
    if (pgNo < 1347) {
      getSubmissions(++pgNo);
    }
  }

  init();
})();