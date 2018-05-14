var buttonColor = "rgb(176,224,230)"
var portfolioColor = "rgb(230, 244, 247)"
var $root = $('html, body');

$(document).ready(function() {
    document.getElementById("home-btn").onclick = function () {
	    $('html, body').animate({
	        scrollTop: $( "#home" ).offset().top
	    }, 500);
    };
    document.getElementById("portfolio-btn").onclick = function () {
	    $('html, body').animate({
	        scrollTop: $( "#portfolio" ).offset().top
	    }, 500);
    };
    document.getElementById("contact-btn").onclick = function () {
	    $('html, body').animate({
	        scrollTop: $( "#contact" ).offset().top
	    }, 500);
    };
    document.getElementById("about-btn").onclick = function () {
	    $('html, body').animate({
	        scrollTop: $( "#about" ).offset().top
	    }, 500);
    };

	// Nav Bar Button Highlighting
	$(".btn").mouseover(function() {
		$(this).css("background-color", "#9CC4C9");
	});
	$(".btn").mouseout(function() {
		$(this).css("background-color", buttonColor);
	});

	// Portfolio Image Highlighting
	$(".portfolio-border").mouseover(function() {
		$(this).css("border-color", "#4DDAF8");
	});
	$(".portfolio-border").mouseout(function() {
		$(this).css("border-color", portfolioColor);
	});

	// Social Media Button Image Highlighting
	$(".contact-social-img").mouseover(function() {
		$(this).css("border-color", "#45DDBB");
	});
	$(".contact-social-img").mouseout(function() {
		$(this).css("border-color", "#FFFFFF");
	});
});