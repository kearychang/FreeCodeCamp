game_mode = undefined;
turn_player = true;
player_val = undefined;
opp_val = undefined;
game_board = {
	arr: [-6,-6,-6,
	      -6,-6,-6,
	      -6,-6,-6],
	tiles_rem: 9,

	reset: function() {
		turn_player = true;
		$(".tictactoe-box").text("");
		this.arr = [-6,-6,-6,
		            -6,-6,-6,
		            -6,-6,-6];
		this.tiles_rem = 9;
	},

	check: function(arr) {
		if (arr == undefined) {
			var a = this.arr;
		} else {
			var a = arr;
		}
		var b1 = a[0]; var b2 = a[1]; var b3 = a[2];
		var b4 = a[3]; var b5 = a[4]; var b6 = a[5];
		var b7 = a[6]; var b8 = a[7]; var b9 = a[8];
		if ((b1+b2+b3==3) || (b4+b5+b6==3) || (b7+b8+b9==3) || 
			(b1+b4+b7==3) || (b2+b5+b8==3) || (b3+b6+b9==3) ||
			(b1+b5+b9==3) || (b3+b5+b7==3)) {
			if (player_val == 1) {
				return 1;
			} else {
				return -1;
			}
		} else if ((b1+b2+b3==6) || (b4+b5+b6==6) || (b7+b8+b9==6) || 
					(b1+b4+b7==6) || (b2+b5+b8==6) || (b3+b6+b9==6) ||
					(b1+b5+b9==6) || (b3+b5+b7==6)) {
			if (player_val == 2) {
				return 1;
			} else {
				return -1;
			}
		} else {
			return 0;
		}
	},

	click: function(s, val, recur) {
		if (val == 1) {
			$(".tictactoe-box[data-val=" + s + "]").text("X");
		} else {
			$(".tictactoe-box[data-val=" + s + "]").text("O");
		}
		this.arr[s] = val;
		this.tiles_rem--;
		var win = game_board.check(undefined);
		if ((win != 0) || (this.tiles_rem == 0)) {
			if (win == 1) {
				if (game_mode == "computer") {
					alert("You win!");
				} else {
					alert("Player 1 wins!");
				}
			} else if (win == -1) {
				if (game_mode == "computer") {
					alert("Computer wins!"); 
				} else {
					alert("Player 2 wins!");
				}
			} else {
				alert("Tie");
			}
			game_board.reset();
		} else if (game_mode == "computer" && recur) {
			var x = get_minimax(this.arr, opp_val);
			this.click(x, opp_val, false);
		} else if (game_mode == "player") {
			turn_player = !turn_player;
		}
	},
}

function minimax(arr, isMax) {
	var score = -1 * game_board.check(arr);
	if (score != 0) {
		return score;
	} else if (isMax) {
		var bestVal = -1000;
		for (var i = 0; i<9; i++) {
			if (arr[i] == -6) {
				arr[i] = opp_val;
				bestVal = Math.max(bestVal, minimax(arr, !isMax));
				arr[i] = -6;
			}
		}
	} else {
		var bestVal = 1000;
		for (var i = 0; i<9; i++) {
			if (arr[i] == -6) {
				arr[i] = player_val;
				bestVal = Math.min(bestVal, minimax(arr, !isMax));
				arr[i] = -6;
			}
		}
	}
	return bestVal;
}

function get_minimax(arr, val) {
	var bestVal = -1000;
	var bestMove = -1;
	var moveVal;
	for (var i = 0; i<9; i++) {
		if (arr[i] == -6) {
			arr[i] = val;
			moveVal = minimax(arr, true);
			arr[i] = -6;

			if (moveVal > bestVal) {
				bestMove = i;
				bestVal = moveVal;
			}
		}
	}
	return bestMove;
}

$(document).ready(function() {
	$(".tictactoe-box").on("click", function() {
		var id = $(this).data("val");
		if (game_board.arr[id] == -6) {
			if (turn_player) {
				game_board.click(id, player_val, true);
			} else {
				game_board.click(id, opp_val, true);
			}
		}
	});

	$(".tictactoe-btn").on("click", function() {
		var val = $(this).attr("id");
		if (game_mode == undefined && (val=="computer" || val=="player")) {
			$(this).addClass("tictactoe-btn-selected");
			game_mode = val;
		}
		if (player_val == undefined && (val=="X" || val=="O")) {
			$(this).addClass("tictactoe-btn-selected");
			if (val == "X") {
				player_val = 1;
				opp_val = 2;
			} else {
				player_val = 2;
				opp_val = 1;
			}
		}
		if (game_mode != undefined && player_val != undefined) {
			$(".tictactoe-box").removeClass("hidden");
		}
	});

	$("#reset").on("click", function() {
		game_mode = undefined;
		player_val = undefined;
		opp_val = undefined;
		turn_player = true;
		game_board.reset();
		$(".tictactoe-btn").removeClass("tictactoe-btn-selected");
		$(".tictactoe-box").addClass("hidden");
	});
}); 