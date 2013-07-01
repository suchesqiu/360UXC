(function($){
    !window.UXC && (window.UXC = { log:function(){} });
    !UXC.Calendar && ( UXC.Calendar = {} );

    UXC.Calendar.pickSeason =
        function( _selector ){
            _logic.lastDateObj = UXC.Calendar.getDate( _selector );
            UXC.Calendar.lastIpt = _selector;
            UXC.Calendar.setPosition( _selector, _logic.update( _logic.lastDateObj ) );
        };

    UXC.Calendar.pickSeason.tpl = '';

    var _logic = {
        getLayout:
            function(){
                var _box
                if( !( _box = $('#UXCCalendar_season') ).length ){
                    _box = $( UXC.Calendar.pickSeason.tpl || _logic.tpl ); 
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
                UXC.log( 'Calendar.pickSeason, onConfirm' );
                var _cur = _logic.getLayout().find('td.cur');
                if( !_cur.length ) _logic.getLayout().find('td.today');
                if( _cur.length ) _cur.find('a').trigger('click');
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
                var _ls = [], _class, _data, _title, _sdate, _edate, _cnNum
                    , _year = _date.getFullYear();

                _ls.push('<tr>');
                for( i = 1, j = 4; i <= j; i++ ){
                    _sdate = new Date( _year, i * 3 - 3, 1 ); 
                    _edate = new Date( _year, i * 3 - 1, maxDayOfMonth( _sdate ) );

                    _cnNum = cnNum.charAt( i % 10 );
                    i > 10 && ( _cnNum = "十" + _cnNum );

                    _title = printf( "{0}年 {1}季度\n开始日期: {2}<br />结束日期: {3}"
                                , _year
                                , _cnNum
                                , formatISODate( _sdate )
                                , formatISODate( _edate )
                                );
                    _class = [];

                    if( _dateObj.minvalue && _sdate.getTime() < _dateObj.minvalue.getTime() ) 
                        _class.push( 'unable' );
                    if( _dateObj.maxvalue && _edate.getTime() > _dateObj.maxvalue.getTime() ){
                        _class.push( 'unable' );
                    }

                    if( _date.getTime() >= _sdate.getTime() && _date.getTime() <= _edate.getTime() ) _class.push( 'cur' );
                    if( today >= _sdate.getTime() && today <= _edate.getTime() ) _class.push( 'today' );


                    _ls.push( printf( '<td class="{0}"><a href="javascript:" title="{1}"'+
                                    ' dstart="{3}" dend="{4}" month="{5}" >{2}季度</a></td>'
                                , _class.join(' ')
                                , _title
                                , _cnNum
                                , _sdate.getTime()
                                , _edate.getTime()
                                , i
                            ));
                    if( i % 2 === 0 && i != j ) _ls.push( '</tr><tr>' );
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
            '<div id="UXCCalendar_season" class="UXCCalendar UXCCalendar_week UXCCalendar_season" >'
            ,'    <div class="UHeader">'
            ,'        <button type="button" class="UButton UNextYear">&nbsp;&gt;&gt;&nbsp;</button>'
            ,'        <button type="button" class="UButton UPreYear">&nbsp;&lt;&lt;&nbsp;</button>'
            ,'        <select class="UYear" style=""></select>'
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

    var cnNum = "十一二三四五六七八九";

    $(document).delegate('#UXCCalendar_season table a', 'click', function( _evt ){
        var p = $(this), dstart = new Date(), dend = new Date();
        if( !UXC.Calendar.lastIpt ) return;
        if( p.parent('td').hasClass( 'unable' ) ) return;
        dstart.setTime( p.attr('dstart') );
        dend.setTime( p.attr('dend') );
        UXC.Calendar.lastIpt.val( printf( '{0} 至 {1}', formatISODate( dstart ), formatISODate( dend ) ) );
        UXC.Calendar.hide();
    });

}(jQuery));
