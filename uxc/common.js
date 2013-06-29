/**
 * @namespace 
 * @class   window
 * @static
 */
 /**
 * 按格式输出字符串
 * @method printf
 * @static
 * @param   {string}    _str
 * @example
 *      printf( 'asdfasdf{0}sdfasdf{1}', '000', 1111 );
 *      //return asdfasdf000sdfasdf1111
 */
function printf( _str ){
    for(var i = 1, _len = arguments.length; i < _len; i++){
        _str = _str.replace( new RegExp('\\{'+( i - 1 )+'\\}'), arguments[i] );
    }
    return _str;
}
/**
 * 判断URL中是否有某个get参数
 * @method  has_url_param
 * @static
 * @param   {string}    _url
 * @param   {string}    _key
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
 * @method  add_url_params
 * @static
 * @param   {string}    _url
 * @param   {object}    $params
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
 * @method  get_url_param
 * @static
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
 * @method  del_url_param
 * @static
 * @param  {string}    $url
 * @param  {string}    $key
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
/**
 * 提示需要 HTTP 环境
 * @method  httpRequire
 * @static
 * @param  {string}  _msg   要提示的文字, 默认 "本示例需要HTTP环境'
 */
function httpRequire( _msg ){
    _msg = _msg || '本示例需要HTTP环境';
    if( /file\:|\\/.test( location.href ) ){
        alert( _msg );
        return false;
    }
    return true;
}
