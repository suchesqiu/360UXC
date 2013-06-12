;(function($){
    !window.UXC && (window.UXC = { log:function(){} });
    /**
     * 表单常用功能类 UXC.Form
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a></p>
     * <p><a href='https://github.com/suchesqiu/360UXC.git' target='_blank'>UXC Project Site</a>
     * | <a href='http://uxc.btbtd.org/docs/uxc_docs/classes/UXC.Form.html' target='_blank'>API docs</a>
     * | <a href='http://uxc.btbtd.org/uxc/comps/Form/_demo' target='_blank'>demo link</a></p>
     * @namespace UXC
     * @class Form
     * @static
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 360 UXC-FE Team
     * @date    2013-06-11
     */
    window.UXCForm = UXC.Form = {};
}(jQuery));

/**
 * 添加URL参数
 * x@btbtd.org  2013-06-12
 * @example
        var url = add_url_params( location.href, {'key1': 'key1value', 'key2': 'key2value' } );
 */ 
function add_url_params( $url, $params ){
    var sharp = '';
    if( !$params ){
        $params = $url;
        $url = location.href;
    }

    if( $url.indexOf('#') > -1 ){
        sharp = $url.split('#')[1];
        $url = $url.split('#')[0];
    }

    for( var k in $params ){
        $url = del_url_param($url, k);
        $url.indexOf('?') > -1 
            ? $url += '&' + k +'=' + $params[k]
            : $url += '?' + k +'=' + $params[k];
    }
    sharp && ( $url += '#' + sharp );
    $url = $url.replace(/\?\&/g, '?' );
    return $url;   
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
 * 取URL参数的值
 * x@btbtd.org  2012/4/24 
 * @example
        var defaultTag = get_url_param(location.href, 'tag');  
 */ 
function get_url_param( $url, $key )
{
    var result = '';
    if( $url.indexOf('#') > -1 ) $url = $url.split('#')[0];
    
    if( $url.indexOf('?') > -1 )
    {
        var paramAr = $url.split('?')[1].split('&');
        for( var i = 0; i < paramAr.length; i++ )
        {
            var items = paramAr[i].split('=');
            
            items[0] = items[0].replace(/^\s+|\s+$/g, '');
             
            if( items[0].toLowerCase() == $key.toLowerCase() )
            {
                result = items[1];
                break;
            } 
        }
    }
    
    return result;
}
