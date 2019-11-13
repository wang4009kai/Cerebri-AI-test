var app = angular.module('reportingApp', []);

//<editor-fold desc="global helpers">

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};
var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
    } else if (getSpec(item.description) !== getSpec(prevItem.description)) {
        item.displaySpecName = true;
    }
};

var getParent = function (str) {
    var arr = str.split('|');
    str = "";
    for (var i = arr.length - 2; i > 0; i--) {
        str += arr[i] + " > ";
    }
    return str.slice(0, -3);
};

var getShortDescription = function (str) {
    return str.split('|')[0];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};

var convertTimestamp = function (timestamp) {
    var d = new Date(timestamp),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),
        dd = ('0' + d.getDate()).slice(-2),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh === 0) {
        h = 12;
    }

    // ie: 2013-02-18, 8:35 AM
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

    return time;
};

var defaultSortFunction = function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) {
        return -1;
    } else if (a.sessionId > b.sessionId) {
        return 1;
    }

    if (a.timestamp < b.timestamp) {
        return -1;
    } else if (a.timestamp > b.timestamp) {
        return 1;
    }

    return 0;
};

//</editor-fold>

app.controller('ScreenshotReportController', ['$scope', '$http', 'TitleService', function ($scope, $http, titleService) {
    var that = this;
    var clientDefaults = {};

    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, clientDefaults.searchSettings || {}); // enable customisation of search settings on first page hit

    this.warningTime = 1400;
    this.dangerTime = 1900;
    this.totalDurationFormat = clientDefaults.totalDurationFormat;
    this.showTotalDurationIn = clientDefaults.showTotalDurationIn;

    var initialColumnSettings = clientDefaults.columnSettings; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        } else {
            this.inlineScreenshots = false;
        }
        if (initialColumnSettings.warningTime) {
            this.warningTime = initialColumnSettings.warningTime;
        }
        if (initialColumnSettings.dangerTime) {
            this.dangerTime = initialColumnSettings.dangerTime;
        }
    }


    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        return getParent(str);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };

    this.getShortDescription = function (str) {
        return getShortDescription(str);
    };
    this.hasNextScreenshot = function (index) {
        var old = index;
        return old !== this.getNextScreenshotIdx(index);
    };

    this.hasPreviousScreenshot = function (index) {
        var old = index;
        return old !== this.getPreviousScreenshotIdx(index);
    };
    this.getNextScreenshotIdx = function (index) {
        var next = index;
        var hit = false;
        while (next + 2 < this.results.length) {
            next++;
            if (this.results[next].screenShotFile && !this.results[next].pending) {
                hit = true;
                break;
            }
        }
        return hit ? next : index;
    };

    this.getPreviousScreenshotIdx = function (index) {
        var prev = index;
        var hit = false;
        while (prev > 0) {
            prev--;
            if (this.results[prev].screenShotFile && !this.results[prev].pending) {
                hit = true;
                break;
            }
        }
        return hit ? prev : index;
    };

    this.convertTimestamp = convertTimestamp;


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };

    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.totalDuration = function () {
        var sum = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.duration) {
                sum += result.duration;
            }
        }
        return sum;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };


    var results = [
    {
        "description": "should display welcome message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15385,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00bf002f-00a4-00be-007d-004e0053004c.png",
        "timestamp": 1573607941003,
        "duration": 1056
    },
    {
        "description": "should display first name label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15385,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001600a7-0078-002d-0093-00b400710054.png",
        "timestamp": 1573607942550,
        "duration": 3585
    },
    {
        "description": "should display last name label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15385,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a20069-0050-0088-0002-0049008c008e.png",
        "timestamp": 1573607946567,
        "duration": 3638
    },
    {
        "description": "should display gender label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15385,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005a004c-006a-0041-007c-005200b3002d.png",
        "timestamp": 1573607950650,
        "duration": 3857
    },
    {
        "description": "should display male radio button label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15385,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ee00be-00c6-00b4-008a-0002006000f1.png",
        "timestamp": 1573607954950,
        "duration": 3631
    },
    {
        "description": "should display welcome message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00da00a9-00ff-00a2-007a-00f800c20024.png",
        "timestamp": 1573607987752,
        "duration": 975
    },
    {
        "description": "should display first name label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000400db-00ad-00e6-0066-0023004100b9.png",
        "timestamp": 1573607989225,
        "duration": 5113
    },
    {
        "description": "should display last name label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00dc004b-00e7-0041-00e0-007c00e9009e.png",
        "timestamp": 1573607994960,
        "duration": 2917
    },
    {
        "description": "should display gender label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d100f9-004c-00fe-009e-00a500190085.png",
        "timestamp": 1573607998337,
        "duration": 4072
    },
    {
        "description": "should display male radio button label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00890076-00c3-0031-001b-00b0003900f2.png",
        "timestamp": 1573608002874,
        "duration": 4259
    },
    {
        "description": "should display female radio button label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007d0091-00e8-00da-0060-003100900065.png",
        "timestamp": 1573608007606,
        "duration": 3716
    },
    {
        "description": "should display email label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ed001b-002d-003e-004e-007700420029.png",
        "timestamp": 1573608011774,
        "duration": 3806
    },
    {
        "description": "should display phone number label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a30023-0054-003d-0041-0089003100ab.png",
        "timestamp": 1573608016066,
        "duration": 4063
    },
    {
        "description": "should display qualification label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006100ab-00b8-003e-00ff-003b00ba00da.png",
        "timestamp": 1573608020602,
        "duration": 4316
    },
    {
        "description": "should display qualification option master degree label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fe0057-0021-00f3-0052-0029003000f0.png",
        "timestamp": 1573608025362,
        "duration": 3646
    },
    {
        "description": "should display qualification option bachelor degree label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009200b9-009a-0058-00ac-00f100ef00e9.png",
        "timestamp": 1573608029449,
        "duration": 3812
    },
    {
        "description": "should display qualification option doctoral degree label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b600e1-00df-00ff-00aa-003100d300fd.png",
        "timestamp": 1573608033688,
        "duration": 4019
    },
    {
        "description": "should display qualification option associate degree label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00eb003b-005b-0080-0025-008f00e2006e.png",
        "timestamp": 1573608038138,
        "duration": 4122
    },
    {
        "description": "should display city label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007c0086-00b5-00dc-0038-00cf00de0048.png",
        "timestamp": 1573608042693,
        "duration": 4004
    },
    {
        "description": "should display state label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e100e3-005f-006f-00af-0025009b00d5.png",
        "timestamp": 1573608047168,
        "duration": 4179
    },
    {
        "description": "should display zipcode label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00830001-0019-00ad-0061-004f00d300ba.png",
        "timestamp": 1573608051842,
        "duration": 4469
    },
    {
        "description": "should display submit button label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a7001b-00e6-00f5-00dc-007500e20080.png",
        "timestamp": 1573608056782,
        "duration": 3818
    },
    {
        "description": "should display reset form button label|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00aa007a-0062-00e6-00e6-0076003b0052.png",
        "timestamp": 1573608061072,
        "duration": 4333
    },
    {
        "description": "reset form button should be enabled|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005900e3-003f-0032-006b-00f8006600ea.png",
        "timestamp": 1573608065865,
        "duration": 4312
    },
    {
        "description": "submit form button should be disabled at the beginning|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004d0053-0012-00a0-000f-000700530057.png",
        "timestamp": 1573608070702,
        "duration": 4064
    },
    {
        "description": "male radio button is not checked by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008e00b3-0083-00a5-0006-00fe00a10035.png",
        "timestamp": 1573608075267,
        "duration": 3631
    },
    {
        "description": "female radio button is not checked by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008100ae-0029-0062-0055-008400ce009e.png",
        "timestamp": 1573608079396,
        "duration": 3910
    },
    {
        "description": "male radio button is checked after click|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00de00a1-00cf-0088-005c-0051003a00ed.png",
        "timestamp": 1573608083843,
        "duration": 4266
    },
    {
        "description": "female radio button is checked after click|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b00013-00ae-00e8-003a-00f90098004e.png",
        "timestamp": 1573608088551,
        "duration": 4186
    },
    {
        "description": "male radio button is unchecked after female radio button is click|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00540084-0071-0010-005e-00c2003400b5.png",
        "timestamp": 1573608093184,
        "duration": 4317
    },
    {
        "description": "female radio button is unchecked after male radio button is click|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0078006d-00f2-0019-0005-0006009a00c2.png",
        "timestamp": 1573608097929,
        "duration": 4490
    },
    {
        "description": "master qualification dropdown option is not selected by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005e0078-0077-0048-00ff-007100b0000e.png",
        "timestamp": 1573608102832,
        "duration": 3066
    },
    {
        "description": "bachelor qualification dropdown option is not selected by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b50092-00a2-00e9-001c-001100b600c1.png",
        "timestamp": 1573608106424,
        "duration": 4181
    },
    {
        "description": "doctoral qualification dropdown option is not selected by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003500a7-0054-00c8-0000-00e2005d00bf.png",
        "timestamp": 1573608111103,
        "duration": 4644
    },
    {
        "description": "associate qualification dropdown option is not selected by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ae007f-00df-00da-002e-006b002e0090.png",
        "timestamp": 1573608116175,
        "duration": 3591
    },
    {
        "description": "master qualification dropdown option is not selected by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e600fc-0058-0039-00d9-00ef00900030.png",
        "timestamp": 1573608120258,
        "duration": 3883
    },
    {
        "description": "bachelor qualification dropdown option is not selected by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d20001-0027-00e6-0018-00ea00df0055.png",
        "timestamp": 1573608124569,
        "duration": 4010
    },
    {
        "description": "doctoral qualification dropdown option is not selected by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00830003-0091-005d-0018-0007002f002c.png",
        "timestamp": 1573608129008,
        "duration": 4044
    },
    {
        "description": "associate qualification dropdown option is not selected by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007b0063-0094-00e5-0022-00da00ba0027.png",
        "timestamp": 1573608133491,
        "duration": 4070
    },
    {
        "description": "master qualification dropdown option is not selected by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d700fe-00ff-00bb-00cb-00b100f000a3.png",
        "timestamp": 1573608137999,
        "duration": 4206
    },
    {
        "description": "bachelor qualification dropdown option is not selected by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a9001b-0043-0046-00b1-002100b200a4.png",
        "timestamp": 1573608142648,
        "duration": 4222
    },
    {
        "description": "doctoral qualification dropdown option is not selected by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00da006c-005b-0092-0029-00200044007c.png",
        "timestamp": 1573608147307,
        "duration": 4341
    },
    {
        "description": "associate qualification dropdown option is not selected by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00270080-00e4-009c-0050-009000070041.png",
        "timestamp": 1573608152086,
        "duration": 3916
    },
    {
        "description": "first name is required warning message should not be shown right after the page is loaded|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e8005f-002d-00dc-0044-002c0008004a.png",
        "timestamp": 1573608156442,
        "duration": 3288
    },
    {
        "description": "last name is required warning message should not be shown right after the page is loaded|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00af0027-003d-00b1-00f0-00f400b20054.png",
        "timestamp": 1573608160260,
        "duration": 3461
    },
    {
        "description": "email is required warning message should not be shown right after the page is loaded|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001300da-00ef-00c4-0061-00420021004a.png",
        "timestamp": 1573608164222,
        "duration": 3939
    },
    {
        "description": "phone number is required warning message should not be shown right after the page is loaded|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005b0058-002c-007a-0061-009e00ef0032.png",
        "timestamp": 1573608168593,
        "duration": 3653
    },
    {
        "description": "city is required warning message should not be shown right after the page is loaded|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0017002e-003b-0071-0061-009b002c0023.png",
        "timestamp": 1573608172755,
        "duration": 3524
    },
    {
        "description": "state is required warning message should not be shown right after the page is loaded|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00c30078-0076-00b8-00c5-000600820020.png",
        "timestamp": 1573608176788,
        "duration": 3839
    },
    {
        "description": "zipcode is required warning message should not be shown right after the page is loaded|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000d0070-007a-00d4-008d-002d00f40085.png",
        "timestamp": 1573608181148,
        "duration": 3471
    },
    {
        "description": "first name is required warning message should be shown if the input is left empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00aa0004-00e5-00fb-009c-007900a800e9.png",
        "timestamp": 1573608185126,
        "duration": 3373
    },
    {
        "description": "first name empty warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f90037-00e3-0096-0071-003e003a0067.png",
        "timestamp": 1573608188941,
        "duration": 3457
    },
    {
        "description": "last name is required warning message should be shown if the input is left empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d20012-00e3-0035-00ae-000900b40077.png",
        "timestamp": 1573608192850,
        "duration": 3507
    },
    {
        "description": "last name empty warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a800a9-0014-0045-00bb-004b000e00e1.png",
        "timestamp": 1573608196819,
        "duration": 3522
    },
    {
        "description": "email is required warning message should be shown if the input is left empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0041005c-00d0-00ef-007a-001c00740075.png",
        "timestamp": 1573608200789,
        "duration": 2942
    },
    {
        "description": "email empty warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00820044-00fd-00f2-007b-00c100dc006e.png",
        "timestamp": 1573608204166,
        "duration": 3967
    },
    {
        "description": "phone number is required warning message should be shown if the input is left empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0052000b-001a-005e-00be-003300620044.png",
        "timestamp": 1573608208584,
        "duration": 3360
    },
    {
        "description": "phone number empty warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fa00fc-008e-00d5-0000-003500ae001a.png",
        "timestamp": 1573608212365,
        "duration": 3097
    },
    {
        "description": "city is required warning message should be shown if the input is left empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003900d8-0084-002f-0090-007d00500029.png",
        "timestamp": 1573608215928,
        "duration": 3601
    },
    {
        "description": "city empty warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e50037-0098-008b-0014-00f100a4006a.png",
        "timestamp": 1573608220009,
        "duration": 3985
    },
    {
        "description": "state is required warning message should be shown if the input is left empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000600ab-009e-0088-00de-0094004e00f0.png",
        "timestamp": 1573608224459,
        "duration": 3603
    },
    {
        "description": "state empty warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0024008a-0098-0002-0095-009b00fb0018.png",
        "timestamp": 1573608228525,
        "duration": 3760
    },
    {
        "description": "zipcode is required warning message should be shown if the input is left empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002d00a2-0063-002e-00f5-002300700075.png",
        "timestamp": 1573608232744,
        "duration": 3933
    },
    {
        "description": "zipcode empty warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009100ea-00b6-00de-0053-0087006900fe.png",
        "timestamp": 1573608237128,
        "duration": 3484
    },
    {
        "description": "first name is too short warning message should not shown by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ce002b-00bd-0022-0068-003b00f400c1.png",
        "timestamp": 1573608241074,
        "duration": 2839
    },
    {
        "description": "first name is too short warning message should be shown when input is less than 3 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008e004d-0063-008b-00f9-006700bb00dd.png",
        "timestamp": 1573608244455,
        "duration": 4256
    },
    {
        "description": "first name too short warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a60036-0090-00cf-002e-004300b300f3.png",
        "timestamp": 1573608249146,
        "duration": 3880
    },
    {
        "description": "first name is too short warning message should not be shown when input is more than 3 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00250044-008a-0016-00a2-0006002d0098.png",
        "timestamp": 1573608253504,
        "duration": 3938
    },
    {
        "description": "last name is too short warning message should not shown by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d00004-00f0-008a-002c-00ad004c008b.png",
        "timestamp": 1573608257881,
        "duration": 3708
    },
    {
        "description": "last name is too short warning message should be shown when input is less than 3 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d500f6-00cf-0086-00bd-002900f800da.png",
        "timestamp": 1573608262135,
        "duration": 4077
    },
    {
        "description": "last name too short warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001100e8-007a-0036-00bb-00ce00f400f6.png",
        "timestamp": 1573608266657,
        "duration": 3554
    },
    {
        "description": "last name is too short warning message should not be shown when input is more than 3 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ce0071-000f-0075-006c-0006000700e6.png",
        "timestamp": 1573608270677,
        "duration": 3796
    },
    {
        "description": "city is too short warning message should not shown by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00940001-00aa-0070-001e-00150092000b.png",
        "timestamp": 1573608274908,
        "duration": 4051
    },
    {
        "description": "city is too short warning message should be shown when input is less than 3 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005e0059-0010-0055-00bb-00ea0080008f.png",
        "timestamp": 1573608279491,
        "duration": 3469
    },
    {
        "description": "city too short warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0048006d-00ed-00af-003f-006d002500ab.png",
        "timestamp": 1573608283437,
        "duration": 3757
    },
    {
        "description": "city is too short warning message should not be shown when input is more than 3 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d60093-0012-00c9-0066-00a1005a00dc.png",
        "timestamp": 1573608287679,
        "duration": 3390
    },
    {
        "description": "state is too short warning message should not shown by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00850086-00a2-0052-0077-009a0018008d.png",
        "timestamp": 1573608291527,
        "duration": 3832
    },
    {
        "description": "state is too short warning message should be shown when input is less than 3 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b700c9-0097-00bd-0094-0085002b00d9.png",
        "timestamp": 1573608295881,
        "duration": 4398
    },
    {
        "description": "state too short warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003b005f-00ad-003b-00be-000e00a9008a.png",
        "timestamp": 1573608300729,
        "duration": 3900
    },
    {
        "description": "state is too short warning message should not be shown when input is more than 3 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0094002c-00ae-0067-0099-00b000ff0088.png",
        "timestamp": 1573608305108,
        "duration": 4344
    },
    {
        "description": "zipcode is too short warning message should not shown by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004500f7-001a-00c2-0018-0011003500f7.png",
        "timestamp": 1573608309898,
        "duration": 3916
    },
    {
        "description": "zipcode is too short warning message should be shown when input is less than 5 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ca000d-0079-0073-008a-006800ea0042.png",
        "timestamp": 1573608314342,
        "duration": 4488
    },
    {
        "description": "zipcode too short warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005400fb-00ad-00f2-00d3-00c800ae0054.png",
        "timestamp": 1573608319288,
        "duration": 4335
    },
    {
        "description": "zipcode is too short warning message should not be shown when input is exactly 5 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f700a5-004d-005a-005d-00db00dd0037.png",
        "timestamp": 1573608324055,
        "duration": 4552
    },
    {
        "description": "first name is too long warning message should not shown by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0025001f-00e5-0005-00c8-00fd00560041.png",
        "timestamp": 1573608329061,
        "duration": 3993
    },
    {
        "description": "first name is too long warning message should be shown when input is more than 20 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002300c5-004a-0086-00ff-00d2001a0031.png",
        "timestamp": 1573608333577,
        "duration": 4152
    },
    {
        "description": "first name too long warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004600ee-003d-0088-00e4-001000da0069.png",
        "timestamp": 1573608338206,
        "duration": 4749
    },
    {
        "description": "first name is too long warning message should not be shown when input is less than 20 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d00069-00af-00cc-0071-007100a0004d.png",
        "timestamp": 1573608343380,
        "duration": 4331
    },
    {
        "description": "last name is too long warning message should not shown by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008b00a8-004d-00ab-00fe-00af008d000e.png",
        "timestamp": 1573608348148,
        "duration": 3920
    },
    {
        "description": "last name is too long warning message should be shown when input is more than 20 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003200a9-00c7-0002-00c7-00060015008b.png",
        "timestamp": 1573608352624,
        "duration": 4550
    },
    {
        "description": "last name too long warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00af008f-002a-00c9-0038-002b009100c4.png",
        "timestamp": 1573608357590,
        "duration": 3999
    },
    {
        "description": "last name is too long warning message should not be shown when input is less than 20 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009a0062-00c9-0010-0060-006d004300b2.png",
        "timestamp": 1573608362039,
        "duration": 3987
    },
    {
        "description": "city is too long warning message should not shown by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008e004b-0093-007e-009b-006000b1006c.png",
        "timestamp": 1573608366466,
        "duration": 3766
    },
    {
        "description": "city is too long warning message should be shown when input is more than 20 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004a0008-00a0-00c3-001e-000000ee0022.png",
        "timestamp": 1573608370756,
        "duration": 3801
    },
    {
        "description": "city too long warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0010000d-007d-00a6-00ca-007b006f0008.png",
        "timestamp": 1573608375016,
        "duration": 4647
    },
    {
        "description": "city is too long warning message should not be shown when input is less than 20 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00690004-0066-0030-00e5-009400260053.png",
        "timestamp": 1573608380102,
        "duration": 4181
    },
    {
        "description": "state is too long warning message should not shown by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008b0028-0089-003e-00c4-001d009e0034.png",
        "timestamp": 1573608384732,
        "duration": 3624
    },
    {
        "description": "state is too long warning message should be shown when input is more than 20 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e50096-0087-0085-004b-00420014009f.png",
        "timestamp": 1573608388891,
        "duration": 4000
    },
    {
        "description": "state too long warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a300b0-0041-00aa-00de-008c00b7005d.png",
        "timestamp": 1573608393348,
        "duration": 3801
    },
    {
        "description": "state is too long warning message should not be shown when input is less than 20 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00930024-008d-00ff-0018-00b5001e00c7.png",
        "timestamp": 1573608397614,
        "duration": 3827
    },
    {
        "description": "zipcode is too long warning message should not shown by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0099006e-00a2-009f-0081-003c002100a5.png",
        "timestamp": 1573608401921,
        "duration": 3729
    },
    {
        "description": "zipcode is too long warning message should be shown when input is more than 5 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008200ba-005c-0035-0097-00ab0012004c.png",
        "timestamp": 1573608406179,
        "duration": 4249
    },
    {
        "description": "zipcode too long warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00c500d7-000b-001c-00f1-003500e100ef.png",
        "timestamp": 1573608410875,
        "duration": 3401
    },
    {
        "description": "zipcode is too long warning message should not be shown when input is exactly 5 chars|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b400cb-0057-007b-00e0-0020004c00bd.png",
        "timestamp": 1573608414736,
        "duration": 3356
    },
    {
        "description": "email is not in correct format warning message should not shown by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00c60017-0033-0018-00eb-0063004100fd.png",
        "timestamp": 1573608418556,
        "duration": 3600
    },
    {
        "description": "email is in wrong format warning message should be shown when input has non comma symbol(s)|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00cd008a-0005-00ae-0036-004e00430074.png",
        "timestamp": 1573608422617,
        "duration": 4256
    },
    {
        "description": "email is in wrong format warning message should be shown when input doesnt have @|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001c0029-00a0-00df-0084-00dd003300d4.png",
        "timestamp": 1573608427340,
        "duration": 3233
    },
    {
        "description": "email is in wrong format warning message should be shown when nothing before @|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002b0021-0042-009a-006f-004100350084.png",
        "timestamp": 1573608431032,
        "duration": 3924
    },
    {
        "description": "email is in wrong format warning message should be shown when nothing after @|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001f0080-002f-0043-0031-00f0006900cc.png",
        "timestamp": 1573608435420,
        "duration": 3454
    },
    {
        "description": "email is in wrong format warning message should be shown when input doesnt have .|angular-demo-app App",
        "passed": false,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (/Users/kaiwang/Downloads/cerebriai-angular-qa-test-app-e440755cb060/e2e/app.e2e-spec.ts:794:66)\n    at /usr/local/lib/node_modules/protractor/node_modules/jasminewd2/index.js:112:25\n    at new ManagedPromise (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:1077:7)\n    at ControlFlow.promise (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:2505:12)\n    at schedulerExecute (/usr/local/lib/node_modules/protractor/node_modules/jasminewd2/index.js:95:18)\n    at TaskQueue.execute_ (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:3084:14)\n    at TaskQueue.executeNext_ (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:3067:27)\n    at /usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:2974:25\n    at /usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:668:7"
        ],
        "browserLogs": [],
        "screenShotFile": "002b00e2-008d-005d-00bb-0099001700eb.png",
        "timestamp": 1573608439353,
        "duration": 3438
    },
    {
        "description": "email is in wrong format warning message should be shown when input have nothing after .|angular-demo-app App",
        "passed": false,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (/Users/kaiwang/Downloads/cerebriai-angular-qa-test-app-e440755cb060/e2e/app.e2e-spec.ts:804:66)\n    at /usr/local/lib/node_modules/protractor/node_modules/jasminewd2/index.js:112:25\n    at new ManagedPromise (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:1077:7)\n    at ControlFlow.promise (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:2505:12)\n    at schedulerExecute (/usr/local/lib/node_modules/protractor/node_modules/jasminewd2/index.js:95:18)\n    at TaskQueue.execute_ (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:3084:14)\n    at TaskQueue.executeNext_ (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:3067:27)\n    at /usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:2974:25\n    at /usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:668:7"
        ],
        "browserLogs": [],
        "screenShotFile": "000d0001-0095-007e-000b-00c3004a009f.png",
        "timestamp": 1573608443273,
        "duration": 3515
    },
    {
        "description": "email is in wrong format warning message should be shown when input have nothing before .|angular-demo-app App",
        "passed": false,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (/Users/kaiwang/Downloads/cerebriai-angular-qa-test-app-e440755cb060/e2e/app.e2e-spec.ts:814:66)\n    at /usr/local/lib/node_modules/protractor/node_modules/jasminewd2/index.js:112:25\n    at new ManagedPromise (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:1077:7)\n    at ControlFlow.promise (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:2505:12)\n    at schedulerExecute (/usr/local/lib/node_modules/protractor/node_modules/jasminewd2/index.js:95:18)\n    at TaskQueue.execute_ (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:3084:14)\n    at TaskQueue.executeNext_ (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:3067:27)\n    at /usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:2974:25\n    at /usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:668:7"
        ],
        "browserLogs": [],
        "screenShotFile": "005a0093-00fb-005c-003f-00b7002700f8.png",
        "timestamp": 1573608447234,
        "duration": 3220
    },
    {
        "description": "email is in wrong format warning message should be shown when input have . before @|angular-demo-app App",
        "passed": false,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (/Users/kaiwang/Downloads/cerebriai-angular-qa-test-app-e440755cb060/e2e/app.e2e-spec.ts:824:66)\n    at /usr/local/lib/node_modules/protractor/node_modules/jasminewd2/index.js:112:25\n    at new ManagedPromise (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:1077:7)\n    at ControlFlow.promise (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:2505:12)\n    at schedulerExecute (/usr/local/lib/node_modules/protractor/node_modules/jasminewd2/index.js:95:18)\n    at TaskQueue.execute_ (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:3084:14)\n    at TaskQueue.executeNext_ (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:3067:27)\n    at /usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:2974:25\n    at /usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:668:7"
        ],
        "browserLogs": [],
        "screenShotFile": "003c00c2-0017-0066-008c-00fe00900054.png",
        "timestamp": 1573608450901,
        "duration": 4085
    },
    {
        "description": "email is in wrong format warning message should be shown when nothing between @ and .|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0083000d-004f-00d8-0035-00f300f7004c.png",
        "timestamp": 1573608455422,
        "duration": 3790
    },
    {
        "description": "email format warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005a0073-00a0-0017-001a-0021001300c6.png",
        "timestamp": 1573608459678,
        "duration": 4249
    },
    {
        "description": "email is in wrong format warning message should not be shown when having proper format|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f600c6-00c8-0055-00d0-001d00460095.png",
        "timestamp": 1573608464396,
        "duration": 4242
    },
    {
        "description": "phone is not in correct format warning message should not shown by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007d008e-0077-002b-00fb-003600a200fb.png",
        "timestamp": 1573608469103,
        "duration": 3360
    },
    {
        "description": "phone is in wrong format warning message should be shown when input has non digit char(s)|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b9002f-0018-008b-003a-004700c7002f.png",
        "timestamp": 1573608472990,
        "duration": 4101
    },
    {
        "description": "phone is in wrong format warning message should be shown when input does not have enough char in first part|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fe00c3-0059-00ca-004f-00e6005b00d9.png",
        "timestamp": 1573608477545,
        "duration": 4063
    },
    {
        "description": "phone is in wrong format warning message should be shown when input have more than 3 char in first part|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008e00a0-003c-008d-006b-00f4002b001c.png",
        "timestamp": 1573608482073,
        "duration": 3635
    },
    {
        "description": "phone is in wrong format warning message should be shown when input does not have enough char in second part|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004c0038-00bd-00fa-00bf-00a000df006d.png",
        "timestamp": 1573608486141,
        "duration": 3301
    },
    {
        "description": "phone is in wrong format warning message should be shown when input have more than 3 char in second part|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002900a3-008a-008a-00ce-00e9007900d3.png",
        "timestamp": 1573608489890,
        "duration": 4420
    },
    {
        "description": "phone is in wrong format warning message should be shown when input does not have enough char in third part|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b30070-00e4-004e-00da-008900b600cf.png",
        "timestamp": 1573608494762,
        "duration": 4031
    },
    {
        "description": "phone is in wrong format warning message should be shown when input have more than 4 char in thrid part|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009800a3-00f6-007d-00ca-00f7001b00be.png",
        "timestamp": 1573608499266,
        "duration": 4074
    },
    {
        "description": "phone is in wrong format warning message should be shown when input does not have -|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b50022-0010-001e-0064-00e200df0035.png",
        "timestamp": 1573608503801,
        "duration": 4141
    },
    {
        "description": "phone format warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000b007c-00a4-008b-00d9-007a00c300bb.png",
        "timestamp": 1573608508430,
        "duration": 4745
    },
    {
        "description": "phone is in wrong format warning message should not be shown when having proper format|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a70078-000a-0031-004f-007e00a10017.png",
        "timestamp": 1573608513637,
        "duration": 4904
    },
    {
        "description": "city is not in correct format warning message should not shown by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fc003d-0097-0007-00ae-0069000600b0.png",
        "timestamp": 1573608519006,
        "duration": 4193
    },
    {
        "description": "city is in wrong format warning message should be shown when input have digits in middle|angular-demo-app App",
        "passed": false,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": [
            "Expected false to be true."
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (/Users/kaiwang/Downloads/cerebriai-angular-qa-test-app-e440755cb060/e2e/app.e2e-spec.ts:963:65)\n    at /usr/local/lib/node_modules/protractor/node_modules/jasminewd2/index.js:112:25\n    at new ManagedPromise (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:1077:7)\n    at ControlFlow.promise (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:2505:12)\n    at schedulerExecute (/usr/local/lib/node_modules/protractor/node_modules/jasminewd2/index.js:95:18)\n    at TaskQueue.execute_ (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:3084:14)\n    at TaskQueue.executeNext_ (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:3067:27)\n    at /usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:2974:25\n    at /usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:668:7"
        ],
        "browserLogs": [],
        "screenShotFile": "00c70053-00df-00e8-00d8-00e500cb00a7.png",
        "timestamp": 1573608523747,
        "duration": 3775
    },
    {
        "description": "city is in wrong format warning message should be shown when input have digits at the beginning|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00040040-0084-0037-0055-008600e3002c.png",
        "timestamp": 1573608527990,
        "duration": 4264
    },
    {
        "description": "city is in wrong format warning message should be shown when input have digits at the end|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f600f1-0019-0018-0084-0030004c00e9.png",
        "timestamp": 1573608532712,
        "duration": 3882
    },
    {
        "description": "city format warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007a005f-00c3-0091-003f-006200530032.png",
        "timestamp": 1573608537056,
        "duration": 3816
    },
    {
        "description": "city is in wrong format warning message should not be shown when having proper format|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003a0049-001c-003c-0047-001200b500ba.png",
        "timestamp": 1573608541362,
        "duration": 4090
    },
    {
        "description": "city is in wrong format warning message should not be shown when having proper format with caps|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009d00bf-00b6-00d0-00fd-009f00fc0017.png",
        "timestamp": 1573608545912,
        "duration": 4258
    },
    {
        "description": "state is not in correct format warning message should not shown by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e5003b-00d0-0009-003a-001800490015.png",
        "timestamp": 1573608550638,
        "duration": 4018
    },
    {
        "description": "state is in wrong format warning message should be shown when input have digits at the end|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f0004f-006b-00e2-0007-004b00b300d1.png",
        "timestamp": 1573608555177,
        "duration": 3916
    },
    {
        "description": "state format warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007400f4-0031-003f-00b1-004c003b00c3.png",
        "timestamp": 1573608559567,
        "duration": 4025
    },
    {
        "description": "state is in wrong format warning message should not be shown when having proper format|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f900d3-009f-0015-002d-008100150027.png",
        "timestamp": 1573608564069,
        "duration": 3985
    },
    {
        "description": "state is in wrong format warning message should not be shown when having proper format with Caps|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a2006d-005b-0009-00cd-009d00bc0022.png",
        "timestamp": 1573608568514,
        "duration": 3922
    },
    {
        "description": "zipcode is not in correct format warning message should not shown by default|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00920031-0034-0016-00e2-006500c90020.png",
        "timestamp": 1573608572901,
        "duration": 3251
    },
    {
        "description": "zipcode is in wrong format warning message should be shown when input have letter(s)|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005100be-0097-00f2-00bd-00fb00df0057.png",
        "timestamp": 1573608576601,
        "duration": 4322
    },
    {
        "description": "zipcode is in wrong format warning message should be shown when input have symbol(s)|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b1001d-00a0-009b-0034-00cb00e90056.png",
        "timestamp": 1573608581363,
        "duration": 3957
    },
    {
        "description": "zipcode format warning message is same as expected|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a8006c-0089-00f3-0039-0070006600ce.png",
        "timestamp": 1573608585760,
        "duration": 3642
    },
    {
        "description": "zipcode is in wrong format warning message should not be shown when having proper format|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00190032-002e-00ba-0011-00d7008a0058.png",
        "timestamp": 1573608589855,
        "duration": 3731
    },
    {
        "description": "reset form button should able to clean first name input field in form|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00920010-00cf-008f-006a-0058007600f7.png",
        "timestamp": 1573608594039,
        "duration": 3619
    },
    {
        "description": "reset form button should able to clean last name input field in form|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00db009a-00b3-003a-0002-005600be00d6.png",
        "timestamp": 1573608598110,
        "duration": 3657
    },
    {
        "description": "reset form button should able to reset male radio buttons in form|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002f001b-00b7-00d8-0039-00bf005900aa.png",
        "timestamp": 1573608602252,
        "duration": 4042
    },
    {
        "description": "reset form button should able to reset female radio buttons in form|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b400a9-00f7-0074-0022-009100220031.png",
        "timestamp": 1573608606745,
        "duration": 3831
    },
    {
        "description": "reset form button should able to clean email input field in form|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00580096-00b4-007b-0038-00a200e10047.png",
        "timestamp": 1573608611005,
        "duration": 3735
    },
    {
        "description": "reset form button should able to clean email input field in form|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005f0018-0090-00c9-0032-00f6003d00b2.png",
        "timestamp": 1573608615177,
        "duration": 4039
    },
    {
        "description": "reset form button should able to reset master qualification option in form|angular-demo-app App",
        "passed": false,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": [
            "Expected true to be false."
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (/Users/kaiwang/Downloads/cerebriai-angular-qa-test-app-e440755cb060/e2e/app.e2e-spec.ts:1149:62)\n    at /usr/local/lib/node_modules/protractor/node_modules/jasminewd2/index.js:112:25\n    at new ManagedPromise (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:1077:7)\n    at ControlFlow.promise (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:2505:12)\n    at schedulerExecute (/usr/local/lib/node_modules/protractor/node_modules/jasminewd2/index.js:95:18)\n    at TaskQueue.execute_ (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:3084:14)\n    at TaskQueue.executeNext_ (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:3067:27)\n    at /usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:2974:25\n    at /usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/promise.js:668:7"
        ],
        "browserLogs": [],
        "screenShotFile": "00090082-00b7-003d-00a4-002d0018003f.png",
        "timestamp": 1573608619662,
        "duration": 3664
    },
    {
        "description": "reset form button should able to reset bachelor qualification option in form|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003500c8-00ef-00e6-004c-005c00270026.png",
        "timestamp": 1573608623799,
        "duration": 3857
    },
    {
        "description": "reset form button should able to reset doctoral qualification option in form|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00680086-0095-00f3-0099-00fb001300d8.png",
        "timestamp": 1573608628133,
        "duration": 3287
    },
    {
        "description": "reset form button should able to reset associate qualification option in form|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00440067-0078-0001-0098-001e00b000be.png",
        "timestamp": 1573608631858,
        "duration": 3974
    },
    {
        "description": "reset form button should able to clean city input field in form|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005b00aa-00b8-0004-00fa-009f000b003b.png",
        "timestamp": 1573608636280,
        "duration": 3456
    },
    {
        "description": "reset form button should able to clean state input field in form|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a7000e-008e-0080-00a7-00da00600059.png",
        "timestamp": 1573608640182,
        "duration": 4006
    },
    {
        "description": "reset form button should able to clean zipcode input field in form|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00840069-0067-00dd-005b-0093001900c5.png",
        "timestamp": 1573608644647,
        "duration": 3991
    },
    {
        "description": "reset form button should able to clean first name empty warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d9006f-0092-00c7-00a5-004600ad0093.png",
        "timestamp": 1573608649085,
        "duration": 4095
    },
    {
        "description": "reset form button should able to clean first name too short warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003100aa-0075-0065-007b-00ee00a70070.png",
        "timestamp": 1573608653630,
        "duration": 3600
    },
    {
        "description": "reset form button should able to clean first name too long warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0064004f-00ad-0050-0055-00da001900f0.png",
        "timestamp": 1573608657679,
        "duration": 4083
    },
    {
        "description": "reset form button should able to clean last name empty warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f10044-00ed-0081-0013-00d8007f00bd.png",
        "timestamp": 1573608662214,
        "duration": 4164
    },
    {
        "description": "reset form button should able to clean last name too short warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b6006f-001c-00af-0082-001a004100fb.png",
        "timestamp": 1573608666839,
        "duration": 4340
    },
    {
        "description": "reset form button should able to clean last name too long warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00550055-00f8-007f-0048-00c400660055.png",
        "timestamp": 1573608671632,
        "duration": 3713
    },
    {
        "description": "reset form button should able to clean email empty warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fa0086-0040-00a5-00a1-005600f90010.png",
        "timestamp": 1573608675798,
        "duration": 4314
    },
    {
        "description": "reset form button should able to clean email wrong format warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007a00ff-00ad-0042-00c5-00d90001007f.png",
        "timestamp": 1573608680595,
        "duration": 4052
    },
    {
        "description": "reset form button should able to clean phone empty warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005400ac-003c-007d-0098-00620053004b.png",
        "timestamp": 1573608685127,
        "duration": 4100
    },
    {
        "description": "reset form button should able to clean email wrong format warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006e00c8-00b6-0059-0033-008a001700eb.png",
        "timestamp": 1573608689690,
        "duration": 4622
    },
    {
        "description": "reset form button should able to clean city empty warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009800cf-0049-0098-00ad-00b200ea009e.png",
        "timestamp": 1573608694767,
        "duration": 4160
    },
    {
        "description": "reset form button should able to clean city wrong format warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00050010-0070-0057-0052-009d000c00d9.png",
        "timestamp": 1573608699372,
        "duration": 4356
    },
    {
        "description": "reset form button should able to clean city too short warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002c002f-0043-0026-00a7-006f00d10012.png",
        "timestamp": 1573608704213,
        "duration": 4115
    },
    {
        "description": "reset form button should able to clean city too long warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00460080-00f5-003f-00dd-00c5002c009a.png",
        "timestamp": 1573608708780,
        "duration": 4298
    },
    {
        "description": "reset form button should able to clean state empty warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003500cd-007e-0054-0096-00bc00b800ac.png",
        "timestamp": 1573608713528,
        "duration": 4783
    },
    {
        "description": "reset form button should able to clean state wrong format warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ae0097-0077-0015-00ed-00c500d300e9.png",
        "timestamp": 1573608718760,
        "duration": 4400
    },
    {
        "description": "reset form button should able to clean state too short warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b600c6-0027-00c8-00c5-00f1007b0062.png",
        "timestamp": 1573608723613,
        "duration": 4131
    },
    {
        "description": "reset form button should able to clean state too long warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00df0016-0000-0071-00ca-00a2002b00ac.png",
        "timestamp": 1573608728191,
        "duration": 4122
    },
    {
        "description": "reset form button should able to clean zipcode empty warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00c500a9-00e8-00ef-002d-00f400f60019.png",
        "timestamp": 1573608732790,
        "duration": 4054
    },
    {
        "description": "reset form button should able to clean zipcode wrong format warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00110072-0016-00ca-00b6-00b1000300c9.png",
        "timestamp": 1573608737277,
        "duration": 4217
    },
    {
        "description": "reset form button should able to clean zipcode too short warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000800c9-003e-0040-007d-000e002a00c8.png",
        "timestamp": 1573608741964,
        "duration": 4162
    },
    {
        "description": "reset form button should able to clean zipcode too long warning message|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00650062-0080-0076-004c-00ab00a50036.png",
        "timestamp": 1573608746581,
        "duration": 3729
    },
    {
        "description": "submit button should not be enabled if all but first name is empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a600da-00c5-004b-0050-00ae00770067.png",
        "timestamp": 1573608750760,
        "duration": 4651
    },
    {
        "description": "submit button should not be enabled if all but first name is too short|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005d0068-000c-0045-00c0-00d60042000a.png",
        "timestamp": 1573608755884,
        "duration": 4348
    },
    {
        "description": "submit button should not be enabled if all but first name is too long|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005c00c0-00d8-00d3-00bb-005b00e300fe.png",
        "timestamp": 1573608760722,
        "duration": 4455
    },
    {
        "description": "submit button should not be enabled if all but last name is empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00440037-0078-0043-002e-002000cf002e.png",
        "timestamp": 1573608765653,
        "duration": 4007
    },
    {
        "description": "submit button should not be enabled if all but last name is too short|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001a009b-0011-0068-00f4-004b00a500f3.png",
        "timestamp": 1573608770131,
        "duration": 4881
    },
    {
        "description": "submit button should not be enabled if all but last name is too long|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008f00d7-00d2-00c0-00ab-003200c10065.png",
        "timestamp": 1573608775498,
        "duration": 4401
    },
    {
        "description": "submit button should not be enabled if all but gender is empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009900d1-0027-002a-0064-00f4001900e9.png",
        "timestamp": 1573608780376,
        "duration": 3494
    },
    {
        "description": "submit button should not be enabled if all but qualification is empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000500cb-00fb-008e-0068-0033003800c1.png",
        "timestamp": 1573608784365,
        "duration": 3880
    },
    {
        "description": "submit button should not be enabled if all but email is empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0071005b-00c6-0004-00ef-00a100130008.png",
        "timestamp": 1573608788730,
        "duration": 4193
    },
    {
        "description": "submit button should not be enabled if all but email is in wrong format|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008100ec-0027-00e0-00a8-0003003500a4.png",
        "timestamp": 1573608793416,
        "duration": 4119
    },
    {
        "description": "submit button should not be enabled if all but phone is empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fd0078-0084-0000-00a7-003e00560070.png",
        "timestamp": 1573608798050,
        "duration": 3092
    },
    {
        "description": "submit button should not be enabled if all but phone is in wrong format|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f200b2-008d-006a-00eb-001b00b2003d.png",
        "timestamp": 1573608801610,
        "duration": 4292
    },
    {
        "description": "submit button should not be enabled if all but city is empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ba0036-00dd-003c-0031-006d00c100fa.png",
        "timestamp": 1573608806405,
        "duration": 3811
    },
    {
        "description": "submit button should not be enabled if all but city is too short|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00240094-0097-002c-0061-005000860056.png",
        "timestamp": 1573608810716,
        "duration": 4079
    },
    {
        "description": "submit button should not be enabled if all but city is too long|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00100079-0042-0019-003d-0034004e0024.png",
        "timestamp": 1573608815273,
        "duration": 3974
    },
    {
        "description": "submit button should not be enabled if all but city is in wrong format|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d60017-00d4-0007-00be-0086006b008e.png",
        "timestamp": 1573608819743,
        "duration": 4219
    },
    {
        "description": "submit button should not be enabled if all but state is empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a900fa-0066-00ac-006c-007b00ba00a8.png",
        "timestamp": 1573608824438,
        "duration": 3620
    },
    {
        "description": "submit button should not be enabled if all but state is too short|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002a00b3-00ab-0006-0011-002f00a7009f.png",
        "timestamp": 1573608828555,
        "duration": 3995
    },
    {
        "description": "submit button should not be enabled if all but state is too long|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00060014-00cc-0050-00fd-00ab00b60038.png",
        "timestamp": 1573608833043,
        "duration": 4520
    },
    {
        "description": "submit button should not be enabled if all but state is in wrong format|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008d003a-0067-000c-00d6-00f7000600e5.png",
        "timestamp": 1573608838027,
        "duration": 3677
    },
    {
        "description": "submit button should not be enabled if all but zipcode is empty|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ac008f-0025-004d-0041-00500051009f.png",
        "timestamp": 1573608842207,
        "duration": 4341
    },
    {
        "description": "submit button should not be enabled if all but zipcode is too short|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009700aa-00e5-00af-0084-00fb004c006c.png",
        "timestamp": 1573608847072,
        "duration": 3655
    },
    {
        "description": "submit button should not be enabled if all but zipcode is too long|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002200c0-0036-0055-008b-001e008800dc.png",
        "timestamp": 1573608851191,
        "duration": 4653
    },
    {
        "description": "submit button should not be enabled if all but zipcode is in wrong format|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006200c0-00c5-0097-0081-00b5004800ee.png",
        "timestamp": 1573608856303,
        "duration": 4426
    },
    {
        "description": "submit button should be enabled if all fields are filled without error|angular-demo-app App",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 15434,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.97"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0032007c-00c4-00a0-00f8-0030006d004b.png",
        "timestamp": 1573608861211,
        "duration": 3841
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});

    };

    this.setTitle = function () {
        var title = $('.report-title').text();
        titleService.setTitle(title);
    };

    // is run after all test data has been prepared/loaded
    this.afterLoadingJobs = function () {
        this.sortSpecs();
        this.setTitle();
    };

    this.loadResultsViaAjax = function () {

        $http({
            url: './combined.json',
            method: 'GET'
        }).then(function (response) {
                var data = null;
                if (response && response.data) {
                    if (typeof response.data === 'object') {
                        data = response.data;
                    } else if (response.data[0] === '"') { //detect super escaped file (from circular json)
                        data = CircularJSON.parse(response.data); //the file is escaped in a weird way (with circular json)
                    } else {
                        data = JSON.parse(response.data);
                    }
                }
                if (data) {
                    results = data;
                    that.afterLoadingJobs();
                }
            },
            function (error) {
                console.error(error);
            });
    };


    if (clientDefaults.useAjax) {
        this.loadResultsViaAjax();
    } else {
        this.afterLoadingJobs();
    }

}]);

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        if (!items) {
            return filtered; // to avoid crashing in where results might be empty
        }
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            var isHit = false; //is set to true if any of the search criteria matched
            countLogMessages(item); // modifies item contents

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    isHit = true;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    isHit = true;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    isHit = true;
                }
            }
            if (isHit) {
                checkIfShouldDisplaySpecName(prevItem, item);

                filtered.push(item);
                prevItem = item;
            }
        }

        return filtered;
    };
});

//formats millseconds to h m s
app.filter('timeFormat', function () {
    return function (tr, fmt) {
        if(tr == null){
            return "NaN";
        }

        switch (fmt) {
            case 'h':
                var h = tr / 1000 / 60 / 60;
                return "".concat(h.toFixed(2)).concat("h");
            case 'm':
                var m = tr / 1000 / 60;
                return "".concat(m.toFixed(2)).concat("min");
            case 's' :
                var s = tr / 1000;
                return "".concat(s.toFixed(2)).concat("s");
            case 'hm':
            case 'h:m':
                var hmMt = tr / 1000 / 60;
                var hmHr = Math.trunc(hmMt / 60);
                var hmMr = hmMt - (hmHr * 60);
                if (fmt === 'h:m') {
                    return "".concat(hmHr).concat(":").concat(hmMr < 10 ? "0" : "").concat(Math.round(hmMr));
                }
                return "".concat(hmHr).concat("h ").concat(hmMr.toFixed(2)).concat("min");
            case 'hms':
            case 'h:m:s':
                var hmsS = tr / 1000;
                var hmsHr = Math.trunc(hmsS / 60 / 60);
                var hmsM = hmsS / 60;
                var hmsMr = Math.trunc(hmsM - hmsHr * 60);
                var hmsSo = hmsS - (hmsHr * 60 * 60) - (hmsMr*60);
                if (fmt === 'h:m:s') {
                    return "".concat(hmsHr).concat(":").concat(hmsMr < 10 ? "0" : "").concat(hmsMr).concat(":").concat(hmsSo < 10 ? "0" : "").concat(Math.round(hmsSo));
                }
                return "".concat(hmsHr).concat("h ").concat(hmsMr).concat("min ").concat(hmsSo.toFixed(2)).concat("s");
            case 'ms':
                var msS = tr / 1000;
                var msMr = Math.trunc(msS / 60);
                var msMs = msS - (msMr * 60);
                return "".concat(msMr).concat("min ").concat(msMs.toFixed(2)).concat("s");
        }

        return tr;
    };
});


function PbrStackModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;
    ctrl.convertTimestamp = convertTimestamp;
    ctrl.isValueAnArray = isValueAnArray;
    ctrl.toggleSmartStackTraceHighlight = function () {
        var inv = !ctrl.rootScope.showSmartStackTraceHighlight;
        ctrl.rootScope.showSmartStackTraceHighlight = inv;
    };
    ctrl.applySmartHighlight = function (line) {
        if ($rootScope.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return '';
    };
}


app.component('pbrStackModal', {
    templateUrl: "pbr-stack-modal.html",
    bindings: {
        index: '=',
        data: '='
    },
    controller: PbrStackModalController
});

function PbrScreenshotModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;

    /**
     * Updates which modal is selected.
     */
    this.updateSelectedModal = function (event, index) {
        var key = event.key; //try to use non-deprecated key first https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/keyCode
        if (key == null) {
            var keyMap = {
                37: 'ArrowLeft',
                39: 'ArrowRight'
            };
            key = keyMap[event.keyCode]; //fallback to keycode
        }
        if (key === "ArrowLeft" && this.hasPrevious) {
            this.showHideModal(index, this.previous);
        } else if (key === "ArrowRight" && this.hasNext) {
            this.showHideModal(index, this.next);
        }
    };

    /**
     * Hides the modal with the #oldIndex and shows the modal with the #newIndex.
     */
    this.showHideModal = function (oldIndex, newIndex) {
        const modalName = '#imageModal';
        $(modalName + oldIndex).modal("hide");
        $(modalName + newIndex).modal("show");
    };

}

app.component('pbrScreenshotModal', {
    templateUrl: "pbr-screenshot-modal.html",
    bindings: {
        index: '=',
        data: '=',
        next: '=',
        previous: '=',
        hasNext: '=',
        hasPrevious: '='
    },
    controller: PbrScreenshotModalController
});

app.factory('TitleService', ['$document', function ($document) {
    return {
        setTitle: function (title) {
            $document[0].title = title;
        }
    };
}]);


app.run(
    function ($rootScope, $templateCache) {
        //make sure this option is on by default
        $rootScope.showSmartStackTraceHighlight = true;
        
  $templateCache.put('pbr-screenshot-modal.html',
    '<div class="modal" id="imageModal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="imageModalLabel{{$ctrl.index}}" ng-keydown="$ctrl.updateSelectedModal($event,$ctrl.index)">\n' +
    '    <div class="modal-dialog modal-lg m-screenhot-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="imageModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="imageModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <img class="screenshotImage" ng-src="{{$ctrl.data.screenShotFile}}">\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <div class="pull-left">\n' +
    '                    <button ng-disabled="!$ctrl.hasPrevious" class="btn btn-default btn-previous" data-dismiss="modal"\n' +
    '                            data-toggle="modal" data-target="#imageModal{{$ctrl.previous}}">\n' +
    '                        Prev\n' +
    '                    </button>\n' +
    '                    <button ng-disabled="!$ctrl.hasNext" class="btn btn-default btn-next"\n' +
    '                            data-dismiss="modal" data-toggle="modal"\n' +
    '                            data-target="#imageModal{{$ctrl.next}}">\n' +
    '                        Next\n' +
    '                    </button>\n' +
    '                </div>\n' +
    '                <a class="btn btn-primary" href="{{$ctrl.data.screenShotFile}}" target="_blank">\n' +
    '                    Open Image in New Tab\n' +
    '                    <span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>\n' +
    '                </a>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

  $templateCache.put('pbr-stack-modal.html',
    '<div class="modal" id="modal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="stackModalLabel{{$ctrl.index}}">\n' +
    '    <div class="modal-dialog modal-lg m-stack-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="stackModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="stackModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <div ng-if="$ctrl.data.trace.length > 0">\n' +
    '                    <div ng-if="$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer" ng-repeat="trace in $ctrl.data.trace track by $index"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                    <div ng-if="!$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in $ctrl.data.trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div ng-if="$ctrl.data.browserLogs.length > 0">\n' +
    '                    <h5 class="modal-title">\n' +
    '                        Browser logs:\n' +
    '                    </h5>\n' +
    '                    <pre class="logContainer"><div class="browserLogItem"\n' +
    '                                                   ng-repeat="logError in $ctrl.data.browserLogs track by $index"><div><span class="label browserLogLabel label-default"\n' +
    '                                                                                                                             ng-class="{\'label-danger\': logError.level===\'SEVERE\', \'label-warning\': logError.level===\'WARNING\'}">{{logError.level}}</span><span class="label label-default">{{$ctrl.convertTimestamp(logError.timestamp)}}</span><div ng-repeat="messageLine in logError.message.split(\'\\\\n\') track by $index">{{ messageLine }}</div></div></div></pre>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <button class="btn btn-default"\n' +
    '                        ng-class="{active: $ctrl.rootScope.showSmartStackTraceHighlight}"\n' +
    '                        ng-click="$ctrl.toggleSmartStackTraceHighlight()">\n' +
    '                    <span class="glyphicon glyphicon-education black"></span> Smart Stack Trace\n' +
    '                </button>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

    });
