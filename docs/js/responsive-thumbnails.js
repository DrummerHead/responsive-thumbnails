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
var guidGen = function(){
  return Math.random().toString(36).substr(2, 9);
};


// var for holding all resizing functions
//
var resizeFuncs = [];


// Return a function that changes lis width (%) so they always fit inside their
// container and try to be as close in width to data-max-width as possible
//
var resizeFuncSweatshop = function(index, maxWidth, padding, maxHeight){
  if(typeof maxWidth === "undefined" || maxWidth === null || isNaN(maxWidth)){
    throw new Error("`data-max-width` attribute must be set in `.responsive-thumbnails` element");
  }
  padding = padding || 0;
  var style = document.getElementById('dynamic-rt-' + index);
  var container = document.getElementById('responsive-thumbnails-' + index);
  var elemUnitWidth = maxWidth + (padding * 2);
  var fitInsideMaxPast = 0;

  // When dealing with only image (or mainly image content (img inside a for
  // example)) the ratio of the whole package is set by the image itself (by
  // only assigning width and leaving height to be calculated automatically) In
  // such cases we don't need to calculate heights or ems (no text expected
  // inside) so we can leave that work to the client (rendering engine)
  //
  if(typeof maxHeight === "undefined" || maxHeight === null || isNaN(maxHeight)){
    return function(){
      var fitInsideMax = Math.ceil(container.clientWidth / elemUnitWidth);

      if(fitInsideMax !== fitInsideMaxPast){
        style.sheet.cssRules[1].style.width = (100 / fitInsideMax) + '%';
        fitInsideMaxPast = fitInsideMax;
      }
    };
  }

  // In the case that data-max-height is set on the element, we take the burden
  // and calculations needed to keep the same aspect ratio and content size.
  // The height on lis is calculated in pixels and set, and the font-size of
  // the ul is calculated in such a way to preserve the text in the same
  // position.
  //
  else {
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
};

var responsiveThumbnails = function(selector, maxWidth, padding, maxHeight){
  var rt = $(selector);

  if(rt.length > 0){
    rt.forEach(function(element){

      // Create unique id
      //
      var guid = guidGen();

      // Get data from function atributes or get data attributes from element
      // Save as var because this can change per element if set by data-attr
      //
      var _maxWidth = to_i(maxWidth || element.getAttribute('data-max-width'));
      var _padding = to_i(padding || element.getAttribute('data-padding'));
      var _maxHeight = to_i(maxHeight || element.getAttribute('data-max-height'));


      // Create and inject stylesheet with specific padding for lis and
      // negative margins for container
      //
      var stylesheetContent =
        '#responsive-thumbnails-' + guid + ' {' +
        '  margin-left: -' + _padding + 'px;' +
        '  margin-right: -' + _padding + 'px;' +
        '}' +
        '#responsive-thumbnails-' + guid + ' li {' +
        '  padding: ' + _padding + 'px;' +
        '}';

      document.head.insertAdjacentHTML(
        'beforeend',
        '<style id="dynamic-rt-' + guid + '">' + stylesheetContent + '</style>'
      );


      // Set specific id for the specific .responsive-thumbnails
      //
      element.id = 'responsive-thumbnails-' + guid;


      // Save a specific resizeFunc in resizeFuncs and
      // execute it for the first time
      //
      resizeFuncs.push(resizeFuncSweatshop(guid, _maxWidth, _padding, _maxHeight));
      resizeFuncs[resizeFuncs.length - 1]();
    });


    // Create specific function instead of anonymos function so it can be
    // unbinded from resize
    //
    var responsiveThumbnailsFuncs = function(){
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
    window.addEventListener('resize', responsiveThumbnailsFuncs, false);
  }
};


// Make responsiveThumbnails a global function
//
window.responsiveThumbnails = responsiveThumbnails;


// Initialize
//
responsiveThumbnails('.responsive-thumbnails');




})(window, document);
