var compressor = require('node-minify');
var fs = require('fs');

var dir = __dirname;
if( /\\/.test( dir ) ){
    dir = './';
}else dir += '';

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

    var fl = $fs.readdirSync( $sourceRoot );

    for( var i = 0, j = fl.length; i < j; i++ ){
        var cspath = [$sourceRoot, fl[i]].join('/');
        var copath = [$outputRoot, fl[i]].join('/');

        cspath = cspath.replace( /[\/]+/g, '/' );
        copath = copath.replace( /[\/]+/g, '/' );
/*
        console.log( cspath, '\n', copath, '\n\n' );
        continue;
        */

        var fstat = $fs.statSync( cspath )  

        if( fstat.isDirectory() ){
            if( fl[i] == ".git" || fl[i] == 'uxc_docs' || fl[i] == 'tools' ) continue;
            /*console.log('directory');*/
        }else if( fstat.isFile ){
            /*console.log('file');*/
        }
        /*console.log( i + ': ' + cspath );
        console.log( i + ': ' + copath );
        console.log("");*/

        if( /node\_|nodejs\_/i.test( fl[i] ) ) continue;

        if( fstat.isDirectory() ){
            recursive_compress( cspath, copath, $fs );
        }else if( fstat.isFile() ){

            if( !/\.(?:css|js)$/i.test(cspath) ) continue;
            console.log( 'xxxxxx', cspath, copath );

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

