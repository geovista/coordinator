"use strict";

var util = {};

// util.timedRun = function(data, workerFunction, completionCallback) {

//     var length = data.length;
//     var idx = 0;
//     var delay = 10;

//     var timedRunFunction = function() {

//         // This function should get all of its data-related variables through 
//         // closure, otherwise the inner setTimeout() call won't work.

//         var start = Date.now();

//         do {
//             workerFunction(data[idx]);
//             idx++;
//         } while (idx < length && (Date.now() - start < 50));

//         if (idx < length) {
//             setTimeout(timedRunFunction, delay);
//         } else {
//             if (completionCallback) {
//                 completionCallback(data);
//             }
//         }

//     };

//     setTimeout(timedRunFunction, delay);
// };

util.onPostMessage = function(postMessage) {

    // Parse the payload
    var payload = JSON.parse(postMessage.data);

    // Process the payload
    if (payload.type === "initErrorReport") {

        // Load data into the geocoding error report
        tweetList.onGeocodingPopupReady({data: payload.data});

    } else if (payload.type === "initMatrix") {

        // Load data into the matrix sketch
        coMatrix.onMatrixPopupReady(payload.data);
        
    } else if (payload.type === "initTimeWheel") {

        // Load data into the time wheel
        timeWheel.onTimeWheelPopupReady(payload.data);
        
    } else if (payload.type === "initNetwork") {
        
        // Load data into the hive plot
        hivePlot.onNetworkPopupReady(payload.data);
        
    }

};

util.setupLogger = function (hostObject, hostObjectName, logLevel) {
    
    // This is a generic function that sets up a simple logger on a hostObject.
    // The logger can be accessed via 
    // 
    //     hostObject.log(logMessage);
    //     
    // method.
    
    if (!logLevel) {
        logLevel = log4javascript.Level.ALL;    // Use log4javascript.Level.OFF to turn logging off, 
                                                // see http://log4javascript.org/docs/manual.html#levels
                                                // for more levels.
    }
    
    hostObject.initLogger = function () {
    
        var consoleAppender = new log4javascript.BrowserConsoleAppender();
        consoleAppender.setThreshold(logLevel);
        consoleAppender.setLayout(new log4javascript.PatternLayout("[" + hostObjectName + "] %m"));

        this.consoleLogger = log4javascript.getLogger(hostObjectName);
        this.consoleLogger.addAppender(consoleAppender);
        
        this.log = function (logMessage) {
            this.consoleLogger.debug(logMessage);
        };
    };
    
    hostObject.initLogger();
}

util.setupLogger(util, "util");