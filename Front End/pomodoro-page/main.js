session_time = 25;
break_time = 5;
sess_min_rem = 25;
sess_s_rem = 0;
break_min_rem = 5;
break_s_rem = 0;
time_pause = true;
time_break = false;
pixel_rate = 0.33;
pixel_height = 0;

function set_time() {
	$("#break_text").text(break_time);
	$("#sess_text").text(session_time);
}

$(document).ready( function() {
	setInterval(function() {
		if (!time_pause) {
			pixel_height += pixel_rate;
			$(".pomodoro-img").css("background", 
				"linear-gradient(to top, lightgreen " + (Math.round(pixel_height)-2) + "px, red " + Math.round(pixel_height) + "px)" );
			if (!time_break) {
				if (sess_s_rem == 0 && sess_min_rem == 0) {
					time_break = !time_break;
					sess_min_rem = session_time;
					pixel_rate = -500/(60*break_min_rem);
					pixel_height = 500;
					$("#pomodoro-time").text(break_min_rem + ":00");
					$("#sess_title").removeClass("pomodoro-active");
					$("#sess_text").removeClass("pomodoro-active");
					$("#break_title").addClass("pomodoro-active");
					$("#break_text").addClass("pomodoro-active");
				} else {
					if (sess_s_rem > 0) {
						sess_s_rem--;
					} else {
						sess_s_rem = 59;
						sess_min_rem--;
					}
					if (sess_s_rem <= 9) {
						$("#pomodoro-time").text(sess_min_rem + ":0" + sess_s_rem);
					} else {
						$("#pomodoro-time").text(sess_min_rem + ":" + sess_s_rem);
					}
				}
			} else {
				if (break_s_rem == 0 && break_min_rem == 0) {
					time_break = !time_break;
					break_min_rem = break_time;
					pixel_rate = 500/(60*sess_min_rem);
					pixel_height = 0;
					$("#pomodoro-time").text(sess_min_rem + ":00");
					$("#sess_title").addClass("pomodoro-active");
					$("#sess_text").addClass("pomodoro-active");
					$("#break_title").removeClass("pomodoro-active");
					$("#break_text").removeClass("pomodoro-active");
				} else {
					if (break_s_rem > 0) {
						break_s_rem--;
					} else {
						break_s_rem = 59;
						break_min_rem--;
					}
					if (break_s_rem <= 9) {
						$("#pomodoro-time").text(break_min_rem + ":0" + break_s_rem);
					} else {
						$("#pomodoro-time").text(break_min_rem + ":" + break_s_rem);
					}
				}
			}
		}
	}, 1000);

	$(".pomodoro-img").on("click", function() {
		if (time_pause) {
			$(".pomodoro-img").css("background", 
				"linear-gradient(to top, lightgreen " + (Math.round(pixel_height)-2) + "px, red " + Math.round(pixel_height) + "px)" );
		} else {
			$(".pomodoro-img").css("background", 
				"linear-gradient(to top, lightgreen " + (Math.round(pixel_height)-2) + "px, #FF6666 " + Math.round(pixel_height) + "px)" );
		}
		time_pause = !time_pause;
	});

	$("#reset").on("click", function() {
		$("#pomodoro-time").text(session_time + ":00");
		sess_min_rem = session_time;
		sess_s_rem = 0;
		break_min_rem = break_time;
		break_s_rem = 0;
		time_pause = true;
		pixel_rate = 500/(60*session_time);
		pixel_height = 0;
		$(".pomodoro-img").css("background", 
			"linear-gradient(to top, lightgreen " + -2 + "px, #FF6666 " + 0 + "px)" );
	});

	$("#break_down").on("click", function() {
		if (break_time > 1) {
			break_time--;
		}
		set_time();
	});

	$("#break_up").on("click", function() {
		if (break_time < 998) {
			break_time++;
		}
		set_time();
	});

	$("#sess_down").on("click", function() {
		if (session_time > 1) {
			session_time--;
		}
		set_time();
	});

	$("#sess_up").on("click", function() {
		if (session_time < 998) {
			session_time++;
		}
		set_time();
	});
});