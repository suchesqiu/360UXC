/**
 * ilike.pop
 * 
 * lichao3@360.cn
 */
(function() {
	Popup = (function(){

		var opts={"wrapId":"BasePanel01",
			"className":"pop_info",
			"withClose":true,
			"withCorner":true,
			"withCue":true,
			"withShadow":false,
			"withBgIframe":true,
			"keyEsc":false,
			"withMask":false,
			"dragable":false,
			"resizable":false,
			"posCenter":false,
			"posAdjust":false,
			"body":""
		};
		
		var config = {
			animTime:300,
			showEasing: QW.Easing.easeOut,
			closeEasing: QW.Easing.easeIn,
			succTime:1000
		};
		function animTop(el, from, to, easing, onEnd){
			var anim = new ElAnim(el, {top:{from:from,to:to}}, config.animTime, easing),
			doc = (QW.Browser.firefox || QW.Browser.ie) ? document.documentElement : document.body;

			el.parentNode().css('overflow','hidden');

			anim.on('end', function(){
				el.parentNode().css('overflow','visible');
				onEnd && onEnd();
			});

			var rect = el.getRect();
			if(rect.top < Dom.getDocRect().scrollY){
				el.hide();
				var anim2 = new ScrollAnim(doc, {
					"scrollTop" : {
						to : rect.top
					}
				}, config.animTime, QW.Easing.easeBothStrong);
				anim2.on('end', function(){
					el.show();
					anim.play();
				});
				anim2.play();
			}else{
				anim.play();
			}
		}
		
		return {
			confirm: function(el, msg, succ, cancel, aftershow){
				opts.body = QW.StringH.tmpl(['<div class="pop_in">',
					'<h4><span class="i_warn"></span>{$msg}</h4>',
					'<p><input type="button" class="confirm" value="确认" />',
					'<input type="button" class="cancel" value="取消" /></p>',
					'</div>'].join(''),
					{msg:msg}
				);
				var panel = new QW.BasePanel(opts),
				wrap = W(panel.oWrap), 
				rect = Dom.getRect(el);

				panel.on("afterhide",function(){
					this.dispose();
					stage.parentNode().removeChild(stage);
				});				
				aftershow && panel.on('aftershow', aftershow);
				panel.show(0, 0, null,null, g("evalBtn"));
				
				var width = wrap[0].offsetWidth,
				height = wrap[0].offsetHeight,
				left = rect.left + rect.width/2 - panel.oWrap.offsetWidth/2,
				top = rect.top-height,
				stage = W(document.createElement('div'));
				
				stage.css('width', width+'px').css('height', height+'px').css('left', left+'px').css('top', top+'px')
				.addClass('pop_stage');

				W(document.body).appendChild(stage);
				stage.appendChild(wrap);
				
				animTop(wrap, height, 0, config.showEasing);
				wrap.css('top', height+'px');
				wrap.delegate('input', 'click', function(){
					animTop(wrap, 0, height, config.closeEasing, function(){
						panel.hide();
					});
					this.className == 'confirm' ? (succ&&succ()) : (cancel&&cancel());
				});
			},
			succ: function(el, msg){
				opts.body = QW.StringH.tmpl(['<div class="pop_in">',
					'<h4><span class="i_right"></span>{$msg}</h4>',
					'</div>'].join(''),
					{msg:msg}
				);
				var panel=new QW.BasePanel(opts),
				wrap = W(panel.oWrap),
				rect = Dom.getRect(el);
				
				panel.on("afterhide",function(){
					this.dispose();
				});
				panel.show(0, 0, null,null, g("evalBtn"));
				
				var width = wrap[0].offsetWidth,
				height = wrap[0].offsetHeight,
				left = rect.left + rect.width/2 - panel.oWrap.offsetWidth/2,
				top = rect.top-height,
				stage = W(document.createElement('div'));
				
				stage.css('width', width+'px').css('height', height+'px').css('left', left+'px').css('top', top+'px')
				.addClass('pop_stage');
				
				W(document.body).appendChild(stage);
				stage.appendChild(wrap);
				animTop(wrap, height, 0, config.showEasing);
				
				wrap.css('top', height+'px');
				
				setTimeout(function(){
					animTop(wrap, 0, height, config.closeEasing, function(){
						panel.hide();
						stage.parentNode().removeChild(stage);
					});
				},config.succTime);
				
			},
			fail: function(el, msg, callback){
				opts.body = QW.StringH.tmpl(['<div class="pop_in">',
					'<h4><span class="i_wrong"></span>{$msg}</h4>',
					'<p><input type="button" class="confirm" value="确认" /></p>',
					'</div>'].join(''),
					{msg:msg}
				);
				var panel=new QW.BasePanel(opts),
				rect = Dom.getRect(el),
				wrap = W(panel.oWrap);
				panel.on("afterhide",function(){
					this.dispose();
				});

				panel.show(0, 0, null, null, g("evalBtn"));

				var width = wrap[0].offsetWidth,
				height = wrap[0].offsetHeight,
				left = rect.left + rect.width/2 - panel.oWrap.offsetWidth/2,
				top = rect.top-height,
				stage = W(document.createElement('div'));
				
				stage.css('width', width+'px').css('height', height+'px').css('left', left+'px').css('top', top+'px')
				.addClass('pop_stage');
				

				W(document.body).appendChild(stage);
				stage.appendChild(wrap);

				animTop(wrap, height, 0, config.showEasing);

				wrap.css('top', height+'px');
								
				wrap.delegate('input', 'click', function(){
					animTop(wrap, 0, height, config.closeEasing, function(){
						panel.hide();
						stage.parentNode().removeChild(stage);
					});
					callback && callback();
				});
			}		
		};
	})();
	QW.provide({
		Popup: Popup
	});
})();
