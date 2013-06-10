(function(d){!window.UXC&&(window.UXC={log:function(){}});var e=UXC.Valid=window.Valid={check:function(b){var a=true,b=d(b),i=b.length?b.prop("nodeName").toLowerCase():"";if(b.length){if(i=="form"){for(var c=0,j=b[0].length;c<j;c++){!f.parse(d(b[0][c]))&&(a=false)}}else{a=f.parse(b)}}return a},clearError:function(a){d(a).each(function(){var b=d(this);UXC.log("clearError: "+b.prop("nodeName"));switch(b.prop("nodeName").toLowerCase()){case"form":for(var c=0,j=b[0].length;c<j;c++){var i=d(b[0][c]);if(i.is("[disabled]")){return}f.valid(i)}break;default:f.valid(d(this));break}})}};e.checkAll=e.check;d(document).delegate("input[type=text], input[type=password], textarea","blur",function(a){UXC.Valid.check(this)});d(document).delegate("select, input[type=file]","change",function(a){UXC.Valid.check(this)});var f={parse:function(b){var a=true,b=d(b);b.each(function(){if(!f.isValidItem(this)){return}var c=d(this),j=f.getDatatype(c),i=f.getSubdatatype(c);if(c.is("[disabled]")){return}UXC.log(j,i);if(c.is("[reqmsg]")){if(!f.datatype.reqmsg(c)){a=false;return}}if(!f.datatype.length(c)){a=false;return}if(j in f.datatype&&c.val()){if(!f.datatype[j](c)){a=false;return}}if(i&&i in f.subdatatype&&(c.val()||i=="alternative")){if(!f.subdatatype[i](c)){a=false;return}}f.valid(c)});return a},isValidItem:function(c){c=d(c);var a,b;c.each(function(){b=d(this);if(b.is("[datatype]")||b.is("[subdatatype]")||b.is("[minlength]")||b.is("[maxlength]")||b.is("[reqmsg]")){a=true}});return a},valid:function(a){if(!f.isValidItem(a)){return}a.removeClass("error");a.find("~ em").show();a.find("~ em.error").hide()},error:function(c,i,j){if(!f.isValidItem(c)){return}var a=f.getMsg.apply(null,[].slice.call(arguments)),b;c.addClass("error");c.find("~ em:not(.error)").hide();if(c.is("[emEl]")){(b=f.getElement(c.attr("emEl")))&&b.length&&b.addClass("error")}!(b&&b.length)&&(b=c.find("~ em.error"));if(!b.length){(b=d('<em class="error"></em>')).insertAfter(c)}UXC.log("error: "+a);b.html(a).show();return false},getElement:function(a){if(/^[\w-]+$/.test(a)){a="#"+a}return d(a)},getDatatype:function(a){return(a.attr("datatype")||"text").toLowerCase().replace(/\-.*/,"")},getSubdatatype:function(a){return(a.attr("subdatatype")||"text").toLowerCase().replace(/\-.*/,"")},getMsg:function(b,c,h){var a=b.is("[errmsg]")?" "+b.attr("errmsg"):b.is("[reqmsg]")?b.attr("reqmsg"):"";c&&(a=b.attr(c)||a);h&&a&&(a=" "+a);if(a&&!/^[\s]/.test(a)){switch(b.prop("type").toLowerCase()){case"file":a="请上传"+a;break;case"select-multiple":case"select-one":case"select":a="请选择"+a;break;case"textarea":case"password":case"text":a="请填写"+a;break}}UXC.log("_msg: "+a,b.prop("type").toLowerCase());return d.trim(a)},bytelen:function(a){return a.replace(/[^\x00-\xff]/g,"11").length},getTimestamp:function(a){a=a.replace(/[^\d]/g,"");return new Date(a.slice(0,4),parseInt(a.slice(4,6),10)-1,a.slice(6,8)).getTime()},subdatatype:{alternative:function(b){var a=true,c;UXC.log("alternative");if(b.is("[datatarget]")&&(c=d(b.attr("datatarget"))).length&&!b.val()){var h=false;c.each(function(){if(d(this).val()){h=true;return false}});a=h}!a&&f.error(b,"alternativemsg",true);!a&&c&&c.length&&c.each(function(){f.error(d(this),"alternativemsg",true)});a&&c&&c.length&&c.each(function(){f.valid(d(this))});return a},reconfirm:function(b){var a=true,c;UXC.log("reconfirm");if(b.is("[datatarget]")&&(c=d(b.attr("datatarget"))).length){c.each(function(){if(b.val()!=d(this).val()){return a=false}})}!a&&f.error(b,"reconfirmmsg",true);!a&&c.length&&c.each(function(){f.error(d(this),"reconfirmmsg",true)});a&&c.length&&c.each(function(){f.valid(d(this))});return a}},datatype:{n:function(m){var a=true,c=m.val(),q=+c,o=0,b=Math.pow(10,10),r,p,n;if(!isNaN(q)&&q>=0){m.attr("datatype").replace(/^n\-(.*)$/,function(h,g){n=g.split(".");r=n[0];p=n[1]});if(m.is("[minvalue]")){o=+m.attr("minvalue")||o}if(m.is("[maxvalue]")){b=+m.attr("maxvalue")||b}if(q>=o&&q<=b){typeof r!="undefined"&&typeof p!="undefined"&&(a=new RegExp("^(?:[\\d]{0,"+r+"}|)(?:\\.[\\d]{1,"+p+"}|)$").test(c));typeof r!="undefined"&&typeof p=="undefined"&&(a=new RegExp("^[\\d]{1,"+r+"}$").test(c));typeof r=="undefined"&&typeof p!="undefined"&&(a=new RegExp("^\\.[\\d]{1,"+p+"}$").test(c));typeof p=="undefined"&&/\./.test(c)&&(a=false)}else{a=false}UXC.log("nValid",q,typeof r,typeof p,typeof o,typeof b,o,b)}else{a=false}!a&&f.error(m);return a},d:function(l){var a=l.val().trim(),c,b=/^[\d]{4}([\/.-]|)[01][\d]\1[0-3][\d]$/;if(!a){return true}if(c=b.test(a)){var m=f.getTimestamp(l.val()),k,n;if(l.is("[minvalue]")&&(c=b.test(l.attr("minvalue")))){k=f.getTimestamp(l.attr("minvalue"));m<k&&(c=false)}if(c&&l.is("[maxvalue]")&&(c=b.test(l.attr("maxvalue")))){n=f.getTimestamp(l.attr("maxvalue"));m>n&&(c=false)}}!c&&f.error(l);return c},daterange:function(l){var a=f.datatype.d(l),c,k;if(a){if(a){var j,b;if(l.is("[fromDateEl]")){j=f.getElement(l.attr("fromDateEl"))}if(l.is("[toDateEl]")){b=f.getElement(l.attr("toDateEl"))}if(j&&j.length||b&&b.length){j&&j.length&&!(b&&b.length)&&(b=l);!(j&&j.length)&&b&&b.length&&(j=l);UXC.log("daterange",j.length,b.length);if(b[0]!=j[0]){a&&(a=f.datatype.d(b));a&&(a=f.datatype.d(j));a&&f.getTimestamp(j.val())>f.getTimestamp(b.val())&&(a=false);a&&f.valid(j);a&&f.valid(b)}}}}!a&&f.error(l);return a},time:function(b){var a=/^(([0-1]\d)|(2[0-3])):[0-5]\d:[0-5]\d$/.test(b.val());!a&&f.error(b);return a},minute:function(b){var a=/^(([0-1]\d)|(2[0-3])):[0-5]\d$/.test(b.val());!a&&f.error(b);return a},bankcard:function(b){var a=/^[1-9][\d]{3}(?: |)(?:[\d]{4}(?: |))(?:[\d]{4}(?: |))(?:[\d]{4})(?:(?: |)[\d]{3}|)$/.test(b.val());!a&&f.error(b);return a},cnname:function(b){var a=f.bytelen(b.val())<32&&/^[\u4e00-\u9fa5a-zA-Z.\u3002\u2022]{2,32}$/.test(b.val());!a&&f.error(b);return a},username:function(b){var a=/^[a-zA-Z0-9][\w-]{2,29}$/.test(b.val());!a&&f.error(b);return a},idnumber:function(b){var a=/^[0-9]{15}(?:[0-9]{2}(?:[0-9xX]|)|)$/.test(b.val());!a&&f.error(b);return a},mobilecode:function(b){var a=/^(?:13|14|15|16|18|19)\d{9}$/.test(b.val());!a&&f.error(b);return a},mobilezonecode:function(b){var a=/^(?:\+[0-9]{1,6} |)(?:0|)(?:13|14|15|16|18|19)\d{9}$/.test(b.val());!a&&f.error(b);return a},phone:function(b){var a=/^(?:0(?:10|2\d|[3-9]\d\d)(?: |\-|)|)[1-9]\d{6,7}$/.test(b.val());!a&&f.error(b);return a},phoneall:function(b){var a=/^(?:\+[\d]{1,6}(?: |\-)|)(?:0[\d]{2,3}(?:\-| |)|)[1-9][\d]{6,7}(?:(?: |)\#[\d]{1,6}|)$/.test(b.val());!a&&f.error(b);return a},phonezone:function(b){var a=/^[0-9]{3,4}$/.test(b.val());!a&&f.error(b);return a},phonecode:function(b){var a=/^[0-9]{7,8}$/.test(b.val());!a&&f.error(b);return a},phoneext:function(b){var a=/^[0-9]{1,6}$/.test(b.val());!a&&f.error(b);return a},length:function(k){var b=true,n=f.getDatatype(k),c,l,a=k.val(),m;if(k.is("[minlength]")){UXC.log("minlength");c=parseInt(k.attr("minlength"),10)||0}if(k.is("[maxlength]")){UXC.log("maxlength");l=parseInt(k.attr("maxlength"),10)||0}switch(n){case"richtext":case"bytetext":m=f.bytelen(a);break;default:m=a.length;break}c&&(m<c)&&(b=false);l&&(m>l)&&(b=false);UXC.log("lengthValid: ",c,l,b);!b&&f.error(k);return b},reqmsg:function(b){var a;if(b.val()&&b.val().constructor==Array){a=!!((b.val().join("")+"").trim())}else{a=!!d.trim(b.val()||"")}!a&&f.error(b,"reqmsg");UXC.log("regmsgValid: "+a);return a},reg:function(b){var a=true,c;if(b.is("[reg-pattern]")){c=b.attr("reg-pattern")}if(!c){c=d.trim(b.attr("datatype")).replace(/^reg(?:\-|)/i,"")}c.replace(/^\/([\s\S]*)\/([\w]{0,3})$/,function(k,l,j){UXC.log(l,j);a=new RegExp(l,j||"").test(b.val())});!a&&f.error(b);return a},vcode:function(b){var a,c=parseInt(b.attr("datatype").trim().replace(/^vcode(?:\-|)/i,""),10)||4;UXC.log("vcodeValid: "+c);a=new RegExp("^[0-9a-zA-Z]{"+c+"}$").test(b.val());!a&&f.error(b);return a},text:function(a){return true},bytetext:function(a){return true},richtext:function(a){return true},url:function(b){var a=/^((http|ftp|https):\/\/|)[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])$/.test(b.val());!a&&f.error(b);return a},domain:function(b){var a=/^(?:(?:f|ht)tp\:\/\/|)((?:(?:(?:\w[\.\-\+]?)*)\w)*)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})(?:\/|)$/.test(b.val());!a&&f.error(b);return a},email:function(b){var a=/^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(b.val());!a&&f.error(b);return a},zipcode:function(b){var a=/^[0-9]{6}$/.test(b.val());!a&&f.error(b);return a}}}}(jQuery));