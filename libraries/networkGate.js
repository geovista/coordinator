"use strict";

var networkGate = {};

networkGate.socket = null;

networkGate.init = function (ip, port) {
    
    if ((ip !== undefined) && (port !== undefined)) {

    	util.setupLogger(networkGate, "NetworkGate to " + ip);
    
	    // Form the request
	    var wsUrl = "ws://" + ip + ":" + port;	// 128.118.54.231
	    
	    // Launch the request
	    networkGate.socket = networkGate.launchWebSocketRequest(wsUrl);
    }

    return networkGate;
}

networkGate.launchWebSocketRequest = function(wsUrl) {
    
    var protocol = 'http';
    
    var socket = new WebSocket(wsUrl, protocol);
    networkGate.log("Requested a socket connection with " + wsUrl + " using " + protocol + " as protocol.");

    socket.onopen = function(event) {
    	networkGate.log("Socket connection established.");
    }
    
    socket.onmessage = function (event) {
        
        // networkGate.log("Received data from server: " + event.data);

        // Trigger this event locally
        var parsedEvent = JSON.parse(event.data);
        networkGate.triggerEvent(parsedEvent.type, parsedEvent.tweetIds, parsedEvent.flag);
    }
    
    socket.onclose = function (event) {
    	networkGate.log("Socket connection closed.");
    }

    socket.onerror = function (event) {
    	networkGate.log("Socket error.")
    }
    
    return socket;
}

networkGate.broadcastEvent = function (event) {

	// Broadcast event over network

	if (networkGate.socket.readyState == WebSocket.OPEN) {
		networkGate.socket.send(JSON.stringify(event));
	} else {
		networkGate.log("Socket isn't ready for data to be sent.")
	}
}


//
// Event coordination
//

networkGate.onHighlight = function (event) {
	networkGate.broadcastEvent(event);
};

networkGate.onFilter = function (event) {
	networkGate.broadcastEvent(event);
};

networkGate.coordinationMetadata = {
        
    listeners: {
        "highlight": networkGate.onHighlight,
        "filter": networkGate.onFilter
    },

    triggers: {
        "highlight": {},
        "filter": 	 {}
    }

};

networkGate.triggerEvent = coordinator.triggerEvent.bind(networkGate);
