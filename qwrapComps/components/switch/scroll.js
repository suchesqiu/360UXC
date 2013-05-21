void function () {
	var O = QW.ObjectH, NH = QW.NodeH, E = QW.CustEvent, ETH = QW.EventTargetH, EH = QW.EventH, DU = QW.DomU, SW = QW.Switch, SA = QW.ElAnim;

	SW.Scroll = function () {
		this._switch = null;
		this.panel = null;
		this.prev = null;
		this.next = null;
		this.vertical = false;
		this.autoWidth = true;
		this.preventDefault = true;
		this.easing = null;
		this.interval = 200;
		this.events = { 'in' : 'mousedown', out : 'mouseup' };
		this.className = { scroll : 'switch-scroll', scrolled : 'switch-scrolled', active : 'switch-scroll-active', panel : 'switch-scroll-panel', prev : 'switch-scroll-prev', next : 'switch-scroll-next' };

		this._handlers = { render : null, dispose : null, _switch : null, prev : null, next : null, previn : null, prevout : null, nextin : null, nextout : null };
		this._anim = null;
		this._timer = null;

		this.initialize.apply(this, arguments);
		return this._switch;
	};

	O.mix(SW.Scroll.prototype, function () {
		return {
			initialize : function (_switch, options) {
				this._switch = _switch;
				this._switch.scroll = this;
				
				O.mix(this, options || {}, true);
				
				this._addListener();
			},

			dispose : function () {
				this._unListener();
				this._unTriggerHandler();
				delete this._switch.scroll;
			},

			render : function (options) {
				options = options || {};
				this.panel = options.panel || NH.ancestorNode(this._switch.nav, '.' + this.className.panel);
				this.prev = options.prev || DU.query('.' + this.className.prev, this._switch.host)[0];
				this.next = options.next || DU.query('.' + this.className.next, this._switch.host)[0];

				this._addTriggerHandler();

				this._autoWidth();
				this.refresh();
			},

			_autoWidth : function () {
				if (!this.vertical && this.autoWidth) {
					var list = this._switch.list, l = list.length, width = 0, i = 0;
					for (; i < l ; ++ i) {
						width += list[i].nav.offsetWidth;
					}
					NH.setInnerSize(this._switch.nav, width);
				}
			},

			_addListener : function () {
				var _self = this;

				this._switch.after('render', this._handlers.render = function () {
					_self.render();
				});


				this._switch.after('dispose', this._handlers.dispose = function () {
					_self.dispose();
				});

				this._switch.after('switch', this._handlers._switch = function (e) {
					_self.move(e.to.nav);
				});
			},

			_unListener : function () {
				this._switch.un('afterrender', this._handlers.render);
				this._switch.un('afterdispose', this._handlers.dispose);
				this._switch.un('afterswitch', this._handlers._switch);
			},

			_addTriggerHandler : function () {
				var _self = this;
				ETH.on(this.prev, 'click', this._handlers.prev = function (e) {
					if (_self.preventDefault) {
						EH.preventDefault(e);
					}
				});
				ETH.on(this.next, 'click', this._handlers.next = function (e) {
					if (_self.preventDefault) {
						EH.preventDefault(e);
					}
				});

				ETH.on(this.prev, this.events['in'], this._handlers.previn = function (e) {
					_self.intoView(-1);
					if (_self._timer) {
						clearInterval(_self._timer);
					}
					_self._timer = setInterval(function () {
						_self.intoView(-1);
					}, _self.interval + 100);
				});

				ETH.on(this.prev, this.events.out, this._handlers.prevout = function (e) {
					if (_self._timer) {
						clearInterval(_self._timer);
						_self._timer = null;
					}
				});

				ETH.on(this.next, this.events['in'], this._handlers.nextin = function (e) {
					_self.intoView(1);
					if (_self._timer) {
						clearInterval(_self._timer);
					}
					_self._timer = setInterval(function () {
						_self.intoView(1);
					}, _self.interval + 100);
				});

				ETH.on(this.next, this.events.out, this._handlers.nextout = function (e) {
					if (_self._timer) {
						clearInterval(_self._timer);
						_self._timer = null;
					}
				});
			},

			_unTriggerHandler : function () {
				ETH.un(this.prev, 'click', this._handlers.prev);
				ETH.un(this.next, 'click', this._handlers.next);
				ETH.un(this.prev, this.events['in'], this._handlers.previn);
				ETH.un(this.next, this.events.out, this._handlers.nextin);
				ETH.un(this.prev, this.events['in'], this._handlers.prevout);
				ETH.un(this.next, this.events.out, this._handlers.nextout);
			},

			intoView : function (n) {
				if (this._switch.index == -1) {
					return;
				}

				var scroll = NH.getRect(this.panel), moveNav = null, i = 0, l = this._switch.list.length, nav;

				/*获取当前可见元素*/
				for (; i < l ; ++ i) {
					nav = NH.getRect(this._switch.list[i].nav);

					if (this.vertical) {
						if (scroll.top <=  nav.top && scroll.top + scroll.height >= nav.top + nav.height) {
							break;
						}
					} else {
						if (scroll.left <=  nav.left && scroll.left + scroll.width >= nav.left + nav.width) {
							break;
						}
					}
				}
				
				for ( ; i < l && i >= 0 ; i += n) {

					nav = NH.getRect(this._switch.list[i].nav);

					if (this.vertical) {
						if (scroll.top >  nav.top || scroll.top + scroll.height < nav.top + nav.height) {
							moveNav = this._switch.list[i].nav;
							//if (scroll.top >=  nav.top + nav.height || scroll.top + scroll.height <= nav.top) {
								break;
							//}
						}
					} else {
						if (scroll.left >  nav.left || scroll.left + scroll.width < nav.left + nav.width) {
							moveNav = this._switch.list[i].nav;
							//if (scroll.left >=  nav.left + nav.width || scroll.left + scroll.width <= nav.left) {
								break;
							//}
						}
					}

				}

				if (moveNav) {
					this.move(moveNav);
				}
				
			},

			moveTo : function (e) {
				var _self = this, step = null;

				if (this._anim && this._anim.isPlay()) {
					this._anim.pause();
					step = 1 - this._anim.step();
					this._anim.stop();
				}

				var options = {};

				if (this.vertical) {
					options['scrollTop'] = { to : e };
					//this.panel.scrollTop = e;
				} else {
					options['scrollLeft'] = { to : e };
					//this.panel.scrollLeft = e;
				}
				alert(SA);
				this._anim = new SA(
					this.panel,
					options,
					this.interval,
					this.easing
				);

				this._anim.on('suspend', function () {
					_self.refresh();
				});

				this._anim.play();

				if (step != null) {
					this._anim.step(step);
				}
			},

			move : function (e) {
				var scroll = NH.getRect(this.panel), nav = NH.getRect(e);
				nav.top += this.panel.scrollTop;

				var offset;

				if (this.vertical) {
					if (scroll.top >  nav.top) {
						offset = this.panel.scrollTop + nav.top - scroll.top;
					} else if (scroll.top + scroll.height < nav.top + nav.height) {
						offset = this.panel.scrollTop + nav.top + nav.height - scroll.top - scroll.height;
					}
				} else {
					if (scroll.left >  nav.left) {
						offset = this.panel.scrollLeft + nav.left - scroll.left;
					} else if (scroll.left + scroll.width < nav.left + nav.width) {
						offset = this.panel.scrollLeft + nav.left + nav.width - scroll.left - scroll.width;
					}
				}

				this.moveTo(offset);
			},

			refresh : function () {
				if (this.vertical) {
					if (this._switch.nav.offsetHeight > this.panel.offsetHeight) {
						NH.addClass(this.panel, this.className.active);
						if (this.panel.scrollTop == 0) {
							NH.replaceClass(this.prev, this.className.scroll, this.className.scrolled);
						} else {
							NH.replaceClass(this.prev, this.className.scrolled, this.className.scroll);
						}

						if (this.panel.scrollTop + this.panel.offsetHeight == this.panel.scrollHeight) {
							NH.replaceClass(this.next, this.className.scroll, this.className.scrolled);
						} else {
							NH.replaceClass(this.next, this.className.scrolled, this.className.scroll);
						}
					}
				} else {
					if (this._switch.nav.offsetWidth > this.panel.offsetWidth) {
						NH.addClass(this.panel, this.className.active);
						if (this.panel.scrollLeft == 0) {
							NH.replaceClass(this.prev, this.className.scroll, this.className.scrolled);
						} else {
							NH.replaceClass(this.prev, this.className.scrolled, this.className.scroll);
						}

						if (this.panel.scrollLeft + this.panel.offsetWidth == this.panel.scrollWidth) {
							NH.replaceClass(this.next, this.className.scroll, this.className.scrolled);
						} else {
							NH.replaceClass(this.next, this.className.scrolled, this.className.scroll);
						}
					}
				}
			}
		};
	}(), true);


}();