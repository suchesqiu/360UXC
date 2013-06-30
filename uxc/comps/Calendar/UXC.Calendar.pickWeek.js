(function($){
    !window.UXC && (window.UXC = { log:function(){} });
    !UXC.Calendar && ( UXC.Calendar = {} );

    UXC.Calendar.pickWeek =
        function( _selector ){
            _logic.lastDateObj = UXC.Calendar.getDate( _selector );
            UXC.Calendar.lastIpt = _selector;
            UXC.Calendar.setPosition( _selector, _logic.update( _logic.lastDateObj ) );
        };

    UXC.Calendar.pickWeek.tpl = '';

    var _logic = {
        getLayout:
            function(){
                var _box
                if( !( _box = $('#UXCCalendar_week') ).length ){
                    _box = $( UXC.Calendar.pickWeek.tpl || _logic.tpl ); 
                    _box.appendTo( document.body );
                    _box.data('confirmMethod', _logic.onConfirm );
                    _box.data('updateYearMethod', _logic.updateYear );
                    _box.data('nextYearMethod', _logic.nextYear );
                    _box.data('preYearMethod', _logic.preYear );
                }
                return _box;
            }

        , onConfirm:
            function(){
                UXC.log( 'Calendar.pickWeek, onConfirm' );
            }
        , updateYear:
            function( _val ){
                if( !_logic.lastDateObj ) return;
                _logic.lastDateObj.date.setFullYear( _val );
                UXC.Calendar.updateInitYearList( _logic.lastDateObj );
                _logic.update( _logic.lastDateObj );
            }
        , nextYear:
            function(){
                UXC.log( 'nextYearMethod' );
                if( !_logic.lastDateObj ) return;
                _logic.updateYear( _logic.lastDateObj.date.getFullYear() + 1)
            }
        , preYear:
            function(){
                UXC.log( 'preYearMethod' );
                if( !_logic.lastDateObj ) return;
                _logic.updateYear( _logic.lastDateObj.date.getFullYear() - 1)
            }
        , update:
            function( _dateObj ){
                _logic.getLayout();
                _logic.updateHead( _dateObj );
                _logic.updateBody( _dateObj );
                return _logic.getLayout();
            }
        , updateHead:
            function( _dateObj ){
                var _layout = _logic.getLayout(), _ls = [], _tmp, _selected
                    , _sYear = _dateObj.initMinvalue.getFullYear()
                    , _eYear = _dateObj.initMaxvalue.getFullYear();


                if( !_selected ) _selected = _dateObj.date.getFullYear();

                for( var i = _sYear; i <= _eYear; i++ ){
                    _tmp = '';
                    if( _selected === i ) _tmp = " selected "
                    _ls.push( '<option value="'+i+'"'+_tmp+'>'+i+'</option>' );
                }

                $( _ls.join('') ).appendTo( _layout.find('select.UYear').html('') );

            }
        , updateBody:
            function( _dateObj ){
                var _date = _dateObj.date;
                var _layout = _logic.getLayout();
                    _layout.find('button.UYearButton').html( _date.getFullYear() );

                var today = new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate() ).getTime();
                var weeks = weekOfYear( _date.getFullYear() );
                var nextYearWeeks = weekOfYear( _date.getFullYear() + 1 );
                var nextCount = 0;
                var _ls = [], _class, _data, _title, _sdate, _edate, _year = _date.getFullYear()
                    , _rows = Math.ceil( weeks.length / 8 );

                _ls.push('<tr>');
                for( i = 1, j = _rows * 8; i <= j; i++ ){
                    _data = weeks[ i - 1];
                    if( !_data ) {
                        _data = nextYearWeeks[ nextCount++ ];
                        _year = _date.getFullYear() + 1;
                    }
                    _sdate = new Date(); _edate = new Date();
                    _sdate.setTime( _data.start ); _edate.setTime( _data.end );
                    _title = printf( "{0}年 第{1}周<br/>开始日期: {2}<br />结束日期: {3}"
                                , _year
                                , _data.week 
                                , formatISODate( _sdate )
                                , formatISODate( _edate )
                                );
                    _class = [];

                    if( _dateObj.minvalue && _data.start < _dateObj.minvalue.getTime() ) 
                        _class.push( 'unable' );
                    if( _dateObj.maxvalue && _data.end > _dateObj.maxvalue.getTime() ){
                        _class.push( 'unable' );
                    }

                    if( _date.getTime() >= _data.start && _date.getTime() <= _data.end ) _class.push( 'cur' );
                    if( today >= _data.start && today <= _data.end ) _class.push( 'today' );

                    _ls.push( printf( '<td class="{0}"><a href="javascript:" title="{2}"'+
                                    ' dstart="{3}" dend="{4}" week="{5}" >{1}</a></td>'
                                , _class.join(' ')
                                , _data.week 
                                , _title
                                , _data.start
                                , _data.end
                                , _data.week
                            ));
                    if( i % 8 === 0 && i != j ) _ls.push( '</tr><tr>' );
                }
                _ls.push('</tr>'); 
 
                _layout.find('table.UTableBorder tbody' ).html( $( _ls.join('') ) );

            }
        /**
         * 最后一个显示日历组件的日期对象
         * @property    _logic.lastDateObj
         * @type        Object
         * @private
         */
        , lastDateObj: null
        , tpl:
            [
            '<div id="UXCCalendar_week" class="UXCCalendar UXCCalendar_week" >'
            ,'    <div class="UHeader">'
            ,'        <button type="button" class="UButton UNextYear">&nbsp;&gt;&gt;&nbsp;</button>'
            ,'        <select class="UYear" style=""></select>'
            ,'        <button type="button" class="UButton UPreYear">&nbsp;&lt;&lt;&nbsp;</button>'
            ,'    </div>'
            ,'    <table class="UTable UTableBorder">'
            ,'        <tbody></tbody>'
            ,'    </table>'
            ,'    <div class="UFooter">'
            ,'        <button type="button" class="UConfirm">确定</button>'
            ,'        <button type="button" class="UClear">清空</button>'
            ,'        <button type="button" class="UCancel">取消</button>'
            ,'    </div>'
            ,'</div>'
            ].join('')
    };
    /**
     * 取一年中所有的星期, 及其开始结束日期
     * @method  weekOfYear
     * @static
     * @param   {int}   _year
     * @return  Array
     */
    function weekOfYear( _year ){
        var _r = [], _tmp, _count = 1
            , _year = parseInt( _year, 10 )
            , _d = new Date( _year, 0, 1 );
        /**
         * 元旦开始的第一个星期一开始的一周为政治经济上的第一周
         */
         _d.getDay() > 1 && _d.setDate( _d.getDate() - _d.getDay() + 7 );

        while( _d.getFullYear() <= _year ){
            _tmp = { 'week': _count++, 'start': null, 'end': null };
            _tmp.start = _d.getTime();
            _d.setDate( _d.getDate() + 6 );
            _tmp.end = _d.getTime();
            _d.setDate( _d.getDate() + 1 );
            if( _d.getFullYear() > _year ) {
                _d = new Date( _d.getFullYear(), 0, 1 );
                if( _d.getDay() < 2 ) break;
             }
            _r.push( _tmp );
        }
        return _r;
    }

    $(document).delegate('#UXCCalendar_week table a', 'click', function( _evt ){
        var p = $(this), dstart = new Date(), dend = new Date();
        if( !UXC.Calendar.lastIpt ) return;
        dstart.setTime( p.attr('dstart') );
        dend.setTime( p.attr('dend') );
        UXC.Calendar.lastIpt.val( printf( '{0} 至 {1}', formatISODate( dstart ), formatISODate( dend ) ) );
        UXC.Calendar.hide();
    });

}(jQuery));
