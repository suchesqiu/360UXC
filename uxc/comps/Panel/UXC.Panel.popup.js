(function($){

    $(document).on( 'click', function( _evt ){
        var _p = $(_evt.target||_evt.srcElement)
            , _paneltype = _p.attr('paneltype'), _panelmsg = _p.attr('panelmsg');
        if( !(_paneltype && _panelmsg ) ) return;

        _p.prop('nodeName') && _p.prop('nodeName').toLowerCase() == 'a' && _evt.preventDefault();

        var  _panelstatus = ( parseInt( _p.attr('panelstatus'), 10 ) || 0 )
           , _callback = _p.attr('panelcallback')
           , _cancelcallback = _p.attr('panelcancelcallback');
        
        _callback && ( _callback = window[ _callback ] );
        _cancelcallback && ( _cancelcallback = window[ _cancelcallback ] );

        if( !_paneltype in UXC.Panel ) return;

        var _panel = UXC[ _paneltype ]( _panelmsg, _p, _panelstatus );
        if( _callback ) _panel.on( 'confirm', _callback );
        if( _cancelcallback ) _panel.on( 'cancel', _cancelcallback );

    });

    UXC.alert = 
        function( _msg, _popupSrc, _status, _cb ){
            return _logic.popup( _logic.tpl.alert, _msg, _popupSrc, _status, _cb );
        };

    UXC.confirm = 
        function( _msg, _popupSrc, _status, _cb ){
            return _logic.popup( _logic.tpl.confirm, _msg, _popupSrc, _status, _cb );
        };

    var _logic = {

        minWidth: 180, maxWidth: 500

        , popup:
        function( _tpl, _msg, _popupSrc, _status, _cb ){
            if( !_msg ) return;
            if( _logic.ins.alert )
                try{ 
                    _logic.ins.alert.close(); 
                    _logic.ins.alert = null; 
                }catch(ex){};

            _popupSrc && ( _popupSrc = $(_popupSrc) );

            var _tpl = _tpl
                        .replace(/\{msg\}/g, _msg)
                        .replace(/\{status\}/g, _logic.getStatusClass(_status||'') );
            var _ins = _logic.ins.alert = new UXC.Panel(_tpl);
            _logic.fixWidth( _msg, _ins );

            _cb && _ins.on('confirm', _cb);
            if( !_popupSrc ) _ins.center();

            _ins.on('show_default', function(){
                UXC.log('user show_default');
                _logic.showEffect( _ins, _popupSrc, function(){
                });
                return false;
            });

            _ins.on('close_default', function(){
                UXC.log('user close_default');
                _logic.hideEffect( _ins, _popupSrc, function(){
                    _ins.selector().remove();
                    _ins = null;
                });
                return false;
            });

            _ins.on('hide_default', function(){
                UXC.log('user hide_default');
                _logic.hideEffect( _ins, _popupSrc, function(){
                    _ins.selector().hide();
                });
                return false;
            });

            if( _popupSrc && _popupSrc.length )_ins.selector().css( { 'left': '-9999px', 'top': '-9999px' } );

            _ins.show();

            return _ins;
        }

        , hideEffect:
            function( _panel, _popupSrc, _doneCb ){
                _popupSrc && ( _popupSrc = $(_popupSrc) );
                if( !(_popupSrc && _popupSrc.length ) ) return;

                var _poffset = _popupSrc.offset(), _selector = _panel.selector();
                var _dom = _selector[0];

                _dom.interval && clearInterval( _dom.interval );
                _dom.defaultWidth && _selector.width( _dom.defaultWidth );
                _dom.defaultHeight && _selector.height( _dom.defaultHeight );

                var _pw = _popupSrc.width(), _sh = _selector.height();
                _dom.defaultWidth = _selector.width();
                _dom.defaultHeight = _selector.height();

                var _left = _logic.getLeft( _poffset.left, _pw, _selector.width() );
                var _top = _logic.getTop( _poffset.top, _popupSrc.height(), _sh );
                    _top = _top - _sh - 2;

                _selector.height(0);
                _selector.css( { 'left': _left  + 'px' } );

                _dom.interval = 
                    _logic.easyEffect( function( _curVal ){
                        _selector.css( {
                            'top': _top + _curVal + 'px'
                            , 'height': _sh - _curVal + 'px'
                        });

                        if( _sh === _curVal ) _selector.hide();
                    }, _sh );

            }

        , showEffect:
            function( _panel, _popupSrc ){
                _popupSrc && ( _popupSrc = $(_popupSrc) );
                if( !(_popupSrc && _popupSrc.length ) ) return;

                var _poffset = _popupSrc.offset(), _selector = _panel.selector();
                var _dom = _selector[0];

                _dom.interval && clearInterval( _dom.interval );
                _dom.defaultWidth && _selector.width( _dom.defaultWidth );
                _dom.defaultHeight && _selector.height( _dom.defaultHeight );

                var _pw = _popupSrc.width(), _sh = _selector.height();
                _dom.defaultWidth = _selector.width();
                _dom.defaultHeight = _selector.height();

                var _left = _logic.getLeft( _poffset.left, _pw, _selector.width() );
                var _top = _logic.getTop( _poffset.top, _popupSrc.height(), _sh, 9 );

                _selector.height(0);
                _selector.css( { 'left': _left  + 'px' } );

                UXC.log( _top, _poffset.top );

                if( _top > _poffset.top ){
                    _dom.interval = 
                        _logic.easyEffect( function( _curVal ){
                            _selector.css( {
                                'top': _top - _sh - 3 + 'px'
                                , 'height': _curVal + 'px'
                            });
                        }, _sh );

                }else{
                    _dom.interval = 
                        _logic.easyEffect( function( _curVal ){
                            _selector.css( {
                                'top': _top - _curVal - 3 + 'px'
                                , 'height': _curVal + 'px'
                            });
                        }, _sh );
                }

            }

        , getTop:
            function( _srcTop, _srcHeight, _targetHeight, _offset  ){
                var _r = _srcTop
                    , _scrTop = $(document).scrollTop()
                    , _maxTop = $(window).height() - _targetHeight;

                _r - _targetHeight < _scrTop && ( _r = _srcTop + _srcHeight + _targetHeight + _offset );

                return _r;
            }

        , getLeft:
            function( _srcLeft, _srcWidth, _targetWidth, _offset  ){
                _offset == undefined && ( _offset = 5 );
                var _r = _srcLeft + _srcWidth / 2 + _offset - _targetWidth / 2
                    , _scrLeft = $(document).scrollLeft()
                    , _maxLeft = $(window).width() - _targetWidth;

                _r > _maxLeft && ( _r = _maxLeft - 2 );
                _r < _scrLeft && ( _r = _scrLeft + 1 );

                return _r;
            }
        
        , fixWidth:
            function( _msg, _panel ){
                var _tmp = $('<div style="position:absolute; left:-9999px;top:-9999px;">' + _msg + '</div>').appendTo('body'), _w = _tmp.width() + 50;
                _w > _logic.maxWidth && ( _w = _logic.maxWidth );
                _w < _logic.minWidth && ( _w = _logic.minWidth );

                _panel.selector().css('width', _w);
            }

        , getStatusClass:
            function ( _status ){
                var _r = 'UPanelSuccess';
                switch( _status ){
                    case 0: _r = 'UPanelSuccess'; break;
                    case 1: _r = 'UPanelError'; break;
                    case 2: _r = 'UPanelAlert'; break;
                }
                return _r;
            }

        , easyEffect:
            function( _cb, _maxVal, _minVal, _duration, _stepMs ){
                var _beginDate = new Date(), _timepass
                    , _maxVal = _maxVal || 200, _minVal = _minVal || 0
                    , _duration = _duration || 200, _stepMs = _stepMs || 2;
                var _interval = setInterval(
                    function(){
                        _timepass = new Date() - _beginDate;
                        _minVal = _timepass / _duration * _maxVal;

                        if( _minVal > _maxVal ){
                            _minVal = _maxVal
                            clearInterval( _interval );
                        }
                        _cb && _cb( _minVal );
                    }, _stepMs );

                return _interval;
            }

        , ins: {
            alert: null
            , confirm: null
        }

        , tpl: {
            alert:
                [
                '<div class="UPanel UPanelPopup {status}" >\n'
                ,'    <div class="UPContent">\n'
                ,'        <div class="bd">\n'
                ,'            <dl>\n'
                ,'                <dd class="UPopupContent">\n'
                ,'                <button class="UIcon" align="absMiddle" ></button><div class="UText"><button type="button" class="UPlaceholder"></button>{msg}</div>\n'
                ,'                </dd>\n'
                ,'                <dd class="UButton">\n'
                ,'                    <button type="button" eventtype="confirm">确定</button>\n'
                ,'                </dd>\n'
                ,'            </dl>\n'
                ,'        </div>\n'
                ,'    </div><!--end UPContent-->\n'
                ,'</div><!--end UPanel-->\n'
                ].join('')

            , confirm:
                [
                '<div class="UPanel UPanelPopup {status}" >\n'
                ,'    <div class="UPContent">\n'
                ,'        <div class="bd">\n'
                ,'            <dl>\n'
                ,'                <dd class="UPopupContent">\n'
                ,'                <button class="UIcon" align="absMiddle" ></button><div class="UText"><button type="button" class="UPlaceholder"></button>{msg}</div>\n'
                ,'                </dd>\n'
                ,'                <dd class="UButton">\n'
                ,'                    <button type="button" eventtype="confirm">确定</button>'
                ,'                    <button type="button" eventtype="cancel">取消</button>\n'
                ,'                </dd>\n'
                ,'            </dl>\n'
                ,'        </div>\n'
                ,'    </div><!--end UPContent-->\n'
                ,'</div><!--end UPanel-->\n'
                ].join('')

        }
    }

}(jQuery));
