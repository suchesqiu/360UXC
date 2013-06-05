window.MAX_INDEX = 9999; 

function getMaxIndex()
{
    return ++window.MAX_INDEX;
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
