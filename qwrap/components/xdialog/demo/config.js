
window.MAX_INDEX = 9999; 

function getMaxIndex()
{
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
 * 取屏幕的可用大小相关值
 * @author      suches@btbtd.org
 * @date        2008-9-19
 */         
function viewport_f() 
{
    var myWidth = 0, myHeight = 0;
    if(typeof(window.innerWidth ) == 'number' ) 
    {/* Non-IE */
        width_i = window.innerWidth; height_i = window.innerHeight;
    } 
    else if 
    (
        document.documentElement &&( document.documentElement.clientWidth || document.documentElement.clientHeight ) 
    ) 
    {/* IE 6 */
        width_i = document.documentElement.clientWidth; height_i = document.documentElement.clientHeight;
    } 
    else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) 
    {/* IE 4 */
        width_i = document.body.clientWidth; height_i = document.body.clientHeight;
    }
    
    var sLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    var sTop = document.documentElement.scrollTop || document.body.scrollTop;
    var oWidth = document.documentElement.offsetWidth || document.body.offsetWidth;
    var oHeight = document.documentElement.offsetHeight || document.body.offsetHeight
    
    return {
                width:width_i
                , height:height_i
                , max_width: width_i + sLeft
                , max_height: height_i + sTop
                , scrollLeft: sLeft
                , scrollTop: sTop
                
                , body_width: oWidth
                , body_height: oHeight
          };
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
 * 从 class 获取DOM节点
 * @author      suches@btbtd.org
 * @date        2011-8-1
 * @requires    HasClass               
 */
function getClass( $class, $box, $r )
{
    $box = $box || document.body;
    $r = $r || [];
    
    var first = $box.firstChild;
    
    if( first )
    {
        if( HasClass( first, $class ) )
        {
            $r.push( first );
        }
        
        if( first.childNodes.length )
        {
            arguments.callee( $class, first, $r );
        }
        
        while( first = first.nextSibling )
        {
            if( HasClass( first, $class ) )
            {
                $r.push( first );
            }
        
            if( first.childNodes.length )
            {
                arguments.callee( $class, first, $r );
            }
        }
    }
    
    return $r;
}         
//***Adds a new class to an object, preserving existing classes
function AddClass(obj,cName){ KillClass(obj,cName); return obj && (obj.className+=(obj.className.length>0?' ':'')+cName); }

//***Removes a particular class from an object, preserving other existing classes.
function KillClass(obj,cName){ return obj && (obj.className=obj.className.replace(new RegExp("^"+cName+"\\b\\s*|\\s*\\b"+cName+"\\b",'g'),'')); }

//***Returns true if the object has the class assigned, false otherwise.
function HasClass(obj,cName){ return (!obj || !obj.className)?false:(new RegExp("\\b"+cName+"\\b")).test(obj.className) }

/**
 * 遍历键值对象或数组
 * @author      suches@btbtd.org
 * @date        2011-7-24
 */        
function xeach( $list, $callback )
{
    var count = 0;
    
    if( $list.length )
    {
        for( var i = 0, j = $list.length; i < j; i++ )
        {
            if( inner( i, count, $callback ) === false )
            {
                return;
            }
            count++;
        }
    }
    else
    {    
        for( var o in $list )
        {
            
            if( inner( o, count, $callback ) === false )
            {
                return;
            }
            count++;
        }
    }
    
    function inner( $key )
    {
        if( $callback )
        {
            return $callback( $list[$key], count );
        }
    }
}
/**
 * 删除数组指定索引
 * @author      suches@btbtd.org
 * @date        2009-4-21
 */          
function remove_array_item( arr, index_ )
{
  return arr = arr.slice(0, index_).concat( arr.slice(index_+1) );
}  
    
/**
 * 合并对象
 * @author      suches@btbtd.org
 * @date        2011-8-1          
 */         
function mergeObject()
{
    if( !arguments.length ) return null;
    var r = arguments[0];
    if( arguments.length === 1 ) return r;
    
    for( var i = 1; i < arguments.length; i++ )
    {
        if( arguments[i] ) for( var k in arguments[i] ) r[k] = arguments[i][k];
    }
    
    return r;
}

/**
 * 判断是否为 Firefox
 * x@btbtd.org  2012/6/19 
 */ 
function isFF()
{
    return ( navigator.userAgent.indexOf('Firefox') >= 0 );
}
