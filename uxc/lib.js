/**
 * 取当前脚本标签的 src路径 
 * scuehs@btbtd.org 2013-05-23
 */
function script_path_f(){
    var _sc = document.getElementsByTagName('script'), _sc = _sc[ _sc.length - 1 ], _path = _sc.getAttribute('src');
    if( /\//.test( _path ) ){ _path = _path.split('/'); _path.pop(); _path = _path.join('/') + '/'; }
    else if( /\\/.test( path ) ){ _path = _path.split('\\'); _path.pop(); _path = _path.join('\\') + '/'; }
    return _path;
}
var _path = script_path_f();

document.write( '<script src="'+_path+'jquery.js" ><\/script>' );
document.write( '<script src="'+_path+'UXC.js" ><\/script>' );