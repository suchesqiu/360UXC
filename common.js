!String.prototype.trim&&(String.prototype.trim=function(){return $.trim(this)});function printf(f){for(var d=1,e=arguments.length;d<e;d++){f=f.replace(new RegExp("\\{"+(d-1)+"\\}","g"),arguments[d])}return f}function has_url_param(j,i){var h=false;if(!i){i=j;j=location.href}if(/\?/.test(j)){j=j.split("?");j=j[j.length-1];j=j.split("&");for(var f=0,g=j.length;f<g;f++){if(j[f].split("=")[0].toLowerCase()==i.toLowerCase()){h=true;break}}}return h}function add_url_params(h,f){var g="";!f&&(f=h,h=location.href);h.indexOf("#")>-1&&(g=h.split("#")[1],h=h.split("#")[0]);for(var e in f){h=del_url_param(h,e);h.indexOf("?")>-1?h+="&"+e+"="+f[e]:h+="?"+e+"="+f[e]}g&&(h+="#"+g);h=h.replace(/\?\&/g,"?");return h}function get_url_param(k,i){var h="",j,l,g;!i&&(i=k,k=location.href);k.indexOf("#")>-1&&(k=k.split("#")[0]);if(k.indexOf("?")>-1){j=k.split("?")[1].split("&");for(l=0;l<j.length;l++){g=j[l].split("=");g[0]=g[0].replace(/^\s+|\s+$/g,"");if(g[0].toLowerCase()==i.toLowerCase()){h=g[1];break}}}return h}function del_url_param(h,k){var l="",j,m=[],i,n;!k&&(k=h,h=location.href);h.indexOf("#")>-1&&(l=h.split("#")[1],h=h.split("#")[0]);if(h.indexOf("?")>-1){j=h.split("?")[1].split("&");h=h.split("?")[0];for(i=0;i<j.length;i++){items=j[i].split("=");items[0]=items[0].replace(/^\s+|\s+$/g,"");if(items[0].toLowerCase()==k.toLowerCase()){continue}m.push(items.join("="))}h+="?"+m.join("&")}l&&(h+="#"+l);return h}function httpRequire(b){b=b||"本示例需要HTTP环境";if(/file\:|\\/.test(location.href)){alert(b);return false}return true}function removeUrlSharp(d,f){var e=d.replace(/\#[\s\S]*/,"");!f&&(e=add_url_params(e,{rnd:new Date().getTime()}));return e}function reload_page(d,f,e){e=e||0;setTimeout(function(){d=removeUrlSharp(d||location.href,f);!f&&(d=add_url_params(d,{rnd:new Date().getTime()}));location.href=d},e)}function parse_finance_num(c,d){c=parseFloat(c)||0;if(c&&d){c=Math.floor(c*Math.pow(10,d))/Math.pow(10,d)}return c}function pad_char_f(f,e,d){e=e||2;d=d||"0";f+="";if(f.length>f){return f}f=new Array(e+1).join(d)+f;return f.slice(f.length-e)}function formatISODate(d,c){d=d||new Date();typeof c=="undefined"&&(c="-");return[d.getFullYear(),pad_char_f(d.getMonth()+1),pad_char_f(d.getDate())].join(c)}function parseISODate(d){if(!d){return}d=d.replace(/[^\d]+/g,"");var c;if(d.length===8){c=new Date(d.slice(0,4),parseInt(d.slice(4,6),10)-1,parseInt(d.slice(6),10))}return c}function cloneDate(d){var c=new Date();c.setTime(d.getTime());return c}function isSameDay(c,d){return[c.getFullYear(),c.getMonth(),c.getDate()].join()===[d.getFullYear(),d.getMonth(),d.getDate()].join()}function isSameMonth(c,d){return[c.getFullYear(),c.getMonth()].join()===[d.getFullYear(),d.getMonth()].join()}function maxDayOfMonth(d){var f,e=new Date(d.getFullYear(),d.getMonth()+1);e.setDate(e.getDate()-1);f=e.getDate();return f}function script_path_f(){var d=document.getElementsByTagName("script"),d=d[d.length-1],c=d.getAttribute("src");if(/\//.test(c)){c=c.split("/");c.pop();c=c.join("/")+"/"}else{if(/\\/.test(c)){c=c.split("\\");c.pop();c=c.join("\\")+"/"}}return c}function easyEffect(k,o,s,p,m){var q=new Date(),l,o=o||200,s=s||0,n=0,t,p=p||200,m=m||2;var r=setInterval(function(){l=new Date()-q;n=l/p*o;n+=s;if(n>o){n=o;t=true;clearInterval(r)}k&&k(n,t)},m);return r}function parseBool(b){if(typeof b=="string"){b=b.replace(/[\s]/g,"").toLowerCase();if(b&&(b=="false"||b=="0"||b=="null"||b=="undefined")){b=false}else{if(b){b=true}}}return !!b};