(function(e){!window.UXC&&(window.UXC={log:function(){}});window.Tab=UXC.Tab=f;function f(b,a){b&&(b=e(b));a&&(a=e(a));if(f.inited(b)){return f.inited(b)}this._model=new g(b,a);this._view=new h(this._model);UXC.log("initing tab");this._init()}f.autoInit=true;f.inited=function(c,b){var a;c&&(c=e(c)).length&&(typeof b!="undefined"&&c.data("TabInited",b),a=c.data("TabInited"));return a};f.prototype={_init:function(){f.inited(this._model.layout(),this);return this}};function g(b,a){this._layout=b;this._triggerTarget=a;this._init()}g.prototype={_init:function(){return this},layout:function(){return this._layout},triggerTarget:function(){return this._triggerTarget}};function h(a){this._model=a;this._init()}h.prototype={_init:function(){return this}};e(document).delegate(".js_autoTab","click",function(c){if(!f.autoInit){return}var d=e(this),b,a=c.target||c.srcElement;if(f.inited(d)){return}a&&(a=e(a));UXC.log(new Date().getTime(),a.prop("nodeName"));b=new f(d,a)})}(jQuery));