obj = {
	ESL_SC2: {},
	OgamingSC2: {},
	cretetion: {},
	freecodecamp: {}, 
	storbeck: {},
	habathcx: {},
	RobotCaleb: {},
	noobs2ninjas: {}
};
//sub_js.(CHANNEL).img				404 img if DNE
//sub_js.(CHANNEL).title
//sub_js.(CHANNEL).status			
//sub_js.(CHANNEL).descript         OFFLINE or 404, does not exist

function getChannel(channel) {
	var url = 'https://wind-bow.gomix.me/twitch-api/channels/' + channel + '?callback=?';
	$.getJSON(url, function(data){
		if (data.status == 404) {
			obj[channel].title = channel; 
			obj[channel].descript = "404, Does not exist";
			obj[channel].img = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdnWHyOUx8Kt5JfhO_YQFMelEmXMW0_4EoPxQFTqvofsbpnilCBA";
		} else {
			obj[channel].title = data.display_name; 
			obj[channel].descript = data.status
			if (data.logo == null) {
				obj[channel].img = "http://www.iconskid.com/images/268/subscriber-twitch-comprar-agora-licenamp231a-subscribe-tv-requisito-icon-268229.png";
			} else {
				obj[channel].img = data.logo;
			}
		}
		addChannel();
	});
}

function getStream(channel) {
	var url = 'https://wind-bow.gomix.me/twitch-api/streams/' + channel + '?callback=?';
	$.getJSON(url, function(data){
		if (data.stream == null) {
			obj[channel].status = "table-danger";
		} else {
			obj[channel].status = "table-success";
		}
		addChannel();
	});
}

function addChannel() {
	$("#twitch-channel").text('');
	for (var key in obj) {
		$("#twitch-channel").append(
			'<tr class="' + obj[key].status + '">' + 
			'<td> <img class="twitch-img" src="' + obj[key].img + '">' +
				'<button class="btn btn-danger twitch-sub" type="button" data-var="' + key + '">X</button>' +
			'</td>' +
			'<td> <a href="https://twitch.tv/' + key + '">' + obj[key].title + '</a> </td>' +
			'<td>' + obj[key].descript + '</td>' +
			'</tr>'
		);
	}
}

function initChannel() {
	if (jQuery.isEmptyObject(obj)) {
		$("#twitch-channel").text('');
	}
	for (var channel in obj) {
		getChannel(channel);
		getStream(channel);
	}
}

$(document).ready(function () {
	initChannel();

	$("#twitch-search").keypress(function(event) {
		if (event.which==13) {
			var channel = $(this).val();
			if (obj.hasOwnProperty(channel) == false) {
				obj[channel] = {};
				initChannel();
			}
		}
	});

	$("#twitch-add").on('click', function() {
		var channel = $("#twitch-search").val();
		if (obj.hasOwnProperty(channel) == false) {
			obj[channel] = {};
			initChannel();
		}
	});

	$("body").on('click', '.twitch-sub', function() {
		var channel = $(this).data("var");
		delete obj[channel];
		initChannel();
	});

	$("#twitch-all").on('click', function() {
		$(this).removeClass("btn-outline-primary");
		$(this).addClass("btn-primary");

		$("#twitch-on").removeClass("btn-success");
		$("#twitch-on").addClass("btn-outline-success");
		$("#twitch-off").removeClass("btn-danger");
		$("#twitch-off").addClass("btn-outline-danger");

		$(".table-success").removeClass("hidden");
		$(".table-danger").removeClass("hidden");
	});
	$("#twitch-on").on('click', function() {
		$(this).removeClass("btn-outline-success");
		$(this).addClass("btn-success");

		$("#twitch-all").removeClass("btn-primary");
		$("#twitch-all").addClass("btn-outline-primary");
		$("#twitch-off").removeClass("btn-danger");
		$("#twitch-off").addClass("btn-outline-danger");

		$(".table-success").removeClass("hidden");
		$(".table-danger").addClass("hidden");
	});
	$("#twitch-off").on('click', function() {
		$(this).removeClass("btn-outline-danger");
		$(this).addClass("btn-danger");

		$("#twitch-all").removeClass("btn-primary");
		$("#twitch-all").addClass("btn-outline-primary");
		$("#twitch-on").removeClass("btn-success");
		$("#twitch-on").addClass("btn-outline-success");

		$(".table-success").addClass("hidden");
		$(".table-danger").removeClass("hidden");
	});
});