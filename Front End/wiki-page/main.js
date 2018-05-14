$(document).ready(function() {
	$('#search-result').on('click','.panel', function() {
		var url = "https://en.wikipedia.org/?curid=";
		window.open(url + $(this).attr("id"));
	});

	// Actions when search icon is clicked
	$("#wiki-search-button").click( function() {
		$(".wiki-search").addClass("hidden");
		$(".wiki-search2").removeClass("hidden");
		$(".wiki-search2").animate({
			width: "20%"
		}, 250, function() {
		});
	});

	// Actions when search close is clicked
	$("#wiki-close-button").click( function() {
		$(".panel").remove();
		$("#search-text").val("");
		$(".wiki").css("margin-top", "20%");
		document.getElementById("search-result").innerHTML = "";
		$(".wiki-search2").animate({
			width: "2%"
		}, 250, function() {
			$(".wiki-search2").addClass("hidden");
			$(".wiki-search").removeClass("hidden");
			$("#wiki-text").removeClass("hidden");
		});
	});

	// Actions when search is submit
	$("#search-bar").submit(function() {
		$(".panel").remove();
		$("#wiki-text").addClass("hidden");
		$(".wiki").css("margin-top", "0%");
		var title = $("#search-text").val();

		$.ajax( {
		    url: 'https://en.wikipedia.org/w/api.php?',
		    data: {
		        action: 'query',
		        format: 'json',
		        generator: 'search',
		        gsrnamespace: '0',
		        gsrlimit: '10',
		        prop : 'pageimages|extracts',
		        pilimit: 'max',
		        exintro: '1',
		        explaintext: '1',
		        exsentences: '1',
		        exlimit: 'max',
	            origin: '*',
	            gsrsearch: title
		    },
		} ).done( function ( data ) {
			var s;
			var searchResult = document.getElementById("search-result");
			var matches = data.query.pages;
			for (var res in matches) {
				s = '<div class="panel panel-default wiki-panel" id="' + matches[res].pageid + '">'+
				'<div class="panel-heading"><h4><b>' + matches[res].title + '</b></h4></div>'+
				'<div class="panel-body">' + matches[res].extract + '</div></div>';
				searchResult.innerHTML += s;
			}
		} );

		return false;
	});
});