(function($){
    !window.UXC && (window.UXC = { log:function(){} });
    UXC.LunarCalendar = window.LunarCalendar = LunarCalendar;
    /**
     * 日历选择组件
     * <br />全局访问请使用 UXC.LunarCalendar 或 LunarCalendar
     * <br />DOM 加载完毕后
     * , LunarCalendar会自动初始化页面所有日历组件, input[type=text][datatype=date]标签
     * <br />Ajax 加载内容后, 如果有日历组件需求的话, 需要手动使用LunarCalendar.init( _selector )
     * <br />_selector 可以是 新加载的容器, 也可以是新加载的所有input
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a></p>
     * <p><a href='https://github.com/suchesqiu/360UXC.git' target='_blank'>UXC Project Site</a>
     * | <a href='http://uxc.btbtd.org/docs/uxc_docs/classes/UXC.LunarCalendar.html' target='_blank'>API docs</a>
     * | <a href='http://uxc.btbtd.org/uxc/comps/LunarCalendar/_demo/' target='_blank'>demo link</a></p>
     * @namespace UXC
     * @class LunarCalendar
     * @static
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 360 UXC-FE Team
     * @date    2013-06-13
     */
    function LunarCalendar( _container, _date, _params ){
        _container && ( _container = $(_container) );
        !(_container && _container.length) && ( _container = $(document) );
        !_date && ( _date = new Date() );
        _container.data('LunarCalendar', this);

        UXC.log( 'LunarCalendar.constructor' );

        this._model = new Model( _container, _date, _params );
        this._view = new View( this._model );
        
        this._init();
    }
    /**
     * 自定义日历组件模板
     * <p>默认模板为UXC.LunarCalendar.Model#tpl</p>
     * <p>如果用户显示定义UXC.LunarCalendar.tpl的话, 将采用用户的模板</p>
     * @property    tpl
     * @type    {string}
     * @default empty
     * @static
     */
    LunarCalendar.tpl;
    /**
     * 设置是否在 dom 加载完毕后, 自动初始化所有日期控件
     * @property    autoinit
     * @default true
     * @type    {bool}
     * @static
            <script>UXC.LunarCalendar.autoInit = true;</script>
     */
     LunarCalendar.autoInit = true
    /**
     * 设置默认显示的年份数, 该数为前后各多少年 默认为前后各10年
     * @property    defaultYearSpan
     * @type        {int}
     * @default     20
     * @static
            <script>UXC.LunarCalendar.defaultYearSpan = 20;</script>
     */
    LunarCalendar.defaultYearSpan = 20
    LunarCalendar.nationalHolidays = {};


    LunarCalendar.prototype = {
        _init:
            function(){
                this._view.layout.data('LunarCalendar', this);
                
                return this;
            }    

        , update:
            function( _date ){
                if( !_date ) return;
                this._view.initLayout( _date );
            }

        , nextMonth: 
            function(){
                var _date = this._model.getDate().date;
                _date.setMonth( _date.getMonth() + 1 );
                this._view.initLayout( _date );
            }

        , preMonth:
            function(){
                var _date = this._model.getDate().date;
                _date.setMonth( _date.getMonth() - 1 );
                this._view.initLayout( _date );
            }

        , nextYear: 
            function(){
                var _date = this._model.getDate().date;
                _date.setFullYear( _date.getFullYear() + 1 );
                this._view.initLayout( _date );
            }
        , preYear: 
            function(){
                var _date = this._model.getDate().date;
                _date.setFullYear( _date.getFullYear() - 1 );
                this._view.initLayout( _date );
            }

        , getDate: function(){ return this._model.getDate().date;  }
        , getAllDate: function(){ return this._model.getDate();  }

        , getSelectedDate: function(){
            var _r;
            this._view.layout.find( 'td.cur a').each( function(){
                var _tm = $(this).attr('date');
                _r = new Date();
                _r.setTime( _tm );
            });
            return _r;
        }
    }
    
    function View( _model ){
        this._model = _model;
        this.layout;

        this._init();
    }
    
    View.prototype = {
        _init:
            function()
            {
                this.layout = $( this._model.tpl ).appendTo( this._model.container );
                this.initLayout();
                return this;
            }

        , initLayout:
            function( _date ){
                var _dateObj = this._model.getDate();
                if( _date ) _dateObj.date = _date;
                this.layout.find('table.UTableBorder tbody').html('');

                this.initYear( _dateObj );
                this.initMonth( _dateObj );
                this.initMonthDate( _dateObj );
            }

        , initYear:
            function( _dateObj ){
                this.layout.find('button.UYear').html(  _dateObj.date.getFullYear() );
            }

        , initMonth:
            function( _dateObj ){
                this.layout.find('button.UMonth').html(  _dateObj.date.getMonth() + 1 + '月' );
            }
        /**
         * 初始化月份的所有日期
         * @method  _logic.initMonthDate
         * @param   {DateObjects}   _dateObj   保存所有相关日期的对象
         * @private
         */
        , initMonthDate:
            function( _dateObj ){
                var _layout = this.layout;
                var _maxday = this._model.maxDayOfMonth( _dateObj.date ), _weekday = _dateObj.date.getDay() || 7
                    , _sumday = _weekday + _maxday, _row = 6, _ls = [], _premaxday, _prebegin
                    , _tmp, i, _class;

                var _beginDate = this._model.cloneDate( _dateObj.date );
                    _beginDate.setDate( 1 );
                var _beginWeekday = _beginDate.getDay() || 7;
                if( _beginWeekday < 2 ){
                    _beginDate.setDate( -(_beginWeekday-1+6) );
                }else{
                    _beginDate.setDate( -(_beginWeekday-2) );
                }

                var today = new Date();

                _ls.push('<tr>');
                for( i = 1; i <= 42; i++ ){
                    _class = [];
                    if( _beginDate.getDay() === 0 || _beginDate.getDay() == 6 ) _class.push('weekend');
                    if( !this._model.isSameMonth( _dateObj.date, _beginDate ) ) _class.push( 'other' );
                    if( _dateObj.minvalue && _beginDate.getTime() < _dateObj.minvalue.getTime() ) 
                        _class.push( 'unable' );
                    if( _dateObj.maxvalue && _beginDate.getTime() > _dateObj.maxvalue.getTime() ) 
                        _class.push( 'unable' );

                    var lunarDate = LunarCalendar.gregorianToLunar( _beginDate );
                    var festivals = LunarCalendar.getFestival( lunarDate, _beginDate );

                    if( festivals.isHoliday ){ _class.push( 'festival' ); _class.push('xiuxi'); }
                    if( festivals.isWorkday ) _class.push( 'shangban' );

                    if( this._model.isSameDay( today, _beginDate ) ) _class.push( 'today' );
                    _ls.push( '<td class="', _class.join(' '),'">'
                            ,'<a href="javascript:" date="', _beginDate.getTime(),'"><b>'
                            , _beginDate.getDate(), '</b><label>', festivals.dayName,  '</label></a></td>' );
                    _beginDate.setDate( _beginDate.getDate() + 1 );
                    if( i % 7 === 0 && i != 42 ) _ls.push( '</tr><tr>' );
                }
                _ls.push('</tr>');

                _layout.find('table.UTableBorder tbody' ).html( $( _ls.join('') ) );

                UXC.log( _prebegin, _premaxday, _maxday, _weekday, _sumday, _row );
            }

    };

    function Model( _container, _date, _params ){
        this.container = _container;
        this.date = _date;
        this.selector;
        this.tpl;
        this.dateObj;

        if( _params ) for( var k in _params ) this[k] = _params[k];
        this._init();
    }
    
    Model.prototype = {
        _init:
            function(){
                this.tpl = UXC.LunarCalendar.tpl || _deftpl;
                return this;
            }
        /**
         * 获取初始日期对象
         * @method  getDate
         * @param   {selector}  _selector   显示日历组件的input
         * @private
         */
        , getDate:
            function(){
                if( this.dateObj ) return this.dateObj;
                var _selector = this.container;
                var _r = { date: 0, minvalue: 0, maxvalue: 0, initMinvalue: 0, initMaxvalue: 0 }, _tmp;

                if( _tmp = this.parseDate( _selector.attr('defaultdate') )) _r.date = _tmp;
                else _r.date = new Date();


                _r.minvalue = this.parseDate( _selector.attr('minvalue') );
                _r.maxvalue = this.parseDate( _selector.attr('maxvalue') );
                
                _r.minvalue && ( _r.initMinvalue = this.cloneDate( _r.minvalue ) );
                _r.maxvalue && ( _r.initMaxvalue = this.cloneDate( _r.maxvalue ) );

                if( !_r.initMinvalue ){
                    _r.initMinvalue = this.cloneDate( _r.date );
                    _r.initMinvalue.setFullYear( _r.initMinvalue.getFullYear() - LunarCalendar.defaultYearSpan );
                }

                if( !_r.initMaxvalue ){
                    _r.initMaxvalue = this.cloneDate( _r.date );
                    _r.initMaxvalue.setFullYear( _r.initMaxvalue.getFullYear() + LunarCalendar.defaultYearSpan );
                }

                return this.dateObj = _r;
            }
        /**
         * 把日期赋值给文本框
         * @method  setDate
         * @param   {int}   _timestamp  日期对象的时间戳
         * @private
         */
        , setDate:
            function( _timestamp ){
                var _d = new Date(), _symbol = '-'; _d.setTime( _timestamp );
            }
        /**
         * 给文本框赋值, 日期为控件的当前日期
         * @method  setSelectedDate
         * @return  {int}   0/1
         * @private
         */
        , setSelectedDate:
            function(){
                var _cur;
                _cur = this.getLayout().find('table td.cur a');
                if( _cur.parent('td').hasClass('unable') ) return 0;
                _cur && _cur.length && _cur.attr('date') && this.setDate( _cur.attr('date') );
                return 1;
            }
        /**
         * 解析日期
         * @method  parseDate
         * @param   {string}    _dateStr
         * @return  {Date}  返回解析得到的日期/或者当前日期
         * @private
         */
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
        /**
         * 克隆日期对象
         * @method  cloneDate
         * @param   {Date}  _date   需要克隆的日期
         * @return  {Date}  需要克隆的日期对象
         * @private
         */
        , cloneDate: function( _date ){ var d = new Date(); d.setTime( _date.getTime() ); return d; }
        /**
         * 判断两个日期是否为同一天
         * @method  isSameDay
         * @param   {Date}  _d1     需要判断的日期1
         * @param   {Date}  _d2     需要判断的日期2
         * @return {bool}
         * @private
         */
        , isSameDay:
            function( _d1, _d2 ){
                return [_d1.getFullYear(), _d1.getMonth(), _d1.getDate()].join() === [
                        _d2.getFullYear(), _d2.getMonth(), _d2.getDate()].join()
            }
        /**
         * 判断两个日期是否为同一月份
         * @method  isSameMonth
         * @param   {Date}  _d1     需要判断的日期1
         * @param   {Date}  _d2     需要判断的日期2
         * @return {bool}
         * @private
         */
        , isSameMonth:
            function( _d1, _d2 ){
                return [_d1.getFullYear(), _d1.getMonth()].join() === [
                        _d2.getFullYear(), _d2.getMonth()].join()
            }
        /**
         * 取得一个月份中最大的一天
         * @method  maxDayOfMonth
         * @param   {Date}  _date
         * @return {int} 月份中最大的一天
         * @private
         */
        , maxDayOfMonth:
            function( _date ){
                var _r, _d = new Date( _date.getFullYear(), _date.getMonth() + 1 );
                    _d.setDate( _d.getDate() - 1 );
                    _r = _d.getDate();
                return _r;
            }
        /**
         * 为数字添加前置0
         * @method  intPad
         * @param   {int}   _n      需要添加前置0的数字
         * @param   {int}   _len    需要添加_len个0, 默认为2
         * @return  {string}
         * @private
         */
        , intPad: 
            function( _n, _len ){
                if( typeof _len == 'undefined' ) _len = 2;
                _n = new Array( _len + 1 ).join('0') + _n;
                return _n.slice( _n.length - _len );
            }

    };

    var _deftpl = 
        [
        '<div id="UXCLunarCalendar" class="UXCLunarCalendar">\n'
        ,'    <div class="UXCLunarCalendar_wrapper">\n'
        ,'        <div class="UHeader">\n'
        ,'            <button type="button" class="UButton UYear">2013</button>\n'
        ,'            <button type="button" class="UButton UMonth">1月</button>\n'
        ,'        </div>\n'
        ,'        <table class="UTable UTableThead">\n'
        ,'            <thead>\n'
        ,'                <tr>\n'
        ,'                    <th>一</th>\n'
        ,'                    <th>二</th>\n'
        ,'                    <th>三</th>\n'
        ,'                    <th>四</th>\n'
        ,'                    <th>五</th>\n'
        ,'                    <th class="weekend">六</th>\n'
        ,'                    <th class="weekend">日</th>\n'
        ,'                </tr>\n'
        ,'            </thead>\n'
        ,'       </table>\n'
        ,'       <table class="UTable UTableBorder">\n'
        ,'            <tbody>\n'
        ,'                <!--<tr>\n'
        ,'                    <td class="unable"><a href="#"><b>1</b><label>两字</label></a></td>\n'
        ,'                    <td class="unable cur"><a href="#"><b>2</b><label>两字</label></a></td>\n'
        ,'                    <td class="unable"><a href="#"><b>33</b><label>两字</label></a></td>\n'
        ,'                    <td class="unable"><a href="#"><b>44</b><label>两字</label></a></td>\n'
        ,'                    <td class="unable"><a href="#"><b>5</b><label>两字</label></a></td>\n'
        ,'                    <td class="weekend shangban cur"><a href="#"><b>6</b><label>两字</label></a></td>\n'
        ,'                    <td class="weekend"><a href="#"><b>7</b><label>两字</label></a></td>\n'
        ,'                </tr>-->\n'
        ,'            </tbody>\n'
        ,'        </table>\n'
        ,'    </div>\n'
        ,'</div>\n'
        ].join('');    
    /**
     * DOM 加载完毕后, 初始化日历组件相关事件
     * @event   dom ready
     * @private
     */
    $(document).ready( function($evt){
        setTimeout( function(){
            $('div.js_LunarCalendar, td.js_LunarCalendar, li.js_LunarCalendar').each( function(){
                new LunarCalendar( $(this) );
            });
        }, 100);
    });

    $(document).delegate( 'div.UXCLunarCalendar table.UTableBorder td', 'click', function(){
        var _p = $(this);
        $('div.UXCLunarCalendar table.UTableBorder td.cur').removeClass('cur');
        _p.addClass('cur');
    });

}(jQuery));

