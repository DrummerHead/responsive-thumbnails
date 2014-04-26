/*
 * Responsive Thumbnails by DrummerHead
 * http://mcdlr.com/responsive-thumbnails/
 *
 * Released under the MIT license
 * If you like this, find me and buy me a beer
 *
 */

(function(window, document, undefined){




// Helper functions
//
var $ = function(selector){
  return Array.prototype.slice.call(document.querySelectorAll(selector));
}


// Get all elements with .responsive-thumbs class
//
var rt = $('.responsive-thumbs');


// var for holding all resizing functions
//
var resizeFuncs = [];


// Return a function that changes lis width (%) so they always fit inside their
// container and try to be as close in width to data-max-width as possible
//
var resizeFuncSweatshop = function(index, maxWidth, padding){
  var style = document.getElementById('dynamic-rt-' + index);
  var container = document.getElementById('responsive-thumbs-' + index);
  var elemUnitWidth = maxWidth + (padding * 2);

  return function(){
    this.fitInsideMaxMemoize = this.fitInsideMaxMemoize || 0;
    var fitInsideMax = Math.ceil(container.clientWidth / elemUnitWidth);

    if(fitInsideMax !== this.fitInsideMaxMemoize){
      style.sheet.cssRules[1].style.width = (100 / fitInsideMax) + '%';
      this.fitInsideMaxMemoize = fitInsideMax;
    }
  }
}

if(rt.length > 0){
  rt.forEach(function(element, index, array){


    // Get data from data attributes
    //
    var maxWidth = parseInt(element.getAttribute('data-max-width'), 10);
    var padding = parseInt(element.getAttribute('data-padding-sides'), 10);


    // Create and inject stylesheet with specific padding for lis and
    // negative margins for container
    //
    var stylesheetContent =
      '#responsive-thumbs-' + index + ' {' +
      '  margin-left: -' + padding + 'px;' +
      '  margin-right: -' + padding + 'px;' +
      '}' +
      '#responsive-thumbs-' + index + ' li {' +
      '  padding-left: ' + padding + 'px;' +
      '  padding-right: ' + padding + 'px;' +
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
    resizeFuncs[index] = resizeFuncSweatshop(index, maxWidth, padding);
    resizeFuncs[index]();
  });


  // Create specific function instead of anonymos function so it can be
  // unbinded from resize
  //
  var responsiveThumbnails = function(){
    resizeFuncs.forEach(function(func){
      func();
    });
  }


  // Bind resize window event to responsiveThumbnails.
  // A better solution would be to listen to the specific
  // element's resize event, but this doesn not exist.
  //
  // Side projects for this have been created:
  // https://github.com/search?q=element+querie
  //
  window.addEventListener('resize', responsiveThumbnails, false);
}




})(window, document)
