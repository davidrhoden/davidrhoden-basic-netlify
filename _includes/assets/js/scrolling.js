// gsap.to(".word-scrolling", {
//   scrollTrigger: ".word-scrolling", // start the animation when ".word-scrolling" enters the viewport (once)
//   x: 500
// });


document.addEventListener("DOMContentLoaded", function(event) { 
gsap.registerPlugin(CSSRulePlugin, ScrollTrigger);

	let tween = gsap.from(".word-scrolling", {x:"-2000px"}),
	    st = ScrollTrigger.create({
	        trigger: ".car-scrolling",
	        animation: tween
	      });

	console.log(st.animation); // tween

		let tweencar = gsap.from(".car-scrolling", {
			x:"+2000px",

		}),
	    stcar = ScrollTrigger.create({
	        trigger: ".demo-container",
	        duration: {min: 3, max: 5},
	        ease: "power1.inOut",
	        toggleActions: "restart none none reverse",
	        animation: tweencar
	      });


	console.log(stcar.animation); // tween

	var carbod = $("#car-body");
	let tweencolor = gsap.from(carbod, {
			fill:"red", 
			delay:1
		}),
	    stcolor = ScrollTrigger.create({
	        trigger: ".demo-container",
	        toggleActions: "restart none none reverse",
	        animation: tweencolor
	      });

});