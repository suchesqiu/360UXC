(function($){

    window.ZIDNEX_COUNT = window.ZINDEX_COUNT || 50001;
    var isIE6 = !!window.ActiveXObject && !window.XMLHttpRequest;

    var Dialog = window.Dialog = UXC.Dialog = 
        function( _selector, _headers, _bodys, _footers ){
            if( _logic.timeout ) clearTimeout( _logic.timeout );
            _logic.dialogIdentifier();

            var _ins = new UXC.Panel( _selector, _headers, _bodys, _footers );
            _logic.dialogIdentifier( _ins );

            _logic.showMask();
            _ins.selector().css( 'z-index', window.ZINDEX_COUNT++ );

            _ins.on('close_default', function( _evt, _panel){
                _logic.hideMask();
            });
            
            _logic.timeout = setTimeout( function(){
                _ins.show( 0 );
            }, _logic.showMs );

            return _ins;
        };

    UXC.Dialog.alert = 
        function(_msg, _status, _cb){
            if( !_msg ) return;
            var _tpl = _logic.tpl.alert
                        .replace(/\{msg\}/g, _msg)
                        .replace(/\{status\}/g, _logic.getStatusClass(_status||'') );
            var _ins = UXC.Dialog(_tpl);
            _logic.fixWidth( _msg, _ins );
            _cb && _ins.on('confirm', _cb);

            return _ins;
        };

    UXC.Dialog.confirm = 
        function(_msg, _status, _cb){
            if( !_msg ) return;
            var _tpl = _logic.tpl.confirm
                        .replace(/\{msg\}/g, _msg)
                        .replace(/\{status\}/g, _logic.getStatusClass(_status||'') );
            var _ins = UXC.Dialog(_tpl);
            _logic.fixWidth( _msg, _ins );
            _cb && _ins.on('confirm', _cb);

            return _ins;
        };

    $(document).on( 'click', function( _evt ){
        var _p = $(_evt.target||_evt.srcElement)
            , _paneltype = _p.attr('paneltype'), _panelmsg = _p.attr('panelmsg');
        if( !(_paneltype && _panelmsg ) ) return;
        _paneltype = _paneltype.toLowerCase();
        if( !/dialog\./.test( _paneltype ) ) return;
        _paneltype = _paneltype.replace( /.*?\./, '');

        _p.prop('nodeName') && _p.prop('nodeName').toLowerCase() == 'a' && _evt.preventDefault();

        var  _panelstatus = ( parseInt( _p.attr('panelstatus'), 10 ) || 0 )
           , _callback = _p.attr('panelcallback')
           , _cancelcallback = _p.attr('panelcancelcallback');
        
        _callback && ( _callback = window[ _callback ] );
        _cancelcallback && ( _cancelcallback = window[ _cancelcallback ] );

        if( !(_paneltype in UXC.Dialog) ) return;

        var _panel = UXC.Dialog[ _paneltype ]( _panelmsg, _panelstatus );
        if( _callback ) _panel.on( 'confirm', _callback );
        if( _cancelcallback ) _panel.on( 'cancel', _cancelcallback );

    });


    $(window).on('resize scroll', function( _evt ){
        $('body > div.UPanelDialog_identifer').each( function(){
            var _p = $(this);
            if( _p.data('DialogInstance') ){
                if(  !_p.data('DialogInstance').selector().is(':visible') ) return;
                if( _evt.type.toLowerCase() == 'resize' ) _p.data('DialogInstance').center(); 
                _logic.setMaskSizeForIe6();
            }
        });
    });

    var _logic = {
        timeout: null
        , showMs: 10
        , minWidth: 180, maxWidth: 500

        , dialogIdentifier:
            function( _panel ){
                if( !_panel ){
                    _logic.hideMask();
                    $('body > div.UPanelDialog_identifer').remove();
                }else{
                    _panel.selector().addClass('UPanelDialog_identifer');
                    _panel.selector().data('DialogInstance', _panel);
                }
            }

        , showMask:
            function(){
                var _mask = $('#UPanelMask'), _iframemask = $('#UPanelMaskIfrmae');
                if( !_mask.length ){
                    $( _logic.tpl.mask ).appendTo('body');
                    _mask = $('#UPanelMask'), _iframemask = $('#UPanelMaskIfrmae');
                }
                _iframemask.show(); _mask.show();

                _logic.setMaskSizeForIe6();

                _iframemask.css('z-index', window.ZINDEX_COUNT++ );
                _mask.css('z-index', window.ZINDEX_COUNT++ );
            }

        , hideMask:
            function(){
                var _mask = $('#UPanelMask'), _iframemask = $('#UPanelMaskIfrmae');
                if( _mask.length ) _mask.hide();
                if( _iframemask.length ) _iframemask.hide();
            }

        , setMaskSizeForIe6:
            function(){
                var _mask = $('#UPanelMask'), _iframemask = $('#UPanelMaskIfrmae');
                if( !( _mask.length && _iframemask.length ) ) return;

                var _css = {
                    'position': 'absolute'
                    , 'top': '0px'
                    , 'left': $(document).scrollLeft() + 'px'
                    , 'height': $(document).height() + 'px'
                    , 'width': $(window).width()  + 'px'
                };

                _mask.css( _css );
                _iframemask.css( _css );
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

        , fixWidth:
            function( _msg, _panel ){
                var _tmp = $('<div style="position:absolute; left:-9999px;top:-9999px;">' + _msg + '</div>').appendTo('body'), _w = _tmp.width() + 80;
                _w > _logic.maxWidth && ( _w = _logic.maxWidth );
                _w < _logic.minWidth && ( _w = _logic.minWidth );

                _panel.selector().css('width', _w);
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

            , mask:
                [
                    '<div id="UPanelMask" class="UPanelMask"></div>'
                    , '<iframe src="about:blank" id="UPanelMaskIfrmae"'
                    , ' frameborder="0" class="UPanelMaskIframe"></iframe>'
                ].join('')
        }
    };

}(jQuery));
