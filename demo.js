"use strict";



//
// Pop-up controller
//

var popupController = {

	eventGate: null,
	demoPopup: null
};

popupController.spawnPopup = function () {

	var popupUrl = "demoPopup.html";
    var windowName = "demoPopup";
    var windowSpecs = "width = 1100, height = 300, toolbar = yes, scrollbars=yes";

    // Initialize the pop-up and store the reference to it
    popupController.demoPopup = window.open(popupUrl, windowName, windowSpecs);

    // Register popup with the event gate
    popupController.eventGate.registerTargetWindow(popupController.demoPopup);
}











//
// Block that responds to the 'highlight' and 'filter' events
//

function buildHighlightFilterBlock (size, padding, color, idx, blockId) {

    var block = buildHighlightBlock(size, padding, color, idx, blockId);

    //
    // Event handlers
    //

    block.onFilter = function (event) {
        
        // block.log("Filter event from " + event.tweetIds);

        var mainRectangle = d3.select("#" + block.id + " rect"),
        	markerRectangle = d3.select("#" + block.id + " rect:last-child");
    	
    	if (event.flag && event.tweetIds !== block.color) {

			mainRectangle.style("fill", "none");
			markerRectangle.style("fill", "none");

    	} else {

    		mainRectangle.style("fill", function (d, i) { return "#" + d.color; });
    		markerRectangle.style("fill", function (d, i) { return "#" + event.tweetIds; });
    	}
    	
    };


    //
    // Event coordination
    //

    block.coordinationMetadata = {
            
        listeners: {
            "highlight": block.onHighlight,
            "filter": block.onFilter
        },

        triggers: {
            "highlight": {},
            "filter": {}
        }

    };

    block.triggerFilter = function (flag) {
    	block.triggerEvent("filter", block.color, flag)
    };


    return block;
}




//
// Block that responds to the 'highlight' events
//

function buildHighlightBlock (size, padding, color, idx, blockId) {

    var block = {};

    block.size = size;
    block.x	= (size + padding) * idx;
    block.color = color;
    block.id = "block" + blockId;

    util.setupLogger(block, color);


    //
    // Event handlers
    //

    block.onHighlight = function (event) {
        
        // block.log("Highlight event from " + event.tweetIds);

        var markerSize = Math.round(block.size / 3),
        	currentElement = d3.select("#" + block.id);
    	
    	if (event.flag) {

			currentElement.insert("rect")
				.attr("class", "marker")
                .attr("x", function (d, i) { return d.x - 4; })
                .attr("y", -4)
                .attr("width", function (d, i) { return markerSize; })
                .attr("height", function (d, i) { return markerSize; })
                .style("fill", function (d, i) { return "#" + event.tweetIds; });

    	} else {

    		currentElement.selectAll(".marker").remove();
    	}
    	
    };


    //
    // Event coordination
    //

    block.coordinationMetadata = {
            
        listeners: {
            "highlight": block.onHighlight
        },

        triggers: {
            "highlight": {},
            "filter": {}
        }

    };

   	block.triggerEvent = coordinator.triggerEvent.bind(block);

    block.triggerHighlight = function (flag) {
    	block.triggerEvent("highlight", block.color, flag)
    };


    return block;
}

