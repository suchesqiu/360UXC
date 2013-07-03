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
    Tab.activeEvent = 'click';
    Tab.ajaxCallback = null;

    Tab.getInstance = 
        function( _selector, _setter ){
            var _r;
            _selector && ( _selector = $(_selector) ).length && (
                typeof _setter != 'undefined' && _selector.data('TabInstance', _setter)
                , _r =  _selector.data('TabInstance')
            );
            return _r;
        };

    Tab.resetAjaxContainer =
        function( _container ){
            _container && ( _container = $( _container ) );
            _container && _container.length && _container.data('TabAjax', 0 );
        };


    Tab.prototype = {
        _init:
            function(){
                if( !this._model.layoutIsTab() ) return this;
                Tab.getInstance( this._model.layout(), this );
                this._view.init();

                var _triggerTarget = $(this._model.triggerTarget());
                _triggerTarget && _triggerTarget.length 
                && this._model.tablabel( _triggerTarget ) && _triggerTarget.trigger('click');

                return this;
            }    

        , active:
            function( _label ){
                var _ix;
                if( typeof _label == 'number' ) _ix = _label;
                else{
                    _label && $(_label).length && ( _ix = this._model.tabindex( _label ) );
                }

                typeof _ix != 'undefined' && ( this._view.active( _ix ) );
            }
    }
    
    function Model( _selector, _triggerTarget ){
        this._layout = _selector;
        this._triggerTarget = _triggerTarget;

        this._tablabels;
        this._tabcontainers;

        this.currentIndex;
        
        this._init();
    }
    
    Model.prototype = {
        _init:
            function(){
                if( !this.layoutIsTab() ) return;
                var _p = this;
                this._tablabels = $( this.layout().attr('tablabels') );
                this._tabcontainers = $( this.layout().attr('tabcontainers') );

                this._tablabels.each( function(){ _p.tablabel( this, 1 ); } );
                this._tabcontainers.each( function(){ _p.tabcontent( this, 1 ); } );
                this._tablabels.each( function( _ix ){ _p.tabindex( this, _ix ); });

                return this;
            }

        , layout: function(){ return this._layout; }
        , tablabels: function( _ix ){ 
            if( typeof _ix != 'undefined' ) return $( this._tablabels[_ix] );
            return this._tablabels; 
        }
        , tabcontainers: function( _ix ){ 
            if( typeof _ix != 'undefined' ) return $( this._tabcontainers[_ix] );
            return this._tabcontainers; 
        }
        , triggerTarget: function(){ return this._triggerTarget; }
        , layoutIsTab: function(){ return this.layout().attr('tablabels') && this.layout().attr('tabcontainers'); }
        , activeClass: function(){ return this.layout().attr('tabactiveclass') || Tab.activeClass; }
        , activeEvent: function(){ return this.layout().attr('tabactiveevent') || Tab.activeEvent; }
        , tablabel: 
            function( _label, _setter ){
                _label && ( _label = $( _label ) );
                if( !( _label && _label.length ) ) return;
                typeof _setter != 'undefined' && _label.data( 'TabLabel', _setter );
                return _label.data( 'TabLabel' );
            }
        , tabcontent: 
            function( _content, _setter ){
                _content && ( _content = $( _content ) );
                if( !( _content && _content.length ) ) return;
                typeof _setter != 'undefined' && _content.data( 'TabContent', _setter );
                return _content.data( 'TabContent' );
            }
        , tabindex: 
            function( _label, _setter ){
                _label && ( _label = $( _label ) );
                if( !( _label && _label.length ) ) return;
                typeof _setter != 'undefined' && _label.data( 'TabIndex', _setter );
                return _label.data( 'TabIndex' );
            }
        , tabactivecallback:
            function(){
                var _r;
                this.layout().attr('tabactivecallback') && ( _r = window[ this.layout().attr('tabactivecallback') ] );
                return _r;
            }
        , tabchangecallback:
            function(){
                var _r;
                this.layout().attr('tabchangecallback') && ( _r = window[ this.layout().attr('tabchangecallback') ] );
                return _r;
            }
    };
    
    function View( _model ){
        this._model = _model;
    }
    
    View.prototype = {
        init:
            function() {
                UXC.log( 'Tab.View:', new Date().getTime() );
                var _p = this;
                this._model.tablabels().on( this._model.activeEvent(), function( _evt ){
                    var _sp = $(this);
                    if( typeof _p._model.currentIndex !== 'undefined' 
                        && _p._model.currentIndex === _p._model.tabindex( _sp ) ) return;
                    _p._model.currentIndex = _p._model.tabindex( _sp );

                    _p._model.tabactivecallback() 
                        && _p._model.tabactivecallback().call( this, _evt, _p._model.tabindex( _sp ), _p );
                    _p.active( _p._model.tabindex( _sp ) );
                });

                return this;
            }

        , active:
            function( _ix ){
                if( typeof _ix == 'undefined' ) return;
                var _p = this, _activeClass = this._model.activeClass(), _activeItem = this._model.tablabels( _ix );
                this._model.tablabels().each( function(){
                    var _sp = $(this);
                    _p._model.layout().is('[tablabelparent]') && ( _sp = _sp.parent( _p._model.layout().attr('tablabelparent') ) );
                    _sp && _sp.length && _sp.removeClass( _activeClass );
                });
                _p._model.layout().is('[tablabelparent]') && ( _activeItem = _activeItem.parent( _p._model.layout().attr('tablabelparent') ) );
                _activeItem && _activeItem.length && _activeItem.addClass( _activeClass );

                _p._model.tabcontainers().hide();
                _p._model.tabcontainers( _ix ).show();

                _p._model.tabchangecallback() 
                    && _p._model.tabchangecallback().call( _p._model.tablabels( _ix ), _ix, this );
            }
    };

    $(document).delegate( '.js_autoTab', 'mouseover', function( _evt ){
        if( !Tab.autoInit ) return;
        var _p = $(this), _tab, _src = _evt.target || _evt.srcElement;
        if( Tab.getInstance( _p ) ) return;
        _src && ( _src = $(_src) );
        UXC.log( new Date().getTime(), _src.prop('nodeName') );
        _tab = new Tab( _p, _src );
    });

}(jQuery));
