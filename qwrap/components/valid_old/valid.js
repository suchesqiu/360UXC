(function(){var q=window.QW,d=q.loadJs,j=q.ObjectH.mix,f=q.StringH,t=f.trim,h=f.tmpl,i=f.dbc2sbc,r=f.byteLen,n=f.evalExp,m=q.DateH.format,v=q.NodeH,u=v.g,e=v.query,c=v.getValue,l=function(x,g){return x[g]||x.getAttribute(g)||s(x,g)},o=q.DomU.create,k=q.CustEvent;var w={VERSION:"0.0.1",EVENTS:"hint,blur,pass,fail,beforecheckall,checkall,initall".split(","),validPath:q.PATH+"components/valid/",REQ_ATTR:"reqMsg",_curReqAttr:"reqMsg"};var s=function(A,C){var x=w.CheckRules;if(!x){return null}C=C.toLowerCase();A=u(A);var B=[];if(A.id){B.push("#"+A.id)}if(A.name){B.push("@"+A.name)}B=B.concat(A.className.match(/\.[\w\-]+/g)||[],(A.tagName+"").toLowerCase());for(var z=0,g=B.length;z<g;z++){var y=B[z];if((y in x)&&(C in x[y])){return x[y][C]}}return null};k.createEvents(w,w.EVENTS);j(w,{hint:function(g){w.fire(new k(g,"hint"))},blur:function(g){w.fire(new k(g,"blur"))},pass:function(g){w.fire(new k(g,"pass"))},fail:function(x,y,g){if(g){w.focusFailEl(x)}var z=new k(x,"fail");z.errMsg=y;w.fire(z)},checkAll_stamp:1,isChecking:false,checkAll:function(F,E,g){E=(E!=false);var x=new k(F,"beforecheckall");x.opts=g||{};w.fire(x);w.isChecking=true;var B=F.elements,A=[];for(var C=0,y;y=B[C++];){if(!l(y,"forceVld")&&(y.disabled||y.readOnly||!y.offsetWidth)){continue}if(!w.check(y,false,g)){A.push(y)}}var D=!A.length;var z=new k(F,"checkall");z.result=D;z.failEls=A;w.fire(z);w.isChecking=false;w.checkAll_stamp++;if(!D&&E){window.setTimeout(function(){w.check(A[0],true,g)},10)}return D},check:function(x,g,y){if(!a.required(x)||l(x,"datatype")&&!a.datatype(x)||(y&&y.myValidator&&!y.myValidator(x))){if(g){w.focusFailEl(x);w.check(x,false,y)}return false}return true},renderResult:function(y,g,z,x){if(g){w.pass(y)}else{w.fail(y,z,x)}},focusFailEl:function(g){var x=l(g,"focusEl");x=x&&u(x)||g;try{x.focus();if(!x.tagName){return}if(q.NodeW&&q.NodeW.shine4Error){q.NodeW.shine4Error(x)}x.select()}catch(y){}},initAll:function(g){if(!w._isInitialized){w._isInitialized=true;if(document.addEventListener){document.addEventListener("focus",function(B){var A=B.target;if(A&&",INPUT,SELECT,TEXTAREA,OBJECT".indexOf(","+A.tagName)>-1){w.hint(A)}},true);document.addEventListener("blur",function(B){var A=B.target;if(A&&",INPUT,SELECT,TEXTAREA,OBJECT".indexOf(","+A.tagName)>-1){w.blur(A)}},true)}else{document.attachEvent("onfocusin",function(B){var A=B.srcElement;if(A&&",INPUT,SELECT,TEXTAREA,OBJECT".indexOf(","+A.tagName)>-1){w.hint(A)}});document.attachEvent("onfocusout",function(B){var A=B.srcElement;if(A&&",INPUT,SELECT,TEXTAREA,OBJECT".indexOf(","+A.tagName)>-1){w.blur(A)}})}}var y=e(g,"input");for(var x=0;x<y.length;x++){w.initEl(y[x])}var z=new k(g,"initall");w.fire(z)},initEl:function(z){var y=l(z,"datatype");if(y=="d"||y=="daterange"){var g=z.nextSibling;if(g&&g.tagName=="IMG"){return}var x=b.getCalendarImg().cloneNode(true);x.onclick=function(A){b.pickDate(z)};z.parentNode.insertBefore(x,g)}},resetAll:function(z){var x=z.elements;for(var g=0,y;y=x[g++];){w.pass(y)}}});var p=w.Msgs={n_integer:"请输入小于{$0}的正整数。",n_format:'数字输入格式为"{$0}"。',n_upper:"输入值太大，最大允许<strong>{$0}</strong>。",n_lower:"输入值太小，最小允许<strong>{$0}</strong>。",nrange_from:"您输入的范围不合理。",nrange_to:"您输入的范围不合理。",n_useless_zero:'数字前面好像有多余的"0"。',d_format:'日期输入格式为"YYYY-MM-DD"。',d_upper:"日期太晚，最晚允许<strong>{$0}</strong>。",d_lower:"日期太早，最早允许<strong>{$0}</strong>。",daterange_from:"起始日期不能大于截止日期。",daterange_to:"截止日期不能小于起始日期。",daterange_larger_span:"时间跨度不得超过<strong>{$0}</strong>天。",text_longer:"字数太多，最多允许<strong>{$0}</strong>字。",text_shorter:"字数太少，最少允许<strong>{$0}</strong>字。",bytetext_longer:"字数太多，最多允许<strong>{$0}</strong>字节。",bytetext_shorter:"字数太少，最少允许<strong>{$0}</strong>字节。",richtext_longer:"字数太多，最多允许<strong>{$0}</strong>字。",richtext_shorter:"字数太少，最少允许<strong>{$0}</strong>字。",_reconfirm:"两次输入不一致。",_time:"请检查您输入的时间格式。",_minute:"请检查您输入的时间格式。",_email:"请检查您输入的Email格式。",_mobilecode:"请检查您输入的手机号码。",_phone:"请检查您输入的电话号码。",_phonewithext:"请检查您输入的电话号码。",_phonezone:"请检查您输入的电话区号。",_phonecode:"请检查您输入的电话号码。",_phoneext:"请检查您输入的电话分机号码。",_zipcode:"请检查您输入的邮政编码。",_idnumber:"请检查您输入的身份证号码，目前只支持15位或者18位。",_bankcard:"请检查您输入的银行账号。",_cnname:"请检查您输入的姓名。",_vcode:"请检查您输入的验证码。",_imgfile:"请检查您选择的图片文件路径，只支持jpg、jpeg、png、gif、tif、bmp格式。",_regexp:"请检查您的输入。",_magic:"请检查您的输入。",_req_text:"请填写{$0}。",_req_select:"请选择{$0}。",_req_file:"请上传{$0}。",_logicrequired:"{$0}输入不完整.",getMsg:function(g,x){return l(g,x)||l(g,"errmsg")||p[x]||x}};var b=w.Utils={getCalendarImg:(function(){var g=null;return function(){return g=g||o('<img src="'+w.validPath+'assets/Calendar.gif" align="absMiddle" class="calendar-hdl-img" style="cursor:pointer">')}}()),pickDate:function(x){if(q.Calendar){q.Calendar.pickDate(x)}else{var g=w.validPath+"calendar.js?v={version}";d(g,function(){q.Calendar.pickDate(x)})}},setTextValue:function(g,x){if(g.createTextRange){g.createTextRange().text=x}else{g.value=x}},trimTextValue:function(x){var g=t(x.value);if(g!=x.value){b.setTextValue(x,g)}},dbc2sbcValue:function(x){var g=i(c(x));if(g!=c(x)){b.setTextValue(x,g)}},prepare4Vld:function(g){if(l(g,"ignoredbc")){b.dbc2sbcValue(g)}if(g.type=="text"||g.type=="textarea"){b.trimTextValue(g)}}};var a=w.Validators={};j(a,[{required:function(x,D){b.prepare4Vld(x);var E=w._curReqAttr||w.REQ_ATTR;var C=l(x,E);if(C){var g=l(x,"reqlogic");if(g){return a.logicrequired(x,D,g)}else{var B=false;var A="_req_text";if(x.tagName=="SELECT"){B=(x.value!="");A="_req_select"}else{if(x.type=="checkbox"||x.type=="radio"){var y=document.getElementsByName(x.name);for(var z=0;z<y.length;z++){if(B=y[z].checked){break}}A="_req_select"}else{B=(c(x)!="");if(x.type=="file"){A="_req_file"}}}if(D!=false){w.renderResult(x,B,!B&&C.indexOf(" ")==0?C.substr(1):h(p[A],[C]))}return B}}return true},datatype:function(y,B,x){x=x||l(y,"datatype");if(!x){w.pass(y,B);return true}var z=x.split("-")[0].toLowerCase(),A=x.substr(z.length+1),g=a[z];if(!g){throw"Unknown datatype: "+x}return A?g(y,B,A):g(y,B)},n:function(x,F,E){b.prepare4Vld(x);b.dbc2sbcValue(x);var y=c(x);var C=(y=="");var z=null;if(!C){var G=(E||l(x,"n-pattern")||"10").split(".");var D=G[0]|0||10,B=G[1]|0;if(B<1){if((/\D/).test(y)||y.length>D){z=h(p.getMsg(x,"n_integer"),[1+new Array(D+1).join("0")])}}else{var H="^\\d{1,100}(\\.\\d{1,"+B+"})?$";if(!(new RegExp(H)).test(y)){z=h(p.getMsg(x,"n_format"),[(new Array(D-B+1)).join("X")+"."+(new Array(B+1)).join("X")])}}if((/^0\d/).test(y)){z=p.getMsg(x,"n_useless_zero")}if(!z){var g=l(x,"maxValue")||Math.pow(10,D-B)-Math.pow(10,-B);if(g&&(parseFloat(y,10)>g-0)){z=h(p.getMsg(x,"n_upper"),[g,y])}var A=l(x,"minValue");if(A&&parseFloat(y,10)<A-0){z=h(p.getMsg(x,"n_lower"),[A,y])}}if(z){C=false}else{C=true}}if(F!=false){w.renderResult(x,C,z)}return C},nrange:function(g,E,D){var A=a.n(g,E,D);if(A){var z=u(l(g,"fromNEl"));var x=u(l(g,"toNEl"));if(z){x=g}else{if(x){z=g}else{var y=g.parentNode.getElementsByTagName("input");if(y[0]==g){z=g;x=y[1]}else{z=y[0];x=g}}}var B=g==z?x:z;var C=a.n(B,E,D);if(C){if(c(B)&&c(g)){if(c(z)*1>c(x)*1){A=false;if(g==z){w.fail(z,p.getMsg(z,"nrange_from"))}if(g==x){w.fail(x,p.getMsg(x,"nrange_to"))}}}}}return A},d:function(x,E){b.prepare4Vld(x);b.dbc2sbcValue(x);var y=c(x);var D=(y=="");var z=null;if(!D){y=y.replace(/(^\D+)|(\D+$)/g,"").replace(/\D+/g,"/");if(!(/\D/).test(y)){if(y.length==8){y=y.substr(0,4)+"/"+y.substr(4,2)+"/"+y.substr(6,2)}}var B=new Date(y);if(!isNaN(B)){var A=y.split(/\D+/ig);if(A.length==3&&A[0].length==4&&A[2].length<3){D=true;if(m(B)!=c(x)){b.setTextValue(x,m(B));y=c(x)}}}if(!D){z=p.getMsg(x,"d_format")}else{var g=l(x,"maxValue")||"2049-12-31";if(B>new Date(g.replace(/\D+/g,"/"))){D=false;z=h(p.getMsg(x,"d_upper"),[g,y])}var C=l(x,"minValue")||"1900-01-01";if(B<new Date(C.replace(/\D+/g,"/"))){D=false;z=h(p.getMsg(x,"d_lower"),[C,y])}}}if(E!=false){w.renderResult(x,D,z)}return D},daterange:function(g,E){var y=a.d(g,E);if(y){var D=u(l(g,"fromDateEl"));var B=u(l(g,"toDateEl"));if(D){B=g}else{if(B){D=g}else{var x=g.parentNode.getElementsByTagName("input");if(x[0]==g){D=g;B=x[1]}else{D=x[0];B=g}}}var z=g==D?B:D;var C=a.d(z,E);if(C){if(c(z)&&c(g)){if(c(D)>c(B)){y=false;if(g==D){w.fail(D,p.getMsg(D,"daterange_from"))}if(g==B){w.fail(B,p.getMsg(B,"daterange_to"))}}if(c(D)&&c(B)){var A=l(D,"maxDateSpan")||l(B,"maxDateSpan");if(A&&(new Date(c(B).replace(/-/g,"/"))-new Date(c(D).replace(/-/g,"/")))>(A-1)*24*3600000){w.fail(g,h(p.getMsg(g,"daterange_larger_span"),[A]));y=false}}}}}return y},_checkLength:function(x,F,E,D){b.prepare4Vld(x);var z=c(x);var C=(z=="");var A=null;if(!C){var B=(Math.max(x.maxLength,0)||x.getAttribute("maxLength")||s(x,"maxLength")||1024)|0;var y=l(x,"minLength")|0;var g=E(x);if(g>B){A=h(p.getMsg(x,"text_longer")||p[D+"_longer"],[B,g])}else{if(g<y){A=h(p.getMsg(x,"text_shorter")||p[D+"_shorter"],[y,g])}else{C=true}}}if(F!=false){w.renderResult(x,C,A)}return C},text:function(g,x){return a._checkLength(g||this,x,function(y){return c(y).length},"text")},bytetext:function(g,x){return a._checkLength(g||this,x,function(y){return r(c(y))},"text")},richtext:function(g,x){return a._checkLength(g||this,x,function(y){var z=c(y);if(l(y,"ignoreTag")){return z.replace(/<img[^>]*>/g,"a").replace(/<[^>]*>/g,"").length}else{return z.length}},"richtext")},idnumber:function(y,C){b.prepare4Vld(y);b.dbc2sbcValue(y);var z=c(y);var B=(z=="");if(!B){if((/^\d{15}$/).test(z)){B=true}else{if((/^\d{17}[0-9xX]$/).test(z)){var D="1,0,x,9,8,7,6,5,4,3,2".split(","),g="7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2".split(","),E=z.toLowerCase().split(""),x=0;for(var A=0;A<17;A++){x+=g[A]*E[A]}B=(D[x%11]==E[17])}}}if(C!=false){w.renderResult(y,B,!B&&p.getMsg(y,"_idnumber"))}return B},cnname:function(x,z){b.prepare4Vld(x);var y=c(x);var g=(y=="");if(!g){g=r(y)<=32&&/^[\u4e00-\u9fa5a-zA-Z.\u3002\u2022]{2,32}$/.test(y)}if(z!=false){w.renderResult(x,g,!g&&p.getMsg(x,"_cnname"))}return g},reconfirm:function(x,z){b.prepare4Vld(x);var y=u(l(x,"reconfirmFor"));var g=(c(x)==c(y));if(z!=false){w.renderResult(x,g,!g&&p.getMsg(x,"_reconfirm"))}return g},imgfile:function(y,A){var z=c(y);var g=(z=="");if(!g){var x=z.substring(z.lastIndexOf(".")+1);g=(/^(jpg|jpeg|png|gif|tif|bmp)$/i).test(x)}if(A!=false){w.renderResult(y,g,!g&&p.getMsg(y,"_imgfile"))}return g},reg:function(y,C,z,B,x){if(x){b.dbc2sbcValue(y)}b.prepare4Vld(y);var A=c(y);var g=(A=="");if(!g){B=B||"_regexp";z=z||l(y,"reg-pattern");if("string"==typeof z){z.replace(/^\/(.*)\/([ig]*)$/g,function(E,D,F){z=new RegExp(D,F||"")})}g=z.test(A)}if(C!=false){w.renderResult(y,g,!g&&p.getMsg(y,B))}return g},magic:function(y,B,A){b.prepare4Vld(y);A=A||l(y,"magic-pattern");var x=(c(y)==""||!A);if(!x){var z={el:y,Validators:a};var g=A.replace(/(\w+)/ig,'opts.Validators.datatype(opts.el,false,"$1")');x=n(g,z)}if(B!=false){w.renderResult(y,x,!x&&p.getMsg(y,"_magic"))}return x},uv:function(g,x){if(g.onblur&&!g.onblur()){return false}return true},notempty:function(g){b.prepare4Vld(g);return !!c(g)},logicrequired:function(z,D,y){z=z||this;y=y||l(z,"reqlogic");var B=w._curReqAttr||w.REQATTR,C=l(z,B),A={el:z,Validators:a},x=y.replace(/\$([\w\-]+)/ig,'opts.Validators.notempty(g("$1"))').replace(/this/ig,"opts.Validators.notempty(opts.el)");var g=n(x,A);if(D!=false){w.renderResult(z,g,!g&&C.indexOf(" ")==0?C.substr(1):h(p._logicrequired,[C]))}return !!g}},{time:function(g,x){return a.reg(g,x,/^(([0-1]\d)|(2[0-3])):[0-5]\d:[0-5]\d$/,"_time",true)},minute:function(g,x){return a.reg(g,x,/^(([0-1]\d)|(2[0-3])):[0-5]\d$/,"_minute",true)},email:function(g,x){return a.reg(g||this,x,/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,"_email",true)},mobilecode:function(g,x){return a.reg(g||this,x,/^(13|15|18|14)\d{9}$/,"_mobilecode",true)},phone:function(g,x){return a.reg(g||this,x,/^0(10|2\d|[3-9]\d\d)[1-9]\d{6,7}$/,"_phone",true)},phonewithext:function(g,x){return a.reg(g||this,x,/^0(10|2\d|[3-9]\d\d)[1-9]\d{6,7}(-\d{1,7})?$/,"_phonewithext",true)},phonezone:function(g,x){return a.reg(g||this,x,/^0(10|2\d|[3-9]\d\d)$/,"_phonezone",true)},phonecode:function(g,x){return a.reg(g||this,x,/^[1-9]\d{6,7}$/,"_phonecode",true)},phoneext:function(g,x){return a.reg(g||this,x,/^\d{1,6}$/,"_phoneext",true)},zipcode:function(g,x){return a.reg(g||this,x,/^\d{6}$/,"_zipcode",true)},vcode:function(g,x){return a.reg(g||this,x,/^\w{4}$/,"_vcode",true)}}]);q.provide("Valid",w)}());(function(){var m=QW.Valid,a=m.Validators,k=QW.NodeH,h=k.g,c=function(o,g){return o.getAttribute(g)},i=k.addClass,n=k.removeClass,j=k.replaceClass,l=k.show,f=k.hide,d=k.getValue,b=function(g,q){q=q||{};var p=document.createElement(g);for(var o in q){p[o]=q[o]}return p};m._getHintEl=function(o){var g=c(o,"hintEl");return g&&h(g)};m._getPlaceHolderEl=function(o){var g=c(o,"placeHolderEl");return g&&h(g)};m._getEmEl=function(r){var q=c(r,"emEl");if(q){return h(q)}var g=[r,r.parentNode];for(var p=0;p<2;p++){var s=g[p];for(var o=0;o<5;o++){s=s.nextSibling;if(!s){break}if(s.tagName=="EM"){return s}}}return null};m._getErrEmEl=function(o,p){var g=o.nextSibling;if(g){if(g.tagName=="EM"||!g.tagName&&(g=g.nextSibling)&&g.tagName=="EM"){return g}}if(!p){return null}g=b("em",{className:"error"});o.parentNode.insertBefore(g,o.nextSibling);return g};m.onhint=function(p){var o=p.target;if(!o||"INPUT,TEXTAREA,SELECT,BUTTON,OBJECT".indexOf(o.tagName)==-1){return}var g=m._getHintEl(o),q=m._getPlaceHolderEl(o);g&&j(g,"hint-dark","hint");if(q){clearTimeout(o.__placeholderTimer||0);i(q,"placeholder-dark")}if(!a.required(o,false)&&!d(o)){return}if(!a.datatype(o,false)){a.datatype(o,true)}};m.onblur=function(p){var o=p.target;if(!o||"INPUT,TEXTAREA,SELECT,BUTTON,OBJECT".indexOf(o.tagName)==-1){return}var g=m._getHintEl(o),q=m._getPlaceHolderEl(o);g&&j(g,"hint","hint-dark");a.datatype(o,true);if(q){(d(o)?i:n)(q,"placeholder-dark");clearTimeout(o.__placeholderTimer||0);o.__placeholderTimer=setTimeout(function(){(d(o)?i:n)(q,"placeholder-dark")},600)}};m.onpass=function(q){var p=q.target,o=m._getEmEl(p);n(p,"error");if(o){if((o.__vld_fail_stamp|0)!=m.checkAll_stamp){l(o);var g=m._getErrEmEl(o);g&&f(g)}}};m.onfail=function(r){var p=r.target,q=r.errMsg;i(p,"error");p.__vld_errMsg=q;var o=m._getEmEl(p);if(o){if((o.__vld_fail_stamp|0)!=m.checkAll_stamp){f(o);var g=m._getErrEmEl(o,true);g.innerHTML=q;l(g)}if(m.isChecking){o.__vld_fail_stamp=m.checkAll_stamp}}};var e=10000;m.oninitall=function(g){setTimeout(function(){if("placeholder" in document.createElement("input")){return}QW.NodeW("input,textarea",g.target).forEach(function(p){var q=c(p,"placeholder"),r=m._getPlaceHolderEl(p);if(q&&!r){var o="placeHolder-"+e++;r=b("span",{id:o,innerHTML:q,className:"placeholder"});r.onclick=function(){try{p.focus()}catch(s){}};p.parentNode.insertBefore(r,p);p.setAttribute("placeHolderEl",o)}if(r){if((d(p)||"").trim()||p==document.activeElement){i(r,"placeholder-dark")}else{n(r,"placeholder-dark")}}})},10)};m.bindPhoneEls=function(t){var r=["phonezone","phonecode","phoneext","mobilecode"],s=[4,8,4,11],g=[" 请输入电话区号。"," 请输入电话号码。",""," 电话号码与手机至少填写一项。"],o=t.reqMsgs||g,q=t.ids;for(var p=0;p<q.length;p++){QW.NodeW.g(q[p]).attr("reqMsg",o[p]||g[p]).attr("dataType",r[p]).set("maxLength",s[p])}h(q[0]).setAttribute("reqlogic","(!$"+q[1]+" && !$"+q[2]+") || $"+q[0]);h(q[1]).setAttribute("reqlogic","(!$"+q[0]+" && !$"+q[2]+") || $"+q[1]);if(q.length==4){h(q[3]).setAttribute("reqlogic","$"+q[0]+" || $"+q[1]+"|| $"+q[2]+"|| $"+q[3])}};QW.DomU.ready(function(){m.initAll()})}());