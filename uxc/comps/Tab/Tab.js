/**
 * Created with JetBrains WebStorm.
 * User: rekey
 * Date: 13-5-29
 * Time: 上午11:03
 * To change this template use File | Settings | File Templates.
 */
;
(function ( $ ) {
    var mix = $.extend;
    /**
     * UXC jQuery 组件库 自定义事件类<br />
     * @namespace UXC
     * @class CustomEvent
     * @requires jQuery
     * @example $.extend(obj,new UXC.CustomEvent());
     *
     * @author Rekey <rekey@me.com> | {@link http://uxc.360.cn|360 UXC-FE Team}
     * @date 2013-05-29
     */
    var CustomEvent = function ( obj ) {
        this._customEvent = $( obj || {
            __id : +new Date
        } );
        return this;
    };
    mix( CustomEvent.prototype , {
        /**
         * 触发自定义事件
         * @namespace UXC.CustomEvent
         * @method   fire
         * @param    {String}    type        自定义事件类型
         * @param    {Boolean}      data        自定义事件传递的数据
         **/
        fire : function ( type , data ) {
            //noinspection JSUnresolvedVariable
            return this._customEvent.trigger( type , data );
        } ,
        /**
         * 取消事件绑定
         * @namespace UXC.CustomEvent
         * @method   off
         * @param    {String}    type        自定义事件类型
         * @param    {Function}      fn      事件回调
         **/
        off : function ( type , fn ) {
            //noinspection JSUnresolvedVariable
            return this._customEvent.off( type , fn );
        } ,
        /**
         * 事件绑定
         * @namespace UXC.CustomEvent
         * @method   on
         * @param    {String}    type        自定义事件类型
         * @param    {Function}      fn      事件回调
         **/
        on : function ( type , fn ) {
            //noinspection JSUnresolvedVariable
            return this._customEvent.on( type , fn );
        }
    } );
    UXC.CustomEvent = CustomEvent;

    /**
     * UXC jQuery 组件库 自定义事件类<br />
     * @namespace UXC
     * @class Toggle
     * @requires jQuery
     * @example new Toggle(3,{loop:true});
     *
     * @author Rekey <rekey@me.com> | {@link http://uxc.360.cn|360 UXC-FE Team}
     * @date 2013-05-29
     */
    var Toggle = function ( total , options ) {
        mix( this , {
            total : total ,
            current : null ,
            old : null ,
            loop : options['loop']
        } );
        this._initEvent();
    };
    mix( Toggle.prototype , {
        /**
         * 内部方法,初始化自定义事件
         * @namespace UXC.Toggle
         * @method   _initEvent
         **/
        _initEvent : function () {
            mix( this , new CustomEvent( this ) );
        } ,
        /**
         * 切换焦点,将触发beforeToggle和afterToggle的自定义事件,分别对应切换前和切换后的事件
         如果当前焦点是序列里的第一个或者最后一个,还将触发first或者end事件
         * @namespace UXC.Toggle
         * @method   toggle
         * @current    {Number}    type        焦点值
         **/
        toggle : function ( current ) {
            if ( current === this.current ) {
                return;
            }
            var _me = this;

            _me.fire( 'beforeToggle' , {
                type : 'beforeToggle' ,
                total : _me.total ,
                old : _me.old ,
                current : _me.current
            } );

            _me.old = _me.current;
            _me.current = current;

            _me.fire( 'afterToggle' , {
                type : 'afterToggle' ,
                total : _me.total ,
                old : _me.old ,
                current : _me.current
            } );
            if ( _me.current == 0 ) {
                _me.fire( 'first' , {
                    type : 'first' ,
                    total : _me.total ,
                    old : _me.old ,
                    current : _me.current
                } );
            }
            if ( _me.current == _me.total - 1 ) {
                _me.fire( 'end' , {
                    type : 'end' ,
                    total : _me.total ,
                    old : _me.old ,
                    current : _me.current
                } );
            }
        } ,
        /**
         * 切换到下一个焦点,内部调用toggle方法
         * @namespace UXC.Toggle
         * @method   next
         **/
        next : function () {
            if ( this.current == this.total - 1 ) {
                if ( this.loop ) {
                    this.toggle( 0 );
                }
            } else {
                this.toggle( this.current - -1 );
            }
        } ,
        /**
         * 切换到上一个焦点,内部调用toggle方法
         * @namespace UXC.Toggle
         * @method   prev
         **/
        prev : function () {
            if ( this.current == 0 ) {
                if ( this.loop ) {
                    this.toggle( this.total - 1 );
                }
            } else {
                this.toggle( this.current - 1 );
            }
        } ,
        /**
         * 获取当前焦点
         * @namespace UXC.Toggle
         * @method   getCurrent
         * @return {Number}
         **/
        getCurrent : function () {
            return this.current;
        } ,
        /**
         * 获取前一个焦点
         * @namespace UXC.Toggle
         * @method   getOldCurrent
         * @return {Number}
         **/
        getOldCurrent : function () {
            return this.old;
        } ,
        /**
         * 设置焦点,但不触发事件
         * @namespace UXC.Toggle
         * @method   getOldCurrent
         * @param {Number} current 焦点值
         **/
        setCurrent : function ( current ) {
            this.current = current;
        } ,
        /**
         * 设置前一个焦点,但不触发事件
         * @namespace UXC.Toggle
         * @method   getOldCurrent
         * @param {Number} current 焦点值
         **/
        setOldCurrent : function ( current ) {
            this.old = current;
        }
    } );
    /**
     * 以Toggle为基础的tab切换示例模型
     * @namespace UXC.Toggle
     * @method   tab
     * @static
     * @param {Object} options 选项
     * @return {Object} Toggle对象
     **/
    Toggle.tab = function ( options ) {
        var opts = mix( {
            triggers : null ,
            contents : null ,
            loop : null ,
            current : null ,
            total : null ,
            currentCls : 'on'
        } , options );
        var TG = new Toggle( opts.total || opts.contents.length , opts );
        TG.on( 'beforeToggle' , function ( e , data ) {
            if ( data.current !== null ) {
                opts['triggers'].eq( data.current ).removeClass( opts['currentCls'] );
                opts['contents'].eq( data.current ).hide();
            }
        } );
        TG.on( 'afterToggle' , function ( e , data ) {
            opts['triggers'].eq( data.current ).addClass( opts['currentCls'] );
            opts['contents'].eq( data.current ).show();
        } );
        if ( opts['current'] !== null ) {
            TG.toggle( opts['current'] );
        }
        return TG;
    };
    /**
     * 以Toggle为基础的tab切换示例模型
     * @namespace UXC.Toggle
     * @method   slide
     * @static
     * @param {Object} options 选项
     * @return {Object} Toggle对象
     **/
    Toggle.slide = function ( options ) {
        var opts = mix( {
            triggers : null ,
            contents : null ,
            loop : null ,
            current : null ,
            total : null ,
            currentCls : 'on'
        } , options );
        var TG = new Toggle( opts.total || opts.contents.length , opts );
        TG.on( 'beforeToggle' , function ( e , data ) {
            if ( data.current !== null ) {
                opts['triggers'].eq( data.current ).removeClass( opts['currentCls'] );
                opts['contents'].eq( data.current ).stop( 1 , 1 ).animate( {
                    opacity : 0
                } );
            }
        } );
        TG.on( 'afterToggle' , function ( e , data ) {
            opts['triggers'].eq( data.current ).addClass( opts['currentCls'] );
            opts['contents'].eq( data.current ).stop( 1 , 1 ).animate( {
                opacity : 1
            } );
        } );
        if ( opts['current'] !== null ) {
            TG.toggle( opts['current'] );
        }
        return TG;

    };
    UXC.Toggle = Toggle;
})( jQuery );