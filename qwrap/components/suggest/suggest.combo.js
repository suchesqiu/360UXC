/*import from ../components/suggest/suggest.control.js,(by build.py)*/

/**
 * @class		Suggest				用于处理Suggest的数据来源。可以为脚本CallBack(涉及跨域)，脚本数据(即返回json文本)
 * @namespace	Suggest
 * @author		Remember2015(wangzilong@baidu.com)
 */
/**
 * @constructor		
 * @param	{object}		oConfig	构造函数参数，详细参照类的配置
 * @example	
var sug = new QW.Suggest({
	textbox: '#searchTextbox',
	dataUrl: "http://youa.baidu.com/suggest/se/s?cmd=suggest&type=kwd&charset=utf-8&category=0",
	uiHighlighter: function(oEl) {
		var elKeyEl = QW.NodeW(oEl).query('.key').core[0];
		var sHtml = elKeyEl.innerHTML;
		elKeyEl.innerHTML = sHtml.replace(sug.getKeyword(), '<em style="color:#d06000;font-weight:bold">' + sug.getKeyword() + '</em>')
	},
	uiItemNumber: 10,
	uiReferEl: '#sug-rel'
});
 * @return	{boolean}	返回是否构造成功
 */
Suggest = function(oConfig) {
	Suggest._argValid(oConfig, 'object', arguments.callee);
	/**
	 * @property	_config		Suggest实例的变量集合，里面是构造实例需要的配置参数
	 * @type			object
	 */
	this._config = {
		/**
		 * @cfg		{boolean}		autoFocusFirstItem		是否自动focus第一项
		 */
		autoFocusFirstItem: true,
		/**
		 * @cfg		{boolean}		autoSelectToEnter		是否在选中某一项时出发enter事件
		 */
		autoSelectToEnter: false,
		/**
		 * @cfg		{integer}		cacheCapacity		Cache的容量，Data实例构建时使用
		 */
		cacheCapacity: -1,
		/**
		 * @cfg		{boolean}		cacheAutoScale		Cache是否自动控制大小，Data实例构建时使用
		 */
		cacheAutoScale: true,
		/**
		 * @cfg		{Suggest.Data}		data		data实例，如传入次参数，则忽略其他data参数
		 */
		data: null,
		/**
		 * @cfg		{string}		dataUrl		data实例所需参数，参照data文档
		 */
		dataUrl: "",
		/**
		 * @cfg		{string}		dataType		data实例所需参数，参照data文档
		 */
		dataType: "ScriptCallBack",
		/**
		 * @cfg		{function}		dataCallback		data实例所需参数，参照data文档
		 */
		dataCallback: Suggest.O,
		/**
		 * @cfg		{function}		dataHandler		data实例所需参数，参照data文档
		 */
		dataHandler: function(sKey, oData, oThis) {
			if (oData.sug) {
				//oData.sug=[{key:'b',display:'c',val:''}];
				for(var i = 0; i < oData.sug.length; i++){
					oData.sug[i].key = oData.sug[i].display = oData.sug[i].q;
					oData.sug[i].val = ' ';
				}
				oThis._read(oData.sug);
				oThis._prop.cache.pushCache(sKey, oData.sug);
			}else{
				oThis._read([]);
				oThis._prop.cache.pushCache(sKey, []);
			}
		},
		/**
		 * @cfg		{string}		dataCapacity		data实例所需参数，参照data文档
		 */
		dataCapacity: 10,
		/**
		 * @cfg		{object}		ui		ui实例，如传入次参数，则忽略其他UI参数
		 */
		ui: null,
		/**
		 * @cfg		{string|NodeW}		textbox		ui实例所需参数，参照ui文档
		 */
		textbox: '',
		/**
		 * @cfg		{string}		uiTemplate		ui实例所需参数，参照ui文档
		 */
		uiTemplate: '<div><span class="key">{display}</span><span class="val">{val}</span></div>',
		/**
		 * @cfg		{function}		uiRender		ui实例所需参数，参照ui文档
		 */
		uiRender: Suggest.O,
		/**
		 * @cfg		{function}		uiHighlighter		ui实例所需参数，参照ui文档
		 */
		uiHighlighter: Suggest.O,
		/**
		 * @cfg		{object}		uiBaseLayerConfig		ui实例所需参数，参照ui文档
		 */
		uiBaseLayerConfig: {
			autoPosition: false
		},
		/**
		 * @cfg		{integer}		uiItemNumber		ui实例所需参数，参照ui文档
		 */
		uiItemNumber: -1,
		/**
		 * @cfg		{object}		uiContainer		ui实例所需参数，参照ui文档
		 */
		uiContainer: null,
		/**
		 * @cfg		{object}		uiStyle		ui实例所需参数，参照ui文档
		 */
		uiStyle: {
			itemClass: 'item',
			containerClass: 'panel-suggest',
			selectClass: 'selected',
			focusClass: 'selected'
		},
		/**
		 * @cfg		{object}		uiView	ui实例所需参数，参照ui文档
		 */
		uiView: null,
		uiSelectFilter: function(d){return true}
	};

	/**
	 * @property		_prop		Suggest实例的属性集合，里面是实例运行的各种内部变量
	 * @type				object
	 */
	this._prop = {
		/**
		 * @property		index		当前关注项的值
		 * @type				integer
		 */
		index: -1,
		/**
		 * @property		isShown		是否显示
		 * @type				boolean
		 */
		isShown: false,
		/**
		 * @property		data		data实例
		 * @type				object
		 */
		data: null,
		/**
		 * @property		ui		ui实例
		 * @type				object
		 */
		ui: null
	};

	/**
	 * @property		_filter		Suggest实例的点击过滤器，预留，用于检测是否可以select或者可以focus
	 * @type				object
	 */
	this._filter = {};

	QW.ObjectH.mix(this._config, oConfig, true);
	this._init();
};

/**
 * @static
 * @property	_EVENT	用于构造CustEvent的事件列表
 * @type			array
 */
Suggest._EVENT = [
	/**
	 * @event		backspace		退格键触发
	 */
	'backspace', 
	/**
	 * @event		input		有数据输入的时候
	 */
	'input', 
	/**
	 * @event		enter		回车键按下触发
	 */
	'enter', 
	/**
	 * @event		esc		esc键按下触发
	 */
	'esc', 
	/**
	 * @event		focus		文本框focus的时候触发
	 */
	'focus', 
	/**
	 * @event		blur		文本框blur时触发
	 */
	'blur', 
	/**
	 * @event		itemfocus		提示项focus时触发
	 */
	'itemfocus', 
	/**
	 * @event		itemblur		提示项blur时触发
	 */
	'itemblur', 
	/**
	 * @event		itemselect		提示项选中时触发
	 */
	'itemselect'
];

Suggest.prototype = {
	/**
	 * 事件派发
	 * @method		_dispatch
	 * @param		{string}		sType		事件类型，为Suggest.Data._EVENT数组中的项
	 */
	_dispatch: function(sType) {
		if (!QW.ArrayH.contains(Suggest._EVENT, sType)) {
			Suggest._debug('arg', 'event type "' + sType.toString() + '" not exist when dispatching', arguments.callee);
			return false;
		}
		var oItem = this.getItem(this._prop.index);
		var eEvent = new QW.CustEvent(oItem, sType);
		eEvent.suggest = oItem;
		this.fire(eEvent);
	},
	/**
	 * 实例初始化函数，构造时调用
	 * @method		_init
	 * @return		{boolean}	返回是否初始化成功
	 */
	_init: function() {
		if (!this._initData()) {
			Suggest._debug("arg", "init data error", this);
			return false;
		}
		if (!this._initUI()) {
			Suggest._debug("arg", "init ui error", this);
			return false;
		}
		if (!this._initEvent()) {
			Suggest._debug("arg", "init event error", this);
			return false;
		}
	},
	/**
	 * data属性初始化，用Suggest.Data类构建
	 * @method		_initData
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initData: function() {
		if (null === this.get('data')) {
			var oSugData = new Suggest.Data(this._config);
			this._prop.data = this.set('data', oSugData);
		} else {
			this._prop.data = this.get('data');
		}
		return true;
	},
	/**
	 * ui属性初始化，用Suggest.UI类构建
	 * @method		_initData
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initUI: function() {
		if (null === this.get('ui')) {
			var oSugUI = new Suggest.UI(this._config);
			this._prop.ui = this.set('ui', oSugUI);
		} else {
			this._prop.ui = this.get('ui');
		}
		return true;
	},
	/**
	 * 事件初始化，包括侦听Data和UI的事件，以及初始化自己的事件
	 * @method		_initEvent
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initEvent: function() {
		QW.CustEvent.createEvents(this, Suggest._EVENT);
		var o = this._prop.ui;
		var oThis = this;
		var d = this._prop.data;
		o.on('up', function() {
			if (oThis.isShown())
				oThis.previous();
		});
		o.on('down', function() {
			if (oThis.isShown())
				oThis.next();
			else {
				oThis.suggest(this.getTextboxValue());
			}
		});
		o.on('change', function(eEvent) {
			oThis.suggest(this.getTextboxValue());
			oThis._dispatch('input');
		});
		o.on('esc', function() {
			if (oThis.isShown())
				oThis.hide();
		});
		o.on('backspace', function() {
			oThis._dispatch('backspace');
		});
		o.on('enter', function() {
			var nIndex = oThis._prop.index;
			if (nIndex >= 0) {
				o.setKeyword(d.getItem(oThis._prop.index).key);
				o.setTextboxValue(d.getItem(oThis._prop.index).key);
			}
			oThis.hide();
			oThis._dispatch('enter');
		});
		o.on('blur', function(e) {
			oThis._dispatch('blur');
			//oThis.hide();
		});
		o.on('focus', function() {
			oThis.suggest(this.getTextboxValue());
			oThis._dispatch('focus');
		});
		o.on('itemblur', function(eEvent) {
			oThis.blur(eEvent.itemIndex);
		});
		o.on('itemfocus', function(eEvent) {
			oThis.focus(eEvent.itemIndex);
		});
		o.on('itemselect', function(eEvent) {
			oThis.select(eEvent.itemIndex);
		});
		d.on('datachange', function() {
			if (d.getLength() > 0) {
				oThis.show();
				o.render(this.getData());
				if (oThis.isShown() && oThis.get('autoFocusFirstItem')) {
					oThis._prop.index = 0;
					while( !oThis.get('uiSelectFilter')(oThis.getItem(oThis._prop.index).data)) {
						oThis._prop.index++;
					}
					oThis.focus(oThis._prop.index);
				}
			} else {
				oThis.hide();
			}
		});
		d.on('indexchange', function() {
			if (d.getLength() <= 0) {
				return;
			};
			var nIndex = this.getIndex();
			if (nIndex >= 0) {
				o.setTextboxValue(d.getItem(this.getIndex()).key);
			} else {
				o.setTextboxValue(o.getKeyword());
			}
		});
		return true;
	},
	/**
	 * 设置参数
	 * @method		set
	 * @param		{string}		sKey			属性名
	 * @param		{object}		oValue		属性值
	 * @return		{object}		返回设置的oValue，默认设置成功
	 * @example		
this.set('dataType', 'ScriptCallback')
	 */
	set: function(sKey, oValue) {
		this._config[sKey] = oValue;
		return oValue;
	},
	/**
	 * 返回参数值
	 * @method		get
	 * @param		{string}		sKey			属性名
	 * @return		{object}
	 */
	get: function(sKey) {
		return this._config[sKey];
	},
	/**
	 * 设置过滤器
	 * @method		setFilter
	 * @param		{string}		sKey			属性名
	 * @param		{object}		oValue		属性值
	 * @return		{object}		返回设置的oValue，默认设置成功
	 */
	setFilter: function(sKey, oValue) {
		this._filter[sKey] = oValue;
		return oValue;
	},
	/**
	 * 返回Data属性
	 * @method		getData
	 * @return		{object}		隶属于Suggest的data实例
	 */
	getData: function() {
		return this._prop.data;
	},
	/**
	 * 返回关键字，注意是和Textbox的Value不一样的值
	 * @method		getKeyword
	 * @return		{string}		关键字
	 */
	getKeyword: function() {
		return this._prop.ui.getKeyword();
	},
	/**
	 * 设置关键字，注意是和Textbox的Value不一样的值
	 * @method		setKeyword
	 * @param		{string}		sKey			关键字
	 * @return		{boolean}		是否修改成功
	 */
	setKeyword: function(skey) {
		return this._prop.ui.setTextboxValue(skey);
	},
	/**
	 * 返回第n项提示项目
	 * @method		getItem
	 * @param		{integer}		nIndex		第n项，从0计数
	 * @return		{object}			第n项数据，格式为{index:x,data:x,ui:x}
	 */
	getItem: function(nIndex) {
		//返回对象格式如下所示
		return {
			index: nIndex,
			data: this._prop.data.getItem(nIndex),
			ui: this._prop.ui.getItem(nIndex)
		}
	},
	/**
	 * 返回Suggest是否显示
	 * @method		isShown
	 * @return		{boolean}
	 */
	isShown: function() {
		return this._prop.isShown;
	},
	/**
	 * 显示UI部分
	 * @method		show
	 * @return		{boolean}		是否显示成功
	 */
	show: function() {
		var bIsShown = true;
		if (!this.isShown()) {
			bIsShown = this._prop.ui.show();
			this._prop.isShown = bIsShown;
		}
		return bIsShown;
	},
	/**
	 * 隐藏UI部分
	 * @method		hide
	 * @return		{boolean}		是否隐藏成功
	 */
	hide: function() {
		var bIsHidden = false;
		if (this.isShown()) {
			bIsHidden = this._prop.ui.hide();
			this._prop.isShown = !bIsHidden;
		}
		this._prop.index = -1;
		this._prop.data.setCurrent(-1);
		return bIsHidden;
	},
	/**
	 * 根据关键字进行提示
	 * @method		suggest
	 * @return		{boolean}
	 */
	suggest: function(sKeyword) {
		this.set('keyword', sKeyword);
		if (sKeyword != "") {
			var oThis = this;
			this._prop.data.query(sKeyword);
		}
		//else this.hide();
		return true;
	},
	/**
	 * select列表项的第n项
	 * @method		select
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否select成功
	 */
	select: function(nIndex) {
		if (!Suggest._argValid(nIndex, "number", arguments.callee))
			return false;
		this._prop.index = nIndex;
		this._prop.ui.setKeyword(this._prop.data.getItem(nIndex).key);
		this._prop.data.setCurrent(nIndex);
		this._dispatch('itemselect');
		if (this.get('autoSelectToEnter'))
			this._dispatch('enter');
		this.hide();
		return true;
	},
	/**
	 * focus列表项的第n项
	 * @method		focus
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否focus成功
	 */
	focus: function(nIndex) {
		if (this._prop.index != -1) 
			this.blur(this._prop.index);
		if (!Suggest._argValid(nIndex, "number", arguments.callee))
			return false;
		this._prop.index = nIndex;
		this._prop.ui.focusItem(nIndex);
		this._dispatch('itemfocus');
		return true;
	},
	/**
	 * blur列表项的第n项
	 * @method		blur
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否blur成功
	 */
	blur: function(nIndex) {
		if (!Suggest._argValid(nIndex, "number", arguments.callee))
			return false;
		if (this._prop.index != -1) 
			this._prop.ui.blurItem(this._prop.index);
		this._dispatch('itemblur');
		this._prop.index = -1;
		this._prop.ui.blurItem(nIndex);
		return true;
	},
	/**
	 * 方便使用，blur前一项，focus后一项
	 * @method		exchange
	 * @param		{integer}	nBlurIndex		第几项
	 * @param		{integer}	nFocusIndex		第几项
	 * @return		{boolean}	返回是否exchange成功
	 */
	exchange: function(nBlurIndex, nFocusIndex) {
		if (!Suggest._argValid(nBlurIndex, "number", arguments.callee) || !Suggest._argValid(nFocusIndex, "number", arguments.callee))
			return false;
		return this.blur(nBlurIndex) && this.focus(nFocusIndex);
	},
	/**
	 * 跳到前一项
	 * @method		previous
	 */
	previous: function() {
		this.show();
		var nOriginalIndex = this._prop.index;
		this._prop.index = nOriginalIndex > 0 ? nOriginalIndex - 1 : this._prop.data.getLength() - 1;
		this._prop.data.setCurrent(this._prop.index);
		this.exchange(nOriginalIndex, this._prop.index);
		if (!this.get('uiSelectFilter')(this.getItem(this._prop.index).data)) {
			this.previous();
		}
	},
	/**
	 * 跳到后一项
	 * @method		next
	 */
	next: function() {
		this.show();
		var nOriginalIndex = this._prop.index;
		if (nOriginalIndex < this._prop.data.getLength() - 1) {
			this._prop.data.setCurrent(nOriginalIndex + 1);
			this.exchange(nOriginalIndex, nOriginalIndex + 1);
		}
		else {
			var oThis = this;
			if (this._prop.data.get('capacity') == -1 || this._prop.data.get('capacity') > this._prop.data.getLength()) {
				this._prop.data.increase(this._prop.data.getLength(), function() {
					oThis._prop.data.setCurrent(nOriginalIndex + 1);
					oThis.exchange(nOriginalIndex, nOriginalIndex + 1);
				});
			} else {
				this.exchange(nOriginalIndex, -1);
				this._prop.index = -1;
				this._prop.data.setCurrent(-1);
			}
		}
		if (this._prop.index != -1 && !this.get('uiSelectFilter')(this.getItem(this._prop.index).data)) {
			this.next();
		}
	}
};
/**
 * 基本调试函数，内部调试使用
 * @method				_debug
 * @static
 */
Suggest._debug = function(sType, sMsg, fFunc) {
	var sTypeStr = "";
	switch (sType) {
		case "arg":
			sTypeStr = "参数错误";
			break;
		case "ret":
			sTypeStr = "返回错误";
			break;
		case "net":
			sTypeStr = "网络异常";
			break;
		default:
			break;
	}
	//try{
		//console.log(sTypeStr + ":\t" + sMsg, fFunc);
	//} catch (ex) {
	//	alert(sTypeStr + ":\t" + sMsg + "\n" + fFunc.toString());
	//}
};
/**
 * 参数检测函数，内部调试使用
 * @method				_argValid
 * @static
 */
Suggest._argValid = function(oArg, sType, fFunc) {
	if (typeof oArg != sType) {
		Suggest._debug('arg', 'The type of ' + oArg == window.undefined ? oArg.toString() : 'null' + ' is not ' + sType + ', please check again', fFunc);
		return false;
	}
	return true;
};
/**
 * 空函数，作为默认回调函数
 * @static
 * @method				O
 */
Suggest.O = function() {};

QW.provide("Suggest", Suggest);/*import from ../components/suggest/suggest.cache.js,(by build.py)*/

/**
 * @class				Suggest.Cache		用于缓存之前的提示结果。主要缓存Data，使用Key=Value键值对进行缓存，如尚未缓存，返回Null
 * @namespace			Suggest
 * @author	Remember2015(wangzilong@baidu.com)
 */
/**
 * @constructor		
 * @param	{object}		oConfig	构造函数参数，详细参照类的配置
 * @example	
new Suggest.Cache({
	cacheCapcity: 10
})
 * @return	{boolean}	返回是否构造成功
 */
Suggest.Cache = function(oConfig) {
	Suggest._argValid(oConfig, 'object', arguments.callee);
	/**
	 * @property	_config		Cache实例的私有变量集合，里面是构造实例需要的配置参数
	 * @type			object
	 */
	this._config = {
		/**
		 * @cfg		{integer}		cacheCapacity		缓存的容量
		 */
		cacheCapacity: -1,
		/**
		 * @cfg		{boolean}		cacheAutoScale		自动控制缓存内容，当overflow时自动调整
		 */
		cacheAutoScale: true
	};
	/**
	 * @property		_prop		Cache实例的属性集合，里面是实例运行的各种内部变量
	 * @type				object
	 */
	this._prop = {
		cache: []
	};
	QW.ObjectH.mix(this._config, oConfig, true);
	return this._init();
};

Suggest.Cache.prototype = {
	/**
	 * 实例初始化函数，构造时调用
	 * @method		_init
	 * @return		{boolean}	返回是否初始化成功
	 */
	_init: function() {
		return true;
	},
	/**
	 * 设置参数
	 * @method		set
	 * @param		{string}		sKey			属性名
	 * @param		{object}		oValue		属性值
	 * @return		{object}		返回设置的oValue，默认设置成功
	 * @example		
this.set('cacheCapacity', 20)
	 */
	set: function(sKey, oValue) {
		this._config[sKey] = oValue;
		return oValue;
	},
	/**
	 * 返回参数值
	 * @method		get
	 * @param		{string}		sKey			属性名
	 * @return		{object}
	 */
	get: function(sKey) {
		return this._config[sKey];
	},
	/**
	 * 返回缓存值
	 * @method		getCache
	 * @param		{string}		sKey			属性名
	 * @return		{object}
	 */
	getCache: function(sKey) {
		if (!Suggest._argValid(sKey, 'string', arguments.callee)) {
			return false;
		}
		if (this._prop.cache[sKey])
			return this._prop.cache[sKey];
		else return null;
	},
	/**
	 * 填入缓存值
	 * @method		getCache
	 * @param		{string}		sKey			属性名
	 * @param		{object}		oValue		属性值
	 * @return		{object|boolean}		返回设置的oValue表示成功，返回false表示失败
	 */
	pushCache: function(sKey, oValue) {
		if (!Suggest._argValid(sKey, 'string', arguments.callee)) {
			return false;
		}
		var bAutoScale = this.get('cacheAutoScale'), nCacheCapacity = this.get('cacheCapacity');
		if (!bAutoScale && nCacheCapacity != -1 && this._prop.cache.length >= nCacheCapacity) {
			Suggest._debug('overflow', 'Can not push data into cache because of overflow', arguments.callee);
			return false;
		}
		if (bAutoScale && nCacheCapacity != -1 && this._prop.cache.length >= nCacheCapacity) {
			this._prop.cache.shift();
		}
		this._prop.cache[sKey] = oValue;
		return oValue;
	},
	/**
	 * 检测是否含有某个缓存
	 * @method		hasCache
	 * @param		{string}		sKey			属性名
	 * @return		{boolean}
	 */
	hasCache: function(sKey) {
		return this._prop.cache[sKey] != window.undefined ? true : false;
	},
	/**
	 * 清空缓存
	 * @method		empty
	 * @return		{boolean}	返回是否清空成功
	 */
	empty: function() {
		try {
			this._prop.cache.length = 0;
			return true;
		} catch (ex) {
			return false;
		}
	},
	/**
	 * 获取当前缓存大小
	 * @method		getLength
	 * @return		{integer}	返回大小
	 */
	getLength: function() {
		return this._prop.cache.length;
	}
};/*import from ../components/suggest/suggest.data.js,(by build.py)*/

/**
 * @class		Suggest.Data				用于处理Suggest的数据来源。可以为脚本CallBack(涉及跨域)，脚本数据(即返回json文本)
 * @namespace	Suggest
 * @author		Remember2015(wangzilong@baidu.com)
 */
/**
 * @constructor		
 * @param	{object}		oConfig	构造函数参数，详细参照类的配置
 * @example	
new Suggest.Data({
	dataUrl: "http://abc.com/?suggest&xx=xx"
})
 * @return	{boolean}	返回是否构造成功
 */
Suggest.Data = function(oConfig) {
	Suggest._argValid(oConfig, 'object', arguments.callee);
		/**
	 * @property	_config		Data实例的私有变量集合，里面是构造实例需要的配置参数
	 * @type			object
	 */
	this._config = {
		/**
		 * @cfg		{string}		dataUrl		请求数据的地址
		 */
		dataUrl: null,
		/**
		 * @cfg		{string}		dataType		Data类型，枚举：ScriptCallBack, ScriptData
		 */
		dataType: "ScriptCallBack",
		/**
		 * @cfg		{function}		dataCallBack		请求数据之后的回调函数
		 */
		dataCallBack: Suggest.O,
		/**
		 * @cfg		{function}		dataHandler		返回数据的处理函数，用于操作数据的校验与读取
		 */
		dataHandler: Suggest.O,
		/**
		 * @cfg		{integer}		dataCapacity		数据对象的容量，-1为没有容量限制
		 */
		dataCapacity: -1,
		/**
		 * @cfg		{string}		callback			回调函数的参数，默认为callback
		 */
		callback: "callback",
		/**
		 * @cfg		{string}		keyword			关键词参数，默认为keyword
		 */
		keyword: "keyword"
	};
	/**
	 * @property		_prop		Data实例的属性集合，里面是实例运行的各种内部变量
	 * @type				object
	 */
	this._prop = {
		/**
		 * @property		key		关键字，不具备读写操作，内部使用的变量
		 * @type				string
		 */
		key: "",
		/**
		 * @property		index		当前项的指针
		 * @type				integer
		 */
		index: -1,
		/**
		 * @property		originalIndex		之前项的指针
		 * @type				integer
		 */
		originalIndex: -1,
		/**
		 * @property		cache		Suggest.Cache实例
		 * @type				Suggest.Cache
		 */
		cache: null,
		/**
		 * @property		data		数据容器
		 * @type				array
		 */
		data: []
	};

	QW.ObjectH.mix(this._config, oConfig, true);
	return this._init();
};
/**
 * @static
 * @property	_EVENT	用于构造CustEvent的事件列表
 * @type			array
 */
Suggest.Data._EVENT = [
	/**
	 * @event		datachange		返回数据时会触发
	 */
	"datachange", 
	/**
	 * @event		indexchange		index指针改变时候触发，index指针指向当前项
	 */
	"indexchange", 
	/**
	 * @event		overflow			返回的数据超过容量时触发
	 */
	"overflow"
];
/**
 * @static
 * @property	_UID		用于管理不同关键字所对应的全局callback，处理跨域
 * @type			object
 */
Suggest.Data._UID = {};
Suggest.Data.prototype = {
	/**
	 * 实例初始化函数，构造时调用
	 * @method		_init
	 * @return		{boolean}	返回是否初始化成功
	 */
	_init: function() {
		var sTp = this.get('dataType');
		if (this.get('dataUrl') != '') {
			if (sTp == "ScriptCallBack") {
				var sUrl = this.get('dataUrl') + "&max_count=" + this.get('dataCapacity');
				this.set('dataUrl', sUrl);
			}
			if (sTp == "ScriptData") {
			}
		} 
		return this._initCache() && this._initEvent();
	},
	/**
	 * 缓存初始化
	 * @method		_initCache
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initCache: function() {
		var oSugCache = new Suggest.Cache(this._config);
		if (!oSugCache) {
			Suggest._debug("arg", "cacheCapacity", arguments.callee);
			return false;
		}
		this._prop.cache = this.set('cache', oSugCache);
		return true;
	},
	/**
	 * 事件初始化
	 * @method		_initEvent
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initEvent: function() {
		return QW.CustEvent.createEvents(this, Suggest.Data._EVENT);
	},
	/**
	 * 事件派发
	 * @method		_dispatch
	 * @param		{string}		sType		事件类型，为Suggest.Data._EVENT数组中的项
	 * @param		{event}		eEvent(Optional)	event对象
	 */
	_dispatch: function(sType) {
		if (!QW.ArrayH.contains(Suggest.Data._EVENT, sType)) {
			Suggest._debug('arg', 'event type "' + sType.toString() + '" not exist', this);
			return false;
		}
		var eEvent = new QW.CustEvent(this, sType);
		eEvent.suggestData = this;
		this.fire(eEvent);
	},
	/**
	 * 查询关键字
	 * @method		query
	 * @param		{string}			sKey							关键字
	 * @param		{function}		fCallback(Optional)		回调函数
	 * @return		{boolean}		返回是否查询成功
	 */
	query: function(sKey, fCallback) {
		if(!Suggest._argValid(sKey, 'string', arguments.callee))
			return false;
		this._prop.key = sKey;
		if (this._prop.cache.hasCache(sKey)) {
			this._read(this._prop.cache.getCache(sKey));
			if (fCallback)
				fCallback.apply(this);
			return true;
		} else {
			return this._request(this.get('dataCallback'));
		}
	},
	/**
	 * 内部方法，负责具体的请求
	 * @method		_request
	 * @param		{function}		fCallback(Optional)		回调函数
	 * @return		{boolean}		返回是否查询成功
	 */
	_request: function(fCallback) {
		var uid = 0;
		do {
			uid = (Math.random()*100000000).toFixed(0);
		}
		while (Suggest.Data._UID[uid] !== window.undefined);
		Suggest.Data._UID[uid] = '';
		if (this.get('dataType') == "ScriptCallBack") {
			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			var done = false;
			script.src = this.get('dataUrl') + '&'+this._config.keyword+'=' + window.encodeURIComponent(QW.StringH.trim(this._prop.key)) + "&"+this._config.callback+"=_SuggestCallBack" + uid;
			window["_SuggestCallBack" + uid] = this._scriptCallbackHandler(this._prop.key);
			if (Suggest._argValid(fCallback, 'function', arguments.callee)) {
				script.onload = script.onreadystatechange = function() {
					if ( !done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") ) {
							done = true;
							fCallback();
					}
				};
			}
			head.appendChild(script);
			return true;
		} 
	},
	/**
	 * 生成_request的回调函数
	 * @method		_scriptCallbackHandler
	 * @param		{string}			sKey			关键字
	 */
	_scriptCallbackHandler: function(sKey) {
		var oThis = this;
		var handler = this.get('dataHandler');
		return function(oData) {
			handler(sKey, oData, oThis);
		};
	},
	/**
	 * 读取查询返回的数据，并触发datachange事件
	 * @method		_read
	 * @param		{array[JSON Object]}			aDataSource			数据源
	 * @return		{boolean}		返回是否读取成功
	 */
	_read: function(aDataSource) {
		if (aDataSource.length !== undefined) {
			this._prop.data = aDataSource;
			this._dispatch('datachange');
			return true;
		} else {
			Suggest._debug('arg', 'aDataSource must be an array', aDataSource);
			return false;
		}
	},
	/**
	 * 设置参数
	 * @method		set
	 * @param		{string}		sKey			属性名
	 * @param		{object}		oValue		属性值
	 * @return		{object}		返回设置的oValue，默认设置成功
	 * @example		
this.set('dataType', 'ScriptCallback')
	 */
	set: function(sKey, oValue) {
		this._config[sKey] = oValue;
		return oValue;
	},
	/**
	 * 返回参数值
	 * @method		get
	 * @param		{string}		sKey			属性名
	 * @return		{object}
	 */
	get: function(sKey) {
		return this._config[sKey];
	},
	/**
	 * 设置当前项，会触发indexchange事件
	 * @method		setCurrent
	 * @param		{integer}		nIndex		第n项
	 * @return		{boolean}		返回设定是否成功
	 */
	setCurrent: function(nIndex) {
		if(!Suggest._argValid(nIndex, 'number', arguments.callee))
			return false;
		if(nIndex > this.getLength()) {
			Suggest._debug("arg", "index setted is larger than the length of data", arguments.callee)
			return false;
		}
		this._prop.originalIndex  = this._prop.index;
		this._prop.index = nIndex;
		this._dispatch('indexchange');
		return true;
	},
	/**
	 * 返回数据集
	 * @method		getData
	 * @return		{array[JSON Object]}
	 */
	getData: function() {
		return this._prop.data;
	},
	/**
	 * 返回之前项的指针
	 * @method		getOriginalIndex
	 * @return		{integer}
	 */
	getOriginalIndex: function() {
		return this._prop.originalIndex;
	},
	/**
	 * 返回当前项的指针
	 * @method		getIndex
	 * @return		{integer}
	 */
	getIndex: function() {
		return this._prop.index;
	},
	/**
	 * 返回某一项的数据
	 * @method		getItem
	 * @param		{integer}		nIndex		第n项
	 * @return		{boolean|object}		返回数据表示成功，false表示失败
	 */
	getItem: function(nIndex) {
		if(!Suggest._argValid(nIndex, 'number', arguments.callee))
			return false;
		if(nIndex > this.getLength() - 1) 
			return false;
		return this._prop.data[nIndex];
	},
	/**
	 * 返回当前数据集合的大小
	 * @method		getLength
	 * @return		{integer}
	 */
	getLength: function() {
		return this._prop.data.length;
	},
	/**
	 * 增加数据
	 * @method		increase
	 * @param		{integer}		nLength		增加的数据量
	 * @param		{function}		fCallback(Optional)		回调函数
	 * @return		{boolean}		
	 */
	increase: function(nLength, fCallback) {
		var sUrl = this.get('dataUrl');
		sUrl.replace(/&max_count=([^&]*)/gi, function(a, b) {
			return "&max_count=" + (parseInt(b, 10) + nLength);
		});
		return this._request(fCallback);
	}
};
/*import from ../components/suggest/suggest.ui.js,(by build.py)*/

/**
 * @class		Suggest.UI			管理Suggest涉及的界面部分
 * @namespace	Suggest
 * @author	Remember2015(wangzilong@baidu.com)
 */
/**
 * @constructor		
 * @param	{object}		oConfig	构造函数参数，详细参照类的配置
 * @example	
new Suggest.UI({
	textbox: "#sug-textbox",
	uiReferEl: '#sug-wrap'
})
 * @return	{boolean}	返回是否构造成功
 */
Suggest.UI = function(oConfig) {
	Suggest._argValid(oConfig, 'object', arguments.callee);
		/**
	 * @property	_config		UI实例的私有变量集合，里面是构造实例需要的配置参数
	 * @type			object
	 */
	this._config = {
		/**
		 * @cfg		{xpatch|HTMLElement|NodeW}		textbox		需要启动Suggest的文本框
		 */
		textbox: "",
		/**
		 * @cfg		{UI.View}		uiCaption		提示层的头部
		 */
		uiCaption: null,
		/**
		 * @cfg		{object}		uiView		view的实例，用于扩展，内容与接口参照UI.ListView
		 */
		uiView: null,
		/**
		 * @cfg		{object}		uiBaseLayerConfig		popup的参数，默认没有，详细参照@link[QW.Panel]
		 */
		uiBaseLayerConfig: {
			autoPosition: false
		},
		/**
		 * @cfg		{object}		uiContainer		提示层的容器
		 */
		uiContainer: null,
		/**
		 * @cfg		{xpatch|HTMLElement|NodeW}		uiReferEl		Suggest容器的相对定位容器，默认为文本框
		 */
		uiReferEl: null,
		/**
		 * @cfg		{integer}		_interval		私有变量，检测文本变化的计时器间隔，可以调节
		 */
		_interval: 50
	};
	/**
	 * @property		_prop		UI实例的属性集合，里面是实例运行的各种内部变量
	 * @type				object
	 */
	this._prop = {
		/**
		 * @property		_textChangeTimer		检测内容变化的计时器
		 * @type				window.interval
		 */
		_textChangeTimer: null,
		/**
		 * @property		textbox			文本框
		 * @type				NodeW
		 */
		textbox: null,
		/**
		 * @property		keyword			当前的关键字，进行了特殊处理
		 * @type				string
		 */
		keyword: "",
		/**
		 * @property		baseLayer		Suggest弹出层的HTML元素容器
		 * @type				LayerPopup
		 */
		baseLayer: null,
		/**
		 * @property		view				view实例，比如UI.ListView的实例
		 * @type				UI.View
		 */
		view: null,
		/**
		 * @property		_isTimerOn		是否开启计时器
		 * @type				boolean
		 */
		_isTimerOn: null
	};
	QW.ObjectH.mix(this._config, oConfig, true);
	return this._init();
};

/**
 * @static
 * @property	_EVENT	用于构造CustEvent的事件列表
 * @type			array
 */
Suggest.UI._EVENT = [
	/**
	 * @event	backspace	退格键按下触发
	 * @param	KEY.BackSpace
	 */
	'backspace', 
	/**
	 * @event	up				向上键按下触发
	 * @param	KEY.UP
	 */
	'up', 
	/**
	 * @event	down			向下键按下触发
	 * @param	KEY.DOWN
	 */
	'down', 
	/**
	 * @event	change		文本内容改变被处罚，单纯输入空格无效
	 * @param	KEY.CHARACTER
	 */
	'change', 
	/**
	 * @event	esc			esc键按下触发
	 * @param	KEY.ESC		
	 */
	'esc', 
	/**
	 * @event	enter			回车键按下触发
	 * @param	KEY.ENTER
	 */
	'enter', 
	/**
	 * @event	focus			文本框聚焦时出发
	 * @param	TAB_OR_CLICK
	 */
	'focus', 
	/**
	 * @event	blur			文本框失去焦点触发
	 * @param	TAB_OR_ESC
	 */
	'blur', 
	/**
	 * @event	itemfocus	Suggest项目被focus时触发，来源UI.ListView的事件冒泡
	 */
	'itemfocus', 
	/**
	 * @event	itemblur		Suggest项目被blur时触发，来源UI.ListView的事件冒泡
	 */
	'itemblur', 
	/**
	 * @event	itemselect	Suggest项目被select时触发，来源UI.ListView的事件冒泡
	 */
	'itemselect'
];

Suggest.UI.prototype = {
	/**
	 * 事件派发
	 * @method		_dispatch
	 * @param		{string}		sType		事件类型，为Suggest.UI._EVENT数组中的项
	 * @param		{event}		eEvent(Optional)	event对象
	 */
	_dispatch: function(sType, eEvent) {
		if (!QW.ArrayH.contains(Suggest.UI._EVENT, sType)) {
			Suggest._debug('arg', 'event type "' + sType.toString() + '" not exist when dispatching Suggest.UI instance ', this);
			return false;
		}
		if (eEvent) {
			this.fire(eEvent);
		} else {
			var eEventThis = new QW.CustEvent(this, sType);
			eEventThis.suggestUI = this;
			this.fire(eEventThis);
		}
	},
	/**
	 * 实例初始化函数，构造时调用
	 * @method		_init
	 * @return		{boolean}	返回是否初始化成功
	 */
	_init: function() {
		return this._initTextbox() && this._initView() && this._initBaseLayer() && this._initEvent();
	},
	/**
	 * 文本框初始化
	 * @method		_initTextbox
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initTextbox: function() {
		var oCore = QW.NodeW(this.get('textbox')).core;
		oCore = oCore.length ? oCore[0] : oCore;
		var oTextbox = QW.NodeW(oCore);
		this.set('textbox', oTextbox);
		this._prop.textbox  = oTextbox;
		var oThis = this;
		oTextbox.setAttr('autocomplete', 'off')
			.on('keydown', function(eEvent){
				oThis._keyEventHandler(eEvent);
			})
			.on('focus', function(eEvent){
				oThis._dispatch('focus');
				oThis._addTextChangeTimer();
			})
			.on('blur', function(event){
				oThis._dispatch('blur');
				oThis._removeTextChangeTimer();
			});
		return true;
	},
	/**
	 * View初始化
	 * @method		_initView
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initView: function() {
		var oView = this.get('uiView');
		if (oView === null) {
			oView = new Suggest.UI.ListView(this._config);
		}
		this.set('uiView', oView);
		this._prop.view = oView;
		var oThis = this;
		oView.on('itemfocus', function(eEvent) {
			oThis._dispatch('itemfocus', eEvent);
		});
		oView.on('itemblur', function(eEvent) {
			oThis._dispatch('itemblur', eEvent);
		});
		oView.on('itemselect', function(eEvent) {
			oThis._removeTextChangeTimer();
			oThis._dispatch('itemselect', eEvent);
		});
		return true;
	},
	/**
	 * 弹出层初始化
	 * @method		_initBaseLayer
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initBaseLayer: function() {
		var m = this.get('uiBaseLayerConfig');
		if (this.get('uiContainer') && QW.DomU.isElement(this.get('uiContainer'))) {
			this._prop.baselayer = new QW.LayerPopup(this.get('uiContainer'), m);
		} else {
			m.INNER_CLASS = 'panel-content ' + this.get('uiStyle').containerClass;
			this._prop.baselayer = new QW.LayerPopup(m);
		}
		if (this.get('uiCaption') !== null && this.get('uiCaption') !== '') {
			this._prop.baselayer.setCaption(this.get('uiCaption'));
		}
		this._prop.baselayer.setContent(QW.NodeH.g(this._prop.view.getContainer()));
		if (this.get('uiReferEl') !== null) {
			var oCore = QW.NodeW(this.get('uiReferEl')).core;
			oCore = oCore.length ? oCore[0] : oCore;
			var oE = QW.NodeW(oCore);
			this.set('uiReferEl', oE);
		} else {
			this.set('uiReferEl', this.get('textbox'));
		}
		return true;
	},
	/**
	 * 事件初始化
	 * @method		_initEvent
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initEvent: function() {
		QW.CustEvent.createEvents(this, Suggest.UI._EVENT);
		return true;
	},
	/**
	 * 检测是否开启文本变化计时器
	 * @method		_hasTextChangeTimer
	 * @return		{boolean}	返回是否启用
	 */
	_hasTextChangeTimer: function() {
		return this._prop._isTimerOn;
	},
	/**
	 * 关闭文本变化计时器
	 * @method		_removeTextChangeTimer
	 * @return		{boolean}	返回是否成功关闭
	 */
	_removeTextChangeTimer: function() {
		if (this._prop._isTimerOn) {
			clearInterval(this._prop._textChangeTimer);
			this._prop._isTimerOn = false;
			return true;
		}
		return true;
	},
	/**
	 * 开启文本变化计时器
	 * @method		_addTextChangeTimer
	 * @return		{boolean}	返回是否成功开启
	 */
	_addTextChangeTimer: function() {
		if (!this._prop._isTimerOn) {
			var oThis = this;
			oThis._prop._textChangeTimer = window.setInterval(function () {
				var value = oThis.getTextboxValue();
				/*
				 * change自定义事件的触发条件
				 * 文本框值有改变
				 */
				if (oThis.getKeyword() != value) {
					oThis._prop.keyword = value;
					oThis._dispatch('change');
				}
			}, oThis.get('_interval'));
			this._prop._isTimerOn = true;
			return true;
		}
		return true;
	},
	/**
	 * 键盘按键管理器，包含了up,down,backspace,esc,enter等按键的KeyCode，同时记载了一些无效按键
	 * @property		_keyManager
	 * @type			object
	 */
	_keyManager: {
		DOWN  : 40,
		UP    : 38,
		ESC   : 27,
		ENTER : 13,
		BACKSPACE: 8,
		_invalidKeyCode: [40, 39, 38, 37, 27, 13, 17, 16]
	},
	/**
	 * 检测KeyCode是否有效
	 * @method		_isKeyValid
	 * @param		{integer}	nKeyCode
	 * @return		{boolean}	返回按键是否有效
	 */
	_isKeyValid: function(nKeyCode) {
		var aInvalidCode = this._keyManager._invalidKeyCode;
		for (var i = 0, len = aInvalidCode.length; i < len; i++) {
			if (aInvalidCode[i] == nKeyCode) return false;
		}
		return true;
	},
	/**
	 * 键盘按键处理函数
	 * @method		_keyEventHandler
	 * @param		{event}		eEvent
	 */
	_keyEventHandler: function(eEvent) {
		var sEventType = "";
		switch(eEvent.keyCode) {
			case this._keyManager.UP:
				sEventType = "up";
				eEvent.preventDefault();
				this._removeTextChangeTimer();
				break;
			case this._keyManager.DOWN:
				sEventType = "down";
				this._removeTextChangeTimer();
				break;
			case this._keyManager.ESC:
				sEventType = "esc";
				this._removeTextChangeTimer();
				break;
			case this._keyManager.BACKSPACE:
				sEventType = "backspace";
				this._addTextChangeTimer();
				break;
			case this._keyManager.ENTER:
				sEventType = "enter";
				eEvent.preventDefault();
				this._removeTextChangeTimer();
				break;
			default:
				if (this._isKeyValid(eEvent.keyCode)) {
					this._addTextChangeTimer();
				};
		};
		if (sEventType != '') 
			this._dispatch(sEventType);
	},
	/**
	 * 设置参数
	 * @method		set
	 * @param		{string}		sKey			属性名
	 * @param		{object}		oValue		属性值
	 * @return		{object}		返回设置的oValue，默认设置成功
	 * @example		
this.set('textbox', '#id')
	 */
	set: function(sKey, oValue) {
		this._config[sKey] = oValue;
		return oValue;
	},
	/**
	 * 返回参数值
	 * @method		get
	 * @param		{string}		sKey			属性名
	 * @return		{object}
	 */
	get: function(sKey) {
		return this._config[sKey];
	},
	/**
	 * 渲染所有列表项
	 * @method		render
	 * @param		{array[JSON Object]}			aData			数据数组
	 */
	render: function(aData) {
		return this._prop.view.render(aData);
	},
	/**
	 * 设置文本框内容
	 * @method		setTextboxValue
	 * @param		{string}			sValue			要设定的文本值
	 * @param		{boolean}		是否设定成功
	 */
	setTextboxValue: function(sValue){
		this._prop.textbox.core.value = sValue;
//		this._prop.keyword = sValue;
		return true;
	},
	/**
	 * 获取文本框内容
	 * @method		getTextboxValue
	 * @return		{string}		返回文本框的值，已经处理trim的
	 */
	getTextboxValue: function(){
		return QW.StringH.trim(this._prop.textbox.core.value);
	},
	/**
	 * 显示Suggest的弹出层
	 * @method		show
	 * @return		{boolean}		返回是否弹出成功
	 */
	show: function() {
		this._prop.baselayer.showPopup(null, this.get('uiReferEl').get('offsetHeight'), null, null, this.get('uiReferEl').core);
		return true;
	},
	/**
	 * 隐藏Suggest的弹出层
	 * @method		hide
	 * @return		{boolean}		返回是否隐藏成功
	 */
	hide: function(){
		this._prop.baselayer.hide();
		return true;
	},
	/**
	 * 设置关键字，注意关键字并不意味着文本框的值，有时人工设置文本框的值，但是Suggest实例的关键字是没有变化的
	 * @method		setKeyword
	 * @param		{string}		sKey		关键字
	 */
	setKeyword: function(sKey){
		this._prop.keyword = sKey;
	},
	/**
	 * 获取关键字，注意关键字并不意味着文本框的值，有时人工设置文本框的值，但是Suggest实例的关键字是没有变化的
	 * @method		getKeyword
	 * @return		{string}		返回关键字
	 */
	getKeyword: function(){
		return QW.StringH.trim(this._prop.keyword);
	},
	/**
	 * 获取第n提示项，调用View的方法进行处理，本身没有操作
	 * @method		getItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{NodeW}
	 */
	getItem: function(nIndex) {
		return this._prop.view.getItem(nIndex);
	},
	/**
	 * 选中列表项的第n项
	 * @method		selectItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否select成功
	 */
	selectItem: function(nIndex){
		this._prop.view.focusItem(nIndex);
		return true;
	},
	/**
	 * focus列表项的第n项
	 * @method		focusItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否focus成功
	 */
	focusItem: function(nIndex){
		this._prop.view.focusItem(nIndex);
		return true;
	},
	/**
	 * blur列表项的第n项
	 * @method		blurItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否blur成功
	 */
	blurItem: function(nIndex){
		this._prop.view.blurItem(nIndex);
		return true;
	}
};
/*import from ../components/suggest/suggest.ui.listview.js,(by build.py)*/

/**
 * @class	Suggest.UI.ListView	这是UI中view部分的一个实现，也是最常用的类型，列表
 * @namespace	Suggest
 * @author	Remember2015(wangzilong@baidu.com)
 */

/**
 * @constructor		
 * @param	{object}		oConfig	构造函数参数，详细参照类的配置
 * @example	
new Suggest.UI.ListView({
	uiTemplate: "<p>{display}</p><q>{value}</q>"
})
 * @return	{boolean}	返回是否构造成功
 */
Suggest.UI.ListView = function(oConfig) {
	Suggest._argValid(oConfig, 'object', arguments.callee);
	/**
	 * @property	_config		ListView实例的私有变量集合，里面是构造实例需要的配置参数
	 * @type			object
	 */
	this._config = {
		/**
		 * @cfg		{string}		uiTemplate(Optional)		数据渲染模板，如设置，则使用此模板格式化数据，优先级低于uiRender
		 * @exapmle		
if (data == {valueA: '1', valueB: '2'}) 
	uiTemplate = {
		uiTemplate: "<b>{valueA} + {valueB}</b>"
	};
		 */
		uiTemplate: "",
		uiListContainer: null,
		/**
		 * @cfg			{function}		uiRender(Optional)		数据渲染函数，接收参数为data对象，返回为Dom节点(经过wrap)
		 * @example
var render = function(oData) {
	return QW.NodeW(QW.DomU.create('<span onclick="alert(document.location)">' + oData.val.resultNumber + '<span>')); 
}
		 */
		uiRender: null,
		/**
		 * @cfg			{function}		uiHighlighter(Optional)		显示提示项时如需要特殊处理关键字高亮或其他需求时使用
		 * @exapmle		
var uiHighlighter = function(oEl) {
	var elKeyEl = QW.NodeW(oEl).query('.key').core[0];
	var sHtml = elKeyEl.innerHTML;
	elKeyEl.innerHTML = sHtml.replace(sug.getKeyword(), '<em style="color:#d06000;font-weight:bold">' + sug.getKeyword() + '</em>')
};
		 */
		uiHighlighter: Suggest.O,
		/**
		 * @cfg		{integer}		uiItemNumber(Optional)		列表项的最大容量，如data有20项，uiItemNumber设置为10，则只显示10项，但是可以通过上下键滚动
		 */
		uiItemNumber: -1,
		/**
		 * @cfg			{object}		uiStyle		样式集合，包括containerClass，selectedClass，focusClass等，提供默认值
		 * @example		
var uiStyle = {
	containerClass: 'panel-suggest',
	selectClass: 'selected',
	focusClass: 'selected'
}
		 */
		uiStyle:{
			containerClass: '',
			selectClass: '',
			focusClass: ''
		}
	};
	/**
	 * @property		_prop		ListView实例的属性集合，里面是实例运行的各种内部变量
	 * @type				object
	 */
	this._prop = {
		/**
		 * @property		container		Suggest列表项的HTML元素容器
		 * @type				NodeW
		 */
		container: null,
		/**
		 * @property		items		各个列表项对应HTML元素的集合
		 * @type				array[NodeW]
		 */
		items: [],
		/**
		 * @property		start		ListView实例显示在container里面的项目的启示index
		 * @type				integer
		 */
		start: 0
	};
	QW.ObjectH.mix(this._config, oConfig, true);
	return this._init();
};
/**
 * @static
 * @property	_EVENT	用于构造CustEvent的事件列表
 * @type			array
 */
Suggest.UI.ListView._EVENT = [
	/**
	 * @event	itemfocus	Suggest项目被focus时触发，UI层的事件
	 * @param	mouseenter
	 */
	'itemfocus', 
	/**
	 * @event	itemblur		Suggest项目blur时触发，UI层的事件
	 * @param	mouseout
	 */
	'itemblur', 
	/**
	 * @event	itemselect	Suggest项目被点击时触发，UI层的事件
	 * @param	mousedown
	 */
	'itemselect'
];

Suggest.UI.ListView.prototype = {
	/**
	 * 实例初始化函数，构造时调用
	 * @method		_init
	 * @return		{boolean}	返回是否初始化成功
	 */
	_init: function() {
		this._prop.container = this.get('uiListContainer') || QW.NodeW(document.createElement('div'));
//		this._prop.container.addClass(this.get('uiStyle').containerClass);
		this._initEvent();
		return true;
	},
	/**
	 * 事件初始化
	 * @method		_initEvent
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initEvent: function() {
		QW.CustEvent.createEvents(this, Suggest.UI.ListView._EVENT);
		return true;
	},
	/**
	 * 事件派发
	 * @method		_dispatch
	 * @param		{string}		sType		事件类型，为Suggest.UI.ListView._EVENT数组中的项
	 * @param		{integer}	nIndex	事件触发的项目的index
	 */
	_dispatch: function(sType, nIndex) {
		if (!QW.ArrayH.contains(Suggest.UI.ListView._EVENT, sType)) {
			Suggest._debug('arg', 'event type "' + sType.toString() + '" not exist', this);
			return false;
		}
		var eEvent = new QW.CustEvent(this._prop.items[nIndex], sType);
		eEvent.itemIndex = nIndex;
		this.fire(eEvent);
	},
	/**
	 * 设置参数
	 * @method		set
	 * @param		{string}		sKey			属性名
	 * @param		{object}		oValue		属性值
	 * @return		{object}		返回设置的oValue，默认设置成功
	 * @example		
this.set('uiItemNumber', 10)
	 */
	set: function(sKey, oValue) {
		this._config[sKey] = oValue;
		return oValue;
	},
	/**
	 * 返回参数值
	 * @method		get
	 * @param		{string}		sKey			属性名
	 * @return		{object}
	 */
	get: function(sKey) {
		return this._config[sKey];
	},
	/**
	 * 返回列表项的容器
	 * @method		getContainer
	 * @return		{NodeW}
	 */
	getContainer: function() {
		return this._prop.container;
	},
	/**
	 * 渲染所有列表项
	 * @method		render
	 * @param		{array[JSON Object]}			aData			数据数组
	 */
	render: function(aData) {
		for (var i = 0; i < this._prop.items.length; i++) {
			this._prop.items[i].un();
		}
		this._prop.items.length = 0;
		this._prop.start = 0;
		this._prop.container.set('innerHTML', '');

		for (var i = 0, len = aData.length; i < len; i++) {
			this._prop.items[i] = this.renderItem(aData[i], i);
			this.highlight(i);
			this._prop.container.appendChild(this._prop.items[i]);
		}
		var limit = this.get('uiItemNumber') == -1 ? this._prop.items.length : this.get('uiItemNumber');
		for (var i = limit; i < this._prop.items.length; i++) {
			this._prop.container.removeChild(this._prop.items[i]);
		}
	},
	/**
	 * 渲染单个列表项
	 * @method		renderItem
	 * @param		{object}		oData			数据项
	 * @param		{integer}	nIndex		第几项
	 * @return		{NodeW}		渲染完毕的列表项
	 */
	renderItem: function(oData, nIndex) {
		var sTPL = this.get('uiTemplate');
		var fRender = this.get('uiRender');
		var oEl = null;
		if (fRender != QW.Suggest.O) {
			oEl = QW.NodeW(fRender.apply(this, [oData]));
		} else if (sTPL != '') {
			var sHTML = sTPL.replace(/\{([^\}]+)\}/gi, function(a, b) {
				return oData[b] || ('{' + b + ' }');
			});
			oEl = QW.NodeW(QW.DomU.create(sHTML));
			oEl.addClass('item');
		} 
		this._bindEventToItem(oEl, nIndex, oData);
		return oEl;
	},
	/**
	 * 为列表项绑定事件
	 * @method		_bindEventToItem
	 * @param		{NodeW}		oEl			绑定对象
	 * @param		{integer}	nIndex		第几项
	 */
	_bindEventToItem: function(oEl, nIndex, oData) {
		var oThis = this;
		if (this.get('uiSelectFilter')(oData)) {
			oEl.on('mouseover', function(eEvent) {
				oThis._dispatch('itemfocus', nIndex);
			});
			oEl.on('mouseout', function(eEvent) {
				oThis._dispatch('itemblur', nIndex);
			});
			oEl.on('mousedown', function(eEvent) {
				oThis._dispatch('itemselect', nIndex);
			});
		} else {
			oEl.on('mousedown', function(eEvent) {
				eEvent.preventDefault();
			});
		}
	},	
	/**
	 * 向下滚动一项
	 * @method		scrollDown
	 */
	scrollDown: function() {
		if (this._prop.start === 0) 
			return;
		this._prop.items[this._prop.start].insertSiblingBefore(this._prop.items[this._prop.start-1]);
		this._prop.container.removeChild(this._prop.items[this._prop.start + this.get('uiItemNumber') - 1]);
		this._prop.start--;
	},
	/**
	 * 向上滚动一项
	 * @method		scrollUp
	 */
	scrollUp: function() {
		this._prop.container.removeChild(this._prop.items[this._prop.start]);
		this._prop.items[this._prop.start + this.get('uiItemNumber') - 1].insertSiblingAfter(this._prop.items[this._prop.start + this.get('uiItemNumber')]);
		this._prop.start++;
	},
	/**
	 * 列表项滚动到n项
	 * @method		scrollTo
	 * @param		{integer}	nIndex		第几项
	 */
	scrollTo: function(nIndex) {		
		while (nIndex < this._prop.start || nIndex > this._prop.start + this.get('uiItemNumber') - 1) {
			if (this._prop.start > nIndex) 
				this.scrollDown();
			if (this._prop.start + this.get('uiItemNumber') - 1 < nIndex) 
				this.scrollUp();
		}
	},
	/**
	 * 返回列表项的第n项
	 * @method		getItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{NodeW}
	 */
	getItem: function(nIndex) {
		return this._prop.items[nIndex];
	},
	/**
	 * 选中列表项的第n项
	 * @method		selectItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否select成功
	 */
	selectItem: function(nIndex) {
		this._prop.items[nIndex].addClass(this.get('uiStyle').selectClass);
		return true;
	},
	/**
	 * focus列表项的第n项
	 * @method		focusItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否focus成功
	 */
	focusItem: function(nIndex) {
		nIndex = parseInt(nIndex, 10);
		if (nIndex < 0) 
			return false;
		this.scrollTo(nIndex);
		this._prop.items[nIndex].addClass(this.get('uiStyle').focusClass);
		return true;
	},
	/**
	 * 高亮第n项
	 * @method		highlight
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否focus成功
	 */
	highlight: function(nIndex) {
		nIndex = parseInt(nIndex, 10);
		if (nIndex < 0) 
			return false;
		var fHglter = this.get('uiHighlighter');
		fHglter(this._prop.items[nIndex],nIndex);
		return true;
	},
	/**
	 * blur列表项的第n项
	 * @method		blurItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否blur成功
	 */
	blurItem: function(nIndex) {
		nIndex = parseInt(nIndex, 10);
		if (nIndex < 0) 
			return false;
		this._prop.items[nIndex].removeClass(this.get('uiStyle').focusClass);
		return true;
	}
};