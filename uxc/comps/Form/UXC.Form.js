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
    window.UXCForm = UXC.Form = {
        /**
         * 禁用按钮一定时间, 默认为1秒
         * @method  disableButton
         * @static
         * @param   {selector}  _selector   要禁用button的选择器
         * @param   {int}       _durationMs 禁用多少时间, 单位毫秒, 默认1秒
         */
        'disableButton':
            function( _selector, _durationMs ){
                if( !_selector ) return;
                _selector = $(_selector);
                _durationMs = _durationMs || 1000;
                _selector.attr('disabled', true);
                setTimeout( function(){
                    _selector.attr('disabled', false);
                }, _durationMs);
            }
    };
}(jQuery));
/**
 * 判断URL中是否有某个get参数
 * x@btbtd.org  2013-06-13
 * @example
 *      var bool = has_url_param( 'getkey' );
 */
function has_url_param( _url, _key ){
    var _r = false;
    if( !_key ){ _key = _url; _url = location.href; }
    if( /\?/.test( _url ) ){
        _url = _url.split( '?' ); _url = _url[ _url.length - 1 ];
        _url = _url.split('&');
        for( var i = 0, j = _url.length; i < j; i++ ){
            if( _url[i].split('=')[0].toLowerCase() == _key.toLowerCase() ){ _r = true; break; };
        }
    }
    return _r;
}
/**
 * 添加URL参数
 * x@btbtd.org  2013-06-12
 * @example
        var url = add_url_params( location.href, {'key1': 'key1value', 'key2': 'key2value' } );
 */ 
function add_url_params( $url, $params ){
    var sharp = '';
    !$params && ( $params = $url, $url = location.href );
    $url.indexOf('#') > -1 && ( sharp = $url.split('#')[1], $url = $url.split('#')[0] );
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
 * 取URL参数的值
 * x@btbtd.org  2012/4/24 
 * @method  get_url_param
 * @param   {string}    $url
 * @param   {string}    $key
 * @require del_url_param 
 * @example
        var defaultTag = get_url_param(location.href, 'tag');  
 */ 
function get_url_param( $url, $key ){
    var result = '', paramAr, i, items;
    !$key && ( $key = $url, $url = location.href );
    $url.indexOf('#') > -1 && ( $url = $url.split('#')[0] );
    if( $url.indexOf('?') > -1 ){
        paramAr = $url.split('?')[1].split('&');
        for( i = 0; i < paramAr.length; i++ ){
            items = paramAr[i].split('=');
            items[0] = items[0].replace(/^\s+|\s+$/g, '');
            if( items[0].toLowerCase() == $key.toLowerCase() ){
                result = items[1];
                break;
            } 
        }
    }
    return result;
}
 
/**
 * 删除URL参数
 * x@btbtd.org  2012/4/24  
 * @method  del_url_param
 * @params  {string}    $url
 * @params  {string}    $key
 * @example
        var url = del_url_param( location.href, 'tag' );
 */ 
function del_url_param( $url, $key ){
    var sharp = '', params, tmpParams = [], i, item;
    !$key && ( $key = $url, $url = location.href );
    $url.indexOf('#') > -1 && ( sharp = $url.split('#')[1], $url = $url.split('#')[0] );
    if( $url.indexOf('?') > -1 ){
        params = $url.split('?')[1].split('&');
        $url = $url.split('?')[0];
        for( i = 0; i < params.length; i++ ){
            items = params[i].split('=');
            items[0] = items[0].replace(/^\s+|\s+$/g, '');
            if( items[0].toLowerCase() == $key.toLowerCase() ) continue;
            tmpParams.push( items.join('=') )
        }
        $url += '?' + tmpParams.join('&');
    }
    sharp && ( $url += '#' + sharp );
    return $url;
}

