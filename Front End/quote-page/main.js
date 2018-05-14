var color;

function randomRGB() {
	var r = Math.floor(Math.random()*255);
	var g = Math.floor(Math.random()*255);
	var b = Math.floor(Math.random()*255);
	return [r,g,b];
}

function RGB2String(arr) {
	return "rgb(" + arr[0] + "," + arr[1] + "," + arr[2] + ")";
}

function resetSite() {
	color = randomRGB();
	$(".container-fluid").css("background-color", RGB2String(color));
	$(".quote-btn").css("background-color", RGB2String(color));
	$.getJSON("http://api.icndb.com/jokes/random?exclude=[explicit]", function(json) {
  		$("#message").html('"' + (json.value.joke) + '"');
  		$("#tweet").attr("href", "https://twitter.com/intent/tweet?text=" + (json.value.joke) + "%0a--- ");
	});
}

$(document).ready(function() {
	resetSite();
	$(".quote-btn").mouseover(function() {
		$(this).css("background-color", RGB2String(color.map(c => Math.min(240, Math.floor(c*1.25)))));
	});
	$(".quote-btn").mouseout(function() {
		$(this).css("background-color", RGB2String(color));
	});
	$("#new_quote").on("click", function() {resetSite();});
});