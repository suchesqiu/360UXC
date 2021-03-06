var fs = require('fs');
var dir = '../uxc_docs/classes';

removeIgnoreItem( '../uxc_docs/index.html' );
removeIgnoreItem( '../uxc_docs/api.js' );

var dirs = fs.readdirSync( dir );

for( var i = 0, j = dirs.length; i < j; i++ ){
    var path = dir + '/' + dirs[i];

    var fstat = fs.statSync( path );

    if( fstat.isDirectory() ){
        /*console.log('directory');*/
    }else if( fstat.isFile ){
        /*console.log('file');*/
    }

    if( fstat.isDirectory() ){
    }else if( fstat.isFile() ){
        removeIgnoreItem( path );
    }

}

function removeIgnoreItem( _path ){
    var fstr = fs.readFileSync( _path, 'utf8' );
    var ar = fstr.split( /[\r\n]+/ );
    var r = [];

    for( var i = 0, j = ar.length; i < j; i++ ){
        if( /^[\s]*$/.test( ar[i] ) ) continue;
        if( /\.Model|\.View/.test( ar[i] ) ) continue;
        r.push( ar[i] );
    }

    fs.writeFileSync( _path, r.join('\r\n') );
}

