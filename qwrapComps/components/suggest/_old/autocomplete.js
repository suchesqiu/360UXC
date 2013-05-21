/**
 * @fileoverview Autocomplete class, AutocompleteDataMgr, AutocompleteCache, getScript
 * @author:{@link mailto:ranklau@gmail.com never-online}
 * @update: 2009-1-7
 */


/*
function IDataStruct() {
	return {
		text
		content
		getData
	}
};

function IKeyboard() {
	depend on IDataSource
	return {
		next
		privous
		start
		end
		hide
		show
	}
};

function IDataSource() {
	return {
		formatDataSource
		matchData
		nextEntry
		previousEntry
		gotoEntry
	}
}
*/


var SuggestLayer = function() {
	this.$super.apply(this, arguments);
	return this;
}.$extends(LayerPopup);

SuggestLayer.prototype.autocompleteElements = [];

SuggestLayer.prototype._addLayerPopupListener = function () {
	var instance = this;
	var fnPopupBlurHandler = function(e) { 
		e  = window.event || e;
		var el = BBEvent.target(e);
		
		if (!instance._popup.contains(el) && instance.isVisible()) {
			if (instance.isVisible()) {
				for (var i=0; i<instance.autocompleteElements.length; i++) {
					if (instance.autocompleteElements[i]==el) return;
				}
				CustEvent.fireEvent(instance, 'blur', e);
				instance.hide();
			}
		}
	}
	CustEvent.observe(this, 'aftershow', function() {
		BBEvent.stopObserving(document, 'mousedown', fnPopupBlurHandler);
		BBEvent.stopObserving(document, 'keyup',     fnPopupBlurHandler);
		BBEvent.observe(document, 'mousedown',       fnPopupBlurHandler);
		BBEvent.observe(document, 'keyup',           fnPopupBlurHandler);
	});

}

/* 自动完成的cache */
function AutocompleteCache() {
	this.cache = {};
	return this;
}

AutocompleteCache.prototype.read = function(key) {
	if (this.cache[key]) return this.cache[key];
	return null;
};

AutocompleteCache.prototype.write = function(key, value) {
	key = key +'';
	if (!this.read(key)) this.cache[key] = value;
}



/**
 * 自动完成的样式类名
 * @const
 * @static
 */
var AutocompleteStyle = {
	CONTAINER: 'autocomplete',

	UNSELECTED_ENTRY: 'unselectedentry',
	SELECTED_ENTRY: 'selectedentry',

	UNSELECTED_KEY: 'unselectedkey',
	UNSELECTED_VAL: 'unselectedval',

	SELECTED_KEY: 'selectedkey',
	SELECTED_VAL: 'unselectedval'
};


/**
 * 自动完成键盘事件接口
 */
var AutocompleteKeyMgr = {
	DOWN  : 40,
	UP    : 38,
	ESC   : 27,
	ENTER : 13,
	availableKeyCode: function(keyCode) {
		var invalidKeyCode = [40,39,38,37,27,13,17,16];
		var len = invalidKeyCode.length;
		for (var i=0; i<len; i++) {
			if (invalidKeyCode[i]==keyCode) return false;
		}
		return true;
	}
};


/**
 * 自动完成可以触发的事件接口
 * @const
 * @static
 */
var AUTOCOMPLETE_EVENT = {
	SHOW    : 'onshow',
	HIDE    : 'onhide',
	SELECT  : 'onselect',
	CHANGE  : 'onchange',
	INPUT   : 'oninput',
	ENTER   : 'onenter'
};

/**
 * 通过script的回调机制来实现跨域
 * @param {string}   value    要设置到文本框值的字符串
 * @param {function} callback 当脚本加载完时处理的回调函数
 * @return void
 */
function getScript(url, callback){
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	var done = false;
	script.src = url;

	if(callback)
		script.onload = script.onreadystatechange = function(){
			if ( !done && (!this.readyState ||
				this.readyState == "loaded" || this.readyState == "complete") ) {
					done = true;
					callback();
			}
		};

	head.appendChild(script);
}

/* 自动完成的数据操作工厂
   依赖于数据项的接口 */


function AutocompleteDataMgr(op) {
	
	this.tblPrefix = '_table';

	this.tableId = this.tblPrefix +op.instanceName;
	this.instanceName = op.instanceName;
	this.multipleData = op.multipleData || true;

	this.classNames = op.classNames;
	this.dataSource = op.data || [];

	return this;
};

AutocompleteDataMgr.prototype.getDataLength = function () {
	return this.dataSource.length;
};


/* string formater */
AutocompleteDataMgr.prototype.format = function(data) {
	this.dataSource = data || this.dataSource;
	var dataLength = this.dataSource.length;
	var strBuilder = [];
	strBuilder.push('<table onselectstart="return false" cellspacing="0" cellpadding="0" border="0" id="' +this.tableId+ '" class="' +this.classNames.CONTAINER+ '" width="100%">');

	for (var i=0; i<dataLength; i++) {
		strBuilder.push('<tr class="' +this.classNames.UNSELECTED_ENTRY+' " onmousedown="' +this.instanceName+ '.mousedownHandler(event, ' +i+ ')" onclick="' +this.instanceName+'.clickHandler(' +i+ ')" onmouseover="' +this.instanceName+ '.overHandler(' +i+ ')" onmouseout="' +this.instanceName+ '.outHandler(' +i+ ')">'
							+'<td class="' +this.classNames.UNSELECTED_KEY+ '">' +(this.dataSource[i].display||this.dataSource[i].key)+ '</td>'
							+(this.multipleData?'<td class="' +this.classNames.UNSELECTED_VAL+ '" align="right">' +this.dataSource[i].val+ '</td></tr>':''));
	}

	strBuilder.push('</table>');
	return strBuilder.join('');
};

AutocompleteDataMgr.prototype.replaceClassName = function(beforeIndex, afterIndex) {
	var classNames = this.classNames;
	var beforeKeyNode   = this.getKeyNode(beforeIndex);
	var beforeValNode   = this.getValNode(beforeIndex);

	var afterKeyNode    = this.getKeyNode(afterIndex);
	var afterValNode    = this.getValNode(afterIndex);

	var beforeEntryNode = this.getEntryNode(beforeIndex);
	var afterEntryNode  = this.getEntryNode(afterIndex); 

	Dom.replaceClassName( beforeEntryNode, classNames.SELECTED_ENTRY,   classNames.UNSELECTED_ENTRY );		
	Dom.replaceClassName( beforeKeyNode,   classNames.SELECTED_KEY,     classNames.UNSELECTED_KEY   );
	Dom.replaceClassName( beforeValNode,   classNames.SELECTED_VAL,     classNames.UNSELECTED_VAL   );
	Dom.replaceClassName( afterKeyNode,    classNames.UNSELECTED_KEY,   classNames.SELECTED_KEY     );
	Dom.replaceClassName( afterValNode,    classNames.UNSELECTED_VAL,   classNames.SELECTED_VAL     );
	Dom.replaceClassName( afterEntryNode,  classNames.UNSELECTED_ENTRY, classNames.SELECTED_ENTRY   );
};

AutocompleteDataMgr.prototype.clear = function() {
	this.dataSource = {};
};

AutocompleteDataMgr.prototype.getEntryNode = function(n) {
	var tblElement = document.getElementById(this.tableId);
	return n >=0 ? tblElement.rows[n] : null;
};

AutocompleteDataMgr.prototype.getKeyNode = function(n) {
	var element = this.getEntryNode(n);
	return element ? element.cells[0] : null;
};

AutocompleteDataMgr.prototype.getValNode = function(n) {
	var element = this.getEntryNode(n);
	return element ? element.cells[1] : null;
};

AutocompleteDataMgr.prototype.getEntryData = function(n) {
	return this.dataSource[n];
};

AutocompleteDataMgr.prototype.getEntryKey = function(n) {
	return this.getEntryData(n) ? this.getEntryData(n).key : null;
};

AutocompleteDataMgr.prototype.getEntryVal = function(n) {
	return this.getEntryData(n) ? this.getEntryData(n).val : null;
};



/* 自动完成的实现 */
function Autocomplete(op) {
	return this._constructor.apply(this, arguments);
}

Autocomplete.prototype = {

	EVENT          : AUTOCOMPLETE_EVENT,

	keyMgr         : AutocompleteKeyMgr,

	classNames     : AutocompleteStyle,

	width          : null,

	left           : null,
	
	height         : null,

	top            : null,

	dataMgr        : null,
	
	queryEventType  : [!!window.ActiveXObject ? 'keyup' : 'input'],

	selectEventType : [navigator.userAgent.toLowerCase().indexOf("opera")!=-1 ? 'keypress' : 'keydown'],

	instanceName   : '',
 
	listenTextbox  : null,

	returnTextbox  : null,
 
	selectedIndex  : -1,

	requestURL     : '',

	disabled       : false,

	userInputValue : '',

	textboxValue   : '',

	userSelectedValue : '',
		
	container      : null,

	selectEventInterval : 100,

	interval       : 50,

	_completeItemFlag : 0,


	_lastSelectTime  : null,

	_textChangeTimer : null,

	_autocompletePanel : null,

	/**
	 * 构造函数
	 * @private
	 * @return {autocomplete}
	 */
	_constructor: function (op) {

		Object.extendJson(this, op||{});

		this.dataMgr = new AutocompleteDataMgr({
			instanceName: this.instanceName,
			classNames: this.classNames
		});

		var instanceName = this.instanceName;
		this.returnTextbox = this.returnTextbox || this.listenTextbox;

		this.addTextboxEventListener();

		this._autocompletePanel = new SuggestLayer($(this.container));
		this._autocompletePanel.autoPosition = false;
		this._autocompletePanel.autocompleteElements = [this.listenTextbox,this.returnTextbox];
		this.listenTextbox.setAttribute('autocomplete','off');
		return this;
		
	},

	/**
	 * 绑定事件
	 * @private
	 * @return void
	 */
	addTextboxEventListener: function() {




		/* 循环出查询事件，并绑定到处理函数queryKeyEventHandler */
		this.bindAllEventToTextbox(this.queryEventType, function(e){
				var keyCode = window.event ? event.keyCode : e.which;
				instance.addTextChangeHandler();
				instance.queryKeyEventHandler(e);
		});

		/* 绑定键盘选择事件到selectKeyEventHandler*/
		this.bindAllEventToTextbox(this.selectEventType,function(e){
			var now = (new Date()).valueOf();
			var timeRemainder = parseInt(now-this._lastSelectTime,10)||0;
			if (timeRemainder>=this.selectEventInterval) {
				this._lastSelectTime = now;
				this.selectKeyEventHandler(e);
			}
		});

		var instance = this;

		BBEvent.observe(this.listenTextbox,'blur',function() {
			instance.clearTextChangeTimer();
		});

		/*
		绑定
		timer，当focus时有效，blur时移除*/
		BBEvent.observe(this.listenTextbox,'focus',function() {
			instance.addTextChangeHandler();
		});

		BBEvent.observe(this.listenTextbox,'keypress',function() {
			instance.addTextChangeHandler();
		});

		if (!!window.ActiveXObject) {
			/**
			 * 处理在IE下微软拼音输入法在半输入法状态下suggest的click事件无效的问题
			 * Only IE
			 */
			BBEvent.observe(this.listenTextbox,'beforedeactivate',function(){
				if (instance._completeItemFlag) {
					window.event.cancelBubble = true;
					window.event.returnValue = false;
					instance.listenTextbox.focus();
					instance._completeItemFlag = 0;
				}
				
			});
		}
	},


	clearTextChangeTimer: function() {
		clearInterval(this._textChangeTimer);
	},
	
	addTextChangeHandler: function() {
		var instance = this;
		instance.clearTextChangeTimer();
		
		instance._textChangeTimer = window.setInterval(function () {
			var value = instance.getTextboxValue();
			
			/*
			 * oninput自定义事件的触发条件
			 * 文本框值有改变
			 * 文本框值不是suggest中的值
			 * 文本框的值对比用户输入的值有改变
			 */
			if ((instance.textboxValue!=value && 
				instance.userSelectedValue!=value) || 
				0==value.trim().length) {
				instance.fireInputEvent(instance.EVENT.INPUT, value);
			}
			instance.textboxValue = value;
		}, instance.interval);
	},

	/**
	 * 批量绑定一个事件，并把this绑定到事件函数中
	 * @private
	 * @return {autocomplete}
	 */
	bindAllEventToTextbox: function(arrType, handler) {
		if (!arrType.constructor) throw new Error(['Autocomplete','bindEventToTextbox','event type is not valid']);
		if (arrType.constructor!=Array) arrType = [arrType];
		var len = arrType.length;
		var self = this;
		for (var i=0; i<len; i++) {
			BBEvent.observe(this.listenTextbox, arrType[i], function(arg) {
				return handler.apply(self,arguments);
			});
		}
	},


	fireInputEvent: function(value) {
		this.dispatchEvent(this.EVENT.INPUT, { 
			selectedIndex: this.selectedIndex, 
			dataSource: this.dataMgr.dataSource,
			inputValue: value
		});
	},


	/**
	 * 鼠标点击某个条目时的处理函数
	 * @param {number} index 为某个条目的索引
	 * @private
	 * @return void
	 */
	clickHandler: function(index) {
		this.listenTextbox.blur();
		this.setTextboxValue(this.dataMgr.getEntryKey(this.selectedIndex));
		this.enterKeyEventHandler();
	},

	/**
	 * 鼠标移到某个条目时的处理函数
	 * @param {number} index 为某个条目的索引
	 * @private
	 * @return void
	 */
	overHandler: function(index) {
		this.entryChangeHandler(this.selectedIndex, index);
	},

	/**
	 * 鼠标移开某个条目时的处理函数
	 * @param {number} index 为某个条目的索引
	 * @private
	 * @return void
	 */
	outHandler: function(index) {
		this.entryChangeHandler(index, this.selectedIndex);
	},

	mousedownHandler: function(e, index) {
		var instance = this;
		this._completeItemFlag = 1;
	},

	/**
	 * 键盘选择事件的处理函数
	 * @param {event} e 传入的事件对象
	 * @private
	 * @return void
	 */
	selectKeyEventHandler: function(e) {

		var keyCode = window.event ? event.keyCode : e.which;
		var index = this.selectedIndex;

	
		switch(keyCode) {

			case this.keyMgr.UP:
				index--;
				break;

			case this.keyMgr.DOWN:
				index++;
				break;

			case this.keyMgr.ESC:
				this.hide();
				return;

			case this.keyMgr.ENTER:
				if (-1 != index) {
					var entryValue = this.dataMgr.getEntryKey(index);
					this.userSelectedValue = entryValue;
					window.console && console.log(entryValue);
					this.setTextboxValue(entryValue);
				}
				this.dispatchEvent(this.EVENT.ENTER);
				this.enterKeyEventHandler();
				return;

			default:
				return;
		}

		if (!this._autocompletePanel.isVisible()) {
			/*自动完成的容器未开启时不交换selectedIndex*/
			this.show();
			index = this.selectedIndex;
		}

		index = this.fixSelectedIndex(index);
		this.entryChangeHandler(this.selectedIndex, index);
		var instance = this;

		if (-1 != index) {
			var entryValue = instance.dataMgr.getEntryKey(index);
			instance.userSelectedValue = entryValue;
			instance.setTextboxValue(entryValue);
		}
		
	},

	/**
	 * 自定义事件的派遣函数，自动完成的自定义事件统一由它来执行
	 * @param {string} eventType为自定义事件的类型
	 * @return void
	 */
	dispatchEvent: function(eventType, eventArgs) {
		eventArgs = eventArgs || { 
			selectedIndex: this.selectedIndex, 
			dataSource: this.dataMgr.dataSource,
			inputValue: this.userInputValue
		};
		CustEvent.fireEvent(this, eventType, eventArgs);
	},

	/**
	 * 默认键盘事件的处理函数
	 * @param {event} e 至于为何不传keyCode，考虑到比较容易扩展此函数因此传入事件对象
	 * @private
	 * @return void
	 */
	queryKeyEventHandler: function(e) {
		var keyCode = window.event ? event.keyCode : e.which;
		if (!this.keyMgr.availableKeyCode(keyCode)) return;
		this.userInputValue = this.getTextboxValue();
		//this.dispatchEvent(this.EVENT.INPUT);
	},

	/**
	 * 设置数据源，复原selectedIndex，并显示自动完成的容器
	 * @param {array} dataSource 按照AutocompleteDataMgr提供的接口提供数据集
	 * @return void
	 */
	showDataSource: function(dataSource) {
		this.hide();
		this.setDataSource(dataSource);
		this.resetSelectedIndex();
		this.show();
	},

	/**
	 * 重置selecedIndex
	 * @return void
	 */
	resetSelectedIndex: function() {
		this.selectedIndex = -1;
	},

	/**
	 * 修正selectedIndex属性，如果大于总条目数则为-1，如果小于-1，则selectedIndex为datasource长度-1
	 * @param {number} index 索引下标
	 * @return void
	 */
	fixSelectedIndex: function(index) {
		if (index >= this.dataMgr.getDataLength()) index = -1;
		if (index < -1) index = this.dataMgr.getDataLength()-1;
		return index;
	},

	/**
	 * 当用户选择条目发生改变时，改变容器的className
	 * @param {number} beforeIndex 改变前的索引
	 * @param {number} afterindex 改变后的索引
	 * @return void
	 */
	entryChangeHandler: function(beforeIndex, afterIndex) {
		
		if (beforeIndex!=afterIndex) this.dispatchEvent(this.EVENT.CHANGE);
		this.dataMgr.replaceClassName(beforeIndex, afterIndex);
		if (-1===afterIndex && this.userInputValue) this.setTextboxValue(this.userInputValue);
		this.selectedIndex = afterIndex;
	},

	/**
	 * 当选中某个（点击或者按回车）的处理函数，默认无论是键盘的回车还是鼠标的选择都会触发EVENT.SELECT事件
	 * @return void
	 */
	enterKeyEventHandler: function() {
		this.dispatchEvent(this.EVENT.SELECT);
		this.hide();
	},

	/**
	 * 设置数据集合
	 * @param  {array} dataSource 按照约定的即AutocompleteDataMgr约定提供的数据集
	 * @return void
	 */
	setDataSource: function(data) {
		this.dataMgr.dataSource = data||[];
	},

	/**
	 * 清空数据集合
	 * @return void
	 */
	clearDataSource: function() {
		this.dataMgr.clear();
	},

	/**
	 * 得到绑定文本框的值
	 * @return void
	 */
	getTextboxValue: function() {
		return this.listenTextbox.value;
	},

	/**
	 * 设置绑定到自动完成文本框的值
	 * @param {string} value 要设置到文本框值的字符串
	 * @return void
	 */
	setTextboxValue: function(value) {
		if (null === value) return;
		if (this.returnTextbox.createTextRange) this.returnTextbox.createTextRange().text = value;
		else this.returnTextbox.value = value;
	},

	/**
	 * 展示自动完成的popup
	 * @return void
	 */
	show: function(x, y, w, h, el) {
		
		if (!this.dataMgr.getDataLength() || !!this.disabled) return;
		this.dispatchEvent(this.EVENT.SHOW);

		this._autocompletePanel.setContent(this.dataMgr.format());
		this._autocompletePanel.show();
	},

	/**
	 * 隐藏自动完成的popup
	 * @return void
	 */
	hide: function() {
		this.dispatchEvent(this.EVENT.HIDE);
		this._autocompletePanel.hide();	
	},

	setFocus: function(nIndex){
		this.dispatchEvent(this.EVENT.CHANGE);
		this.dataMgr.replaceClassName(-1, nIndex);
		this.selectedIndex = nIndex;
	}	
};




