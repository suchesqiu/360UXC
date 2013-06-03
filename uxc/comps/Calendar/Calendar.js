(function($){
    !window.UXC && (window.UXC = { log:function(){} });

    var Calendar = UXC.Calendar = window.Calendar = 
    {
        pickDate: function( _selector ){ _logic.pickDate( _selector ); } 
        , init: function( _selector ){ _logic.initTrigger( _selector ); }

        , autoInit: true
        , defaultDateSpan: 10
        , tpl: ''
    };

    $(document).ready( function($evt){
        setTimeout( function( $evt ){
            if( !Calendar.autoInit ) return;
            Calendar.init( $('input[type=text]') );
        }, 200 );

        $(document).delegate( 'input.UXCCalendar_btn', 'click', function($evt){
            if( this.forCalendar ) _logic.pickDate( this.forCalendar );
        });

        $(document).delegate( 'input[datatype=date]', 'focus', function($evt){
            _logic.pickDate( this );
        });
    });

    var _logic =
    {
        initTrigger:
            function( _selector ){
               _selector.each( function(){
                    var _p = $(this), _nodeName = (_p.prop('nodeName')||'').toLowerCase();
                    UXC.log( '\nCalendar.init: ', _nodeName );

                    if( _nodeName != 'input' ){ 
                        arguments.callee( _selector.query( $('input[type=text]') ) ); 
                        return; 
                    }
                    if( $.trim( _p.attr('datatype') || '').toLowerCase() != 'date' ) return;

                    UXC.log( 'find Calendar item:', _p.attr('name'), _p.attr('id'), _p.attr('datatype') );
                    var _btn = _p.find( '+ input.UXCCalendar_btn' );
                    if( !_btn.length ){
                        _p.after( _btn = $('<input type="button" class="UXCCalendar_btn"  />') );
                    }

                    _btn[0].forCalendar = _p;
                });
            }

        , lastIpt: null;

        , pickDate:
            function( _selector ){
                UXC.log( 'Calendar.pickDate', new Date().getTime() );

                _selector = $(_selector);
                if( !(_selector && _selector.length) ) return;

                var _dateObj = _logic.getDate( _selector );

                UXC.log( _dateObj.date.getFullYear(), _dateObj.date.getMonth()+1, _dateObj.date.getDate() );

                var _layout = _logic.getLayout();

                _logic.setPosition( _selector, _layout );
            }

        , setPosition:
            function( _ipt, _layout ){
                _layout.css( {'left': '-9999px'} ).show();
                var _lw = _layout.width(), _lh = _layout.height()
                    , _iw = _ipt.width(), _ih = _ipt.height(), _ioset = _ipt.offset();


                UXC.log( _lw, _lh );
            }

        , getLayout:
            function(){
                var _r = $('#UXCCalendar');

                if( !_r.length ){
                    _r = $( Calendar.tpl || _logic.tpl );
                    _r.attr('id', 'UXCCalendar').hide().appendTo( document.body );
                 }
                _r.hide();

                return _r;
            }

        , getDate:
            function( _selector ){
                var _r = { date: 0, minvalue: 0, maxvalue: 0, initMinvalue: 0, initMaxvalue: 0 }, _tmp;

                if( _tmp = _logic.parseDate( _selector.val() ) ) _r.date = _tmp;
                else _r.date = new Date();

                _r.initMinvalue = _r.minvalue = _logic.parseDate( _selector.attr('minvalue') );
                _r.initMaxvalue = _r.maxvalue = _logic.parseDate( _selector.attr('maxvalue') );

                if( !_r.initMinvalue ){
                    _r.initMinvalue = _logic.cloneDate( _r.date );
                    _r.initMinvalue.setFullYear( _r.initMinvalue.getFullYear() - Calendar.defaultDateSpan );
                }

                if( !_r.initMaxvalue ){
                    _r.initMaxvalue = _logic.cloneDate( _r.date );
                    _r.initMaxvalue.setFullYear( _r.initMaxvalue.getFullYear() + Calendar.defaultDateSpan );
                }

                return _r;
            }

        , parseDate:
            function( _dateStr ){
                var _re = /[^\d]/g, _r, _dateStr = _dateStr || '';
                _dateStr && ( _dateStr = _dateStr.replace(_re, '') );
                if( _dateStr && _dateStr.length == 8 ){
                    _r = new Date( parseInt( _dateStr.slice(0,4), 10 )
                                    , parseInt( _dateStr.slice(4,6), 10 ) - 1
                                    , parseInt( _dateStr.slice(6,8), 10 ) );
                }
                return _r;
            }

        , cloneDate: function( _date ){ var d = new Date(); d.setTime( _date.getTime() ); return d; }

        , tpl: 
        [
        '<div id="UXCCalendar" class="UXCCalendar">\n'
        ,'    <div class="UHeader">\n'
        ,'        <select class="UYear"></select>\n'
        ,'        <img class="UImg yearctl" align="absMiddle" usemap="#UXCCalendar_Year" />\n'
        ,'        <map name="UXCCalendar_Year"><area shape="rect" coords="0,0,13,8" href="#" action="up"><area shape="rect" coords="0,10,13,17" href="#" action="down"></map>\n'
        ,'        <select class="UMonth"></select>\n'
        ,'        <img class="UImg monthctl" align="absMiddle" usemap="#UXCCalendar_Month"  />\n'
        ,'        <map name="UXCCalendar_Month"><area shape="rect" coords="0,0,13,8" href="#" action="up"><area shape="rect" coords="0,10,13,17" href="#" action="down"></map>\n'
        ,'    </div>\n'
        ,'    <table class="UTable">\n'
        ,'        <thead>\n'
        ,'            <tr>\n'
        ,'                <th>一</th>\n'
        ,'                <th>二</th>\n'
        ,'                <th>三</th>\n'
        ,'                <th>四</th>\n'
        ,'                <th>五</th>\n'
        ,'                <th>六</th>\n'
        ,'                <th>日</th>\n'
        ,'            </tr>\n'
        ,'        </thead>\n'
        ,'   </table>\n'
        ,'   <table class="UTable UTableBorder">\n'
        ,'        <tbody>\n'
         ,'           <!--<tr>\n'
         ,'                <td class="cur"><a href="#">2</a></td>\n'
        ,'                <td class="weekend cur"><a href="#">6</a></td>\n'
        ,'                <td class="weekend hover"><a href="#">13</a></td>\n'
        ,'                <td class="weekend other"><a href="#">41</a></td>\n'
        ,'                <td class="weekend other"><a href="#">42</a></td>\n'
        ,'            </tr>\n-->'
        ,'        </tbody>\n'
        ,'    </table>\n'
        ,'    <div class="UFooter">\n'
        ,'        <button type="button" class="USubmit">确定</button>\n'
        ,'        <button type="button" class="UClear">清空</button>\n'
        ,'        <button type="button" class="UCancel">取消</button>\n'
        ,'    </div>\n'
        ,'</div>\n'
        ].join('')
    };

}(jQuery));

