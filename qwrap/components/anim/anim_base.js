(function(){var i=QW.CustEvent,g=QW.ObjectH.mix;var h=function(a,c,b){g(this,b);g(this,{animFun:a,dur:c,byStep:false,per:0,frameTime:28,_status:0});k(this,this.per);i.createEvents(this,h.EVENTS)};h.EVENTS="beforeplay,play,step,pause,resume,end,reset".split(",");function l(a){a.step();if(a.isPlaying()){a._interval=window.setInterval(function(){a.step()},a.frameTime)}}function j(a){window.clearInterval(a._interval)}function k(a,b){a.per=b;a._startDate=new Date()*1-b*a.dur;if(a.byStep){a._totalStep=a.dur/a.frameTime;a._currentStep=b*a._totalStep}}g(h.prototype,{isPlaying:function(){return this._status==1},play:function(){var a=this;if(a.isPlaying()){a.pause()}k(a,0);if(!a.fire("beforeplay")){return false}a._status=1;a.fire("play");l(a);return true},step:function(b){var a=this;if(b!=null){k(a,b)}else{if(a.byStep){b=a._currentStep++/a._totalStep}else{b=(new Date()-a._startDate)/a.dur}this.per=b}if(this.per>1){this.per=1}a.animFun(this.per);a.fire("step");if(this.per>=1){this.end();return}},end:function(){k(this,1);this.animFun(1);this._status=2;j(this);this.fire("end")},pause:function(){this._status=4;j(this);this.fire("pause")},resume:function(){k(this,this.per);this._status=1;this.fire("resume");l(this)},reset:function(){k(this,0);this.animFun(0);this.fire("reset")}});QW.provide("Anim",h)}());