(function(a){if(window.UXC&&window.UXC.PATH){return}window.UXC={PATH:"/js",compsDir:"/comps/",debug:false,use:function(g){if(!g){return}var b=this,d=[],c=a.trim(g).split(/[\s]*?,[\s]*/),e=/[\/\\]/,f=/\:\/\//,h=/(\\)\1|(\/)\2/g;a.each(c,function(m,k){var j=!e.test(k),l,i=/^\//.test(k);if(j&&window.UXC[k]){return}if(UXC.FILE_MAP&&UXC.FILE_MAP[k]){d.push(UXC.FILE_MAP[k]);return}l=k;j&&(l=printf("{0}{1}{2}/{2}.js",UXC.PATH,UXC.compsDir,k));!j&&!i&&(l=printf("{0}/{1}",UXC.PATH,k));if(/\:\/\//.test(l)){l=l.split("://");l[1]=a.trim(l[1].replace(h,"$1$2"));l=l.join("://")}else{l=a.trim(l.replace(h,"$1$2"))}d.push(l)});UXC.log(d);!UXC.enableNginxStyle&&UXC._writeNormalScript(d);UXC.enableNginxStyle&&UXC._writeNginxScript(d)},log:function(){if(!this.debug){return}console.log([].slice.apply(arguments).join(" "))},pathPostfix:"",enableNginxStyle:false,nginxBasePath:"",_writeNginxScript:function(e){if(!UXC.enableNginxStyle){return}for(var d=0,c=e.length,f=[],b=[];d<c;d++){UXC.log(e[d].slice(0,UXC.nginxBasePath.length).toLowerCase(),UXC.nginxBasePath.toLowerCase());if(e[d].slice(0,UXC.nginxBasePath.length).toLowerCase()==UXC.nginxBasePath.toLowerCase()){f.push(e[d].slice(UXC.nginxBasePath.length))}else{b.push(e[d])}}var g=UXC.pathPostfix?"?v="+UXC.pathPostfix:"";f.length&&document.write(printf('<script src="{0}??{1}{2}"><\/script>',UXC.nginxBasePath,f.join(","),g));b.length&&UXC._writeNormalScript(b)},_writeNormalScript:function(d){var f=UXC.pathPostfix?"?v="+UXC.pathPostfix:"";for(var c=0,b=d.length,e;c<b;c++){e=d[c];UXC.pathPostfix&&(e=add_url_params(e,{v:UXC.pathPostfix}));d[c]=printf('<script src="{0}"><\/script>',e)}d.length&&document.write(d.join(""))},FILE_MAP:null};if(!window.console){window.console={log:function(){window.status=[].slice.apply(arguments).join(" ")}}}UXC.PATH=script_path_f()}(jQuery));