;(function( $ ){
    /**
     * UXC jquery 组件库 资源调用控制类
     * <br />这是一个单例模式, 全局访问使用 UXC 或 window.UXC
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a></p>
     * <p><a href='https://github.com/suchesqiu/360UXC.git' target='_blank'>UXC Project Site</a>
     * | <a href='http://uxc.btbtd.org/uxc_docs/classes/window.UXC.html' target='_blank'>API docs</a>
     * | <a href='../../_demo' target='_blank'>demo link</a></p>
     * @class UXC
     * @namespace   window
     * @static
     * @example 
     *      UXC.use( 组件名[,组件名] );
     * @author  qiushaowei   <suches@btbtd.org> | 360 UXC-FE Team
     * @date    2013-05-22
     */
    window.UXC = {
        /**
         * UXC组件库所在路径
         * @property    PATH
         * @static
         * @type {string}
         */
        PATH: '/js'
        , compsDir: '/comps/'
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
        * @param    {bool}      _enableNginxStyle -       指定是否需要使用 nginx 路径输出脚本资源
        *
        * @example
                UXC.use( 'SomeClass' );                              //导入类 SomeClass
                UXC.use( 'SomeClass, AnotherClass' );                //导入类 SomeClass, AnotherClass
                //
                ///  导入类 SomeClass, SomeClass目录下的file1.js, 
                ///  AnotherClass, AnotherClass 下的file2.js
                //
                UXC.use( 'SomeClass, comps/SomeClass/file1.js, comps/AnotherClass/file2.js' );   
                UXC.use( 'SomeClass, plugins/swfobject.js., plugins/json2.js' );   
                UXC.use( '/js/Test/Test1.js' );     //导入文件  /js/Test/Test1.js, 如果起始处为 "/", 将视为文件的绝对路径
                //
                /// 导入 URL 资源 // UXC.use( 'http://test.com/file1.js', 'https://another.com/file2.js' ); 
        */ 
        , use: function( _items ){
                if( ! _items ) return;
                var _p = this, _paths = [], _parts = $.trim( _items ).split(/[\s]*?,[\s]*/)
                   , _pathRe = /[\/\\]/, _urlRe = /\:\/\//, _pathRplRe = /(\\)\1|(\/)\2/g;

                $.each( _parts, function( _ix, _part ){
                    var _isComps = !_pathRe.test( _part ), _path, _isFullpath = /^\//.test( _part );
                    if( _isComps && window.UXC[ _part ] ) return;

                    _path = _part;
                    _isComps && ( _path = printf( '{0}{1}{2}/{2}.js', UXC.PATH, UXC.compsDir, _part ) );
                    !_isComps && !_isFullpath && ( _path = printf( '{0}/{1}', UXC.PATH, _part ) );

                    if( /\:\/\//.test( _path ) ){
                        _path = _path.split('://');
                        _path[1] = $.trim( _path[1].replace( _pathRplRe, '$1$2' ) );
                        _path = _path.join('://');
                    }else{
                        _path = $.trim( _path.replace( _pathRplRe, '$1$2' ) );
                    }
                    _paths.push( _path );
                });

                UXC.log( _paths );

                !UXC.enableNginxStyle && UXC._writeNormalScript( _paths );
                UXC.enableNginxStyle && UXC._writeNginxScript( _paths );
            }
       /**
        * 输出调试信息, 可通过 UXC.debug 指定是否显示调试信息
        * @param    {[string[,string]]}  任意参数任意长度的字符串内容
        * @method log
        * @static
        */
       , log: 
           function(){
                if( !this.debug ) return;
                console.log( [].slice.apply( arguments ).join(' ') );
            }
       /**
        * 定义输出路径的 v 参数, 以便控制缓存
        * @property     pathPostfix
        * @type     string
        * @default  empty
        */
       , pathPostfix: ''
       /**
        * 是否启用nginx concat 模块的路径格式  
        * @property     enableNginxStyle
        * @type bool
        * @default  false
        */
       , enableNginxStyle: false
       /**
        * 定义 nginx style 的基础路径
        * <br /><b>注意:</b> 如果这个属性为空, 即使 enableNginxStyle = true, 也是直接输出默认路径 
        * @property     nginxBasePath
        * @type string
        * @default  empty
        */
       , nginxBasePath: ''
       /**
        * 输出 nginx concat 模块的脚本路径格式
        * @method   _writeNginxScript
        * @param    {array} _paths
        * @private
        */
       , _writeNginxScript:
            function( _paths ){
                if( !UXC.enableNginxStyle ) return;
                for( var i = 0, j = _paths.length, _ngpath = [], _npath = []; i < j; i++ ){
                    UXC.log( _paths[i].slice( 0, UXC.nginxBasePath.length ).toLowerCase(), UXC.nginxBasePath.toLowerCase() );
                    if(  
                         _paths[i].slice( 0, UXC.nginxBasePath.length ).toLowerCase() 
                        == UXC.nginxBasePath.toLowerCase() )
                    {
                        _ngpath.push( _paths[i].slice( UXC.nginxBasePath.length ) );
                    }else{
                        _npath.push( _paths[i] );
                    }
                }

                var _postfix = UXC.pathPostfix ? '?v=' + UXC.pathPostfix : '';

                _ngpath.length && document.write( printf( '<script src="{0}??{1}{2}"><\/script>'
                                                    , UXC.nginxBasePath, _ngpath.join(','), _postfix ) );
                _npath.length && UXC._writeNormalScript( _npath );
            }
       /**
        * 输出的脚本路径格式
        * @method   _writeNormalScript
        * @param    {array} _paths
        * @private
        */
       , _writeNormalScript:
            function( _paths ){
                var _postfix = UXC.pathPostfix ? '?v=' + UXC.pathPostfix : '';
                for( var i = 0, j = _paths.length, _path; i < j; i++ ){
                    _path = _paths[i];
                    UXC.pathPostfix && ( _path = add_url_params( _path, { 'v': UXC.pathPostfix } ) );
                    _paths[i] = printf( '<script src="{0}"><\/script>', _path );
                }
                _paths.length && document.write( _paths.join('') );
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
    UXC.PATH = script_path_f();
}(jQuery));

