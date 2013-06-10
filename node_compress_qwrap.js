var compressor = require('node-minify');
var fs = require('fs');

var dir = __dirname;
if( /\\/.test( dir ) ){
    dir = 'qwrap';
}else dir += '/qwrap';

recursive_compress( dir, dir, fs);

function recursive_compress( $sourceRoot, $outputRoot, $fs ){

    if( $fs.existsSync( $sourceRoot ) ){
        //console.log('source exists');
    }else{
        /*console.log('source no exists');
        console.log( $sourceRoot );*/
        return;
    }

    if( !$outputRoot ) {
        /*console.log( '$path is empty!' );*/
        return;
    }

    recursive_mkdir( $outputRoot, $fs );

    var fl = $fs.readdirSync( $sourceRoot );

    for( var i = 0, j = fl.length; i < j; i++ ){
        var cspath = [$sourceRoot, fl[i]].join('/');
        var copath = [$outputRoot, fl[i]].join('/');

        var fstat = $fs.statSync( cspath )  

        if( fstat.isDirectory() ){
            /*console.log('directory');*/
        }else if( fstat.isFile ){
            /*console.log('file');*/
        }
        /*console.log( i + ': ' + cspath );
        console.log( i + ': ' + copath );
        console.log("");*/

        if( /node\_|nodejs\_/i.test( fl[i] ) ) continue;

        if( fstat.isDirectory() ){
            recursive_mkdir( copath, $fs );
            recursive_compress( cspath, copath, $fs );
        }else if( fstat.isFile() ){

            if( /\.css$/i.test( cspath ) ){
                new compressor.minify({
                    type: 'yui-css',
                    fileIn: cspath,
                    fileOut: copath,
                    callback: function(err){
                        console.log('css: ' + err  + ' : ' +  cspath);

                    }
                });

            }else if( /\.js$/i.test( cspath ) ){
                new compressor.minify({
                    type: 'yui-js',
                    fileIn: cspath,
                    fileOut: copath,
                    callback: function(err){
                        console.log('js: ' + err  + ' : ' +  cspath);
                    }
                });
            }
        }

    }


}

function recursive_mkdir( $path, $fs ){
    if( !$path ){
        console.log( '$path is empty!' );
        return;
    }

    $path = $path.trim();

    //console.log( 'recursive_mkdir: ' + $path );

    var par = $path.split('/');

    for( var i = 0; i < par.length; i++ ){
        if( par[i].trim() == '.' || par[i].trim() == '' ){
            continue;
        }

        var path = par.slice( 0, i+1 ).join('/');

        //console.log( path );

        if( !$fs.existsSync( path ) ){
            $fs.mkdirSync( path );
        }
    }
}


