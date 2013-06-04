(function( $ ){
    /**
     * UXC jquery 组件库 资源调用控制类<br />
     * 这是一个单例模式, 全局访问使用 UXC 或 window.UXC
     * @namespace window
     * @class UXC
     * @static
     * @requires    jQuery
     * @example 
     *      UXC.use( 组件名[,组件名] );
     * @author  qiushaowei   <suches@btbtd.org> | 360 UXC-FE Team
     * @link    https://github.com/suchesqiu/360UXC.git
     * @date    2013-05-22
     */
    window.UXC = 
    {
    
        /**
         * UXC组件库所在路径
         * @property    PATH
         * @static
         * @type {string}
         */
        PATH: '/js/uxc/comps/'
        /**
         * 是否显示调试信息
         * @property    debug
         * @static
         * @type {bool}
         */
        , debug: false
       /**
        * 导入UXC组件
        * @method   use
        * @static
        * @param    {string}    _names -            模块名
        *                                           或者模块下面的某个js文件(test/test1.js, 路径前面不带"/"将视为test模块下的test1.js)
        *                                           或者一个绝对路径的js文件, 路径前面带 "/"
        *
        * @param    {string}    _basePath -         指定要导入资源所在的主目录, 这个主要应用于 nginx 路径输出
        * @param    {bool}      _nginxStyle -       指定是否需要使用 nginx 路径输出脚本资源
        *
        * @example
                UXC.use( 'SomeClass' );                              //导入类 SomeClass
                UXC.use( 'SomeClass, AnotherClass' );                //导入类 SomeClass, AnotherClass
                //
                ///  导入类 SomeClass, SomeClass目录下的file1.js, 
                ///  AnotherClass, AnotherClass 下的file2.js
                //
                UXC.use( 'SomeClass, SomeClass/file1.js, AnotherClass/file2.js' );   
                UXC.use( '/js/Test/Test1.js' );                      //导入文件  /js/Test/Test1.js, 如果起始处为 "/", 将视为文件的绝对路径
                //
                /// nginx style 的文件加载方式, 如 /js/??file1.js,file2.js,file3.js
                //
                UXC.use( 'Test1.js, Test2.js ', '/js/??', true );
                //
                /// 导入 URL 资源
                //
                UXC.use( 'http://test.com/file1.js', 'https://another.com/file2.js' );
        */
        , use: 
            function( _names, _basePath, _nginxStyle ){
                if( ! _names ) return;
                var _p = this, _urlRe = /\:\/\//;

                var _paths = [];

                $.each( _names.split(/[\s]*?,[\s]*/), function( _ix, _val ){

                    var _isCustomPath = _urlRe.test(_val) || /\//.test( _val ) || !!_basePath;

                    if( !/\.js$/i.test( _val ) & !_basePath )  _val =  [ _val, '/', _val, '.js' ].join('');

                    if( _isCustomPath ){
                        if( _urlRe.test( _val ) ){} 
                        else if( _basePath && !_nginxStyle ) _val = _basePath + _val;
                        else if( !/[\/\\]/.test( _val.slice( 0, 1 ) ) && !_nginxStyle ) _val = _p.PATH + _val;
                    }else{
                        _val = _p.PATH + _val;
                    }
                    /**
                     * 去除多余的 正叙扛或反叙扛
                     * @private
                     */
                    !_urlRe.test( _val ) && ( _val = _val.replace( /(\\)\1|(\/)\2/g, '$1' ) ); 

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
            },
        /**
         * 获取组件库所在路径
         * @method
         * @private
         * @return     {string}    组件库所在路径(带comps)
         */
        _getPath: 
            function(){
                var _sc = $('script').last(), _path = _sc.attr('src');
                if( /\//.test( _path ) ){ _path = _path.split('/'); _path.pop(); _path = _path.join('/') + '/'; }
                else if( /\\/.test( path ) ){ _path = _path.split('\\'); _path.pop(); _path = _path.join('\\') + '/'; }
                this.PATH = _path + 'comps/';
            },

       /**
        * 输出调试信息, 可通过 UXC.debug 指定是否显示调试信息
        * @param    {[string[,string]]}  任意参数任意长度的字符串内容
        * @method log
        * @static
        */
       log: 
           function(){
                if( !this.debug ) return;
                console.log( [].slice.apply( arguments ).join(' ') );
            }
    };
    /**
     * 如果 console 不可用, 则生成一个模拟的 console 对象
     */
    if( !window.console ) window.console = { log:function(){
        window.status = [].slice.apply( arguments ).join(' ');
    }};
    /**
     * 自动识别组件库所在路径
     */
    UXC._getPath();

}(jQuery));
