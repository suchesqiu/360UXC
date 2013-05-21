void function () {
	
	var O = QW.ObjectH, SW = QW.Switch;
	

	/**
	 * @class Tabs	直接切换类
	 * @namespace	SwitchBehavior
	 */
	SW.SwitchBehavior.Tabs = function () {
		
		this.initialize.apply(this, arguments);
	};

	O.mix(SW.SwitchBehavior.Tabs.prototype, function () {
		return {
			initialize : function (options) {
				O.mix(this, options || {}, true);
			},

			_change : function (context, from, to) {
				if (!context.dispatchBeforeSwitch(from, to)) return;

				context.clearClass('nav');
				context.setClass(to, 'nav');

				context.clearClass('content');
				context.setClass(to, 'content');

				context.switchTo(to);
				context.dispatchAfterSwitch(from, to);
			},

			_repeat : function (context, from, to) {
				if (!context.dispatchBeforeRepeatSwitch(from, to)) return;

				context.clearClass('nav');
				context.setClass(to, 'nav');

				context.clearClass('content');
				context.setClass(to, 'content');
				
				context.switchTo(to);
				context.dispatchAfterRepeatSwitch(from, to);
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
				context.clearClass('nav');
				context.clearClass('content');
				context.switchTo(-1);
			}
		};
	}());

	/**
	 * @class TabView		直接切换类
	 * @namespace	Switch
	 */
	SW.TabView = function (host, options) {
		
		options = O.mix(O.mix({}, options || {}), { selector : SW.TabView.Config.TABS_SELECTOR, className : SW.TabView.Config.TABS_CLASS_NAME });

		options.behavior = new SW.SwitchBehavior.Tabs;

		return new SW.ElementSwitch(host, options);
	};

	/**
	 * @property	Config		配置
	 * @type	{json}
	 */
	SW.TabView.Config = {
		TABS_SELECTOR : { nav : '>*', content : '>*' },
		TABS_CLASS_NAME : { host : 'switch-tabs', nav : 'switch-nav', content : 'switch-content', navItemSelected : 'selected', navItemUnSelected : 'unselected', contentItemSelected : 'selected', contentItemUnSelected : 'unselected' }
	};
}();