Suggest.Data=function(a){Suggest._argValid(a,"object",arguments.callee);this._config={dataUrl:null,dataType:"ScriptCallBack",dataCallBack:Suggest.O,dataHandler:Suggest.O,dataCapacity:-1,callback:"callback",keyword:"keyword"};this._prop={key:"",index:-1,originalIndex:-1,cache:null,data:[]};QW.ObjectH.mix(this._config,a,true);return this._init()};Suggest.Data._EVENT=["datachange","indexchange","overflow"];Suggest.Data._UID={};Suggest.Data.prototype={_init:function(){var a=this.get("dataType");if(this.get("dataUrl")!=""){if(a=="ScriptCallBack"){var b=this.get("dataUrl")+"&max_count="+this.get("dataCapacity");this.set("dataUrl",b)}if(a=="ScriptData"){}}return this._initCache()&&this._initEvent()},_initCache:function(){var a=new Suggest.Cache(this._config);if(!a){Suggest._debug("arg","cacheCapacity",arguments.callee);return false}this._prop.cache=this.set("cache",a);return true},_initEvent:function(){return QW.CustEvent.createEvents(this,Suggest.Data._EVENT)},_dispatch:function(b){if(!QW.ArrayH.contains(Suggest.Data._EVENT,b)){Suggest._debug("arg",'event type "'+b.toString()+'" not exist',this);return false}var a=new QW.CustEvent(this,b);a.suggestData=this;this.fire(a)},query:function(a,b){if(!Suggest._argValid(a,"string",arguments.callee)){return false}this._prop.key=a;if(this._prop.cache.hasCache(a)){this._read(this._prop.cache.getCache(a));if(b){b.apply(this)}return true}else{return this._request(this.get("dataCallback"))}},_request:function(e){var d=0;do{d=(Math.random()*100000000).toFixed(0)}while(Suggest.Data._UID[d]!==window.undefined);Suggest.Data._UID[d]="";if(this.get("dataType")=="ScriptCallBack"){var c=document.getElementsByTagName("head")[0];var b=document.createElement("script");var a=false;b.src=this.get("dataUrl")+"&"+this._config.keyword+"="+window.encodeURIComponent(QW.StringH.trim(this._prop.key))+"&"+this._config.callback+"=_SuggestCallBack"+d;window["_SuggestCallBack"+d]=this._scriptCallbackHandler(this._prop.key);if(Suggest._argValid(e,"function",arguments.callee)){b.onload=b.onreadystatechange=function(){if(!a&&(!this.readyState||this.readyState=="loaded"||this.readyState=="complete")){a=true;e()}}}c.appendChild(b);return true}},_scriptCallbackHandler:function(c){var a=this;var b=this.get("dataHandler");return function(d){b(c,d,a)}},_read:function(a){if(a.length!==undefined){this._prop.data=a;this._dispatch("datachange");return true}else{Suggest._debug("arg","aDataSource must be an array",a);return false}},set:function(b,a){this._config[b]=a;return a},get:function(a){return this._config[a]},setCurrent:function(a){if(!Suggest._argValid(a,"number",arguments.callee)){return false}if(a>this.getLength()){Suggest._debug("arg","index setted is larger than the length of data",arguments.callee);return false}this._prop.originalIndex=this._prop.index;this._prop.index=a;this._dispatch("indexchange");return true},getData:function(){return this._prop.data},getOriginalIndex:function(){return this._prop.originalIndex},getIndex:function(){return this._prop.index},getItem:function(a){if(!Suggest._argValid(a,"number",arguments.callee)){return false}if(a>this.getLength()-1){return false}return this._prop.data[a]},getLength:function(){return this._prop.data.length},increase:function(b,c){var a=this.get("dataUrl");a.replace(/&max_count=([^&]*)/gi,function(e,d){return"&max_count="+(parseInt(d,10)+b)});return this._request(c)}};