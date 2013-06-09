(function() {
	var QW = window.QW, 
		mix = QW.ObjectH.mix,
		isArray = QW.ObjectH.isArray,
		HH = QW.HelperH, 
		W = QW.NodeW,
		Dom = QW.Dom,
		Anim = QW.ElAnim;

	var AnimElH = (function(){
		return {
			fadeIn : function(el, dur, complete, easing) {
				var params = {
					"opacity" : "show"
				};
				var options = {
					duration : dur,
					complete : complete,
					easing	 : easing
				};
				return AnimElH.animate(el, params, options);
			},
			fadeOut : function(el, dur, complete, easing) {
				var params = {
					"opacity" : "hide"
				};
				var options = {
					duration : dur,
					complete : complete,
					easing	 : easing
				};

				return AnimElH.animate(el, params, options);
			},
			fadeToggle : function(el, dur, complete, easing) {
				var params = {
					"opacity" : "toggle"
				};
				var options = {
					duration : dur,
					complete : complete,
					easing	 : easing
				};

				return AnimElH.animate(el, params, options);
			},
			/* 淡入/淡出切换 */
			/*fadeToggle: function(el, dur, complete) {
				AnimElH[el.offsetHeight ? 'fadeOut' : 'fadeIn'](el, dur, complete);
			},*/
			slideUp : function(el, dur, complete, easing) {
				var params = {
					"height" : "hide"
				};

				var options = {
					duration : dur,
					complete : complete,
					easing	 : easing
				};

				return AnimElH.animate(el, params, options);
			},
			slideDown : function(el, dur, complete, easing) {
				
				var params = {
					"height" : "show"
				};

				var options = {
					duration : dur,
					complete : complete,
					easing	 : easing
				};

				return AnimElH.animate(el, params, options);
			},
			slideToggle : function(el, dur, complete, easing) {
				
				var params = {
					"height" : "toggle"
				};

				var options = {
					duration : dur,
					complete : complete,
					easing	 : easing
				};

				return AnimElH.animate(el, params, options);
			},
			/*slideToggle: function(el, dur, complete) {
				AnimElH[el.offsetHeight ? 'slideUp' : 'slideDown'](el, dur, complete);
			},*/
			shine4Error : function(el, dur, complete, easing) {			
				
				var params = {
					"backgroundColor" : {
						from : "#f33",
						to	 : "#fff"
					}				
				};
				
				var options = {
					duration : dur,
					complete : complete,
					easing	 : easing				
				};

				var anim = AnimElH.animate(el, params, options);

				anim.on("end", function(){
					W(el).setStyle("backgroundColor", "");
				});

				return anim;
			},
			/**
			 * Animate a HTML element or SVG element wrapper
			 * @param {Object} el
			 * @param {Object} params
			 * @param {Object} options jQuery-like animation options: duration, easing, step, complete
			 */
			animate : function (el, params, options) {
				options = options || {};

				var dur = options.duration;
				var easing = options.easing;
				var complete = options.complete;
				var step = options.step;
				var anim = new Anim(el, params, dur, easing);

				if(complete) anim.on("end", complete); //执行oncomplete

				if(step) anim.on("enterframe", step);
					
				function animate(){
					AnimElH.clearAnimate(el);
					el.__QWELANIMH_animate = anim;
					anim.start();
					if(el.__QWELANIMH_animateClearAll){
						anim.cancel();
					}
				}
				if(QW.Async && options.sequence !== false){	//如果支持异步序列执行，wait
					anim.on("end", function(){
						W(el).signal("_animate");			//发送一个signal告诉NodeW动画结束
					});

					W(el).wait("_animate", function(){
						setTimeout(animate);
					});
				}else{							//否则立即执行
					setTimeout(animate);
				}

				return anim;
			},
			clearAnimate : function(el){
				if(el.__QWELANIMH_animate){
					el.__QWELANIMH_animate.cancel()
				}
			}
		};
	})();

	if(QW.Async){
		mix(AnimElH,{
			/**
			 * Do noting but wait
			 */
			sleep: function(el, dur, complete){

				var options = {
					duration : dur,
					complete : complete
				};

				return AnimElH.animate(el, {}, options);
			},
			clearAllAnimate: function(el){
				W(el).wait('_animate', function(){
					el.__QWELANIMH_animateClearAll = false;
					W(el).signal('_animate');
				});
				AnimElH.clearAnimate(el);
				el.__QWELANIMH_animateClearAll = true;
			}
		});
	}

	QW.NodeW.pluginHelper(AnimElH, 'operator');
	if (QW.Dom) {
		mix(QW.Dom, AnimElH);
	}

	QW.provide("AnimElH", AnimElH); 
})();