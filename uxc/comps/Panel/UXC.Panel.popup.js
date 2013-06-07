(function($){
    UXC.Panel.alert = 
        function( _msg, _cb, _status, _popupSrc ){
            if( !_msg ) return;
            if( _logic.ins.alert )
                try{ 
                    _logic.ins.alert.close(); 
                    _logic.ins.alert = null; 
                }catch(ex){};

            var _tpl = _logic.tpl.alert
                        .replace(/\{msg\}/g, _msg)
                        .replace(/\{status\}/g, _logic.getStatusClass(_status||'') );
            var _ins = _logic.ins.alert = new UXC.Panel(_tpl);
            _logic.fixWidth( _msg, _ins );

            _cb && _ins.on('confirm', _cb);
            if( !_popupSrc ) _ins.center();

            if( _popupSrc && ( _popupSrc = $(_popupSrc) ).length ){

            }
            _ins.show();

            return _ins;
        };


    var _logic = {

        maxWidth: 500

        , fixPosition:
            function(){

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
    }

}(jQuery));
