'use strict';
var course_thumbnail_size = 260;
var preview_height = 340;
/* Animations */
 var lectureCatalogAnimations = angular.module('myApp.animations', ['ngAnimate']);


lectureCatalogAnimations.animation('.og-expander', function() {
	
	
// 토글이 닫힐 때 수행되는것 
  var animateUp = function(element, className, done) {
    console.log("animateUp: "+className);
   /*
    if(className != 'active') {
      return;
    }
    */
    element.css({
		height: preview_height,
    });
 
    jQuery(element).animate({
    	height: 0,
	}, done ); 
 	
    return function(cancel) {
      if(cancel) {
        element.stop();
      }
    };
    
  }
 
  var animateDown = function(element, className, done) {
    console.log("animateDown: "+className);
    /*
    if(className != 'active') {
      return;
    }
    */
    element.css({
		height: 0,
    });
 
    jQuery(element).animate({
    	height: preview_height,
	}, done ); 

 
    return function(cancel) {
      if(cancel) {
        element.stop();
      }
    };
    
  }
  

  return {
    addClass: animateUp,
    removeClass: animateDown
  };
 
});

lectureCatalogAnimations.animation('.og-expanded', function() {

// 토글이 닫힐 때 수행되는것 
  var animateUp = function(element, className, done) {
    console.log("animateUp: "+className);
   /*
    if(className != 'active') {
      return;
    }
    */
    element.css({
		height: course_thumbnail_size,
    });
 
    jQuery(element).animate({
    	height: preview_height + course_thumbnail_size,
	}, done);

    return function(cancel) {
      if(cancel) {
        element.stop();
      }
    };
    
  }
 
  var animateDown = function(element, className, done) {
    console.log("animateDown: "+className);
    /*
    if(className != 'active') {
      return;
    }
    */

    element.css({
		height: preview_height + course_thumbnail_size,
    });
 
    jQuery(element).animate({
    	height: course_thumbnail_size,
	}, done);
  
    return function(cancel) {
      if(cancel) {
        element.stop();
      }
    };
    
  }
  

  return {
    addClass: animateUp,
    removeClass: animateDown
  };
 
});