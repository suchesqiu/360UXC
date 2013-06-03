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

        $(document).on('click', function($evt){

            if( _logic.isCalendarElement($evt.target||$evt.targetElement) ) return;
            var _layout = $('#UXCCalendar');
            _layout.length && _layout.hide();
        });

        $(document).delegate( 'input.UXCCalendar_btn', 'click', function($evt){
            if( this.forCalendar ) _logic.pickDate( this.forCalendar );
        });

        $(document).delegate( 'input[datatype=date]', 'focus', function($evt){
            _logic.pickDate( this );
        });

        $(document).delegate( '#UXCCalendar', 'click', function( $evt ){
            $evt.stopPropagation();
        });

        $(document).delegate( '#UXCCalendar select.UMonth', 'click', function( $evt ){
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

        , lastIpt: null

        , isCalendarElement:
            function( _selector ){
                _selector = $(_selector);
                var _r = 0;

                if( _selector.length ){
                    if( _selector.hasClass('UXCCalendar_btn') ) _r = 1;
                    if( _selector.prop('nodeName') 
                            && _selector.attr('datatype')
                            && _selector.prop('nodeName').toLowerCase()=='input' 
                            && _selector.attr('datatype').toLowerCase()=='date') _r = 1;
                }

                return _r;
            }

        , pickDate:
            function( _selector ){
                UXC.log( 'Calendar.pickDate', new Date().getTime() );

                _selector = $(_selector);
                if( !(_selector && _selector.length) ) return;

                var _dateObj = _logic.getDate( _selector );

                UXC.log( _dateObj.date.getFullYear(), _dateObj.date.getMonth()+1, _dateObj.date.getDate() );

                var _layout = _logic.getLayout();

                _logic.initYear( _layout, _dateObj );
                _logic.setPosition( _selector, _layout );
            }

        , initYear:
            function( _layout, _dateObj, _selectedYear ){
                var _ls = [], _tmp
                    , _sYear = _dateObj.initMinvalue.getFullYear()
                    , _eYear = _dateObj.initMaxvalue.getFullYear();

                if( !_selectedYear ) _selectedYear = _dateObj.date.getFullYear();

                for( var i = _sYear; i <= _eYear; i++ ){
                    _tmp = '';
                    if( _selectedYear === i ) _tmp = " selected "
                    _ls.push( '<option value="'+i+'"'+_tmp+'>'+i+'</option>' );
                }

                $( _ls.join('') ).appendTo( _layout.find('select.UYear') );
            }

        , setPosition:
            function( _ipt, _layout ){
                _layout.css( {'left': '-9999px'} ).show();
                var _lw = _layout.width(), _lh = _layout.height()
                    , _iw = _ipt.width(), _ih = _ipt.height(), _ioset = _ipt.offset()
                    , _x, _y;

                _x = _ioset.left; _y = _ioset.top + _ih + 5;

                _layout.css( {left: _x+'px', top: _y+'px'} );

                UXC.log( _lw, _lh, _iw, _ih, _ioset.left, _ioset.top );
            }

        , getLayout:
            function(){
                var _r = $('#UXCCalendar');

                if( !_r.length ){
                    _r = $( Calendar.tpl || _logic.tpl );
                    _r.attr('id', 'UXCCalendar').hide().appendTo( document.body );
                    var _month = $( [
                                '<option value="0">一月</option>'
                                , '<option value="0">二月</option>'
                                , '<option value="0">三月</option>'
                                , '<option value="0">四月</option>'
                                , '<option value="0">五月</option>'
                                , '<option value="0">六月</option>'
                                , '<option value="0">七月</option>'
                                , '<option value="0">八月</option>'
                                , '<option value="0">九月</option>'
                                , '<option value="0">十月</option>'
                                , '<option value="0">十一月</option>'
                                , '<option value="0">十二月</option>'
                            ].join('') ).appendTo( _r.find('select.UMonth' ) );
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

