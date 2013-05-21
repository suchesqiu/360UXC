void function () {
	var O = QW.ObjectH, C = QW.ClassH, E = QW.CustEvent, ETH = QW.EventTargetH, EH = QW.EventH, DU = QW.DomU, NH = QW.NodeH;

	/**
	 * @class Switch	切换类
	 * @namespace	Switch
	 */
	var Switch = function () {
		
		/**
		 * @property list	列表
		 * @type	{Array}
		 */
		this.list = [];

		/**
		 * @property index	当前下标
		 * @type	{int}
		 */
		this.index = -1;
		this.initialize.apply(this, arguments);
	};

	/**
	 * @event beforeswitch	切换前
	 * @param	{CustEvent}	e	事件实例<br>
		e.from			切换前元素<br>
		e.to			切换后元素
	 */

	/**
	 * @event afterswitch	切换后
	 * @param	{CustEvent}	e	事件实例<br>
		e.from			切换前元素<br>
		e.to			切换后元素
	 */
	Switch.EVENTS = { beforeswitch : 'beforeswitch', afterswitch : 'afterswitch', beforerepeatswitch : 'beforerepeatswitch', afterrepeatswitch : 'afterrepeatswitch' };

	O.mix(Switch.prototype, function () {
		return {
			initialize : function (options) {
				var events = [];
				for (var i in Switch.EVENTS) events.push(Switch.EVENTS[i]);
				E.createEvents(this, events);

				O.mix(this, options || {}, true);
			},

			/**
			 * @method insert 插入元素
			 * @override
			 * @param	{item}	item	元素
			 * @param	{int}	index	下标
			 * @return	{item}
			 */
			insert : function (item, index) {
				//index = index % (this.list.length + 1);
				index = Math.max(Math.min(this.list.length), 0);
				if (index < this.index) {
					++ this.index;
				}
				this.list.splice(index, 0, item);
				return item;
			},

			/**
			 * @method remove 移除元素
			 * @override
			 * @param	{int}	index	下标
			 * @return	{item}
			 */
			remove : function (index) {
				if (!this.list.length) return null;
				//index = index % this.list.length;
				index = Math.max(Math.min(this.list.length - 1), 0);

				var result = this.list[this.index];
				if (index < this.index) {
					-- this.index;
				} else if (index == this.index) {
					this.index = -1;
				}
				this.list.splice(index, 1);
				return result;
			},


			/**
			 * @method switchTo 切换到
			 * @param	{int}	index	下标
			 * @return	{void}
			 */
			switchTo : function (index) {
				if (!(this.list.length && index < this.list.length)) return;

				this.index = index;
			},

			/**
			 * @method indexOf 根据元素查找下标
			 * @param	{item}	item	元素
			 * @return	{int}
			 */
			indexOf : function (item) {
				for (var i = 0, l = this.list.length ; i < l ; ++ i) {
					if (this.list[i] == item) return i;
				}
				return -1;
			},

			/**
			 * @method item 根据下表找到元素
			 * @param	{int}	index	下标
			 * @return	{item}
			 */
			item : function (index) {
				if (this.list.length == 0 || index < 0) return null;
				return this.list[index % this.list.length] || null;
			},

			/**
			 * @method getCurrent 获取当前选中元素
			 * @return	{item}
			 */
			getCurrent : function () {
				return this.item(this.index);
			},

			/**
			 * @method getLast 获取最后的元素
			 * @return	{item}
			 */
			getLast : function () {
				return this.item(this.list.length - 1);
			},

			/**
			 * @method getFirst 获取开头的元素
			 * @return	{item}
			 */
			getFirst : function () {
				return this.item(0);
			},

			/**
			 * @method _dispatch 派发事件
			 * @private
			 * @param	{string}	type	事件名
			 * @param	{int}		from	上次选中的下标
			 * @param	{int}		to		当前下标
			 * @return	{bool}	事件执行结果
			 */
			_dispatch : function (type, from, to) {
				var _e = new E(this, type);
				
				O.mix(_e, {
					from : this.item(from),
					to : this.item(to)
				});

				return this.fire(_e);
			},

			/**
			 * @method dispatchBeforeSwitch 派发切换前事件
			 * @param	{int}	from		上次选中的下标
			 * @param	{int}	to			当前下标
			 * @return	{bool}	事件执行结果
			 */
			dispatchBeforeSwitch : function (from, to) {
				return this._dispatch(Switch.EVENTS.beforeswitch, from, to);
			},

			/**
			 * @method dispatchAfterSwitch 派发切换后事件
			 * @param	{int}	from		上次选中的下标
			 * @param	{int}	to			当前下标
			 * @return	{bool}	事件执行结果
			 */
			dispatchAfterSwitch : function (from, to) {
				return this._dispatch(Switch.EVENTS.afterswitch, from, to);
			},

			/**
			 * @method dispatchBeforeRepeatSwitch 派发重复切换前事件
			 * @param	{int}	from		上次选中的下标
			 * @param	{int}	to			当前下标
			 * @return	{bool}	事件执行结果
			 */
			dispatchBeforeRepeatSwitch : function (from, to) {
				return this._dispatch(Switch.EVENTS.beforerepeatswitch, from, to);
			},
			
			/**
			 * @method dispatchAfterRepeatSwitch 派发重复切换后事件
			 * @param	{int}	from		上次选中的下标
			 * @param	{int}	to			当前下标
			 * @return	{bool}	事件执行结果
			 */
			dispatchAfterRepeatSwitch : function (from, to) {
				return this._dispatch(Switch.EVENTS.afterrepeatswitch, from, to);
			}
		};
	}());

	/**
	 * @class ElementSwitchItemEntity	实体类
	 * @namespace	Switch
	 */
	var ElementSwitchItemEntity = function () {
		
		/**
		 * @property	nav		标题
		 * @type		{HTMLElement}
		 */
		this.nav = null;

		/**
		 * @property	content		内容
		 * @type		{HTMLElement}
		 */
		this.content = null;

		/**
		 * @property	disabled		禁止
		 * @type		{bool}
		 */
		this.disabled = false;

		/**
		 * @property	events		触发切换的事件列表
		 * @type		{Array}
		 */
		this.events = [];

		/**
		 * @property	cancelDelayEvents		有延迟时的取消触发切换事件
		 * @type		{Array}
		 */
		this.cancelDelayEvents = [];

		/**
		 * @property	immediateEvents		立即触发切换的事件列表
		 * @type		{Array}
		 */
		this.immediateEvents = [];

		/**
		 * @property	handlers		事件委托缓存(组建维护)
		 * @type		{Hashtable}
		 */
		this.handlers = {};
		/**
		 * 注:虽然没有用程序保证,不过这两组事件里不允许有交集
		 */
		this.initialize.apply(this, arguments);
	};

	O.mix(ElementSwitchItemEntity.prototype, function () {
		return {
			initialize : function (options) {
				O.mix(this, options, true);
			}
		};
	}());

	/**
	 * @method parse	转化json为实例
	 * @static
	 */
	ElementSwitchItemEntity.parse = function (options) {
		return options.nav && new this(options) || null;
	};

	/**
	 * @class	ElementSwitch	元素切换
	 * @namespace	Switch
	 * @extends		Switch
	 */
	var ElementSwitch = C.extend(function () {
		
		/**
		 * @property	events		触发切换的事件列表
		 * @type		{Array}
		 */
		this.events = ['click'];

		/**
		 * @property	cancelDelayEvents		有延迟时的取消触发切换事件
		 * @type		{Array}
		 */
		this.cancelDelayEvents = [];

		/**
		 * @property	immediateEvents		立即触发切换的事件列表
		 * @type		{Array}
		 */
		this.immediateEvents = [];
		/**
		 * 注:虽然没有用程序保证,不过这两组事件里不允许有交集
		 */
		
		/**
		 * @property	behavior		切换行为实例
		 * @type		{ISwitchBehavior}
		 */
		this.behavior = null;

		/**
		 * @property	host			总容器
		 * @type		{HTMLElement}
		 */
		this.host = null;

		/**
		 * @property	nav				标题容器
		 * @type		{HTMLElement}
		 */
		this.nav = null;

		/**
		 * @property	content			内容容器
		 * @type		{ISwitchBehavior}
		 */
		this.content = null;


		/**
		 * @property	selector		选择器<br>
			nav			选择器
			content		选择器
		 * @type		{json}
		 */
		this.selector = { nav : null, content : null };//{ nav : '>:first-child>*', content : '>:nth-child(2)>*' };

		/**
		 * @property	className		切换行为实例<br>
			host<br>
			nav<br>
			content<br>
			navItemSelected<br>
			navItemUnSelected<br>
			contentItemSelected<br>
			contentItemUnSelected
		 * @type		{json}
		 */
		this.className = { host : null, nav : null, content : null, navItemSelected : null, navItemUnSelected : null, contentItemSelected : null, contentItemUnSelected : null };//{ host : 'switch', nav : 'switch-nav', content : 'switch-content', navItemSelected : 'selected', navItemUnSelected : 'unselected', contentItemSelected : 'selected', contentItemUnSelected : 'unselected' };

		/**
		 * @property	preventDefault		是否阻止默认行为
		 * @type		{bool}
		 */
		this.preventDefault = true;

		/**
		 * @property	stopPropagation		是否阻止冒泡
		 * @type		{bool}
		 */
		this.stopPropagation = false;

		/**
		 * @property	delayTime		切换延迟时间
		 * @type		{int}
		 */
		this.delayTime = 0;

		/**
		 * @property	step		每次切换间隔
		 * @type		{int}
		 */
		this.step = 1;

		/**
		 * @property	interval		自动播放间隔
		 * @type		{int}
		 */
		this.interval = 3000;

		/**
		 * @property	autoPlay		是否自动切换
		 * @type		{bool}
		 */
		this.autoPlay = false;
		

		this._handlers = { preventdefault : null, mouseenter : null, mouseleave : null };
		this._playTimer = null;
		this._delayTimer = null;
		this._playing = false;

		this._super = arguments.callee.$super;
		this._proto = this._super.prototype;
		this._super.apply(this, arguments);

	}, Switch, false);

	ElementSwitch.EVENTS = { afterrender : 'afterrender', afterdispose : 'afterdispose' };

	O.mix(ElementSwitch.prototype, function () {
		return {
			initialize : function (host, options) {
				var _self = this;

				var events = [];
				for (var i in ElementSwitch.EVENTS) events.push(ElementSwitch.EVENTS[i]);
				E.createEvents(this, events);

				this._handlers.preventdefault = function (e) { EH.preventDefault(e); };
				this._handlers.mouseenter = function (e) { _self.pause(); };
				this._handlers.mouseleave = function (e) { _self.resume(); };

				this._proto.initialize.call(this, options);

				this.host = host;
				this.nav = this.nav || DU.query('.' + this.className.nav, this.host)[0],
				this.content = this.content || DU.query('.' + this.className.content, this.host)[0];
				//this.nav = this.nav || this.host;
				//this.content = this.content || this.host;

				//NH.addClass(this.host, this.className.host);
				//NH.addClass(this.nav, this.className.nav);
				//NH.addClass(this.content, this.className.content);

				ETH.on(this.host, 'mouseenter', this._handlers.mouseenter);
				ETH.on(this.host, 'mouseleave', this._handlers.mouseleave);

			},

			/**
			 * @method render 渲染
			 * @param	{json}	options	参数
			 * @return	{void}
			 */
			render : function (options) {
				O.mix(this, options || {}, true);

				var navs = DU.query(this.selector.nav, this.nav),
					contents = DU.query(this.selector.content, this.content),
					l = navs.length,
					i = 0,
					currentIndex = null;
							
				for (; i < l ; ++ i) {
					this.add({ nav : navs[i], content : contents[i] || null });
					if (NH.hasClass(navs[i], this.className.navItemSelected)) currentIndex = i;
				}

				this.fire(ElementSwitch.EVENTS.afterrender);

				if (currentIndex != null) this.to(currentIndex);

				if (this.autoPlay) {
					this.play();
				}
			},

			/**
			 * @method dispose 销毁
			 * @return	{void}
			 */
			dispose : function () {
				ETH.un(this.host, 'mouseenter', this._handlers.mouseenter);
				ETH.un(this.host, 'mouseleave', this._handlers.mouseleave);
				
				if (this.autoPlay) {
					this.stop();
				}
				while (this.list.length) this.remove(this.list.length - 1);

				this.fire(ElementSwitch.EVENTS.afterdispose);
			},

			/**
			 * @method insert 插入项
			 * @override
			 * @param	{json}	item	范实体
			 * @param	{int}	index	下标
			 * @return	{ElementSwitchItemEntity}	实体
			 */
			insert : function (item, index) {
				if (!(item = ElementSwitchItemEntity.parse(item))) return null;
				this._proto.insert.apply(this, arguments);
				this._addListener(item);
				return item;
			},

			/**
			 * @method render 添加项
			 * @param	{json}	item	范实体
			 * @return	{ElementSwitchItemEntity} 实体
			 */
			add : function (item) {
				return this.insert(item, this.list.length);
			},

			/**
			 * @method render 移除项
			 * @param	{int}	index	下标
			 * @return	{ElementSwitchItemEntity} 实体
			 */
			remove : function (index) {
				var item = this._proto.remove.apply(this, arguments);
				if (!item) return null;
				this._unListener(item);
				return item;
			},

			/**
			 * @method _addListener 添加事件观察
			 * @private
			 * @param	{ElementSwitchItemEntity}	item	实体
			 * @return	{void}
			 */
			_addListener : function (item) {
				var _self = this, events = item.events.length ? item.events : this.events;

				if (this.preventDefault) { ETH.on(item.nav, 'click', this._handlers.preventdefault); }

				for (var l = events.length, i = 0 ; i < l ; ++ i) {

					void function (type) {
						ETH.on(item.nav, type, item.handlers[type] = function (e) {
							if (_self.preventdefault) EH.preventdefault(e);
							if (_self.stopPropagation) EH.stopPropagation(e);
							if (_self.delayTime) {
								if (_self._delayTimer) clearTimeout(_self._delayTimer);
								_self._delayTimer = setTimeout(function () {
									_self._delayTimer = null;
									_self.to(_self.indexOf(item), type);
								}, _self.delayTime);
							} else {
								_self.to(_self.indexOf(item), type);
							}
						});
					}(events[i]);

				}

				if (this.delayTime) {

					events = item.cancelDelayEvents.length ? item.cancelDelayEvents : this.cancelDelayEvents;

					for (var l = events.length, i = 0 ; i < l ; ++ i) {

						void function (type) {
							ETH.on(item.nav, type, item.handlers['delay.' + type] = function (e) {
								if (_self.delayTime) {
									if (_self._delayTimer) {
										clearTimeout(_self._delayTimer);
										_self._delayTimer = null;
									}
								}
							});
						}(events[i]);

					}
				}

				events = item.immediateEvents.length ? item.immediateEvents : this.immediateEvents;

				for (var l = events.length, i = 0 ; i < l ; ++ i) {
					
					void function (type) {
						ETH.on(item.nav, type, item.handlers[type] = function (e) {
							if (_self.preventdefault) EH.preventdefault(e);
							if (_self.stopPropagation) EH.stopPropagation(e);
							if (_self.delayTime && _self._delayTimer) {
								clearTimeout(_self._delayTimer);
								_self._delayTimer = null;
							}
							_self.to(_self.indexOf(item), type);
						});
					}(events[i]);

				}
			},

			/**
			 * @method _unListener 移除事件观察
			 * @private
			 * @param	{ElementSwitchItemEntity}	item	实体
			 * @return	{void}
			 */
			_unListener : function (item) {
				var l = this.events.length, i = 0;

				if (this.preventDefault) { ETH.un(item.nav, 'click', this._handlers.preventdefault); }

				for (var l = events.length, i = 0 ; i < l ; ++ i) {

					ETH.un(item.nav, events[i], item.handlers[events[i]]);

				}

				events = item.cancelDelayEvents.length ? item.cancelDelayEvents : this.cancelDelayEvents;

				for (var l = events.length, i = 0 ; i < l ; ++ i) {

					ETH.un(item.nav, events[i], item.handlers['delay.' + events[i]]);

				}

				events = item.immediateEvents.length ? item.immediateEvents : this.immediateEvents;

				for (var l = events.length, i = 0 ; i < l ; ++ i) {

					ETH.un(item.nav, events[i], item.handlers[events[i]]);

				}
			},

			/**
			 * @method to 触发切换
			 * @param	{int}	index	下标
			 * @param	{string} type (Optional)触发切换的事件
			 * @return	{void}
			 */
			to : function (index, type) {
				if (!(this.list.length && index < this.list.length)) return;

				return this.behavior.trigger({
					type : type || 'call',
					context : this,
					index : index
				});
			},

			/**
			 * @method prev 触发向前切换
			 * @param	{string} type (Optional)触发切换的事件
			 * @return	{void}
			 */
			prev : function (type) {
				this.to((this.list.length + this.index - this.step) % this.list.length, type);
			},

			/**
			 * @method next 触发向后切换
			 * @param	{string} type (Optional)触发切换的事件
			 * @return	{void}
			 */
			next : function (type) {
				this.to((this.list.length + this.index + this.step) % this.list.length, type);
			},

			/**
			 * @method play 开始自动切换
			 * @return	{void}
			 */
			play : function () {
				this._playing = true;
				this.resume();
			},

			/**
			 * @method stop 停止自动切换
			 * @return	{void}
			 */
			stop : function () {
				this.pause();
				this._playing = false;
			},

			/**
			 * @method resume 继续自动切换
			 * @return	{void}
			 */
			resume : function () {
				if (!this._playing || this._playTimer) return;
				var _self = this;
				this._playTimer = setInterval(function () { _self.next('autoplay'); }, this.interval);
			},

			/**
			 * @method pause 暂停自动切换
			 * @return	{void}
			 */
			pause : function () {
				if (!this._playing || !this._playTimer) return;
				clearInterval(this._playTimer);
				this._playTimer = null;
			},

			/**
			 * @method reset 重置当前的选中状态
			 * @return	{void}
			 */
			reset : function () {
				if (this._delayTimer) clearTimeout(this._delayTimer);
				this.behavior.reset(this);
			},

			/**
			 * @method setClass 选中某个实体样式
			 * @param	{int}		index	下标
			 * @param	{string}	type	类型（标题：nav，内容：content）
			 * @return	{void}
			 */
			setClass : function (index, type) {
				var item = this.item(index), selected, unselected, property;

				if (type == 'content') {
					selected = this.className.contentItemSelected, unselected = this.className.contentItemUnSelected, property = 'content';
				} else {
					selected = this.className.navItemSelected, unselected = this.className.navItemUnSelected, property = 'nav';
				}

				if (item[property]) {
					NH.replaceClass(item[property], unselected, selected);
				}
			},
			
			/**
			 * @method clearClass 清理所有实体样式
			 * @param	{string}	type	类型（标题：nav，内容：content）
			 * @return	{void}
			 */
			clearClass : function (type) {
				var l = this.list.length, i = 0, selected, unselected, property;

				if (type == 'content') {
					selected = this.className.contentItemSelected, unselected = this.className.contentItemUnSelected, property = 'content';
				} else {
					selected = this.className.navItemSelected, unselected = this.className.navItemUnSelected, property = 'nav';
				}

				for (; i < l ; ++ i) {
					if (this.list[i][property]) {
						NH.replaceClass(this.list[i][property], selected, unselected);
					}
				}
			},
			
			/**
			 * @method before 多投before事件
			 * @param	{string}	type	事件类型
			 * @param	{function}	handler	事件委托
			 * @return	{void}
			 */
			before : function (type, handler) {
				this.on('before' + type, handler);
			},

			/**
			 * @method before 多投after事件
			 * @param	{string}	type	事件类型
			 * @param	{function}	handler	事件委托
			 * @return	{void}
			 */
			after : function (type, handler) {
				this.on('after' + type, handler);
			}
		};
	}(), true);

	/**
	 * @class SwitchBehavior	切换行为命名空间
	 * @namespace	Switch
	 * @static
	 */
	var SwitchBehavior = {};

	QW.provide('Switch', {
		Switch : Switch,
		ElementSwitchItemEntity : ElementSwitchItemEntity,
		ElementSwitch : ElementSwitch,
		SwitchBehavior : SwitchBehavior
	});

}();