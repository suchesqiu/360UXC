(function($){
    UXC.Panel.alert = 
        function( _msg, _cb, _status, _popupSrc ){
            return _logic.popup( _logic.tpl.alert, _msg, _cb, _status, _popupSrc );
        };

    UXC.Panel.confirm = 
        function( _msg, _cb, _status, _popupSrc ){
            return _logic.popup( _logic.tpl.confirm, _msg, _cb, _status, _popupSrc );
        };

    var _logic = {

        maxWidth: 500

        , popup:
        function( _tpl, _msg, _cb, _status, _popupSrc ){
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

            _ins.show();

            return _ins;
        }

        , hideEffect:
            function( _panel, _popupSrc, _doneCb ){
                _popupSrc && ( _popupSrc = $(_popupSrc) );
                if( !(_popupSrc && _popupSrc.length ) ) return;

                var _poffset = _popupSrc.offset(), _selector = _panel.selector();
                var _dom = _selector[0];
                if( _dom.interval ){
                    clearInterval( _dom.interval );
                    _dom.interval = null;
                }
                _dom.defaultWidth && _selector.width( _dom.defaultWidth );
                _dom.defaultHeight && _selector.height( _dom.defaultHeight );

                var _pw = _popupSrc.width()
                    , _ph = _popupSrc.height()
                    , _sh = _selector.height()
                    ;
                _dom.defaultWidth = _selector.width();
                _dom.defaultHeight = _selector.height();

                var _left = _poffset.left + _popupSrc.width() / 2 + 5 - _dom.defaultWidth / 2;
                var _top = _poffset.top - _sh - 2;

                _selector.height(0);
                _selector.css( { 'left': _left  + 'px' } );

                var _beginDate = new Date(), _timepass, _count = 0, _ms = 200;
                _dom.interval = setInterval(
                    function(){
                        _timepass = new Date() - _beginDate;
                        _count = _timepass / _ms * _sh;
                        if( _count >= _sh ){
                            _count = _sh;
                            clearInterval( _dom.interval );
                            _doneCb && _doneCb();
                        }

                        _selector.css( {
                            'top': _top + _count + 'px'
                            , 'height': _sh - _count + 'px'
                        });
                    }, 2 );
            }

        , showEffect:
            function( _panel, _popupSrc ){
                _popupSrc && ( _popupSrc = $(_popupSrc) );
                if( !(_popupSrc && _popupSrc.length ) ) return;

                var _poffset = _popupSrc.offset(), _selector = _panel.selector();
                var _dom = _selector[0];
                if( _dom.interval ){
                    clearInterval( _dom.interval );
                    _dom.interval = null;
                }
                _dom.defaultWidth && _selector.width( _dom.defaultWidth );
                _dom.defaultHeight && _selector.height( _dom.defaultHeight );

                var _pw = _popupSrc.width()
                    , _ph = _popupSrc.height()
                    , _sh = _selector.height()
                    ;
                _dom.defaultWidth = _selector.width();
                _dom.defaultHeight = _selector.height();

                var _left = _poffset.left + _popupSrc.width() / 2 + 5 - _dom.defaultWidth / 2;

                _selector.height(0);
                _selector.css( { 'left': _left  + 'px' } );

                var _beginDate = new Date(), _timepass, _count = 0, _ms = 200;
                _dom.interval = setInterval(
                    function(){
                        _timepass = new Date() - _beginDate;
                        _count = _timepass / _ms * _sh;
                        if( _count >= _sh ){
                            _count = _sh;
                            clearInterval( _dom.interval );
                        }

                        _selector.css( {
                            'top': _poffset.top - _count - 3 + 'px'
                            , 'height': _count + 'px'
                        });
                    }, 2 );
            }
        
        , fixWidth:
            function( _msg, _panel ){
                var _tmp = $('<div style="position:absolute; left:-9999px;top:-9999px;">' + _msg + '</div>').appendTo('body'), _w = _tmp.width() + 50;
                _w > _logic.maxWidth && ( _w = _logic.maxWidth );

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
