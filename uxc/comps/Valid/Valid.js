(function(b){!window.UXC&&(window.UXC={log:function(){}});var a=UXC.Valid=window.Valid={check:function(g){var h=true,g=b(g),e=g.length?g.prop("nodeName").toLowerCase():"";if(g.length){if(e=="form"){for(var f=0,d=g[0].length;f<d;f++){!c.parse(b(g[0][f]))&&(h=false)}}else{h=c.parse(g)}}return h},clearError:function(d){b(d).each(function(){var h=b(this);UXC.log("clearError: "+h.prop("nodeName"));switch(h.prop("nodeName").toLowerCase()){case"form":for(var g=0,e=h[0].length;g<e;g++){var f=b(h[0][g]);if(f.is("[disabled]")){return}c.valid(f)}break;default:c.valid(b(this));break}})}};a.checkAll=a.check;b(document).delegate("input[type=text], input[type=password], textarea","blur",function(d){UXC.Valid.check(this)});b(document).delegate("select, input[type=file]","change",function(d){UXC.Valid.check(this)});var c={parse:function(d){var e=true,d=b(d);d.each(function(){if(!c.isValidItem(this)){return}var h=b(this),f=c.getDatatype(h),g=c.getSubdatatype(h);if(h.is("[disabled]")){return}UXC.log(f,g);if(h.is("[reqmsg]")){if(!c.datatype.reqmsg(h)){e=false;return}}if(!c.datatype.length(h)){e=false;return}if(f in c.datatype&&h.val()){if(!c.datatype[f](h)){e=false;return}}if(g&&g in c.subdatatype&&(h.val()||g=="alternative")){if(!c.subdatatype[g](h)){e=false;return}}c.valid(h)});return e},isValidItem:function(d){d=b(d);var f,e;d.each(function(){e=b(this);if(e.is("[datatype]")||e.is("[subdatatype]")||e.is("[minlength]")||e.is("[maxlength]")||e.is("[reqmsg]")){f=true}});return f},valid:function(d){if(!c.isValidItem(d)){return}d.removeClass("error");d.find("~ em").show();d.find("~ em.error").hide()},error:function(f,e,d){if(!c.isValidItem(f)){return}var h=c.getMsg.apply(null,[].slice.call(arguments)),g;f.addClass("error");f.find("~ em:not(.error)").hide();if(f.is("[emEl]")){(g=c.getElement(f.attr("emEl")))&&g.length&&g.addClass("error")}!(g&&g.length)&&(g=f.find("~ em.error"));if(!g.length){(g=b('<em class="error"></em>')).insertAfter(f)}UXC.log("error: "+h);g.html(h).show();return false},getElement:function(d){if(/^[\w-]+$/.test(d)){d="#"+d}return b(d)},getDatatype:function(d){return(d.attr("datatype")||"text").toLowerCase().replace(/\-.*/,"")},getSubdatatype:function(d){return(d.attr("subdatatype")||"text").toLowerCase().replace(/\-.*/,"")},getMsg:function(f,e,d){var g=f.is("[errmsg]")?" "+f.attr("errmsg"):f.is("[reqmsg]")?f.attr("reqmsg"):"";e&&(g=f.attr(e)||g);d&&g&&(g=" "+g);if(g&&!/^[\s]/.test(g)){switch(f.prop("type").toLowerCase()){case"file":g="请上传"+g;break;case"select-multiple":case"select-one":case"select":g="请选择"+g;break;case"textarea":case"password":case"text":g="请填写"+g;break}}UXC.log("_msg: "+g,f.prop("type").toLowerCase());return b.trim(g)},bytelen:function(d){return d.replace(/[^\x00-\xff]/g,"11").length},getTimestamp:function(d){d=d.replace(/[^\d]/g,"");return new Date(d.slice(0,4),parseInt(d.slice(4,6),10)-1,d.slice(6,8)).getTime()},subdatatype:{alternative:function(f){var g=true,e;UXC.log("alternative");if(f.is("[datatarget]")&&(e=b(f.attr("datatarget"))).length&&!f.val()){var d=false;e.each(function(){if(b(this).val()){d=true;return false}});g=d}!g&&c.error(f,"alternativemsg",true);!g&&e&&e.length&&e.each(function(){c.error(b(this),"alternativemsg",true)});g&&e&&e.length&&e.each(function(){c.valid(b(this))});return g},reconfirm:function(e){var f=true,d;UXC.log("reconfirm");if(e.is("[datatarget]")&&(d=b(e.attr("datatarget"))).length){d.each(function(){if(e.val()!=b(this).val()){return f=false}})}!f&&c.error(e,"reconfirmmsg",true);!f&&d.length&&d.each(function(){c.error(b(this),"reconfirmmsg",true)});f&&d.length&&d.each(function(){c.valid(b(this))});return f}},datatype:{n:function(i){var l=true,j=i.val(),e=+j,g=0,k=Math.pow(10,10),d,f,h;if(!isNaN(e)&&e>=0){i.attr("datatype").replace(/^n\-(.*)$/,function(n,m){h=m.split(".");d=h[0];f=h[1]});if(i.is("[minvalue]")){g=+i.attr("minvalue")||g}if(i.is("[maxvalue]")){k=+i.attr("maxvalue")||k}if(e>=g&&e<=k){typeof d!="undefined"&&typeof f!="undefined"&&(l=new RegExp("^(?:[\\d]{0,"+d+"}|)(?:\\.[\\d]{1,"+f+"}|)$").test(j));typeof d!="undefined"&&typeof f=="undefined"&&(l=new RegExp("^[\\d]{1,"+d+"}$").test(j));typeof d=="undefined"&&typeof f!="undefined"&&(l=new RegExp("^\\.[\\d]{1,"+f+"}$").test(j));typeof f=="undefined"&&/\./.test(j)&&(l=false)}else{l=false}UXC.log("nValid",e,typeof d,typeof f,typeof g,typeof k,g,k)}else{l=false}!l&&c.error(i);return l},d:function(f){var j=f.val().trim(),h,i=/^[\d]{4}([\/.-]|)[01][\d]\1[0-3][\d]$/;if(!j){return true}if(h=i.test(j)){var e=c.getTimestamp(f.val()),g,d;if(f.is("[minvalue]")&&(h=i.test(f.attr("minvalue")))){g=c.getTimestamp(f.attr("minvalue"));e<g&&(h=false)}if(h&&f.is("[maxvalue]")&&(h=i.test(f.attr("maxvalue")))){d=c.getTimestamp(f.attr("maxvalue"));e>d&&(h=false)}}!h&&c.error(f);return h},daterange:function(d){var i=c.datatype.d(d),g,e;if(i){if(i){var f,h;if(d.is("[fromDateEl]")){f=c.getElement(d.attr("fromDateEl"))}if(d.is("[toDateEl]")){h=c.getElement(d.attr("toDateEl"))}if(f&&f.length||h&&h.length){f&&f.length&&!(h&&h.length)&&(h=d);!(f&&f.length)&&h&&h.length&&(f=d);UXC.log("daterange",f.length,h.length);if(h[0]!=f[0]){i&&(i=c.datatype.d(h));i&&(i=c.datatype.d(f));i&&c.getTimestamp(f.val())>c.getTimestamp(h.val())&&(i=false);i&&c.valid(f);i&&c.valid(h)}}}}!i&&c.error(d);return i},time:function(d){var e=/^(([0-1]\d)|(2[0-3])):[0-5]\d:[0-5]\d$/.test(d.val());!e&&c.error(d);return e},minute:function(d){var e=/^(([0-1]\d)|(2[0-3])):[0-5]\d$/.test(d.val());!e&&c.error(d);return e},bankcard:function(d){var e=/^[1-9][\d]{3}(?: |)(?:[\d]{4}(?: |))(?:[\d]{4}(?: |))(?:[\d]{4})(?:(?: |)[\d]{3}|)$/.test(d.val());!e&&c.error(d);return e},cnname:function(d){var e=c.bytelen(d.val())<32&&/^[\u4e00-\u9fa5a-zA-Z.\u3002\u2022]{2,32}$/.test(d.val());!e&&c.error(d);return e},username:function(d){var e=/^[a-zA-Z0-9][\w-]{2,29}$/.test(d.val());!e&&c.error(d);return e},idnumber:function(d){var e=/^[0-9]{15}(?:[0-9]{2}(?:[0-9xX]|)|)$/.test(d.val());!e&&c.error(d);return e},mobilecode:function(d){var e=/^(?:13|14|15|16|18|19)\d{9}$/.test(d.val());!e&&c.error(d);return e},mobilezonecode:function(d){var e=/^(?:\+[0-9]{1,6} |)(?:0|)(?:13|14|15|16|18|19)\d{9}$/.test(d.val());!e&&c.error(d);return e},phone:function(d){var e=/^(?:0(?:10|2\d|[3-9]\d\d)(?: |\-|)|)[1-9]\d{6,7}$/.test(d.val());!e&&c.error(d);return e},phoneall:function(d){var e=/^(?:\+[\d]{1,6}(?: |\-)|)(?:0[\d]{2,3}(?:\-| |)|)[1-9][\d]{6,7}(?:(?: |)\#[\d]{1,6}|)$/.test(d.val());!e&&c.error(d);return e},phonezone:function(d){var e=/^[0-9]{3,4}$/.test(d.val());!e&&c.error(d);return e},phonecode:function(d){var e=/^[0-9]{7,8}$/.test(d.val());!e&&c.error(d);return e},phoneext:function(d){var e=/^[0-9]{1,6}$/.test(d.val());!e&&c.error(d);return e},length:function(g){var i=true,d=c.getDatatype(g),h,f,j=g.val(),e;if(g.is("[minlength]")){UXC.log("minlength");h=parseInt(g.attr("minlength"),10)||0}if(g.is("[maxlength]")){UXC.log("maxlength");f=parseInt(g.attr("maxlength"),10)||0}switch(d){case"richtext":case"bytetext":e=c.bytelen(j);break;default:e=j.length;break}h&&(e<h)&&(i=false);f&&(e>f)&&(i=false);UXC.log("lengthValid: ",h,f,i);!i&&c.error(g);return i},reqmsg:function(d){var e;if(d.val()&&d.val().constructor==Array){e=!!((d.val().join("")+"").trim())}else{e=!!b.trim(d.val()||"")}!e&&c.error(d,"reqmsg");UXC.log("regmsgValid: "+e);return e},reg:function(e){var f=true,d;if(e.is("[reg-pattern]")){d=e.attr("reg-pattern")}if(!d){d=b.trim(e.attr("datatype")).replace(/^reg(?:\-|)/i,"")}d.replace(/^\/([\s\S]*)\/([\w]{0,3})$/,function(h,g,i){UXC.log(g,i);f=new RegExp(g,i||"").test(e.val())});!f&&c.error(e);return f},vcode:function(e){var f,d=parseInt(e.attr("datatype").trim().replace(/^vcode(?:\-|)/i,""),10)||4;UXC.log("vcodeValid: "+d);f=new RegExp("^[0-9a-zA-Z]{"+d+"}$").test(e.val());!f&&c.error(e);return f},text:function(d){return true},bytetext:function(d){return true},richtext:function(d){return true},url:function(d){var e=/^((http|ftp|https):\/\/|)[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])$/.test(d.val());!e&&c.error(d);return e},domain:function(d){var e=/^(?:(?:f|ht)tp\:\/\/|)((?:(?:(?:\w[\.\-\+]?)*)\w)*)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})(?:\/|)$/.test(d.val());!e&&c.error(d);return e},email:function(d){var e=/^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(d.val());!e&&c.error(d);return e},zipcode:function(d){var e=/^[0-9]{6}$/.test(d.val());!e&&c.error(d);return e}}}}(jQuery));