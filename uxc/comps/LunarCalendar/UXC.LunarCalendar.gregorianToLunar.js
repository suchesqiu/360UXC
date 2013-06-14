(function($){
    UXC.LunarCalendar.gregorianToLunar = gregorianToLunar;

    function gregorianToLunar( _date ){
        var _r = {
            shengxiao: ''   //生肖
            , ganzhi: ''    //干支
            , yue: ''       //月份
            , ri: ''        //日
            , shi: ''       //时
            , year: ''      //农历数字年
            , month: ''     //农历数字月
            , day: ''       //农历数字天
            , hour: ''      //家历数字时
        };

        var total, m, n, k, isEnd = false, tmp = _date.getFullYear();
        if (tmp < 1900) tmp += 1900;

        total = (tmp - 2001) * 365 
                + Math.floor((tmp - 2001) / 4) 
                + lunarMonth[_date.getMonth()] + _date.getDate() - 23;

        if (_date.getFullYear() % 4 == 0 && _date.getMonth() > 1) total++;
        /*UXC.log( 'month:', _r.month, 0 );*/

        for (m = 0; ; m++) {
            k = (lunarDays[m] < 4095) ? 11 : 12;
            for (n = k; n >= 0; n--) {
                if (total <= 29 + getBit(lunarDays[m], n)) {
                    isEnd = true;
                    break;
                }
                total = total - 29 - getBit(lunarDays[m], n);
            }
            if (isEnd) break;
        }

        _r.year = _date.getFullYear();

        if (_r.year >= 2001) { _r.year = 2001 + m; }
        _r.month = k - n + 1;
        _r.day = total;
         
        /*UXC.log( 'month:', _r.month, k,  1 );*/

        if (k == 12) {
            if (_r.month == Math.floor(lunarDays[m] / 0x10000) + 1) { _r.month = 1 - _r.month; }
            if (_r.month > Math.floor(lunarDays[m] / 0x10000) + 1) { _r.month--; }
        }
        /*UXC.log( 'month:', _r.month, k, 11 );*/
        _r.hour = Math.floor((_date.getHours() + 3) / 2);
        //UXC.log( _r.year, _r.month, _r.day, _r.hour );

        _r.shengxiao = shengxiao.charAt((_r.year - 4) % 12);
        _r.ganzhi = tiangan.charAt((_r.year - 4) % 10) + dizhi.charAt((_r.year - 4) % 12);

        if(_r.month < 1) {
            _r.yue = "闰" + yuefan.charAt(-_r.month - 1);
        }
        else{
            _r.yue = yuefan.charAt(_r.month - 1);
        }

        _r.ri = (_r.day < 11) ? "初" : ((_r.day < 20) ? "十" : ((_r.day < 30) ? "廿" : "卅"));
        if (_r.day % 10 != 0 || _r.day == 10) {
            _r.ri += shuzi.charAt((_r.day - 1) % 10);
        }
        _r.ri == "廿" && ( _r.ri = "二十" );
        _r.ri == "卅" && ( _r.ri = "三十" );
        /*UXC.log( 'month:', _r.month, 2 );*/

        _r.shi = dizhi.charAt((_r.hour - 1) % 12);
        return _r;
    };

    function getBit(m, n) { return (m >> n) & 1; }

    var tiangan =  "甲乙丙丁戊己庚辛壬癸";
    var dizhi =  "子丑寅卯辰巳午未申酉戌亥";
    var shengxiao =  "鼠牛虎兔龙蛇马羊猴鸡狗猪";
    var yuefan =  "正二三四五六七八九十冬腊";
    var xingqi =  "日一二三四五六";
    var shuzi =  "一二三四五六七八九十";
    var lunarDays = [0x41A95,0xD4A,0xDA5,0x20B55,0x56A,0x7155B,0x25D,0x92D,0x5192B,0xA95,0xB4A,0x416AA,0xAD5,0x90AB5,0x4BA,0xA5B,0x60A57,0x52B,0xA93,0x40E95];
    var lunarMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

}(jQuery));
