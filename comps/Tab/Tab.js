;(function($){
    !window.UXC && (window.UXC = { log:function(){} });

    window.Tab = UXC.Tab = Tab;

    function Tab( _selector, _triggerTarget ){
        _selector && ( _selector = $( _selector ) );
        _triggerTarget && ( _triggerTarget = $( _triggerTarget) );
        if( Tab.getInstance( _selector ) ) return Tab.getInstance( _selector );

        this._model = new Model( _selector, _triggerTarget );
        this._view = new View( this._model );

        UXC.log( 'initing tab' );
        this._init();
    }

    Tab.autoInit = true;
    Tab.activeClass = 'cur';

    Tab.getInstance = 
        function( _selector, _setter ){
            var _r;
            _selector && ( _selector = $(_selector) ).length && (
                typeof _setter != 'undefined' && _selector.data('TabgetInstance', _setter)
                , _r =  _selector.data('TabgetInstance')
            );
            return _r;
        };

    Tab.prototype = {
        _init:
            function(){
                if( !this._model.layoutIsTab() ) return this;
                Tab.getInstance( this._model.layout(), this );
                this._view.init();

                var _triggerTarget = $(this._model.triggerTarget());
                _triggerTarget && _triggerTarget.length 
                && _triggerTarget.data( 'TabLabel' ) && _triggerTarget.trigger('click');

                return this;
            }    

        , active:
            function( _label ){
                var _ix;
                if( typeof _label == 'number' ) _ix = _label;
                else{
                    _label && $(_label).length && ( _ix = $(_label).data( 'TabIndex' ) );
                }

                typeof _ix != 'undefined' && ( this._view.active( _ix ) );
            }
    }
    
    function Model( _selector, _triggerTarget ){
        this._layout = _selector;
        this._triggerTarget = _triggerTarget;

        this._tabLabels;
        this._tabContents;

        this.currentIndex;
        
        this._init();
    }
    
    Model.prototype = {
        _init:
            function(){
                if( !this.layoutIsTab() ) return;
                this._tabLabels = $( this.layout().attr('tablabels') );
                this._tabContents = $( this.layout().attr('tabcontents') );

                this._tabLabels.each( function(){ $(this).data('TabLabel', 1 ); } );
                this._tabContents.each( function(){ $(this).data('TabContent', 1 ) } );

                this._tabLabels.each( function( _ix ){ $(this).data( 'TabIndex', _ix ); });

                return this;
            }

        , layout: function(){ return this._layout; }
        , tabLabels: function( _ix ){ 
            if( typeof _ix != 'undefined' ) return $( this._tabLabels[_ix] );
            return this._tabLabels; 
        }
        , tabContents: function( _ix ){ 
            if( typeof _ix != 'undefined' ) return $( this._tabContents[_ix] );
            return this._tabContents; 
        }
        , triggerTarget: function(){ return this._triggerTarget; }
        , layoutIsTab: function(){ return this.layout().attr('tablabels') && this.layout().attr('tabcontents'); }
        , activeClass: function(){ return this.layout().attr('tabactiveclass') || Tab.activeClass; }
    };
    
    function View( _model ){
        this._model = _model;
    }
    
    View.prototype = {
        init:
            function() {
                UXC.log( 'Tab.View:', new Date().getTime() );
                var _p = this;
                this._model.tabLabels().on( 'click', function( _evt ){
                    var _sp = $(this);
                    if( typeof _p._model.currentIndex !== 'undefined' && _p._model.currentIndex === _sp.data('TabIndex') ) return;
                        _p._model.currentIndex = _sp.data('TabIndex');
                    UXC.log( 'Tab label click',  _sp.data('TabIndex'), new Date().getTime() );
                    _p._model.layout().is('[tabclcikcallback]') && window[ _p._model.layout().attr('tabclickcallback') ]
                        && window[ _p._model.layout().attr('tabclickcallback') ].call( _p._model.tabLabels( _ix ), this );
                    _p.active( _sp.data('TabIndex') );
                });

                return this;
            }

        , active:
            function( _ix ){
                if( typeof _ix == 'undefined' ) return;
                var _p = this, _activeClass = this._model.activeClass(), _activeItem = this._model.tabLabels( _ix );
                this._model.tabLabels().each( function(){
                    var _sp = $(this);
                    _p._model.layout().is('[tablabelparent]') && ( _sp = _sp.parent( _p._model.layout().attr('tablabelparent') ) );
                    _sp && _sp.length && _sp.removeClass( _activeClass );
                });
                _p._model.layout().is('[tablabelparent]') && ( _activeItem = _activeItem.parent( _p._model.layout().attr('tablabelparent') ) );
                _activeItem && _activeItem.length && _activeItem.addClass( _activeClass );

                _p._model.tabContents().hide();
                _p._model.tabContents( _ix ).show();

                _p._model.layout().is('[tabchangecallback]') && window[ _p._model.layout().attr('tabchangecallback') ]
                    && window[ _p._model.layout().attr('tabchangecallback') ].call( _p._model.tabLabels( _ix ), this );
            }
    };

    $(document).delegate( '.js_autoTab', 'click', function( _evt ){
        if( !Tab.autoInit ) return;
        var _p = $(this), _tab, _src = _evt.target || _evt.srcElement;
        if( Tab.getInstance( _p ) ) return;
        _src && ( _src = $(_src) );     UXC.log( new Date().getTime(), _src.prop('nodeName') );
        _tab = new Tab( _p, _src );
    });

}(jQuery));
