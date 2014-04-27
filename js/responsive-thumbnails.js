/*
 * Responsive Thumbnails by DrummerHead
 * http://mcdlr.com/responsive-thumbnails/
 *
 * Released under the MIT license
 * If you like this, find me and buy me a beer
 *
 */

(function(window, document, undefined){
'use strict';




// Helper functions
//
var $ = function(selector){
  return Array.prototype.slice.call(document.querySelectorAll(selector));
};
var to_i = function(string){
  return parseInt(string, 10);
};


// Get all elements with .responsive-thumbs class
//
var rt = $('.responsive-thumbs');


// var for holding all resizing functions
//
var resizeFuncs = [];


// Return a function that changes lis width (%) so they always fit inside their
// container and try to be as close in width to data-max-width as possible
//
var resizeFuncSweatshop = function(index, maxWidth, padding, maxHeight){
  var style = document.getElementById('dynamic-rt-' + index);
  var container = document.getElementById('responsive-thumbs-' + index);
  var elemUnitWidth = maxWidth + (padding * 2);
  var fitInsideMaxPast = 0;

  // In the case that data-max-height is set on the element, we take the burden
  // and calculations needed to keep the same aspect ratio and content size.
  // The height on lis is calculated in pixels and set, and the font-size of
  // the ul is calculated in such a way to preserve the text in the same
  // position.
  //
  if(typeof maxHeight !== "undefined" && maxHeight !== null){
    return function(){
      var containerClientWidth = container.clientWidth;
      var fitInsideMax = Math.ceil(containerClientWidth / elemUnitWidth);
      var calculatedLiWidth = (containerClientWidth - (padding * fitInsideMax * 2)) / fitInsideMax;
      var liHeight = calculatedLiWidth / (maxWidth / maxHeight);

      style.sheet.cssRules[1].style.height = liHeight + (padding * 2) + 'px';
      style.sheet.cssRules[0].style.fontSize = calculatedLiWidth / maxWidth + 'em';

      if(fitInsideMax !== fitInsideMaxPast){
        style.sheet.cssRules[1].style.width = (100 / fitInsideMax) + '%';
        fitInsideMaxPast = fitInsideMax;
      }
    };
  }

  // When dealing with only image (or mainly image content (img inside a for
  // example)) the ratio of the whole package is set by the image itself (by
  // only assigning width and leaving height to be calculated automatically) In
  // such cases we don't need to calculate heights or ems (no text expected
  // inside) so we can leave that work to the client (rendering engine)
  //
  else {
    return function(){
      var fitInsideMax = Math.ceil(container.clientWidth / elemUnitWidth);

      if(fitInsideMax !== fitInsideMaxPast){
        style.sheet.cssRules[1].style.width = (100 / fitInsideMax) + '%';
        fitInsideMaxPast = fitInsideMax;
      }
    };
  }
};

if(rt.length > 0){
  rt.forEach(function(element, index){


    // Get data from data attributes
    //
    var maxWidth = to_i(element.getAttribute('data-max-width'));
    var padding = to_i(element.getAttribute('data-padding'));
    var maxHeight = to_i(element.getAttribute('data-max-height'));


    // Create and inject stylesheet with specific padding for lis and
    // negative margins for container
    //
    var stylesheetContent =
      '#responsive-thumbs-' + index + ' {' +
      '  margin-left: -' + padding + 'px;' +
      '  margin-right: -' + padding + 'px;' +
      '}' +
      '#responsive-thumbs-' + index + ' li {' +
      '  padding: ' + padding + 'px;' +
      '}';

    document.head.insertAdjacentHTML(
      'beforeend',
      '<style id="dynamic-rt-' + index + '">' + stylesheetContent + '</style>'
    );


    // Set specific id for the specific .responsive-thumbs
    //
    element.id = 'responsive-thumbs-' + index;


    // Save a specific resizeFunc in resizeFuncs and
    // execute it for the first time
    //
    resizeFuncs[index] = resizeFuncSweatshop(index, maxWidth, padding, maxHeight);
    resizeFuncs[index]();
  });


  // Create specific function instead of anonymos function so it can be
  // unbinded from resize
  //
  var responsiveThumbnails = function(){
    resizeFuncs.forEach(function(func){
      func();
    });
  };


  // Bind resize window event to responsiveThumbnails.
  // A better solution would be to listen to the specific
  // element's resize event, but this doesn not exist natively.
  //
  // Side projects for emulating this have been created:
  // https://github.com/search?q=element+querie
  //
  window.addEventListener('resize', responsiveThumbnails, false);
}




})(window, document);
