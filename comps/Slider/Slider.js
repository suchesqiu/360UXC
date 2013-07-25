;(function($){
    !window.UXC && (window.UXC = { log:function(){} });
    window.ZINDEX_COUNT = window.ZINDEX_COUNT || 50001;

    window.Slider = UXC.Slider = Slider;
    /**
     * Slider 划动菜单类
     * <br />页面加载完毕后, Slider 会查找那些有 class = js_autoSlider 的标签进行自动初始化
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a></p>
     * <p><a href='https://github.com/suchesqiu/360UXC.git' target='_blank'>UXC Project Site</a>
     * | <a href='http://uxc.btbtd.org/uxc_docs/classes/UXC.Slider.html' target='_blank'>API docs</a>
     * | <a href='../../comps/Slider/_demo' target='_blank'>demo link</a></p>
     * <p>
     *      Slider 可以指定的一些常用 html 属性, 这个类的属性很多, 想了解得更详细看源码吧~
     *      <br /><b>slidersubitems</b>: 指定具体子元素是那些, selector ( 子元素默认是 layout的子标签 )
     *      <br /><b>sliderleft</b>: 左移的触发selector
     *      <br /><b>sliderright</b>: 右移的触发selector
     *      <br /><b>sliderwidth</b>: 主容器宽度
     *      <br /><b>slideritemwidth</b>: 子元素的宽度
     *      <br /><b>sliderhowmanyitem</b>: 每次滚动多少个子元素, 默认1
     *      <br /><b>sliderdefaultpage</b>: 默认显示第几页
     *      <br /><b>sliderstepms</b>: 滚动效果运动的间隔时间(毫秒), 默认 5
     *      <br /><b>sliderdurationms</b>: 滚动效果的总时间
     *
     *      <br /><b>sliderdirection</b>: 滚动的方向, 默认 horizontal, { horizontal, vertical }
     *      <br /><b>sliderloop</b>: 是否循环滚动
     *      <br /><b>sliderinitedcb</b>: 初始完毕后的回调函数, 便于进行更详细的声明
     *
     *      <br /><b>sliderautomove</b>: 是否自动滚动
     *      <br /><b>sliderautomovems</b>: 自动滚动的间隔
     * </p>
     * @namespace UXC
     * @class Slider
     * @constructor
     * @param   {selector|string}   _selector   
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 75 Team
     * @date    2013-07-20
     * @example
            <style>
                .hslide_list dd{ display: none; }

                .hslide_list dd, .hslide_list dd img{
                    width: 160px;
                    height: 230px;
                }

                .slider_one_item dd, .slider_one_item dd img{
                    width: 820px;
                    height: 230px;
                }
            </style>
            <link href='../../Slider/res/hslider/style.css' rel='stylesheet' />
            <script src="../../../lib.js"></script>
            <script>
                UXC.debug = true;
                UXC.use( 'Slider' );

                function sliderinitedcb(){
                    var _sliderIns = this;

                    UXC.log( 'sliderinitedcb', new Date().getTime() );

                    _sliderIns.on('outmin', function(){
                        UXC.log( 'slider outmin' );
                    }).on('outmax', function(){
                        UXC.log( 'slider outmax' );
                    }).on('movedone', function( _evt, _oldpointer, _newpointer){
                        UXC.log( 'slider movedone', _evt, _oldpointer, _newpointer );
                    }).on('beforemove', function( _evt, _oldpointer, _newpointer ){
                        UXC.log( 'slider beforemove', _evt, _oldpointer, _newpointer );
                    });
                }
            </script>
            <table class="hslide_wra">
                <tr>
                    <td class="hslide_left">
                        <a href="javascript:" hidefocus="true" style="outline:none;" class="js_slideleft">左边滚动</a>
                    </td>
                    <td class="hslide_mid">
                        <dl 
                            style="width:820px; height: 230px; margin:0 5px;"
                            class="hslide_list clearfix js_slideList js_autoSlider" 
                            slidersubitems="> dd" sliderleft="a.js_slideleft" sliderright="a.js_slideright" 
                            sliderwidth="820" slideritemwidth="160"
                            sliderdirection="horizontal" sliderhowmanyitem="5"
                            sliderloop="false" sliderdurationms="300"
                            sliderinitedcb="sliderinitedcb"
                            >
                            <dd style="display: block; left: 0; " class="tipsItem">content...</dd>
                            <dd style="display: block; left: 0; " class="tipsItem">content...</dd>
                            <dd style="display: block; left: 0; " class="tipsItem">content...</dd>
                        </dl>
                    </td>
                    <td class="hslide_right">
                        <a href="javascript:" hidefocus="true" style="outline:none;" class="js_slideright">右边滚动</a>
                    </td>
                </tr>
            </table>

     */
    function Slider( _layout ){
        _layout && ( _layout = $( _layout ) );
        if( Slider.getInstance( _layout ) ) return Slider.getInstance( _layout );
        Slider.getInstance( _layout, this );

        UXC.log( 'Slider constructor', new Date().getTime() );

        /**
         * 初始化数据模型
         */
        this._model = new Model( _layout );
        /**
         * 初始化视图模型( 根据不同的滚动方向, 初始化不同的视图类 )
         */
        switch( this._model.direction() ){
            case 'vertical': this._view = new VerticalView( this._model, this ); break;
            default: this._view = new HorizontalView( this._model, this ); break;
        }

        this._init();
    }
    /**
     * 页面加载完毕后, 是否自动初始化 带有 class=js_autoSlider 的应用
     * @property   autoInit
     * @type    bool
     * @default true
     * @static
     */
    Slider.autoInit = true;
    /**
     * 批量初始化 Slider
     * @method init
     * @param   {selector}  _selector
     * @return array
     * @static
     */
    Slider.init =
        function( _selector ){
            var _insls = [];
            _selector && ( _selector = $(_selector) );

            if( _selector && _selector.length ){
                if( Slider.isSlider( _selector ) ){
                    if( Slider.getInstance( _selector ) ){
                        return [ Slider.getInstance( _selector ) ];
                    }
                    _insls.push( new Slider( _selector ) );
                }else{
                    _selector.find( 'div.js_autoSlider, dl.js_autoSlider'
                                    +', ul.js_autoSlider, ol.js_autoSlider' ).each(function(){
                        if( Slider.isSlider( this ) ){
                            if( Slider.getInstance( $(this) ) ){
                                _insls.push( Slider.getInstance( $(this) ) );
                                return;
                            }
                            _insls.push( new Slider( $(this) ) );
                        }
                    });
                }
            }
            return _insls;
        };

    Slider.getInstance =
        function( _selector, _ins ){
            _ins && _selector && $(_selector).data( 'SliderIns', _ins );
            return _selector ? $(_selector).data('SliderIns') : null;
        };

    Slider.isSlider =
        function( _selector ){
            _selector && ( _selector = $(_selector) );
            return _selector && ( _selector.is( '[sliderwidth]' ) || _selector.is( '[sliderheight]' ) );
        };
    
    Slider.prototype = {
        _init:
            function(){
                var _p = this;

                _p._model.leftbutton() 
                    && _p._model.leftbutton().on( 'click', function( _evt ){
                        _p.trigger('cleartimeout');
                        _p.trigger('movetoleft');
                        _p._view.move( 1 );
                    })
                    .on('mouseenter', function(){ _p.trigger('controlover'); } )
                    .on('mouseleave', function(){ _p.trigger('controlout'); } )
                ;

                _p._model.rightbutton() 
                    && _p._model.rightbutton().on( 'click', function( _evt ){
                        _p.trigger('cleartimeout');
                        _p.trigger('movetoright');
                        _p._view.move();
                    })
                    .on('mouseenter', function(){ _p.trigger('controlover'); } )
                    .on('mouseleave', function(){ _p.trigger('controlout'); } )
                ;

                _p.on('cleartinterval', function(){
                    _p._model.clearInterval();
                    _p._view.setPagePosition();
                });

                _p.on('cleartimeout', function(){
                    _p._model.clearTimeout();
                });

                _p._initAutoMove();

                _p._model.initedcb() && _p.on('inited', _p._model.initedcb() );
                _p.trigger( 'inited' );

                return this;
            }    

        , on: 
            function( _evtName, _cb ){
                $(this).on( _evtName, _cb );
                return this;
            }

        , trigger: 
            function( _evtName ){
                $(this).trigger(_evtName);
                return this;
            }

        , move: function( _backwrad ){ this._view.move( _backwrad ); return this; }
        , moveTo: function( _newpointer ){ this._view.moveTo( _newpointer ); return this; }
        , totalpage: function(){ return this._model.totalpage(); }
        , pointer: function(){ return this._model.pointer(); }
        , page: function( _ix ){ return this._model.page( _ix ); }
        , layout: function(){ return this._model.layout(); }
        , find: function( _selector ){ return this._model.layout().find( _selector ) }

        , _initAutoMove:
            function(){
                var _p = this;
                if( !_p._model.automove() ) return;

                _p.on('beforemove', function( _evt, _oldpointer, _newpointer ){
                    _p.trigger('cleartimeout');
                });

                _p.on('movedone', function( _evt, _oldpointer, _newpointer ){
                    if( _p._model.controlover() ) return;
                    _p.trigger('automove');
                });

                _p._model.layout().on( 'mouseenter', function( _evt ){
                    _p.trigger('cleartimeout');
                    _p.trigger('mouseenter');
                });

                _p._model.layout().on( 'mouseleave', function( _evt ){
                    _p.trigger('cleartimeout');
                    _p.trigger('mouseleave');
                    _p._view.setPagePosition();
                    _p.trigger('automove');
                });

                _p.on('controlover', function(){
                    _p.trigger('cleartimeout');
                    _p._model.controlover( true );
                });

                _p.on('controlout', function(){
                    _p.trigger('automove');
                    _p._model.controlover( false );
                });

                _p.on('movetoleft', function(){
                    _p._model.moveDirection( false );
                });

                _p.on('movetoright', function(){
                    _p._model.moveDirection( true );
                });

                $( _p ).on('automove', function(){
                    _p._model.timeout( setTimeout( function(){
                        _p._view.moveTo( _p._model.automoveNewPointer() );
                    }, _p._model.automovems() ));
                });

                _p.trigger('automove');
            }
    }
    
    function Model( _layout ){
        this._layout = _layout;

        this._leftbutton = _layout.is( '[sliderleft]' ) ? $( _layout.attr('sliderleft') ) : null;
        this._rightbutton = _layout.is( '[sliderright]' ) ? $( _layout.attr('sliderright') ) : null;
        this._width = parseInt( _layout.attr('sliderwidth'), 10 ) || 0;
        this._height = parseInt( _layout.attr('sliderheight'), 10 ) || 0;
        this._itemwidth = parseInt( _layout.attr('slideritemwidth'), 10 ) || 0;
        this._itemheight = parseInt( _layout.attr('slideritemheight'), 10 ) || 0;

        this._direction = _layout.attr('sliderdirection').toLowerCase() || 'horizontal';
        this._howmanyitem = parseInt( _layout.attr('sliderhowmanyitem'), 10 ) || 1;

        _layout.is('[sliderinitedcb]') 
            && window[ _layout.attr('sliderinitedcb') ]
            && ( this._initedcb = window[ _layout.attr('sliderinitedcb') ] );

        this._defaultpage = parseInt( _layout.attr('sliderdefaultpage'), 10 ) || 0;
        this._stepms = parseInt( _layout.attr('sliderstepms'), 10 ) || 10;
        this._durationms = parseInt( _layout.attr('sliderdurationms'), 10 ) || 300;

        this._loop = parseBool( _layout.attr('sliderloop') );
        this._automove = parseBool( _layout.attr('sliderautomove') );
        this._automovems = parseInt( _layout.attr('sliderautomovems'), 10 ) || 2000;

        this._totalpage;
        this._subitems;
        this._pointer;
        this._interval;
        this._timeout;
        this._moveDirection = true;
        
        this._init();
    }
    
    Model.prototype = {
        _init:
            function(){
                this.subitems();

                UXC.log( printf('w:{0}, h:{1}, iw:{2}, ih:{3}, dr:{4}, si:{6}, hi:{5}, totalpage:{7}'
                            , this._width, this._height
                            , this._itemwidth, this._itemheight
                            , this._direction, this._howmanyitem
                            , this._subitems.length
                            , this.totalpage()
                ));

                return this;
            }
        , layout: function(){ return this._layout; }
        , leftbutton: function(){ return this._leftbutton; }
        , rightbutton: function(){ return this._rightbutton; }
        , direction: function(){ return this._direction; }
        , howmanyitem: function(){ return this._howmanyitem; }
        , width: function(){ return this._width; }
        , itemwidth: function(){ return this._itemwidth; }
        , loop: function(){ return this._loop; }
        , stepms: function(){ return this._stepms; }
        , durationms: function(){ return this._durationms; }
        , initedcb: function(){ return this._initedcb; }
        , automove: function(){ return this._automove; }
        , automovems: function(){ return this._automovems; }
        , totalpage:
            function(){
                this.subitems();
                if( this.howmanyitem() > 1 ){
                    this._totalpage = Math.ceil( this._subitems.length / this.howmanyitem() );
                }else{
                    this._totalpage = this._subitems.length;
                }
                return this._totalpage;
            }
        , subitems:
            function(){
                if( this._layout.is( '[slidersubitems]' ) ){
                    this._subitems = this._layout.find( this._layout.attr('slidersubitems') );
                }else{
                    this._subitems = this._layout.children();
                }
                return this._subitems;
            }
        , page:
            function( _index ){
                !_index && ( _index = 0 );
                _index < 0 && ( _index = 0 );
                _index >= this._totalpage && ( _index = this._totalpage - 1 );
                _index *= this.howmanyitem();
                var _r = [];
                for( var i = _index, count = 0; count < this.howmanyitem() && i < this._subitems.length; i++, count++ ){
                    _r.push( $(this._subitems[i]) );
                }
                return _r;
            }
        , pointer: 
            function( _setter ){ 
                if( typeof this._pointer == 'undefined' ) this._pointer = this._defaultpage;
                if( typeof _setter != 'undefined' ) this._pointer = this.fixpointer( _setter );
                return this._pointer;
            }
        , newpointer:
            function( _isbackward ){
                var _r = this.pointer();
                _isbackward && _r--;
                !_isbackward && _r++;

                _r = this.fixpointer( _r );
                return _r;
            }
        , automoveNewPointer:
            function(){
                var _r = this.pointer();
                if( this._moveDirection ){
                    _r++;
                }else{
                    _r--;
                }

                if( this._loop ){
                    if( _r >= this.totalpage() ){
                        _r = 0;
                    }else if( _r < 0 ){
                        _r = this.totalpage() - 1;
                    }
                }else{
                    if( _r >= this.totalpage() ){
                        _r = this.totalpage() - 2;
                        this._moveDirection = false;
                    }else if( _r < 0 ){
                        _r = 1
                        this._moveDirection = true;
                    }
                }
                return _r;
            }
        , moveDirection:
            function( _setter ){
                typeof _setter != 'undefined' && ( this._moveDirection = _setter );
                UXC.log( 'moveDirection', this._moveDirection );
                return this._moveDirection;
            }

        , fixpointer:
            function( _pointer ){
                var _r = _pointer;
                if( this.loop() ){
                    _r < 0 && ( _r = this.totalpage() - 1 );
                    _r >= this.totalpage() && ( _r = 0 );
                }else{
                    _r < 0 && ( _r = 0 );
                    _r >= this.totalpage() && ( _r = this.totalpage() - 1 );
                }
                return _r;
            }
        , interval:
            function( _setter ){
                typeof _setter != 'undefined' && ( this._interval = _setter );
                return this._interval;
            }

        , 'clearInterval':
            function(){
                this.interval() && clearInterval( this.interval() );
            }

        , timeout:
            function( _setter ){
                typeof _setter != 'undefined' && ( this._timeout = _setter );
                return this._timeout;
            }

        , 'clearTimeout':
            function(){
                this.timeout() && clearTimeout( this.timeout() );
            }

        , controlover:
            function( _setter ){
                typeof _setter != 'undefined' && ( this._controlover = _setter );
                return this._controlover;
            }
    };
    
    function HorizontalView( _model, _slider ){
        this._model = _model;
        this._slider = _slider;

        this._itemspace = 
                        ( 
                            this._model.width() - 
                            Math.floor( this._model.width() / this._model.itemwidth() ) * this._model.itemwidth()
                        )
                        / ( this._model.totalpage() - 1 );
        this._itemspace = parseInt( this._itemspace );

        this._init();
    }

    HorizontalView.prototype = {
        _init:
            function() {
                this.setPagePosition( this._model.pointer() );

                return this;
            }

        , move:
            function( _backwrad ){
                var _p = this;
                _backwrad = !!_backwrad;
                UXC.log( 'HorizontalView move, is backwrad', _backwrad, this._model.pointer() );

                var _newpointer = this._model.newpointer( _backwrad );
                UXC.log( printf( 'is backwrad: {0}, pointer:{1}, new pointer:{2}'
                            , _backwrad, this._model.pointer(), _newpointer
                            ));

                this.moveTo( _newpointer );
            }

        , moveTo:
            function( _newpointer ){
                var _p = this;

                if( !this._model.loop() ){
                    if( _newpointer <= this._model.pointer() && this._model.pointer() === 0 ){
                        $(this._slider).trigger( 'outmin' );
                        return;
                    }
                    if( _newpointer >= this._model.pointer() && this._model.pointer() >= this._model.totalpage() - 1 ){
                        $(this._slider).trigger( 'outmax' );
                        return;
                    }
                }

                _newpointer = this._model.fixpointer( _newpointer );
                var _oldpointer = this._model.pointer();
                if( _newpointer === _oldpointer ) return;


                var _opage = this._model.page( _oldpointer )
                    , _npage = this._model.page( _newpointer );
                ;
                var _concat = _opage.concat( _npage );

                this._setNewPagePosition( _opage, _npage, _oldpointer, _newpointer );
                _p._model.pointer( _newpointer );
            }

        , _setNewPagePosition:
            function( _opage, _npage, _oldpointer, _newpointer ){
                var _p = this, _begin, _concat = _opage.concat( _npage ), _isPlus;

                $( this._slider ).trigger( 'cleartinterval' );

                if( _oldpointer < _newpointer ){
                    _begin = this._model.width() + this._itemspace;
                }else{
                    _begin = -( this._model.width() + this._itemspace );
                    _isPlus = true;
                }

                _oldpointer === (_p._model.totalpage() - 1 ) 
                    && _newpointer === 0 
                    && ( _begin = this._model.width() + this._itemspace, _isPlus = false );

                _oldpointer === 0 
                    && _newpointer === (_p._model.totalpage() - 1 ) 
                    && ( _begin = -( this._model.width() + this._itemspace ), _isPlus = true );

                $.each( _npage, function( _ix, _item ){
                    var _sp = $(_item);
                        _sp.css( { 'left': _begin + _p._model.itemwidth() * _ix + _p._itemspace * _ix + 'px' } );
                        _sp.show();
                });
                $( _p._slider ).trigger( 'beforemove', [_oldpointer, _newpointer] );

                $.each( _concat, function(_ix, _item){
                    _item.data('TMP_LEFT', _item.prop('offsetLeft') );
                });

                UXC.log( 'zzzzzzzzzz', _begin, this._itemspace, this._model.moveDirection() );
                _p._model.interval( easyEffect( function( _step, _done ){
                    //UXC.log( _step );
                    $( _concat ).each(function( _ix, _item ){
                        _item.css( {'left': _item.data('TMP_LEFT') +  (_isPlus? _step : -_step ) + 'px' } );
                    });

                    if( _done ){
                        $( _opage ).each( function( _ix, _item ){ _item.hide(); } );
                        $( _p._slider ).trigger( 'movedone', [_oldpointer, _newpointer] );
                        _p._model.pointer( _newpointer );
                        _p.setPagePosition();
                    }

                   }, this._model.width(), 0, this._model.durationms(), this._model.stepms() )
               );
            }

        , setPagePosition:
            function( _ix ){
                UXC.log( 'view setPagePosition', new Date().getTime() );
                typeof _ix == 'undefined' && ( _ix = this._model.pointer() );
                this._model.subitems().hide();
                var _page = this._model.page( _ix );
                for( var i = 0, j = _page.length; i < j; i++ ){
                    _page[i]
                        .css( { 'left': i * this._model.itemwidth() + i * this._itemspace  + 'px' } )
                        .show()
                        ;
                }
                UXC.log( _page.length );
            }
    };

    function VerticalView( _model, _slider ){
        this._model = _model;
        this._slider = _slider;
        this._itemspace = 0;
        this._init();
    }

    VerticalView.prototype = {
        _init:
            function() {
                this.setPagePosition( this._model.pointer() );
                return this;
            }

        , move:
            function( _backwrad ){
                var _p = this;
                _backwrad = !!_backwrad;
                UXC.log( 'VerticalView move, is backwrad', _backwrad, this._model.pointer() );

                var _newpointer = this._model.newpointer( _backwrad );
                UXC.log( printf( 'is backwrad: {0}, pointer:{1}, new pointer:{2}'
                            , _backwrad, this._model.pointer(), _newpointer
                            ));

                this.moveTo( _newpointer );
            }

        , moveTo:
            function( _newpointer ){
                var _p = this;

                if( !this._model.loop() ){
                    if( _newpointer <= this._model.pointer() && this._model.pointer() === 0 ){
                        $(this._slider).trigger( 'outmin' );
                        return;
                    }
                    if( _newpointer >= this._model.pointer() && this._model.pointer() >= this._model.totalpage() - 1 ){
                        $(this._slider).trigger( 'outmax' );
                        return;
                    }
                }

                _newpointer = this._model.fixpointer( _newpointer );
                var _oldpointer = this._model.pointer();
                if( _newpointer === _oldpointer ) return;


                var _opage = this._model.page( _oldpointer )
                    , _npage = this._model.page( _newpointer );
                ;
                var _concat = _opage.concat( _npage );

                this._setNewPagePosition( _opage, _npage, _oldpointer, _newpointer );
                _p._model.pointer( _newpointer );
            }

        , _setNewPagePosition:
            function( _opage, _npage, _oldpointer, _newpointer ){
                var _p = this, _begin, _concat = _opage.concat( _npage ), _isPlus;
              }

        , setPagePosition:
            function( _ix ){
                UXC.log( 'view setPagePosition', new Date().getTime() );
            }

    };

    $(document).ready(function(){
        if( !Slider.autoInit ) return;
        Slider.init( document.body );
    });
    

}(jQuery));
