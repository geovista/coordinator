"use strict";
// Global variables used:
// 
//  coordinator
// 
// TODO:
//
// 1. Implement proper treatment of multiple window handlers

// Event gate widgets factory

function eventGateWidget(targetWindow) {
    
    var eventGate = new EventGate();
    
    if (targetWindow) {
        eventGate.registerTargetWindow(targetWindow);
    }

    return eventGate;
}

//
// End of wordcloud widgets factory




// Word cloud widget class

function EventGate() {

    // Public variables
    this.targetWindow = null;

    //
    // Constructor
    //
    
    // Event coordination
    
    this.onSelect = this.onSelect.bind(this);
    this.onHighlight = this.onHighlight.bind(this);
    this.onFilter = this.onFilter.bind(this);
    
    this.coordinationMetadata = {

        // This property is used by Coordinator to link components together.
        // The structure of this property must be replicated verbatim.

        // Events this component would like to listens to
        listeners: {
            "select":       this.onSelect,
            "highlight":    this.onHighlight,
            "filter":       this.onFilter 
        },

        // Events this component triggers and list of their subscribers (callbacks)
        triggers: {

            "select": {
                // List of callbacks is populated by Coordinator.
            },

            "highlight": {
                // List of callbacks is populated by Coordinator.
            },

            "filter": {
                // List of callbacks is populated by Coordinator.
            }
        }

    };

    this.triggerEvent = coordinator.triggerEvent.bind(this);
    
    this.triggerSelect = function(tweetIds, flag) {
        this.triggerEvent("select", tweetIds, flag);
    };

    this.triggerHighlight = function(tweetIds, flag) {
        this.triggerEvent("highlight", tweetIds, flag);
    };
    
    this.triggerFilter = function(tweetIds, flag) {
        this.triggerEvent("filter", tweetIds, flag);
    };

    // Bind event handlers to 'this'
    this.onPostMessage = this.onPostMessage.bind(this);
    
    // Register a listener for postMessage events
    window.addEventListener("message", this.onPostMessage, false);

    // When used in a simple function call, 'this' refers to the global object 
    // (or is undefined if the strict mode is on).
    // 
    // When used in a constructor, 'this' refers to the object being created. 
    // If a constructor returns a user-defined object instead of the one created 
    // automatically, the automatic one gets discarder upon exit, hence rendering 
    // all 'this' statements pointless.
    // 
    // When used in a prototype chain, 'this' refers to the object this method 
    // will be called on, ignoring the fact that this function is a member of 
    // a prototype object.
    // 
    // When used as part of an event handler, 'this' refers to the DOM element 
    // that fired the event.
    //
    // The default behaviour described above can be overridden in two ways. 
    // First, a function can called with call() or apply(). Second, a function 
    // can be bound to a particular object using bind(). In either case, 'this' 
    // would then refer to the respective argument provided to call(), apply(), 
    // or bind().     
}


//
// Event coordination
//

EventGate.prototype.onSelect = function (event) {

    // This function marshalls the 'select' event from this window to other windows
    
    if(this.targetWindow) {

        var payload = {
            type:   "eventGateMessage",
            data:   event
        };

        this.targetWindow.postMessage(JSON.stringify(payload), "*");
    }
    
};

EventGate.prototype.onHighlight = function (event) {

    // This function marshalls the 'highlight' event from this window to other windows
    
    if(this.targetWindow) {
        
        var payload = {
            type:   "eventGateMessage",
            data:   event
        };

        this.targetWindow.postMessage(JSON.stringify(payload), "*");
    }
    
};

EventGate.prototype.onFilter = function (event) {

    // This function marshalls the 'filter' event from this window to other windows
    
    if(this.targetWindow) {
        
        var payload = {
            type:   "eventGateMessage",
            data:   event
        };

        this.targetWindow.postMessage(JSON.stringify(payload), "*");
    }
    
};

//
// Event handlers
//

EventGate.prototype.onPostMessage = function (postMessage) {
    
    var payload = JSON.parse(postMessage.data);

    if (payload.type === "eventGateMessage") {

        // Check if its a message from own window

        if (postMessage.source === this.targetWindow) {

            // If so, broadcast the external event

            var event = payload.data;

            if (event.type === coordinator.eventTypes.select) {

                this.triggerSelect(event.tweetIds, event.flag);

            } else if (event.type === coordinator.eventTypes.highlight) {

                this.triggerHighlight(event.tweetIds, event.flag);

            } else if (event.type === coordinator.eventTypes.filter) {

                this.triggerFilter(event.tweetIds, event.flag);
            }
        }
    }

}

//
// Class methods
//

EventGate.prototype.registerTargetWindow = function (windowObject) {

    // Remember the window with which to communicate
    this.targetWindow = windowObject;
    
    return this;
}