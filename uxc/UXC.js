/**
 * @method
 */
(function( $ ){
    /**
     * UXC jq 组件库 资源调用控制类
     * @constructor
     * @private
     * @exports window.UXC
     *
     * @example 
     *      UXC.import( 组件名[,组件名] );
     *
     * @author qiushaowei   2013-05-21
     */
    function UXC(){
        var _p = this;
        /**
         * UXC组件库所在路径
         */
        _p.PATH = '/js/uxc/comps/';
        /**
         * 是否显示调试信息
         */
        _p.debug;
        /**
         * 自动识别组件库所在路径
         */
        _p._getPath();
    }

    UXC.prototype = {
       /**
        * 导入UXC组件
        * @method
        * @public
        * @param    {string}    _names -            模块名
        *                                           或者模块下面的某个js文件(test/test1.js, 路径前面不带"/"将视为test模块下的test1.js)
        *                                           或者一个绝对路径的js文件, 路径前面带 "/"
        *
        * @param    {string}    _basePath -         指定要导入资源所在的主目录, 这个主要应用于 nginx 路径输出
        * @param    {bool}      _nginxStyle -       指定是否需要使用 nginx 路径输出脚本资源
        *
        * @example
                UXC.import( 'Test' );
                UXC.import( 'Test/Test1.js' );
                UXC.import( '/js/Test/Test1.js' );
                UXC.import( 'Test1.js, Test2.js ', '/js/??', true );
        */
        import: function( _names, _basePath, _nginxStyle ){
                    if( ! _names ) return;
                    var _p = this;

                    var _paths = [];

                    $.each( _names.split(/[\s]*?,[\s]*/), function( _ix, _val ){

                        var _isCustomPath = /\//.test( _val ) || !!_basePath;

                        if( !/\.js$/i.test( _val ) & !_basePath )  _val =  [ _val, '/', _val, '.js' ].join('');

                        if( _isCustomPath ){
                            if( _basePath && !_nginxStyle ) _val = _basePath + _val;
                            else if( !/[\/\\]/.test( _val.slice( 0, 1 ) ) && !_nginxStyle ) _val = _p.PATH + _val;
                        }else{
                            _val = _p.PATH + _val;
                        }
                        /**
                         * 去除多余的 正叙扛或反叙扛
                         */
                        _val = _val.replace( /(\\)\1|(\/)\2/g, '$1' ); 

                        if( !_nginxStyle ){
                            _paths.push( '<script src="'+_val+'"><\/script>' );
                        }else{
                            _paths.push( _val );
                        }

                        _p.log( _val );
                    });

                    if( _nginxStyle ){
                        _basePath += _paths.join();
                        document.write( '<script src="'+_basePath+'"><\/script>' );
                    }else{
                        document.write( _paths.join('') );
                    }

                    _p.log( _paths );
                }
        /**
         * 获取组件库所在路径
         * @method
         * @private
         */
        , _getPath: function(){
                      var _sc = $('script').last(), _path = _sc.attr('src').replace( /UXC\.js[^\w]*/i, '' );
                      if( _path ) this.PATH = _path + 'comps/';
                  }

       /**
        * 输出调试信息, 可通过 UXC.debug 指定是否显示调试信息
        * @method
        * @public
        */
       , log: function(){
            if( !this.debug ) return;
            console.log( [].slice.apply( arguments ).join(', ') );
       }
    };

    /**
     * 如果 console 不可用, 则生成一个模拟的 console 对象
     */
    if( !window.console ) window.console = { log:function(){
        window.status = [].slice.apply( arguments ).join(', ');
    }};

    window.UXC = new UXC();
}(jQuery))
