n = "0";
digits = 1;
dec = false;
eq = false;
list = '\xa0';
stack = [];
op_obj = 
{ 
	add: "+",
	sub: "-",
	mul: "*",
	div: "/"
}

function clear() {
	dec = false;
	n = "0";
	digits = 1;
}

function isCharOperation(c) {
	return c=="+" || c=="-" || c=="*" || c=="/" || c==undefined;
}

function mathOp(n1,n2,c) {
	if (c=="+") {
		return parseFloat(n1)+parseFloat(n2);
	} else if (c=="-") {
		return n1-n2;
	} else if (c=="*") {
		return n1*n2;
	} else if (c=="/") {
		return n1/n2;
	}
}

$(document).ready( function() {
	$(".calc-button-number").on("click", function() {
		var number = $(this).data("val");
		if (((n != "0" && isCharOperation(n) == false) || number > 0)) {
			if ((digits < 8) && (list.length < 22)) {
				if (eq) {
					clear();
					eq = false;
					list = '\xa0';
				}
				if (n != "0" && isCharOperation(n)==false) {
					n += number;
					digits++;
				} else {
					n = String(number);
				}
				list += number;
				$(".calc-list").text(list);
			} else {
				clear();
				list = '\xa0';
				stack = [];
				$(".calc-list").text("Digit limit");
			}
			$(".calc-display").text(n);
		}
	});

	$("#calc-dec").on("click", function() {
		if (dec==false) {
			digits++;
			dec = true;
			if (isCharOperation(n) || n=="0") {
				n = "0.";
				list += '0.';
			} else {
				n += ".";
				list += '.';
			}
			$(".calc-list").text(list);
			$(".calc-display").text(n);
		}
	});

	$(".calc-button-op").on("click", function() {
		if (n != "0" && isCharOperation(n) == false) {
			var op = op_obj[$(this).data("val")];
			if (isCharOperation(stack[stack.length-1])) {
				stack.push(n);
			}
			stack.push(op);
			if (eq) {
				eq = false;
				list = '\xa0' + String(Math.round(n*1000000)/1000000);
			}
			clear();
			n = op;
			list += op;
			$(".calc-list").text(list);
			$(".calc-display").text(n);
		}
	});

	$("#calc-ac").on("click", function() {
		clear();
		list = '\xa0';
		stack = [];
		$(".calc-display").text(n);
		$(".calc-list").text(list);
	});

	$("#calc-ce").on("click", function() {
		list = list.substring(0,list.length - digits);
		if (isCharOperation(n)) {
 			stack.pop();
			n = stack[stack.length-1];
			digits = n.length;
			stack.pop();
		} else if (n != "0" && eq==false) {
			clear();
		} else {
			eq = false;
			list = '\xa0';
			stack = [];
			clear();
		}
		$(".calc-display").text(n);
		$(".calc-list").text(list);
	});

	$("#calc-eq").on("click", function() {
		if (stack.length >= 2 && eq == false) {
			stack.push(n);
			stack = stack.reverse();
			var res = 0;
			var n1 = stack.pop();
			var op = stack.pop();
			var n2 = stack.pop();
			var res = mathOp(n1,n2,op);
			while (stack.length > 0) {
				op = stack.pop();
				n2 = stack.pop();
				res = mathOp(res,n2,op);
			}
			list += "=";
			$(".calc-list").text(list);
			$(".calc-display").text(String(Math.round(res*1000000)/1000000));
			eq = true;
			n = res;
		}
	});
});