/**
 * 取当前脚本标签的 src路径 
 * @author  scuehs@btbtd.org 2013-05-23
 * @return  {string} 脚本所在目录的完整路径
 */
function script_path_f(){
    var _sc = document.getElementsByTagName('script'), _sc = _sc[ _sc.length - 1 ], _path = _sc.getAttribute('src');
    if( /\//.test( _path ) ){ _path = _path.split('/'); _path.pop(); _path = _path.join('/') + '/'; }
    else if( /\\/.test( path ) ){ _path = _path.split('\\'); _path.pop(); _path = _path.join('\\') + '/'; }
    return _path;
}
(function(){
    var _path = script_path_f();
    document.write( '<script src="'+_path+'UXC.LunarCalendar.js" ><\/script>'
        , '<script src="'+_path+'UXC.LunarCalendar.gregorianToLunar.js" ><\/script>'
        , '<script src="'+_path+'UXC.LunarCalendar.getFestival.js" ><\/script>'
        , '<script src="'+_path+'nationalHolidays.js" ><\/script>'
    );
}());