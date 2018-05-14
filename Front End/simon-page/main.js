red_sound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
green_sound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
blue_sound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
yellow_sound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
strict_mode = false;
play_mode = false;
reset_mode = false;
press_mode = [false, false, false, false];
count = 0;
play_count = 0;
game_stack = [];
play_stack = [];

function simon_game_play_fn(i) {
	if (i < game_stack.length && !reset_mode) {
		var e = undefined;
		if (game_stack[i] == 1) {
			e = $("#red");
			$("#red").attr("style", "background-color: #FF0000 !important");
			red_sound.currentTime = 0;
			red_sound.play();
		} else if (game_stack[i] == 2) {
			e = $("#green");
			$("#green").attr("style", "background-color: #00FF00 !important");
			green_sound.currentTime = 0;
			green_sound.play();
		} else if (game_stack[i] == 3) {
			e = $("#blue");
			$("#blue").attr("style", "background-color: #0000FF !important");
			blue_sound.currentTime = 0;
			blue_sound.play();
		} else {
			e = $("#yellow");
			$("#yellow").attr("style", "background-color: #FFFF00 !important");
			yellow_sound.currentTime = 0;
			yellow_sound.play();
		}
		e.addClass("simon-game-btn-pressed");
		window.setTimeout(function() {
			$("#red").attr("style", "background-color: #AA2121");
			$("#green").attr("style", "background-color: #21AA21");
			$("#blue").attr("style", "background-color: #2121AA");
			$("#yellow").attr("style", "background-color: #AAAA21");
			$(".simon-game-btn").removeClass("simon-game-btn-pressed");
			if (!reset_mode) {
				window.setTimeout(simon_game_play_fn,400,i+1);
			}
		}, 400);
	} else {
		play_mode = false;
	}
}

function simon_game_play(t) {
	if (!play_mode) {
		play_mode = true;
		window.setTimeout(simon_game_play_fn, t, 0);
	}
}

function simon_game_random() {
	$("#count").text(count);
	return Math.floor(Math.random() * 4) + 1;
}

function simon_game_reset() {
	count = 1;
	play_count = 0;
	game_stack = [];
	play_stack = [];
	game_stack.push(simon_game_random());
	simon_game_play(800);
}

$(document).ready(function() {
	$("#strict").on("click", function() {
		strict_mode = !strict_mode;
		if (strict_mode) {
			$(this).addClass("btn-danger");
			$(this).removeClass("btn-outline-danger");
			$(this).text("Strict - ON");
		} else {
			$(this).removeClass("btn-danger");
			$(this).addClass("btn-outline-danger");
			$(this).text("Strict - OFF");
		}
	});

	$("#start").on("click", function() {
		if (count == 0) {
			count = 1;
			game_stack.push(simon_game_random());
		}
		simon_game_play(400);
	});

	$("#restart").on("click", function() {
		if (!reset_mode) {
			reset_mode = true;
			if (count > 0) {
				window.setTimeout(simon_game_reset, 400);
			}
			reset_mode = false;
		}
	});

	$(".simon-game-btn").on("mousedown", function() {
		var i = $(this).data("val");
		if (!play_mode && !press_mode[i]) {
			press_mode[i] = true;
			var id = $(this).attr("id");
			$(this).addClass("simon-game-btn-pressed");
			if (id == "red") {
				red_sound.currentTime = 0;
				red_sound.play();
			} else if (id == "green") {
				green_sound.currentTime = 0;
				green_sound.play();
			} else if (id == "blue") {
				blue_sound.currentTime = 0;
				blue_sound.play();
			} else {
				yellow_sound.currentTime = 0;
				yellow_sound.play();
			}
			window.setTimeout(function() {
				press_mode[i] = false;
			}, 200);
			if (count > 0) {
				play_count++;
				play_stack.push(parseInt($(this).data("val")));
				if (play_stack[play_count-1] != game_stack[play_count-1]) {
					$("body").attr("style", "background-color: #FF0000");
					window.setTimeout(function() {
						$("body").attr("style", "background-color: #DFDBE5");
					},500);
					play_count = 0;
					play_stack = [];
					if (strict_mode) {
						simon_game_reset();
					} else {
						press_mode = [true, true, true, true];
						simon_game_play(1500);
						press_mode = [false, false, false, false];
					}
				} else if (play_count == count) {
					count++;
					play_count = 0;
					play_stack = [];
					if (count > 20) {
						alert("you win!");
						simon_game_reset();
					} else {
						game_stack.push(simon_game_random());
						simon_game_play(1000);
					}
				}
			}
		}
	});

	$(".simon-game-btn").on("mouseup", function() {
		$(this).removeClass("simon-game-btn-pressed");
	});

	$(".simon-game-btn").on("mouseout", function() {
		if (!play_mode) {
			$(this).removeClass("simon-game-btn-pressed");
		}
	});
});