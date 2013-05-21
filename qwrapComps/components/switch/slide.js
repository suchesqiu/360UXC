void function () {

	var O = QW.ObjectH, NH = QW.NodeH, A = QW.ElAnim, SA = QW.ElAnim, SW = QW.Switch;
	

	/**
	 * @class Fade	淡入淡出切换算子类
	 * @namespace	SwitchBehavior
	 */
	SW.SwitchBehavior.Fade = function () {
		
		/**
		 * @property	easing	切换动画算子
		 * @type	{Anim.Easing}
		 */
		this.easing = null;

		/**
		 * @property	animInterval	切换动画持续时间
		 * @type	{Anim.Easing}
		 */
		this.animInterval = 500;

		this._cache = { from : null };

		this.initialize.apply(this, arguments);
	};

	O.mix(SW.SwitchBehavior.Fade.prototype, function () {
		return {
			initialize : function (options) {
				O.mix(this, options || {}, true);
			},
			
			_play : function (to, suspend) {

				var cache = this._cache, from = cache.from, step = null;

				if (from == to) {
					suspend();
					return;
				}

				if (from) {

					if (from.__fadeAnim) {
						from.__fadeAnim.cancel();
					}

					NH.setStyle(from.content, { zIndex : 9 });

					from.__fadeAnim = new A(
						from.content,
						{ opacity : { from : 1, to : 0 } },
						this.animInterval,
						this.easing
					);

					from.__fadeAnim.on('end', function () {
						NH.setStyle(from.content, { zIndex : 0 });
					});
					
					from.__fadeAnim.start();
					

				}

				cache.from = to;

				if (to.__fadeAnim) {
					to.__fadeAnim.cancel();
				}

				NH.setStyle(to.content, { zIndex : 0 });

				to.__fadeAnim = new A(
					to.content,
					{ opacity : { from : 0, to : 1 } },
					this.animInterval,
					this.easing
				);
				to.__fadeAnim.on('end', function () {
					NH.setStyle(to.content, { zIndex : 9 });
					suspend();
				});
				to.__fadeAnim.start();

				if (step != null) {
					to.__fadeAnim.step(step);
				}
			},

			_change : function (context, from, to) {
				if (!context.dispatchBeforeSwitch(from, to)) return;

				context.clearClass('nav');
				context.setClass(to, 'nav');

				this._play(context.item(to), function () {
					context.clearClass('content');
					context.setClass(to, 'content');

					context.switchTo(to);
					context.dispatchAfterSwitch(from, to);
				});
			},

			_repeat : function (context, from, to) {
				if (!context.dispatchBeforeRepeatSwitch(from, to)) return;

				context.clearClass('nav');
				context.setClass(to, 'nav');

				this._play(context.item(to), function () {
					context.clearClass('content');
					context.setClass(to, 'content');
					
					context.switchTo(to);
					context.dispatchAfterRepeatSwitch(from, to);
				});
			},

			/**
			 * @method trigger	触发函数
			 * @param	{json}	param 参数<br>
				type	触发类型<br>
				index	触发的下标<br>
				context	上下文:ElementSwitch实例<br>
			 */
			trigger : function (param) {
				var context = param.context,
					from = context.index,
					to = param.index;

				if (from == to) {
					this._repeat(context, from, to);
				} else {
					this._change(context, from, to);
				}
			},

			/**
			 * @method reset	重置函数
			 * @param	{ElementSwitch实例}	context 上下文
			 */
			reset : function (context) {
				var cache = this._cache;
				if (cache.from) {
					if (cache.from.__fadeAnim) {
						cache.from.__fadeAnim.cancel();
					}
					NH.setStyle(cache.from.content, { opacity : 0 });
					cache.from = null;
				}

				context.clearClass('nav');
				context.clearClass('content');
				context.switchTo(-1);
			}
		};
	}());

	/**
	 * @class Fade	滚动切换算子类
	 * @namespace	SwitchBehavior
	 */
	SW.SwitchBehavior.Scroll = function () {

		this.config = { top : 'scrollTop', left : 'scrollLeft' };

		this.configProperty = { top : 'height', left : 'width' };

		/**
		 * @property	direction	切换方向：top垂直切换，left：水平切换
		 * @type	{string}
		 */
		this.direction = 'top';

		/**
		 * @property	easing	切换动画算子
		 * @type	{Anim.Easing}
		 */
		this.easing = null;

		/**
		 * @property	animInterval	切换动画持续时间
		 * @type	{Anim.Easing}
		 */
		this.animInterval = 500;

		this._cache = { from : null, anim : null };

		this.initialize.apply(this, arguments);
	};

	O.mix(SW.SwitchBehavior.Scroll.prototype, function () {
		return {
			initialize : function (options) {
				O.mix(this, options || {}, true);
			},

			_play : function (index, to, content, suspend) {

				var cache = this._cache, options = {};

				options[this.config[this.direction]] = { to : NH.getSize(to.content)[this.configProperty[this.direction]] * index };

				if (cache.anim) {
					cache.anim.cancel();
				}

				cache.anim = new SA(
					content,
					options,
					this.animInterval,
					this.easing
				);

				cache.anim.on('end', function () {
					suspend();
				});
				
				cache.anim.start();
			},
			
			_change : function (context, from, to) {
				if (!context.dispatchBeforeSwitch(from, to)) return;

				context.clearClass('nav');
				context.setClass(to, 'nav');

				this._play(to, context.item(to), context.content, function () {
					context.clearClass('content');
					context.setClass(to, 'content');

					context.switchTo(to);
					context.dispatchAfterSwitch(from, to);
				});
			},

			_repeat : function (context, from, to) {
				if (!context.dispatchBeforeRepeatSwitch(from, to)) return;

				context.clearClass('nav');
				context.setClass(to, 'nav');

				this._play(to, context.item(to), context.content, function () {
					context.clearClass('content');
					context.setClass(to, 'content');
					
					context.switchTo(to);
					context.dispatchAfterRepeatSwitch(from, to);
				});
			},

			/**
			 * @method trigger	触发函数
			 * @param	{json}	param 参数<br>
				type	触发类型<br>
				index	触发的下标<br>
				context	上下文:ElementSwitch实例<br>
			 */
			trigger : function (param) {
				var context = param.context,
					from = context.index,
					to = param.index;

				if (from == to) {
					this._repeat(context, from, to);
				} else {
					this._change(context, from, to);
				}
			},

			/**
			 * @method reset	重置函数
			 * @param	{ElementSwitch实例}	context 上下文
			 */
			reset : function (context) {
				var cache = this._cache;

				if (cache.from) {
					if (cache.anim) {
						cache.anim.cancel();
					}
					cache.from = cache.anim = null;
				}
				context.content[this.config[this.direction]] = 0;

				context.clearClass('nav');
				context.clearClass('content');
				context.switchTo(-1);
			}
		};
	}());

	/**
	 * @class Slide		动画切换类
	 * @namespace	Switch
	 */
	SW.Slide = function (host, options) {

		options = O.mix(O.mix({}, options || {}), { autoPlay : true });

		if (options.effect == 'scroll') {
			options.behavior = new SW.SwitchBehavior.Scroll(options);

			options = O.mix(options, { selector : SW.Slide.Config.SCROLL_SELECTOR, className : SW.Slide.Config.SCROLL_CLASS_NAME });
		} else {
			options.behavior = new SW.SwitchBehavior.Fade(options);

			options = O.mix(options, { selector : SW.Slide.Config.FADE_SELECTOR, className : SW.Slide.Config.FADE_CLASS_NAME });
		}

		return new SW.ElementSwitch(host, options);
	};

	/**
	 * @property	Config		配置
	 * @type	{json}
	 */
	SW.Slide.Config = {
		FADE_SELECTOR : { nav : '>*', content : '>*' },
		FADE_CLASS_NAME : { host : 'switch-fade', nav : 'switch-nav', content : 'switch-content', navItemSelected : 'selected', navItemUnSelected : 'unselected', contentItemSelected : 'selected', contentItemUnSelected : 'unselected' },
		SCROLL_SELECTOR : { nav : '>*', content : '>*' },
		SCROLL_CLASS_NAME : { host : 'switch-scroll', nav : 'switch-nav', content : 'switch-content', navItemSelected : 'selected', navItemUnSelected : 'unselected', contentItemSelected : 'selected', contentItemUnSelected : 'unselected' }
	};

}();