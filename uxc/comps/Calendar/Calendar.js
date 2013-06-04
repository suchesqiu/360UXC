(function($){
    !window.UXC && (window.UXC = { log:function(){} });
    /**
     * 日期选择组件
     * <p>全局访问请使用 UXC.Calendar 或 Calendar</p>
     * <p>DOM 加载完毕后
     * , Calendar会自动初始化所有附件要求的input[type=text][datatype=date]标签</p>
     * <p>Ajax 加载内容后, 如果有日历组件需求的话, 需要手动使用Calendar.init( _selector )</p>
     * <p>_selector 可以是 新加载的容器, 也可以是新加载的所有input</p>
     * @namespace UXC
     * @class Calendar
     * @static
     * @uses jQuery
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | {@link http://uxc.360.cn|360 UXC-FE Team}
     * @date    2013-06-04
     */
    var Calendar = UXC.Calendar = window.Calendar = 
    {
        /**
         *
         */
        pickDate: function( _selector ){ _logic.pickDate( _selector ); } 
        , init: function( _selector ){ _logic.initTrigger( _selector ); }
        , hide: function(){ _logic.hide(); }

        , autoInit: true
        , defaultDateSpan: 10
        , tpl: ''
    };

    $(document).ready( function($evt){
        setTimeout( function( $evt ){
            if( !Calendar.autoInit ) return;
            Calendar.init( $('input[type=text]') );
        }, 200 );

        $(document).delegate( '#UXCCalendar select.UYear', 'change', function( $evt ){
            _logic.setNewYear( $(this).val() );
        });

        $(document).delegate( '#UXCCalendar select.UMonth', 'click', function( $evt ){
            _logic.setNewMonth( $(this).val() );
        });

        $(document).delegate( '#UXCCalendar button.UConfirm', 'click', function( $evt ){
            if( !_logic.setSelectedDate() ) return;
            _logic.hide();
        });

        $(document).delegate( "map[name=UXCCalendar_Year] area" , 'click', function( $evt ){
            $evt.preventDefault();
            var _p = $(this), _do = _logic.lastDateObj;
            if( !(_do && _p.attr("action") ) ) return;
            if( _p.attr("action").toLowerCase() == 'up' ){
                _do.date.setFullYear( _do.date.getFullYear() + 1 );
                _do.initMinvalue.setFullYear( _do.initMinvalue.getFullYear() + 1 );
                _do.initMaxvalue.setFullYear( _do.initMaxvalue.getFullYear() + 1 );
            }else if( _p.attr("action").toLowerCase() == 'down' ){
                _do.date.setFullYear( _do.date.getFullYear() - 1 );
                _do.initMinvalue.setFullYear( _do.initMinvalue.getFullYear() - 1 );
                _do.initMaxvalue.setFullYear( _do.initMaxvalue.getFullYear() - 1 );
            }
            _logic.initLayout( _do );
            UXC.log( _p.attr("action") );
        });

        $(document).delegate( "map[name=UXCCalendar_Month] area" , 'click', function( $evt ){
            $evt.preventDefault();
            var _p = $(this), _do = _logic.lastDateObj;
            if( !(_do && _p.attr("action") ) ) return;
            if( _p.attr("action").toLowerCase() == 'up' ){
                _do.date.setMonth( _do.date.getMonth() + 1 );
                _do.initMinvalue.setMonth( _do.initMinvalue.getMonth() + 1 );
                _do.initMaxvalue.setMonth( _do.initMaxvalue.getMonth() + 1 );
            }else if( _p.attr("action").toLowerCase() == 'down' ){
                _do.date.setMonth( _do.date.getMonth() - 1 );
                _do.initMinvalue.setMonth( _do.initMinvalue.getMonth() - 1 );
                _do.initMaxvalue.setMonth( _do.initMaxvalue.getMonth() - 1 );
            }
            _logic.initLayout( _do );
            UXC.log( _p.attr("action") );
        });

        $(document).delegate( '#UXCCalendar button.UClear', 'click', function( $evt ){
            _logic.lastIpt && _logic.lastIpt.length && _logic.lastIpt.val('');
        });

        $(document).delegate( '#UXCCalendar button.UCancel', 'click', function( $evt ){
            _logic.hide();
        });

        $(document).on('click', function($evt){
            if( _logic.isCalendarElement($evt.target||$evt.targetElement) ) return;
            var _src = $evt.target || $evt.srcElement;

            if( _src && _src.nodeName.toLowerCase() != 'input' ){
                _logic.hide(); return;
            }

            setTimeout( function(){
                if( _logic.lastIpt && _logic.lastIpt.length && _src == _logic.lastIpt[0] ) return;
                _logic.hide();
            }, 100);
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

        $(document).delegate( '#UXCCalendar table a', 'click', function( $evt ){
            $evt.preventDefault();
            var _p = $(this), _tm = _p.attr('date')||'';
            if( !_tm ) return;
            if( _p.parent('td').hasClass('unable') ) return;

            UXC.log( _tm );

            _logic.setDate( _tm );
            _logic.hide();
        });

        $(window).on('scroll resize', function($evt){
            var _layout = _logic.getLayout();
            if( !( _layout.is(':visible') && _logic.lastIpt ) ) return;
            _logic.setPosition( _logic.lastIpt, _layout );
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
        , lastDateObj: null

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
                _logic.lastIpt = _selector;

                var _dateObj = _logic.lastDateObj = _logic.getDate( _selector );

                UXC.log( _dateObj.date.getFullYear(), _dateObj.date.getMonth()+1, _dateObj.date.getDate() );

                _logic.initLayout( _dateObj );
                _logic.setPosition( _selector, _logic.getLayout() );
            }

        , initLayout:
            function( _dateObj ){
                var _layout = _logic.getLayout();
                _logic.initYear( _layout, _dateObj );
                _logic.initMonth( _layout, _dateObj );
                _logic.initDate( _layout, _dateObj );
            }

        , initDate:
            function( _layout, _dateObj, _selected ){
                var _maxday = _logic.maxDayOfMonth( _dateObj.date ), _weekday = _dateObj.date.getDay() || 7
                    , _sumday = _weekday + _maxday, _row = 6, _ls = [], _premaxday, _prebegin
                    , _tmp, i, _class;

                var _beginDate = _logic.cloneDate( _dateObj.date );
                    _beginDate.setDate( 1 );
                var _beginWeekday = _beginDate.getDay() || 7;
                if( _beginWeekday < 2 ){
                    _beginDate.setDate( -(_beginWeekday-1+6) );
                }else{
                    _beginDate.setDate( -(_beginWeekday-2) );
                }

                _ls.push('<tr>');
                for( i = 1; i <= 42; i++ ){
                    _class = [];
                    if( _beginDate.getDay() === 0 || _beginDate.getDay() == 6 ) _class.push('weekend');
                    if( !_logic.isSameMonth( _dateObj.date, _beginDate ) ) _class.push( 'other' );
                    if( _dateObj.minvalue && _beginDate.getTime() < _dateObj.minvalue.getTime() ) 
                        _class.push( 'unable' );
                    if( _dateObj.maxvalue && _beginDate.getTime() > _dateObj.maxvalue.getTime() ) 
                        _class.push( 'unable' );

                    if( _logic.isSameDay( _dateObj.date, _beginDate ) ) _class.push( 'cur' );
                    _ls.push( '<td class="', _class.join(' '),'">'
                            ,'<a href="javascript:" date="', _beginDate.getTime(),'">'
                            , _beginDate.getDate(), '</a></td>' );
                    _beginDate.setDate( _beginDate.getDate() + 1 );
                    if( i % 7 === 0 && i != 42 ) _ls.push( '</tr><tr>' );
                }
                _ls.push('</tr>');



                _layout.find('table.UTableBorder tbody' ).html( $( _ls.join('') ) );

                UXC.log( _prebegin, _premaxday, _maxday, _weekday, _sumday, _row );
            }

        , initMonth:
            function( _layout, _dateObj, _selected ){
                $( _layout.find('select.UMonth').val( _dateObj.date.getMonth() ) );
            }

        , initYear:
            function( _layout, _dateObj, _selected ){
                var _ls = [], _tmp
                    , _sYear = _dateObj.initMinvalue.getFullYear()
                    , _eYear = _dateObj.initMaxvalue.getFullYear();

                UXC.log( _sYear, _eYear );

                if( !_selected ) _selected = _dateObj.date.getFullYear();

                for( var i = _sYear; i <= _eYear; i++ ){
                    _tmp = '';
                    if( _selected === i ) _tmp = " selected "
                    _ls.push( '<option value="'+i+'"'+_tmp+'>'+i+'</option>' );
                }

                $( _ls.join('') ).appendTo( _layout.find('select.UYear').html('') );
            }

        , setNewYear:
            function( _year ){
                UXC.log( _year );
                if ( !_logic.lastDateObj ) return;
                var _premaxday = _logic.maxDayOfMonth( _logic.lastDateObj.date )
                    , _d = new Date( _year, _logic.lastDateObj.date.getMonth(), 1 )
                    , _nextmaxday = _logic.maxDayOfMonth( _d );
                if( _premaxday > _nextmaxday ) _d.setDate( _nextmaxday );
                else _d.setDate( _logic.lastDateObj.date.getDate() );

                _logic.lastDateObj.date = _d;

                _logic.initMonth( _logic.getLayout(), _logic.lastDateObj );
                _logic.initDate( _logic.getLayout(), _logic.lastDateObj );
            }

        , setNewMonth:
            function( _month ){
                UXC.log( _month );
                if ( !_logic.lastDateObj ) return;
                var _premaxday = _logic.maxDayOfMonth( _logic.lastDateObj.date )
                    , _d = new Date( _logic.lastDateObj.date.getFullYear(), _month, 1 )
                    , _nextmaxday = _logic.maxDayOfMonth( _d );
                if( _premaxday > _nextmaxday ) _d.setDate( _nextmaxday );
                else _d.setDate( _logic.lastDateObj.date.getDate() );

                _logic.lastDateObj.date = _d;

                _logic.initMonth( _logic.getLayout(), _logic.lastDateObj );
                _logic.initDate( _logic.getLayout(), _logic.lastDateObj );
            }

        , setPosition:
            function( _ipt, _layout ){
                _layout.css( {'left': '-9999px'} ).show();
                var _lw = _layout.width(), _lh = _layout.height()
                    , _iw = _ipt.width(), _ih = _ipt.height(), _ioset = _ipt.offset()
                    , _x, _y, _winw = $(window).width(), _winh = $(window).height()
                    , _scrtop = $(document).scrollTop()
                    ;

                _x = _ioset.left; _y = _ioset.top + _ih + 5;

                if( ( _y + _lh - _scrtop ) > _winh ){
                    UXC.log('y overflow');
                    _y = _ioset.top - _lh - 3;

                    if( _y < _scrtop ) _y = _scrtop;
                }

                _layout.css( {left: _x+'px', top: _y+'px'} );

                UXC.log( _lw, _lh, _iw, _ih, _ioset.left, _ioset.top, _winw, _winh );
                UXC.log( _scrtop, _x, _y );
            }

        , hide:
            function(){
                _logic.getLayout().hide();
            }

        , getLayout:
            function(){
                var _r = $('#UXCCalendar');

                if( !_r.length ){
                    _r = $( Calendar.tpl || _logic.tpl );
                    _r.attr('id', 'UXCCalendar').hide().appendTo( document.body );
                    var _month = $( [
                                '<option value="0">一月</option>'
                                , '<option value="1">二月</option>'
                                , '<option value="2">三月</option>'
                                , '<option value="3">四月</option>'
                                , '<option value="4">五月</option>'
                                , '<option value="5">六月</option>'
                                , '<option value="6">七月</option>'
                                , '<option value="7">八月</option>'
                                , '<option value="8">九月</option>'
                                , '<option value="9">十月</option>'
                                , '<option value="10">十一月</option>'
                                , '<option value="11">十二月</option>'
                            ].join('') ).appendTo( _r.find('select.UMonth' ) );
                    _r.hide();
                 }

                return _r;
            }

        , getDate:
            function( _selector ){
                var _r = { date: 0, minvalue: 0, maxvalue: 0, initMinvalue: 0, initMaxvalue: 0 }, _tmp;

                if( _tmp = _logic.parseDate( _selector.val() ) ) _r.date = _tmp;
                else _r.date = new Date();

                _r.minvalue = _logic.parseDate( _selector.attr('minvalue') );
                _r.maxvalue = _logic.parseDate( _selector.attr('maxvalue') );
                
                _r.minvalue && ( _r.initMinvalue = _logic.cloneDate( _r.minvalue ) );
                _r.maxvalue && ( _r.initMaxvalue = _logic.cloneDate( _r.maxvalue ) );

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

        , setDate:
            function( _timestamp ){
                if( !(_timestamp && _logic.lastIpt && _logic.lastIpt.length ) ) return;
                var _d = new Date(), _symbol = '-'; _d.setTime( _timestamp );
                var _df = _logic.lastIpt.attr('dateFormat');
                if( _df ){
                    _df = _df.replace(/[\da-zA-Z]/g, '');
                    if( _df.length ) _df = _df.slice(0, 1);
                    _symbol = _df;
                }
                var _dStr = 
                    [ 
                        _d.getFullYear()
                        , _logic.intPad( _d.getMonth() + 1 )
                        , _logic.intPad( _d.getDate() ) 
                     ].join(_symbol);
                _logic.lastIpt.val( _dStr );
            }

        , setSelectedDate:
            function(){
                var _cur;
                _cur = _logic.getLayout().find('table td.cur a');
                if( _cur.parent('td').hasClass('unable') ) return 0;
                _cur && _cur.length && _cur.attr('date') && _logic.setDate( _cur.attr('date') );
                return 1;
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

        , isSameDay:
            function( _d1, _d2 ){
                return [_d1.getFullYear(), _d1.getMonth(), _d1.getDate()].join() === [
                        _d2.getFullYear(), _d2.getMonth(), _d2.getDate()].join()
            }

        , isSameMonth:
            function( _d1, _d2 ){
                return [_d1.getFullYear(), _d1.getMonth()].join() === [
                        _d2.getFullYear(), _d2.getMonth()].join()
            }

        , maxDayOfMonth:
            function( _date ){
                var _r, _d = new Date( _date.getFullYear(), _date.getMonth() + 1 );
                    _d.setDate( _d.getDate() - 1 );
                    _r = _d.getDate();
                return _r;
            }

        , intPad: 
            function( _n, _len ){
                if( typeof _len == 'undefined' ) _len = 2;
                _n = new Array( _len + 1 ).join('0') + _n;
                return _n.slice( _n.length - _len );
            }

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
        ,'                <td class="unable"><a href="#">2</a></td>\n'
        ,'                <td class="weekend cur"><a href="#">6</a></td>\n'
        ,'                <td class="weekend hover"><a href="#">13</a></td>\n'
        ,'                <td class="weekend other"><a href="#">41</a></td>\n'
        ,'                <td class="weekend other"><a href="#">42</a></td>\n'
        ,'            </tr>\n-->'
        ,'        </tbody>\n'
        ,'    </table>\n'
        ,'    <div class="UFooter">\n'
        ,'        <button type="button" class="UConfirm">确定</button>\n'
        ,'        <button type="button" class="UClear">清空</button>\n'
        ,'        <button type="button" class="UCancel">取消</button>\n'
        ,'    </div>\n'
        ,'</div>\n'
        ].join('')
    };

}(jQuery));

