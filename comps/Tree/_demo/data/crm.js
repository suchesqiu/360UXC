$(document).ready(function(){window.ZINDEX_COUNT=window.ZINDEX_COUNT||50001;UXC.Tree.dataFilter=function(b){var c={};if(b){if(b.root.length>2){b.root.shift();c.root=b.root}c.data={};for(var d in b.data){c.data[d]=[];for(var a=0,e=b.data[d].length;a<e;a++){if(b.data[d][a].length<3){continue}b.data[d][a].shift();c.data[d].push(b.data[d][a])}}}return c};$(document).delegate("div.tree_container","click",function(a){a.stopPropagation()});$(document).on("click",function(){$("div.dpt-select-active").trigger("click")});$(document).delegate("div.dpt-select","click",function(f){f.stopPropagation();var e=$(this),b=$(e.attr("treenode"));var d=b.data("TreeIns");if(!e.hasClass("dpt-select-active")){$("div.dpt-select-active").trigger("click")}if(!d){var g=window[e.attr("treedata")];var c=new UXC.Tree(b,g);c.on("click",function(){var j=$(this),i=j.attr("dataid"),h=j.attr("dataname");e.find("> span.label").html(h);e.find("> input[type=hidden]").val(i);e.trigger("click")});c.on("RenderLabel",function(i){var h=$(this);h.html(printf('<a href="javascript:" dataid="{0}">{1}</a>',i[0],i[1]))});c.init();c.open();var a=e.find("> input[type=hidden]").val();a&&c.open(a)}b.css({"z-index":ZINDEX_COUNT++});if(b.css("display")!="none"){e.removeClass("dpt-select-active");b.hide()}else{b.show();e.addClass("dpt-select-active");b.css({top:e.prop("offsetHeight")-2+"px",left:"-1px"})}})});