window.MAX_INDEX = 9999; 
/**
 * 获取页面上最大的z-index值, 并+1
 * x@btbtd.org  2012-3-23  
 */ 
function getMaxIndex()
{
    window.MAX_INDEX = window.MAX_INDEX || 9999;
    return ++window.MAX_INDEX;
}

/**
 * 从对象ID取得DOM对象
 * @date        2011-7-21      
 */         
function getId($id)
{
    return typeof $id==="string"?document.getElementById($id):$id;
}

/**
 * 删除URL参数
 * x@btbtd.org  2012/4/24  
 * @example
        var url = del_url_param( location.href, 'tag' );
 */ 
function del_url_param( $url, $key )
{
    var sharp = '';
    if( $url.indexOf('#') > -1 )
    {
        sharp = $url.split('#')[1];
        $url = $url.split('#')[0];
    }
    
    if( $url.indexOf('?') > -1 )
    {
        var params = $url.split('?')[1];
        var $url = $url.split('?')[0];
        
        var paramAr = params.split('&');
        var newParamAr = [];
        for( var i = 0; i < paramAr.length; i++ )
        {
            var items = paramAr[i].split('=');
            
            items[0] = items[0].replace(/^\s+|\s+$/g, '');
             
            if( items[0].toLowerCase() == $key.toLowerCase() )
            {
                continue;
            } 
            newParamAr.push( items.join('=') )
        }
        $url += '?' + newParamAr.join('&');
    }
    
    if( sharp )
    {
        $url += '#' + sharp;
    }
    
    return $url;
}
/**
 * 添加URL参数
 * x@btbtd.org  2012/4/24 
 * @require     del_url_param, 删除URL参数
 * @example
        var url = add_url_param( location.href, {'key': 'tag', 'value': tag } );
 */ 
function add_url_param( $url, $param )
{
    var sharp = '';
    if( $url.indexOf('#') > -1 )
    {
        sharp = $url.split('#')[1];
        $url = $url.split('#')[0];
    }
    
    $url = del_url_param($url, $param.key);
    
    if( $url.indexOf('?') > -1 )
    {
        $url += '&' + $param.key +'=' + $param.value;
    }
    else
    {
        $url += '?' + $param.key +'=' + $param.value;
    }
    
    if( sharp )
    {
        $url += '#' + sharp;
    }
    
    $url = $url.replace(/\?\&/g, '?' );
    
    return $url;   
}
/**
 * DOM方式添加脚本块
 * @author      suches@btbtd.org
 * @date        2011-7-5  
 */ 
function XAppendScript( $url, $box )
{
    var ele = document.createElement("script");  
    ele.src = $url;  
    if(!$box) $box = document.body;
    $box.appendChild( ele );
    return ele;
} 
/**
 *  @description    兼容各浏览器的附加事件函数
 *  @author         suches
 *  @date           2008-9-22
 */ 
function attach_event_f(e_, event_name_s, func_f, capture_b)
{
    if(document.addEventListener){e_.addEventListener(event_name_s, func_f, capture_b);}
    else if(document.attachEvent)
    {
        event_name_s = 'on'+event_name_s;
        if(e_[event_name_s]==null){e_[event_name_s] = func_f;} else{e_.attachEvent(event_name_s, func_f);}
    }
}
/**
 * 取得键盘按键charcode
 * x@btbtd.org 2012/7/3 
 */ 
function keycode_f( $evt )
{
    $evt = $evt || window.event;
    return {
        "keyCode": $evt.keyCode || $evt.which
        , "shiftKey": $evt.shiftKey
        , "ctrlKey": $evt.ctrlKey
        , "altKey": $evt.altKey
    };
}
/**
 * 取某个元素的座标和大小
 * x@btbtd.org      2008-9-9       
 */ 
function ele_pos_f(arg_e)
{
    var a = [], t = arg_e.offsetTop, l = arg_e.offsetLeft, w = arg_e.offsetWidth, h = arg_e.offsetHeight; 
    while(arg_e = arg_e.offsetParent){ t += arg_e.offsetTop; l += arg_e.offsetLeft; } 
    return {top:t, left:l, width:w, height:h};
}
/**
 * 获取 控件 光标位置
 * x@btbtd.org  2012-3-1 
 */   
function get_cursor(target) 
{
    var r = 0;
    if (typeof target.selectionStart == "number"
        && typeof target.selectionEnd == "number") 
    {
        r = target.selectionStart;
    } 
    else if (document.selection) 
    {  
        var trs = document.selection.createRange();  
        if(trs.parentElement()== target)
        {   
          var tro = document.body.createTextRange();    
          tro.moveToElementText(target);   
           
          for (r=0; tro.compareEndPoints("StartToStart", trs) < 0; r++)
          {    
            tro.moveStart('character', 1);    
          }   
          
          for (var i = 0; i <= r; i ++)
          {   
            if (target.value.charAt(i) == '\n') r++;   
          }    
        }   
    }
    return r;
}
/**
 * 设置 控件 光标位置
 * x@btbtd.org  2012-3-1 
 */   
function set_cursor(ctrl, pos)
{
    if(ctrl.setSelectionRange)
    {
        ctrl.focus();
        ctrl.setSelectionRange(pos,pos);
    }
    else if (ctrl.createTextRange) 
    {
        var tro = ctrl.createTextRange();   
        var LStart = pos;   
        var LEnd = pos;   
        var start = 0;   
        var end = 0;   
        var value = ctrl.value;
           
        for(var i=0; i<value.length && i<LStart; i++)
        {   
          var c = value.charAt(i);   
          if(c!='\n') start++;  
        }
           
        for(var i=value.length-1; i>=LEnd && i>=0; i--)
        {   
          var c = value.charAt(i);   
          if(c!='\n') end++;  
        }   
        tro.moveStart('character', start);   
        tro.moveEnd('character', -end);   
        tro.select();   
        ctrl.focus();   
    }
}
/**
 * 阻止事件冒泡
 * @author      suches@btbtd.org
 * @date        2011-7-26                  
 */                 
function stopPropagation($evt)
{            
    $evt = $evt || window.event;
    if( $evt.preventDefault ) $evt.stopPropagation(); else $evt.cancelBubble = false;
}
/**
 * 阻止事件默认行为
 * @author      suches@btbtd.org
 * @date        2011-7-26                  
 */                 
function preventDefault($evt)
{            
    $evt = $evt || window.event;
    if( $evt.preventDefault ) $evt.preventDefault(); else $evt.returnValue = false;
}
//***Adds a new class to an object, preserving existing classes
function AddClass(obj,cName){ KillClass(obj,cName); return obj && (obj.className+=(obj.className.length>0?' ':'')+cName); }

//***Removes a particular class from an object, preserving other existing classes.
function KillClass(obj,cName){ return obj && (obj.className=obj.className.replace(new RegExp("^"+cName+"\\b\\s*|\\s*\\b"+cName+"\\b",'g'),'')); }

//***Returns true if the object has the class assigned, false otherwise.
function HasClass(obj,cName){ return (!obj || !obj.className)?false:(new RegExp("\\b"+cName+"\\b")).test(obj.className) }
/**
 * 取DOM对象的运行时样式
 * x@btbtd.org  2012/7/13
 */ 
function style_f( $ele, $style)
{
    var r = '', isIE = !!window.ActiveXObject;
    if( isIE ){ r = $ele.currentStyle[$style]; }
    else{ r = getComputedStyle($ele)[$style]; }
    return r;
}
