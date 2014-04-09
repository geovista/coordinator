coordinator.js
===========

*coordinator.js* is a JavaScript event coordination framework that follows the [introspective observer coordination pattern](http://dx.doi.org/10.1080/13658810903214203).

A functional demo of the *coordinator.js* framework can be found at http://geovista.github.io/coordinator/

Description of the *coordinator.js* architecture can be found at http://dl.acm.org/citation.cfm?doid=2534931.2534948

The abstract of the paper linked above is as follows:

> Modern-day geovisualization environments are complex systems that support interactive, multi-faceted exploration of spatio-temporal data. Such systems are often composed from a number of visualization tools, each with a pre-determined function of its own, integrated together into a single user interface. Supporting real-time coordination of user interactions across multiple facets (perspectives, views, etc.) of the resulting interface is a fundamental challenge to design of effective geovisualization environments. Past research on coordinated views for geovisualization lead to the development of a number of solutions to this problem, implemented and tested in a range of software products. With the advent of browser-based geovisualization, the issue of user interface coordination became relevant once more due to the differences between semantics of JavaScript, the "lingua franca" of browser-based software, and "traditional" programming languages. This demo paper presents a novel software approach to multiview user interface coordination in browser-based geovisualization environments. This approach is inspired by the software meta-pattern called "introspective observer coordination", is implemented using pure JavaScript and JSON technologies, and is encapsulated in the form of a JavaScript library. As part of the demonstration, additional benefits of the browser-based environments are considered, including user interface coordination across multiple browser windows and multiple computers.