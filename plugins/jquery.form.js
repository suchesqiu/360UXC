/*!
 * jQuery Form Plugin
 * version: 3.36.0-2013.06.16
 * @requires jQuery v1.5 or later
 * Copyright (c) 2013 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */
;(function(d){var a={};a.fileapi=d("<input type='file'/>").get(0).files!==undefined;a.formdata=window.FormData!==undefined;var c=!!d.fn.prop;d.fn.attr2=function(){if(!c){return this.attr.apply(this,arguments)}var g=this.prop.apply(this,arguments);if((g&&g.jquery)||typeof g==="string"){return g}return this.attr.apply(this,arguments)};d.fn.ajaxSubmit=function(i){if(!this.length){b("ajaxSubmit: skipping submit process - no element selected");return this}var h,r,k,m=this;if(typeof i=="function"){i={success:i}}h=i.type||this.attr2("method");r=i.url||this.attr2("action");k=(typeof r==="string")?d.trim(r):"";k=k||window.location.href||"";if(k){k=(k.match(/^([^#]+)/)||[])[1]}i=d.extend(true,{url:k,success:d.ajaxSettings.success,type:h||"GET",iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},i);var x={};this.trigger("form-pre-serialize",[this,i,x]);if(x.veto){b("ajaxSubmit: submit vetoed via form-pre-serialize trigger");return this}if(i.beforeSerialize&&i.beforeSerialize(this,i)===false){b("ajaxSubmit: submit aborted via beforeSerialize callback");return this}var l=i.traditional;if(l===undefined){l=d.ajaxSettings.traditional}var u=[];var v,y=this.formToArray(i.semantic,u);if(i.data){i.extraData=i.data;v=d.param(i.data,l)}if(i.beforeSubmit&&i.beforeSubmit(y,this,i)===false){b("ajaxSubmit: submit aborted via beforeSubmit callback");return this}this.trigger("form-submit-validate",[y,this,i,x]);if(x.veto){b("ajaxSubmit: submit vetoed via form-submit-validate trigger");return this}var E=d.param(y,l);if(v){E=(E?(E+"&"+v):v)}if(i.type.toUpperCase()=="GET"){i.url+=(i.url.indexOf("?")>=0?"&":"?")+E;i.data=null}else{i.data=E}var B=[];if(i.resetForm){B.push(function(){m.resetForm()})}if(i.clearForm){B.push(function(){m.clearForm(i.includeHidden)})}if(!i.dataType&&i.target){var j=i.success||function(){};B.push(function(H){var q=i.replaceTarget?"replaceWith":"html";d(i.target)[q](H).each(j,arguments)})}else{if(i.success){B.push(i.success)}}i.success=function(L,H,q){var J=i.context||this;for(var I=0,K=B.length;I<K;I++){B[I].apply(J,[L,H,q||m,m])}};if(i.error){var F=i.error;i.error=function(J,q,H){var I=i.context||this;F.apply(I,[J,q,H,m])}}if(i.complete){var g=i.complete;i.complete=function(I,q){var H=i.context||this;g.apply(H,[I,q,m])}}var t=d('input[type=file]:enabled[value!=""]',this);var n=t.length>0;var p="multipart/form-data";var D=(m.attr("enctype")==p||m.attr("encoding")==p);var C=a.fileapi&&a.formdata;b("fileAPI :"+C);var s=(n||D)&&!C;var z;if(i.iframe!==false&&(i.iframe||s)){if(i.closeKeepAlive){d.get(i.closeKeepAlive,function(){z=A(y)})}else{z=A(y)}}else{if((n||D)&&C){z=w(y)}else{z=d.ajax(i)}}m.removeData("jqxhr").data("jqxhr",z);for(var o=0;o<u.length;o++){u[o]=null}this.trigger("form-submit-notify",[this,i]);return this;function G(L){var q=d.param(L,i.traditional).split("&");var H=q.length;var J=[];var K,I;for(K=0;K<H;K++){q[K]=q[K].replace(/\+/g," ");I=q[K].split("=");J.push([decodeURIComponent(I[0]),decodeURIComponent(I[1])])}return J}function w(H){var J=new FormData();for(var I=0;I<H.length;I++){J.append(H[I].name,H[I].value)}if(i.extraData){var q=G(i.extraData);for(I=0;I<q.length;I++){if(q[I]){J.append(q[I][0],q[I][1])}}}i.data=null;var L=d.extend(true,{},d.ajaxSettings,i,{contentType:false,processData:false,cache:false,type:h||"POST"});if(i.uploadProgress){L.xhr=function(){var M=d.ajaxSettings.xhr();if(M.upload){M.upload.addEventListener("progress",function(Q){var P=0;var N=Q.loaded||Q.position;var O=Q.total;if(Q.lengthComputable){P=Math.ceil(N/O*100)}i.uploadProgress(Q,N,O,P)},false)}return M}}L.data=null;var K=L.beforeSend;L.beforeSend=function(N,M){M.data=J;if(K){K.call(this,N,M)}};return d.ajax(L)}function A(ah){var W=m[0],U,ab,V,af,ac,q,L,I,J,ae,ad,R;var K=d.Deferred();if(ah){for(ab=0;ab<u.length;ab++){U=d(u[ab]);if(c){U.prop("disabled",false)}else{U.removeAttr("disabled")}}}V=d.extend(true,{},d.ajaxSettings,i);V.context=V.context||V;ac="jqFormIO"+(new Date().getTime());if(V.iframeTarget){q=d(V.iframeTarget);ae=q.attr2("name");if(!ae){q.attr2("name",ac)}else{ac=ae}}else{q=d('<iframe name="'+ac+'" src="'+V.iframeSrc+'" />');q.css({position:"absolute",top:"-1000px",left:"-1000px"})}L=q[0];I={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(H){var ai=(H==="timeout"?"timeout":"aborted");b("aborting upload... "+ai);this.aborted=1;try{if(L.contentWindow.document.execCommand){L.contentWindow.document.execCommand("Stop")}}catch(aj){}q.attr("src",V.iframeSrc);I.error=ai;if(V.error){V.error.call(V.context,I,ai,H)}if(af){d.event.trigger("ajaxError",[I,V,ai])}if(V.complete){V.complete.call(V.context,I,ai)}}};af=V.global;if(af&&0===d.active++){d.event.trigger("ajaxStart")}if(af){d.event.trigger("ajaxSend",[I,V])}if(V.beforeSend&&V.beforeSend.call(V.context,I,V)===false){if(V.global){d.active--}K.reject();return K}if(I.aborted){K.reject();return K}J=W.clk;if(J){ae=J.name;if(ae&&!J.disabled){V.extraData=V.extraData||{};V.extraData[ae]=J.value;if(J.type=="image"){V.extraData[ae+".x"]=W.clk_x;V.extraData[ae+".y"]=W.clk_y}}}var T=1;var N=2;function P(aj){var ai=null;try{if(aj.contentWindow){ai=aj.contentWindow.document}}catch(H){b("cannot get iframe.contentWindow document: "+H)}if(ai){return ai}try{ai=aj.contentDocument?aj.contentDocument:aj.document}catch(H){b("cannot get iframe.contentDocument: "+H);ai=aj.document}return ai}var S=d("meta[name=csrf-token]").attr("content");var Q=d("meta[name=csrf-param]").attr("content");if(Q&&S){V.extraData=V.extraData||{};V.extraData[Q]=S}function aa(){var aj=m.attr2("target"),H=m.attr2("action");W.setAttribute("target",ac);if(!h){W.setAttribute("method","POST")}if(H!=V.url){W.setAttribute("action",V.url)}if(!V.skipEncodingOverride&&(!h||/post/i.test(h))){m.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"})}if(V.timeout){R=setTimeout(function(){ad=true;Z(T)},V.timeout)}function ak(){try{var ap=P(L).readyState;b("state = "+ap);if(ap&&ap.toLowerCase()=="uninitialized"){setTimeout(ak,50)}}catch(ao){b("Server abort: ",ao," (",ao.name,")");Z(N);if(R){clearTimeout(R)}R=undefined}}var ai=[];try{if(V.extraData){for(var an in V.extraData){if(V.extraData.hasOwnProperty(an)){if(d.isPlainObject(V.extraData[an])&&V.extraData[an].hasOwnProperty("name")&&V.extraData[an].hasOwnProperty("value")){ai.push(d('<input type="hidden" name="'+V.extraData[an].name+'">').val(V.extraData[an].value).appendTo(W)[0])}else{ai.push(d('<input type="hidden" name="'+an+'">').val(V.extraData[an]).appendTo(W)[0])}}}}if(!V.iframeTarget){q.appendTo("body");if(L.attachEvent){L.attachEvent("onload",Z)}else{L.addEventListener("load",Z,false)}}setTimeout(ak,15);try{W.submit()}catch(al){var am=document.createElement("form").submit;am.apply(W)}}finally{W.setAttribute("action",H);if(aj){W.setAttribute("target",aj)}else{m.removeAttr("target")}d(ai).remove()}}if(V.forceSync){aa()}else{setTimeout(aa,10)}var aq,ar,ag=50,Y;function Z(am){if(I.aborted||Y){return}ar=P(L);if(!ar){b("cannot access response document");am=N}if(am===T&&I){I.abort("timeout");K.reject(I,"timeout");return}else{if(am==N&&I){I.abort("server abort");K.reject(I,"error","server abort");return}}if(!ar||ar.location.href==V.iframeSrc){if(!ad){return}}if(L.detachEvent){L.detachEvent("onload",Z)}else{L.removeEventListener("load",Z,false)}var ak="success",ao;try{if(ad){throw"timeout"}var aj=V.dataType=="xml"||ar.XMLDocument||d.isXMLDoc(ar);b("isXml="+aj);if(!aj&&window.opera&&(ar.body===null||!ar.body.innerHTML)){if(--ag){b("requeing onLoad callback, DOM not available");setTimeout(Z,250);return}}var ap=ar.body?ar.body:ar.documentElement;I.responseText=ap?ap.innerHTML:null;I.responseXML=ar.XMLDocument?ar.XMLDocument:ar;if(aj){V.dataType="xml"}I.getResponseHeader=function(aw){var av={"content-type":V.dataType};return av[aw]};if(ap){I.status=Number(ap.getAttribute("status"))||I.status;I.statusText=ap.getAttribute("statusText")||I.statusText}var au=(V.dataType||"").toLowerCase();var an=/(json|script|text)/.test(au);if(an||V.textarea){var al=ar.getElementsByTagName("textarea")[0];if(al){I.responseText=al.value;I.status=Number(al.getAttribute("status"))||I.status;I.statusText=al.getAttribute("statusText")||I.statusText}else{if(an){var H=ar.getElementsByTagName("pre")[0];var at=ar.getElementsByTagName("body")[0];if(H){I.responseText=H.textContent?H.textContent:H.innerText}else{if(at){I.responseText=at.textContent?at.textContent:at.innerText}}}}}else{if(au=="xml"&&!I.responseXML&&I.responseText){I.responseXML=X(I.responseText)}}try{aq=M(I,au,V)}catch(ai){ak="parsererror";I.error=ao=(ai||ak)}}catch(ai){b("error caught: ",ai);ak="error";I.error=ao=(ai||ak)}if(I.aborted){b("upload aborted");ak=null}if(I.status){ak=(I.status>=200&&I.status<300||I.status===304)?"success":"error"}if(ak==="success"){if(V.success){V.success.call(V.context,aq,"success",I)}K.resolve(I.responseText,"success",I);if(af){d.event.trigger("ajaxSuccess",[I,V])}}else{if(ak){if(ao===undefined){ao=I.statusText}if(V.error){V.error.call(V.context,I,ak,ao)}K.reject(I,"error",ao);if(af){d.event.trigger("ajaxError",[I,V,ao])}}}if(af){d.event.trigger("ajaxComplete",[I,V])}if(af&&!--d.active){d.event.trigger("ajaxStop")}if(V.complete){V.complete.call(V.context,I,ak)}Y=true;if(V.timeout){clearTimeout(R)}setTimeout(function(){if(!V.iframeTarget){q.remove()}I.responseXML=null},100)}var X=d.parseXML||function(H,ai){if(window.ActiveXObject){ai=new ActiveXObject("Microsoft.XMLDOM");ai.async="false";ai.loadXML(H)}else{ai=(new DOMParser()).parseFromString(H,"text/xml")}return(ai&&ai.documentElement&&ai.documentElement.nodeName!="parsererror")?ai:null};var O=d.parseJSON||function(H){return window["eval"]("("+H+")")};var M=function(am,ak,aj){var ai=am.getResponseHeader("content-type")||"",H=ak==="xml"||!ak&&ai.indexOf("xml")>=0,al=H?am.responseXML:am.responseText;if(H&&al.documentElement.nodeName==="parsererror"){if(d.error){d.error("parsererror")}}if(aj&&aj.dataFilter){al=aj.dataFilter(al,ak)}if(typeof al==="string"){if(ak==="json"||!ak&&ai.indexOf("json")>=0){al=O(al)}else{if(ak==="script"||!ak&&ai.indexOf("javascript")>=0){d.globalEval(al)}}}return al};return K}};d.fn.ajaxForm=function(g){g=g||{};g.delegation=g.delegation&&d.isFunction(d.fn.on);if(!g.delegation&&this.length===0){var h={s:this.selector,c:this.context};if(!d.isReady&&h.s){b("DOM not ready, queuing ajaxForm");d(function(){d(h.s,h.c).ajaxForm(g)});return this}b("terminating; zero elements found by selector"+(d.isReady?"":" (DOM not ready)"));return this}if(g.delegation){d(document).off("submit.form-plugin",this.selector,f).off("click.form-plugin",this.selector,e).on("submit.form-plugin",this.selector,g,f).on("click.form-plugin",this.selector,g,e);return this}return this.ajaxFormUnbind().bind("submit.form-plugin",g,f).bind("click.form-plugin",g,e)};function f(h){var g=h.data;if(!h.isDefaultPrevented()){h.preventDefault();d(this).ajaxSubmit(g)}}function e(g){var l=g.target;var j=d(l);if(!(j.is("[type=submit],[type=image]"))){var i=j.closest("[type=submit]");if(i.length===0){return}l=i[0]}var k=this;k.clk=l;if(l.type=="image"){if(g.offsetX!==undefined){k.clk_x=g.offsetX;k.clk_y=g.offsetY}else{if(typeof d.fn.offset=="function"){var h=j.offset();k.clk_x=g.pageX-h.left;k.clk_y=g.pageY-h.top}else{k.clk_x=g.pageX-l.offsetLeft;k.clk_y=g.pageY-l.offsetTop}}}setTimeout(function(){k.clk=k.clk_x=k.clk_y=null},100)}d.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")};d.fn.formToArray=function(i,q){var h=[];if(this.length===0){return h}var l=this[0];var p=i?l.getElementsByTagName("*"):l.elements;if(!p){return h}var s,r,o,j,m,w,k;for(s=0,w=p.length;s<w;s++){m=p[s];o=m.name;if(!o||m.disabled){continue}if(i&&l.clk&&m.type=="image"){if(l.clk==m){h.push({name:o,value:d(m).val(),type:m.type});h.push({name:o+".x",value:l.clk_x},{name:o+".y",value:l.clk_y})}continue}j=d.fieldValue(m,true);if(j&&j.constructor==Array){if(q){q.push(m)}for(r=0,k=j.length;r<k;r++){h.push({name:o,value:j[r]})}}else{if(a.fileapi&&m.type=="file"){if(q){q.push(m)}var t=m.files;if(t.length){for(r=0;r<t.length;r++){h.push({name:o,value:t[r],type:m.type})}}else{h.push({name:o,value:"",type:m.type})}}else{if(j!==null&&typeof j!="undefined"){if(q){q.push(m)}h.push({name:o,value:j,type:m.type,required:m.required})}}}}if(!i&&l.clk){var u=d(l.clk),g=u[0];o=g.name;if(o&&!g.disabled&&g.type=="image"){h.push({name:o,value:u.val()});h.push({name:o+".x",value:l.clk_x},{name:o+".y",value:l.clk_y})}}return h};d.fn.formSerialize=function(g){return d.param(this.formToArray(g))};d.fn.fieldSerialize=function(h){var g=[];this.each(function(){var l=this.name;if(!l){return}var j=d.fieldValue(this,h);if(j&&j.constructor==Array){for(var k=0,i=j.length;k<i;k++){g.push({name:l,value:j[k]})}}else{if(j!==null&&typeof j!="undefined"){g.push({name:this.name,value:j})}}});return d.param(g)};d.fn.fieldValue=function(h){for(var g=[],k=0,i=this.length;k<i;k++){var l=this[k];var j=d.fieldValue(l,h);if(j===null||typeof j=="undefined"||(j.constructor==Array&&!j.length)){continue}if(j.constructor==Array){d.merge(g,j)}else{g.push(j)}}return g};d.fieldValue=function(r,k){var u=r.name,m=r.type,p=r.tagName.toLowerCase();if(k===undefined){k=true}if(k&&(!u||r.disabled||m=="reset"||m=="button"||(m=="checkbox"||m=="radio")&&!r.checked||(m=="submit"||m=="image")&&r.form&&r.form.clk!=r||p=="select"&&r.selectedIndex==-1)){return null}if(p=="select"){var l=r.selectedIndex;if(l<0){return null}var q=[],s=r.options;var i=(m=="select-one");var o=(i?l+1:s.length);for(var h=(i?l:0);h<o;h++){var j=s[h];if(j.selected){var g=j.value;if(!g){g=(j.attributes&&j.attributes.value&&!(j.attributes.value.specified))?j.text:j.value}if(i){return g}q.push(g)}}return q}return d(r).val()};d.fn.clearForm=function(g){return this.each(function(){d("input,select,textarea",this).clearFields(g)})};d.fn.clearFields=d.fn.clearInputs=function(g){var h=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var j=this.type,i=this.tagName.toLowerCase();if(h.test(j)||i=="textarea"){this.value=""}else{if(j=="checkbox"||j=="radio"){this.checked=false}else{if(i=="select"){this.selectedIndex=-1}else{if(j=="file"){if(/MSIE/.test(navigator.userAgent)){d(this).replaceWith(d(this).clone(true))}else{d(this).val("")}}else{if(g){if((g===true&&/hidden/.test(j))||(typeof g=="string"&&d(this).is(g))){this.value=""}}}}}}})};d.fn.resetForm=function(){return this.each(function(){if(typeof this.reset=="function"||(typeof this.reset=="object"&&!this.reset.nodeType)){this.reset()}})};d.fn.enable=function(g){if(g===undefined){g=true}return this.each(function(){this.disabled=!g})};d.fn.selected=function(g){if(g===undefined){g=true}return this.each(function(){var i=this.type;if(i=="checkbox"||i=="radio"){this.checked=g}else{if(this.tagName.toLowerCase()=="option"){var h=d(this).parent("select");if(g&&h[0]&&h[0].type=="select-one"){h.find("option").selected(false)}this.selected=g}}})};d.fn.ajaxSubmit.debug=false;function b(){if(!d.fn.ajaxSubmit.debug){return}var g="[jquery.form] "+Array.prototype.join.call(arguments,"");if(window.console&&window.console.log){window.console.log(g)}else{if(window.opera&&window.opera.postError){window.opera.postError(g)}}}})(jQuery);