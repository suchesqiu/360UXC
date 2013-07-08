!String.prototype.trim && ( String.prototype.trim = function(){ return $.trim( this ); } );
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
        _str = _str.replace( new RegExp('\\{'+( i - 1 )+'\\}', 'g'), arguments[i] );
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
 * <br /><b>require:</b> del\_url\_param 
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
 * <br /><b>require:</b> del\_url\_param 
 * @method  get_url_param
 * @static
 * @param   {string}    $url
 * @param   {string}    $key
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
 * @return  bool     如果是HTTP环境返回true, 否则返回false
 */
function httpRequire( _msg ){
    _msg = _msg || '本示例需要HTTP环境';
    if( /file\:|\\/.test( location.href ) ){
        alert( _msg );
        return false;
    }
    return true;
}
/**
 * 删除 URL 的锚点
 * <br /><b>require:</b> add\_url\_params
 * @method removeUrlSharp
 * @static
 * @param   {string}    $url
 * @param   {bool}      $nornd      是否不添加随机参数
 * @return  string
 */
function removeUrlSharp($url, $nornd){   
    var url = $url.replace(/\#[\s\S]*/, '');
    !$nornd && (url = add_url_params( url, { "rnd": new Date().getTime() } ) );
    return url;
}
/**
 * 重载页面
 * <br /><b>require:</b> removeUrlSharp
 * <br /><b>require:</b> add\_url\_params
 * @method reload_page
 * @static
 * @param   {string}    $url
 * @param   {bool}      $nornd
 * @param   {int}       $delayms
 */ 
function reload_page( $url, $nornd, $delayms ){
    $delayms = $delayms || 0;
    setTimeout( function(){
        $url = removeUrlSharp( $url || location.href, $nornd );
        !$nornd && ( $url = add_url_params( $url, { 'rnd': new Date().getTime() } ) );
        location.href = $url;
    }, $delayms);
}
/**
 * 取小数点的N位，
 * <br />JS 解析 浮点数的时候，经常出现各种不可预知情况，这个函数就是为了解决这个问题
 * @method  parse_finance_num
 * @static
 * @param   {number}    $i
 * @param   {int}       $dot
 * @return  number
 */
function parse_finance_num( $i, $dot ){
    $i = parseFloat( $i ) || 0;
    if( $i && $dot ) {
        $i = Math.floor( $i * Math.pow( 10, $dot ) ) / Math.pow( 10, $dot );
    }
    return $i;
}
/**
 * js 附加字串函数 pad_char_f
 * @method  pad_char_f
 * @static
 * @param   {string}    _str
 * @param   {intl}      _len
 * @param   {string}    _char
 * @return  string
 */
function pad_char_f( _str, _len, _char ){
	_len  = _len || 2; _char = _char || "0"; 
	_str += '';
	if( _str.length >_str ) return _str;
	_str = new Array( _len + 1 ).join( _char ) + _str
	return _str.slice( _str.length - _len );
}
/**
 * 格式化日期为 YYYY-mm-dd 格式
 * <br /><b>require</b>: pad\_char\_f
 * @method  formatISODate
 * @static
 * @param   {date}                  _date       要格式化日期的日期对象
 * @param   {string|undefined}      _split      定义年月日的分隔符, 默认为 '-'
 * @return  string
 *
 */
function formatISODate( _date, _split ){
	_date = _date || new Date(); typeof _split == 'undefined' && ( _split = '-' );
	return [ _date.getFullYear(), pad_char_f( _date.getMonth() + 1 ), pad_char_f( _date.getDate() ) ].join(_split);
}
/**
 * 从 ISODate 字符串解析日期对象
 * @method  parseISODate
 * @static
 * @param   {string}    _datestr
 * @return  date
 */
function parseISODate( _datestr ){
    if( !_datestr ) return;
    _datestr = _datestr.replace( /[^\d]+/g, '');
    var _r;
    if( _datestr.length === 8 ){
        _r = new Date( _datestr.slice( 0, 4 )
                        , parseInt( _datestr.slice( 4, 6 ), 10 ) - 1
                        , parseInt( _datestr.slice( 6 ), 10 ) );
    }
    return _r;
}
/**
* 克隆日期对象
* @method  cloneDate
* @static
* @param   {Date}  _date   需要克隆的日期
* @return  {Date}  需要克隆的日期对象
*/
function cloneDate( _date ){ var d = new Date(); d.setTime( _date.getTime() ); return d; }
/**
 * 判断两个日期是否为同一天
 * @method  isSameDay
 * @static
 * @param   {Date}  _d1     需要判断的日期1
 * @param   {Date}  _d2     需要判断的日期2
 * @return {bool}
 */
function isSameDay( _d1, _d2 ){
    return [_d1.getFullYear(), _d1.getMonth(), _d1.getDate()].join() === [
            _d2.getFullYear(), _d2.getMonth(), _d2.getDate()].join()
}
/**
 * 判断两个日期是否为同一月份
 * @method  isSameMonth
 * @static
 * @param   {Date}  _d1     需要判断的日期1
 * @param   {Date}  _d2     需要判断的日期2
 * @return {bool}
 */
function isSameMonth( _d1, _d2 ){
    return [_d1.getFullYear(), _d1.getMonth()].join() === [
            _d2.getFullYear(), _d2.getMonth()].join()
}
/**
 * 取得一个月份中最大的一天
 * @method  maxDayOfMonth
 * @static
 * @param   {Date}  _date
 * @return {int} 月份中最大的一天
 */
function maxDayOfMonth( _date ){
    var _r, _d = new Date( _date.getFullYear(), _date.getMonth() + 1 );
        _d.setDate( _d.getDate() - 1 );
        _r = _d.getDate();
    return _r;
}
/**
 * 取当前脚本标签的 src路径 
 * @method  script_path_f
 * @static
 * @return  {string} 脚本所在目录的完整路径
 */
function script_path_f(){
    var _sc = document.getElementsByTagName('script'), _sc = _sc[ _sc.length - 1 ], _path = _sc.getAttribute('src');
    if( /\//.test( _path ) ){ _path = _path.split('/'); _path.pop(); _path = _path.join('/') + '/'; }
    else if( /\\/.test( _path ) ){ _path = _path.split('\\'); _path.pop(); _path = _path.join('\\') + '/'; }
    return _path;
}
