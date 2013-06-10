(function(){var q=QW.NodeH,l=QW.ObjectH.mix,i=QW.ObjectH.isObject,a=l,p=q.g,j=q.getCurrentStyle,b=q.setStyle,m=QW.DomU.isElement,o=QW.ArrayH.forEach,t=QW.ArrayH.map,u=QW.Anim,s=q.show,k=q.hide,n=q.isVisible;var r=function(v,w,g){this.el=v;this.attr=g;if(!i(w)){w={to:w}}l(this,w)};l(r.prototype,{getValue:function(){return j(this.el,this.attr)},setValue:function(g){if(this.unit){b(this.el,this.attr,g+this.unit)}else{b(this.el,this.attr,g)}},getUnit:function(){if(this.unit){return this.unit}var v=this.getValue();if(v){var g=v.toString().replace(/^[+-]?[\d\.]+/g,"");if(g&&g!=v){return g}}return""},init:function(){var w,v,g;if(null!=this.from){w=parseFloat(this.from)}else{w=parseFloat(this.getValue())||0}v=parseFloat(this.to);g=this.by!=null?parseFloat(this.by):(v-w);this.from=w;this.by=g;this.unit=this.getUnit()},action:function(g){var v;if(typeof this.end!="undefined"&&g>=1){v=this.end}else{v=this.from+this.by*this.easing(g);v=parseFloat(v.toFixed(6))}this.setValue(v)}});var d=function(w,x,g){var v=new r(w,x,g);a(this,v)};d.MENTOR_CLASS=r;l(d.prototype,{getValue:function(){return this.el[this.attr]|0},setValue:function(g){this.el[this.attr]=Math.round(g)}},true);var e=function(w,x,g){var v=new r(w,x,g);a(this,v)};e.MENTOR_CLASS=r;l(e.prototype,{parseColor:function(v){var g={rgb:/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,hex:/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,hex3:/^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i};if(v.length==3){return v}var w=g.hex.exec(v);if(w&&w.length==4){return[parseInt(w[1],16),parseInt(w[2],16),parseInt(w[3],16)]}w=g.rgb.exec(v);if(w&&w.length==4){return[parseInt(w[1],10),parseInt(w[2],10),parseInt(w[3],10)]}w=g.hex3.exec(v);if(w&&w.length==4){return[parseInt(w[1]+w[1],16),parseInt(w[2]+w[2],16),parseInt(w[3]+w[3],16)]}return[0,0,0]},init:function(){var x,w,v;var g=this.parseColor;if(null!=this.from){x=this.from}else{x=this.getValue()}x=g(x);w=this.to||[0,0,0];w=g(w);v=this.by?g(this.by):t(w,function(z,y){return z-x[y]});this.from=x;this.to=w;this.by=v;this.unit=""},getValue:function(){var g=j(this.el,this.attr);return this.parseColor(g)},setValue:function(g){if(typeof g=="string"){b(this.el,this.attr,g)}else{b(this.el,this.attr,"rgb("+g.join(",")+")")}},action:function(g){var v=this,w;if(typeof this.end!="undefined"&&g>=1){w=this.end}else{w=this.from.map(function(y,x){return Math.max(Math.floor(y+v.by[x]*v.easing(g)),0)})}this.setValue(w)}},true);var h={"color$":e,"^scroll":d,".*":r};function c(x,v){for(var g in x){var w=new RegExp(g,"i");if(w.test(v)){return x[g]}}return null}var f=function(x,E,v,D){x=p(x);if(!m(x)){throw new Error(["Animation","Initialize Error","Element Not Found!"])}v=v||f.DefaultEasing;D=typeof D==="function"?D:f.DefaultEasing;var g=[],B=[];for(var C in E){if(typeof E[C]=="string"&&f.agentHooks[E[C]]){var A=f.agentHooks[E[C]](C,x);if(A.callback){B.push(A.callback);delete A.callback}E[C]=A}var w=c(h,C),z=new w(x,E[C],C);if(!z){continue}z.init();z.easing=z.easing||D;g.push(z)}var y=new u(function(F){o(g,function(G){G.action(F)})},v);o(B,function(F){y.on("end",F)});a(this,y)};f.MENTOR_CLASS=u;f.DefaultEasing=function(g){return g};f.DefaultDur=500;f.Sequence=false;f.agentHooks=(function(){return{show:function(g,v){var x=0,w=v["__anim"+g];if(!n(v)){s(v);w=(typeof w=="undefined")?j(v,g):w;b(v,g,0)}else{x=j(v,g);w=(typeof w=="undefined")?j(v,g):w}return{from:x,to:w}},hide:function(g,x){var z=j(x,g),w="__anim"+g,v=x[w];if(typeof v=="undefined"){if(!n(x)){s(x);v=j(x,g);k(x)}else{v=z}x[w]=v}var y=function(){k(x);b(x,g,x[w])};return{from:z,to:0,callback:y}},toggle:function(g,v){if(!n(v)){return f.agentHooks.show.apply(this,arguments)}else{return f.agentHooks.hide.apply(this,arguments)}}}})();QW.provide({ElAnim:f,ScrollAnim:f,ColorAnim:f})}());