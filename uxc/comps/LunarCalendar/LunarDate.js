//千一网络 www.cftea.com
//LunarDate v0.2
//本程序是基于互联网上的代码完成的。
//原程序只是演示功能，不便于调用其函数，本程序将其封装为类，方便了调用。
//在原程序的基础上：去除了“夜子时”，统称为“子时”；修正了不能正确获取 2001 年以前天干地支及生肖的问题。
//应用示例：
/*
var dt = new Date(2009, 9, 13, 7, 20); // 注意第二个参数月的范围是 [0, 11]
var ld = new LunarDate(dt);
document.write(ld.lYear + "（" + ld.aYear + "）年" + ld.lMonth + "月" + ld.lDay + ld.lHour + "时");

//对象成员变量说明：
//aYear 生肖
//lYear 天干地支
//lMonth 农历月
//lDay 农历日
//lHour 农历时
*/


function LunarDate(dt) {
    this.dt = dt;

    this.y = null;
    this.m = null;
    this.d = null;
    this.h = null;

    this.aYear = ""; // 生肖
    this.lYear = ""; // 天干地支
    this.lMonth = ""; // 农历月
    this.lDay = ""; // 农历日
    this.lHour = ""; // 农历时
    
    this.heavenlyStems = "甲乙丙丁戊己庚辛壬癸"; // 天干
    this.earthlyBranchs = "子丑寅卯辰巳午未申酉戌亥"; // 地支
    this.animalYears = "鼠牛虎兔龙蛇马羊猴鸡狗猪"; //生肖
    this.moonMonths = "正二三四五六七八九十冬腊";
    this.days = "日一二三四五六";
    this.chineseNumbers = "一二三四五六七八九十";
    this.cData = new Array(20);
    this.madd = new Array(12);

    this.ini = function() {
        this.cData[0] = 0x41A95;
        this.cData[1] = 0xD4A;
        this.cData[2] = 0xDA5;
        this.cData[3] = 0x20B55;
        this.cData[4] = 0x56A;
        this.cData[5] = 0x7155B;
        this.cData[6] = 0x25D;
        this.cData[7] = 0x92D;
        this.cData[8] = 0x5192B;
        this.cData[9] = 0xA95;
        this.cData[10] = 0xB4A;
        this.cData[11] = 0x416AA;
        this.cData[12] = 0xAD5;
        this.cData[13] = 0x90AB5;
        this.cData[14] = 0x4BA;
        this.cData[15] = 0xA5B;
        this.cData[16] = 0x60A57;
        this.cData[17] = 0x52B;
        this.cData[18] = 0xA93;
        this.cData[19] = 0x40E95;
        this.madd[0] = 0;
        this.madd[1] = 31;
        this.madd[2] = 59;
        this.madd[3] = 90;
        this.madd[4] = 120;
        this.madd[5] = 151;
        this.madd[6] = 181;
        this.madd[7] = 212;
        this.madd[8] = 243;
        this.madd[9] = 273;
        this.madd[10] = 304;
        this.madd[11] = 334;
    }
    this.ini();


    function getBit(m, n) {
        return (m >> n) & 1;
    }


    this.e2c = function() {
        var total, m, n, k;
        var isEnd = false;
        var tmp = this.dt.getFullYear();
        if (tmp < 1900) tmp += 1900;
        total = (tmp - 2001) * 365
+ Math.floor((tmp - 2001) / 4)
+ this.madd[this.dt.getMonth()]
+ this.dt.getDate()
- 23;
        if (this.dt.getFullYear() % 4 == 0 && this.dt.getMonth() > 1)
            total++;
        for (m = 0; ; m++) {
            k = (this.cData[m] < 0xfff) ? 11 : 12;
            for (n = k; n >= 0; n--) {
                if (total <= 29 + getBit(this.cData[m], n)) {
                    isEnd = true;
                    break;
                }
                total = total - 29 - getBit(this.cData[m], n);
            }
            if (isEnd) break;
        }
        this.y = this.dt.getFullYear();
        if (this.y >= 2001) {
            this.y = 2001 + m;
        }
        this.m = k - n + 1;
        this.d = total;
        if (k == 12) {
            if (this.m == Math.floor(this.cData[m] / 0x10000) + 1)
                this.m = 1 - this.m;
            if (this.m > Math.floor(this.cData[m] / 0x10000) + 1)
                this.m--;
        }
        this.h = Math.floor((this.dt.getHours() + 3) / 2);
    }


    this.convert = function() {
        this.aYear = this.animalYears.charAt((this.y - 4) % 12);

        this.lYear = this.heavenlyStems.charAt((this.y - 4) % 10) + this.earthlyBranchs.charAt((this.y - 4) % 12);

        if (this.m < 1) {
            this.lMonth = "闰" + this.moonMonths.charAt(-this.m - 1);
        }
        else {
            this.lMonth = this.moonMonths.charAt(this.m - 1);
        }

        this.lDay = (this.d < 11) ? "初" : ((this.d < 20) ? "十" : ((this.d < 30) ? "廿" : "卅"));
        if (this.d % 10 != 0 || this.d == 10) {
            this.lDay += this.chineseNumbers.charAt((this.d - 1) % 10);
        }
        if (this.lDay == "廿") {
            this.lDay = "二十";
        }
        else if (this.lDay == "卅") {
            this.lDay = "三十";
        }

        this.lHour = this.earthlyBranchs.charAt((this.h - 1) % 12);
    }

    this.e2c();
    this.convert();
}

LunarDate.prototype.aYear = ""; // 生肖
LunarDate.prototype.lYear = ""; // 天干地支
LunarDate.prototype.lMonth = ""; // 农历月
LunarDate.prototype.lDay = ""; // 农历日
LunarDate.prototype.lHour = ""; // 农历时
