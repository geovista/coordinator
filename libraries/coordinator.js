"use strict";

//
// TODO:
// 
// 2. Build a function that would add .coordinationMetadata to components automatically.
// 
// 3. Make components use .eventTypes
//

var coordinator = {

    // List of components to link
    componentList: [],

    // Callback counter
    callbackNo: 0
};

coordinator.eventTypes = {
    
    // Dictionary of event types
    select:     "select",
    highlight:  "highlight",
    filter:     "filter"
};

coordinator.signUp = function (component) {

    // Add component to the "to do" list
    if (coordinator.componentList.indexOf(component) < 0){
        coordinator.componentList.push(component);
    }
};

coordinator.linkComponents = function () {

    // Link components in the current list

    var i, j, currentComponent, nextComponent, eventType, callbackFunction;

    // For all components in the current list, 
    for (i = 0; i < coordinator.componentList.length; i++) {

        currentComponent = coordinator.componentList[i];

        // go through all of the components that follow it, then 
        for (j = i + 1; j < coordinator.componentList.length; j++) {

            nextComponent = coordinator.componentList[j];

            // first, see if they are interested in the events broadcast by the current component
            for (eventType in currentComponent.coordinationMetadata.triggers) {

                callbackFunction = nextComponent.coordinationMetadata.listeners[eventType];

                // If so, register them as subscribers with the current component.
                if (callbackFunction) {
                    coordinator.registerEvent(currentComponent, eventType, callbackFunction);
                }
            }

            // second, see if the current component is interested in any of the events they broadcast.
            for (eventType in nextComponent.coordinationMetadata.triggers) {

                callbackFunction = currentComponent.coordinationMetadata.listeners[eventType];

                // If so, register the current component as a subscriber with all of them.
                if (callbackFunction) {
                    coordinator.registerEvent(nextComponent, eventType, callbackFunction);
                }
            }

        }
    }

    // end of .linkComponents()
};

coordinator.registerEvent = function (component, type, callbackFunction) {
    
    // This method registers callback functions for events broadcast by 
    // the specified component.

    var registeredCallbacks = component.coordinationMetadata.triggers[type];

    if (registeredCallbacks) {

        // registeredCallbacks[callbackFunction] = callbackFunction;

        registeredCallbacks["callback" + this.callbackNo] = callbackFunction;
        this.callbackNo++;
    }
    
};

coordinator.triggerEvent = function (type, tweetIds, flag) {
    
    // This is a generic method that specific triggers within components 
    // should use to fire events. To keep UI responsive, this method 
    // sets a delay before the events are fired.
    
    // 'this' must be bound to the calling component before use.
    
    //////////////////// Naive (immediate) coordination ////////////////////////
    
   var registeredCallbacks = this.coordinationMetadata.triggers[type];

   if (registeredCallbacks) {

       var event = {
           "type":         type,       // event type, e.g. XXX, select, highlight, filter, etc.
           "tweetIds":     tweetIds,   // IDs of the tweets affected by this event
           "flag":         flag        // direction of the action, e.g. select / deselect
       };

       var callbackFunction;

       for (callbackFunction in registeredCallbacks) {
           registeredCallbacks[callbackFunction](event);
       }
   }
    
    //////////////////// Coordination with a fixed delay ///////////////////////
    
//    var timeoutDuration = 1;
//    
//    if (type === coordinator.eventTypes.select) {
//        timeoutDuration = 10;
//    }
//    
//    var timeoutTrigger = coordinator.triggerEventNow.bind(this);                // We're "double-binding" - both triggerEvent and triggerEventNow 
//                                                                                // are now bound to the calling component.
//    
//    window.setTimeout(function () {
//        timeoutTrigger(type, tweetIds, flag);
//    }, timeoutDuration);
    
    /////////////////////////// Timed coordination /////////////////////////////
    
    // var registeredCallbacks = this.coordinationMetadata.triggers[type];

    // if (registeredCallbacks) {

    //     var event = {
    //         "type":         type,       // event type, e.g. XXX, select, highlight, filter, etc.
    //         "tweetIds":     tweetIds,   // IDs of the tweets affected by this event
    //         "flag":         flag        // direction of the action, e.g. select / deselect
    //     };

    //     var timedTrigger = coordinator.timedTriggerEvent.bind(this);            // We're "double-binding" - both triggerEvent and triggerEventNow 
    //                                                                             // are now bound to the calling component.
        
    //     timedTrigger(registeredCallbacks, event);
    // }

};

coordinator.timedTriggerEvent = function (registeredCallbacks, eventData) {
    
    var keys    = Object.keys(registeredCallbacks);
    var length  = keys.length;
    var idx     = 0;
    var delay   = 25;
    
    var timedRunFunction = function () {
        
        // This function should get all of its data-related variables through 
        // closure, otherwise the inner setTimeout() call won't work.
        
        var start = Date.now();
        
        do {
            registeredCallbacks[keys[idx]](eventData);
            idx++;
        } while (idx < length && (Date.now() - start < 50));

        if (idx < length){
            setTimeout(timedRunFunction, delay);
        }
    }

    setTimeout(timedRunFunction, delay);    
    
};

coordinator.triggerEventNow = function (type, tweetIds, flag) {
    
    // This is a generic method that specific triggers within components 
    // should use to fire events.
    
    // 'this' must be bound to the calling component before use.

    var registeredCallbacks = this.coordinationMetadata.triggers[type];

    if (registeredCallbacks) {

        var event = {
            "type":         type,       // event type, e.g. XXX, select, highlight, filter, etc.
            "tweetIds":     tweetIds,   // IDs of the tweets affected by this event
            "flag":         flag        // direction of the action, e.g. select / deselect
        };

        var callbackFunction;

        for (callbackFunction in registeredCallbacks) {
            registeredCallbacks[callbackFunction](event);
        }
    }

};