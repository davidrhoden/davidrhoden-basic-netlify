
document.addEventListener("DOMContentLoaded", function(event) { 
	const overlay = document.getElementById("product-shape");
	console.log(overlay);
	var el = document.getElementsByClassName("color");
	for (var i = 0; i < el.length; i++) {
	  console.log(i);
	  el[i].onclick = changeColor;
	}

	function changeColor(e) {
	  console.log(this);
	  let hex = e.target.getAttribute("data-hex");
	  console.log(hex);
	  overlay.style.fill = hex;
	}
});