/**
 * Created with JetBrains WebStorm.
 * User: rekey
 * Date: 13-5-29
 * Time: 上午11:03
 * To change this template use File | Settings | File Templates.
 */
;
(function($) {
    var mix = $.extend;
    var customEvent = function(obj) {
        this._customEvent = $(obj || {
            __id: +new Date
        });
        return this;
    };
    mix(customEvent.prototype, {
        fire: function(type, data) {
            return this._customEvent.trigger(type, data);
        },
        off: function(type, fn) {
            return this._customEvent.off(type, fn);
        },
        on: function(type, fn) {
            return this._customEvent.on(type, fn);
        }
    });
    var toggle = function(total, options) {
        mix(this, {
            total: total,
            current: null,
            old: null,
            loop: options['loop']
        });
        this.initEvent();
    };
    mix(toggle.prototype, {
        initEvent: function() {
            mix(this, new customEvent(this));
        },
        toggle: function(current) {
            var _me = this;

            _me.fire('beforeToggle', {
                type: 'beforeToggle',
                total: _me.total,
                old: _me.old,
                current: _me.current
            });

            _me.old = _me.current;
            _me.current = current;

            _me.fire('afterToggle', {
                type: 'afterToggle',
                total: _me.total,
                old: _me.old,
                current: _me.current
            });
            if (_me.current == 0) {
                _me.fire('first', {
                    type: 'first',
                    total: _me.total,
                    old: _me.old,
                    current: _me.current
                });
            }
            if (_me.current == _me.total - 1) {
                _me.fire('end', {
                    type: 'end',
                    total: _me.total,
                    old: _me.old,
                    current: _me.current
                });
            }
        },
        next: function() {
            if (this.current == this.total - 1) {
                if (this.loop) {
                    this.toggle(0);
                }
            } else {
                this.toggle(this.current - -1);
            }
        },
        prev: function() {
            if (this.current == 0) {
                if (this.loop) {
                    this.toggle(this.total - 1);
                }
            } else {
                this.toggle(this.current - 1);
            }
        },
        getCurrent: function() {
            return this.current;
        },
        getOldCurrent: function() {
            return this.old;
        },
        setCurrent: function(current) {
            this.current = current;
        },
        setOldCurrent: function(old) {
            this.old = old;
        }
    });
    toggle.tab = function(options) {
        var opts = mix({
            triggers: null,
            contents: null,
            loop: null,
            current: null,
            total: null,
            currentCls: 'on'
        }, options);
        var TG = new toggle(opts.total || opts.contents.length, opts);
        TG.on('beforeToggle', function(e, data) {
            if (data.current !== null) {
                opts['triggers'].eq(data.current).removeClass(opts['currentCls']);
                opts['contents'].eq(data.current).hide();
            }
        });
        TG.on('afterToggle', function(e, data) {
            opts['triggers'].eq(data.current).addClass(opts['currentCls']);
            opts['contents'].eq(data.current).show();
        });
        if (opts['current'] !== null) {
            TG.toggle(opts['current']);
        }
        return TG;
    };
    UXC.toggle = toggle;
})(jQuery);