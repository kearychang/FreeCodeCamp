var temperature;
var min_temp = -15;
var max_temp = 30;
var unit = 0;

function temperatureConvert(val) {
	if (unit % 2 == 0) {
		return Math.round(val - 273.15);
	} else if (unit % 2 == 1) {
		return Math.round(1.8*(val - 273.15)+32);
	}
	return Error;
}

function temperature2Color(temperature) {
	var rgb = [[0,0,255],[0,255,255],[255,255,0],[255,0,0]];
	var abs_val = (Math.max(min_temp,Math.min(temperature,max_temp))-min_temp)/(max_temp-min_temp);
	var index = Math.min(Math.floor(abs_val * (rgb.length-1)),2);
	var abs_val_ceil = (1/(rgb.length-1))*(index+1);
	var abs_val_floor = abs_val_ceil - (1/3);

	var r = Math.floor((abs_val-abs_val_floor)*(rgb[index+1][0]-rgb[index][0])/(1/3)+rgb[index][0]);
	var g = Math.floor((abs_val-abs_val_floor)*(rgb[index+1][1]-rgb[index][1])/(1/3)+rgb[index][1]);
	var b = Math.floor((abs_val-abs_val_floor)*(rgb[index+1][2]-rgb[index][2])/(1/3)+rgb[index][2]);

	return [r,g,b];
}

$(document).ready(function() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var appid = "&APPID=b8029a4baca40ec31705f9f8ddc968dc";
			var coord = "lat="+position.coords.latitude+"&lon="+position.coords.longitude;
			var URL = "http://api.openweathermap.org/data/2.5/weather?" + coord + appid;

			$.getJSON(URL, function(data) {
				temperature = data.main.temp;
				$("#icon").attr("src","http://openweathermap.org/img/w/"+ data.weather[0].icon + ".png");
				$("#descript").html(data.weather[0].description);
				$("#city").html(data.name);
				$("#temp").html(temperatureConvert(temperature));
				var rgb = temperature2Color(temperatureConvert(temperature));
				$(".container").css("background-color", "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")");
			}, function(error) {
				console.log(error);
			});
		});
	}

	$(".weather-btn").on("click", function() {
		unit++;
		$("#temp").html(temperatureConvert(temperature));
		if (unit % 2 == 0) {
			$(".weather-btn").html("&#8451");
		} else {
			$(".weather-btn").html("&#8457");
		}
	})
});