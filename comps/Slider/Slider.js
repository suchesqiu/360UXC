;(function($){
    !window.UXC && (window.UXC = { log:function(){} });
    window.ZINDEX_COUNT = window.ZINDEX_COUNT || 50001;

    window.Slider = UXC.Slider = Slider;
    /**
     * Slider 类
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a></p>
     * <p><a href='https://github.com/suchesqiu/360UXC.git' target='_blank'>UXC Project Site</a>
     * | <a href='http://uxc.btbtd.org/uxc_docs/classes/UXC.Slider.html' target='_blank'>API docs</a>
     * | <a href='../../comps/Slider/_demo' target='_blank'>demo link</a></p>
     * @namespace UXC
     * @class Slider
     * @constructor
     * @param   {selector|string}   _selector   
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 75 Team
     * @date    2013-07-20
     * @example
     */
    function Slider( _layout ){
        _layout && ( _layout = $( _layout ) );
        if( Slider.getInstance( _layout ) ) return Slider.getInstance( _layout );
        Slider.getInstance( _layout, this );

        UXC.log( 'Slider constructor', new Date().getTime() );

        this._model = new Model( _layout );

        switch( this._model.direction() ){
            default: this._view = new HorizontalView( this._model ); break;
        }

        this._init();
    }

    Slider.autoInit = true;

    Slider.init =
        function( _selector ){
            var _insls = [];
            _selector && ( _selector = $(_selector) );

            if( _selector && _selector.length ){
                if( Slider.isSlider( _selector ) ){
                    _insls.push( new Slider( _selector ) );
                }else{
                    _selector.find( 'div.js_autoSlider, dl.js_autoSlider'
                                    +', ul.js_autoSlider, ol.js_autoSlider' ).each(function(){
                        if( Slider.isSlider( this ) ){
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

                this._model.leftbutton() 
                    && this._model.leftbutton().on( 'click', function( _evt ){
                        _p._view.move( 1 );
                    });

                this._model.rightbutton() 
                    && this._model.rightbutton().on( 'click', function( _evt ){
                        _p._view.move();
                    });

                return this;
            }    
    }
    
    function Model( _layout ){
        this._layout = _layout;

        this._leftbutton = _layout.is( '[sliderleft]' ) ? $( _layout.attr('sliderleft') ) : null;
        this._rightbutton = _layout.is( '[sliderright]' ) ? $( _layout.attr('sliderright') ) : null;
        this._width = _layout.is( '[sliderwidth]' ) ? parseInt( _layout.attr('sliderwidth'), 10 ) : 0;
        this._height = _layout.is( '[sliderheight]' ) ? parseInt( _layout.attr('sliderheight'), 10 ) : 0;
        this._itemwidth = _layout.is( '[slideritemwidth]' ) ? parseInt( _layout.attr('slideritemwidth'), 10 ) : 0;
        this._itemheight = _layout.is( '[slideritemheight]' ) ? parseInt( _layout.attr('slideritemheight'), 10 ) : 0;

        this._direction = _layout.is( '[sliderdirection]' ) ? _layout.attr('sliderdirection').toLowerCase() : 'horizontal';
        this._howmanyitem = _layout.is( '[sliderhowmanyitem]' ) ? parseInt( _layout.attr('sliderhowmanyitem'), 10 ) || 1 : 1;

        this._defaultpage = _layout.is( '[sliderdefaultpage]' ) ? parseInt( _layout.attr('sliderdefaultpage'), 10 ) || 0 : 0;
        this._stepms = _layout.is( '[sliderstepms]' ) ? parseInt( _layout.attr('sliderstepms'), 10 ) || 2 : 2;
        this._durationms = _layout.is( '[sliderdurationms]' ) ? parseInt( _layout.attr('sliderdurationms'), 10 ) || 300 : 300;

        _layout.attr('sliderloop') && _layout.attr( 'sliderloop', _layout.attr('sliderloop').toLowerCase() );
        this._loop;
        _layout.attr('sliderloop') 
            && _layout.attr('sliderloop') != 'false' 
            && _layout.attr('sliderloop') != '0' 
            && _layout.attr('sliderloop') != 'null' 
            && ( this._loop = true );

        this._totalpage;
        this._subitems;
        this._pointer;
        
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
        , leftbutton: function(){ return this._leftbutton; }
        , rightbutton: function(){ return this._rightbutton; }
        , direction: function(){ return this._direction; }
        , howmanyitem: function(){ return this._howmanyitem; }
        , width: function(){ return this._width; }
        , itemwidth: function(){ return this._itemwidth; }
        , loop: function(){ return this._loop; }
        , stepms: function(){ return this._stepms; }
        , durationms: function(){ return this._durationms; }
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
    };
    
    function HorizontalView( _model ){
        this._model = _model;

        this._itemspace = 
                        ( 
                            this._model.width() - 
                            Math.floor( this._model.width() / this._model.itemwidth() ) * this._model.itemwidth()
                        )
                        / ( this._model.totalpage() - 1 );

        this._interval;

        this._init();
    }

    HorizontalView.prototype = {
        _init:
            function() {
                this._setPagePosition( this._model.pointer() );

                return this;
            }

        , move:
            function( _backwrad ){
                var _p = this;
                _backwrad = !!_backwrad;
                UXC.log( 'HorizontalView move, is backwrad', _backwrad, this._model.pointer() );

                if( !this._model.loop() ){
                    if( _backwrad && this._model.pointer() === 0 ){
                        return;
                    }
                    if( !_backwrad && this._model.pointer() >= this._model.totalpage() - 1 ){
                        return;
                    }
                }

                if( this._interval ){
                    clearInterval( this._interval );
                    this._setPagePosition( this._model.pointer() );
                }
                var _newpointer = this._model.newpointer( _backwrad );
                UXC.log( printf( 'is backwrad: {0}, pointer:{1}, new pointer:{2}'
                            , _backwrad, this._model.pointer(), _newpointer
                            ));

                this.moveTo( _newpointer );
            }

        , moveTo:
            function( _newpointer ){
                var _p = this;
                _newpointer = this._model.fixpointer( _newpointer );
                var _oldpointer = this._model.pointer();
                if( _newpointer === _oldpointer ) return;

                _p._model.pointer( _newpointer );

                var _opage = this._model.page( _oldpointer )
                    , _npage = this._model.page( _newpointer );
                ;
                var _concat = _opage.concat( _npage );

                this._setNewPagePosition( _opage, _npage, _oldpointer, _newpointer );


            }

        , _setNewPagePosition:
            function( _opage, _npage, _oldpointer, _newpointer ){
                var _p = this, _begin, _concat = _opage.concat( _npage ), _isPlus;

                if( _oldpointer < _newpointer ){
                    _begin = this._model.width();
                }else{
                    _begin = -this._model.width();
                    _isPlus = true;
                }

                _oldpointer === (_p._model.totalpage() - 1 ) 
                    && _newpointer === 0 
                    && ( _begin = this._model.width(), _isPlus = false );

                _oldpointer === 0 
                    && _newpointer === (_p._model.totalpage() - 1 ) 
                    && ( _begin = -this._model.width(), _isPlus = true );

                $.each( _npage, function( _ix, _item ){
                    var _sp = $(_item);
                        _sp.css( { 'left': _begin + _p._model.itemwidth() * _ix + _p._itemspace * _ix + 'px' } );
                        _sp.show();
                });

                $.each( _concat, function(_ix, _item){
                    _item.data('TMP_LEFT', _item.prop('offsetLeft') );
                });

                _p.interval = easyEffect( function( _step, _done ){
                    UXC.log( _step );
                    $( _concat ).each(function( _ix, _item ){
                        _item.css( {'left': _item.data('TMP_LEFT') +  (_isPlus? _step : -_step ) + 'px' } );
                    });

                    if( _done ){
                        $( _opage ).each( function( _ix, _item ){ _item.hide(); } );
                    }

                }, this._model.width(), 0, this._model.durationms(), this._model.stepms() );
            }

        , _setPagePosition:
            function( _ix ){
                UXC.log( 'view _setPagePosition', new Date().getTime() );
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

    $(document).ready(function(){
        if( !Slider.autoInit ) return;
        Slider.init( document.body );
    });
    

}(jQuery));
