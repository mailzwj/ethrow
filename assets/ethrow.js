(function(window, $){

    function EThrow(cfg){
        if (!this instanceof EThrow) {
            return new EThrow(cfg);
        }
        this.get = function(n) {
            return cfg[n];
        };
        this.set = function(n, v) {
            cfg[n] = v;
        };
        this.init();
    }

    EThrow.prototype = {
        constructor: EThrow,
        init: function() {
            var _this = this;
            _this.set('target', $(_this.get('target')));
            _this.set('mover', _this.get('target').parents(_this.get('mover')).length > 0 ? _this.get('target').parents(_this.get('mover')) : $(_this.get('mover')));
            _this.set('decay', _this.get('decay') > 0 && _this.get('decay') < 0 ? _this.get('decay') : 0.75);
            _this.get('target').css({
                'cursor': 'move',
                'webkitUserSelect': 'none',
                'mozUserSelect': 'none',
                'msUserSelect': 'none',
                'khtmlUserSelect': 'none',
                'userSelect': 'none'
            });
            _this.get('mover').css('zIndex', _this.get('zIndex'));
            _this._expandTarget(function() {
                _this._startMove();
                _this._bindEvent();
            });
        },
        _expandTarget: function (callback) {
            var _this = this,
                win = $(window),
                vw = win.width(),
                vh = win.height(),
                size = _this.get('size'),
                tarL = (vw - size.w) / 2,
                tarT = (vh - size.h) / 2;

            _this.get('mover').css({"position": "absolute", "width": 0, "height": 0, "left": "50%", "top": "50%"});
            _this.get('mover').animate({"width": size.w, "height": size.h, "left": tarL, "top": tarT}, 300, function() {
                setTimeout(function() {
                    callback && callback();
                }, _this.get('delay') * 1000);
            });
        },
        _startMove: function() {
            var _this = this,
                win = $(window);
            clearInterval(_this.get('timer'));
            _this.set('timer', setInterval(function() {
                _this.set('speedY', _this.get('speedY') + 3);
                var nT = _this.get('mover').offset().top + _this.get('speedY'),
                    nL = _this.get('mover').offset().left + _this.get('speedX'),
                    vw = win.width(),
                    vh = win.height(),
                    bw = _this.get('mover').width(),
                    bh = _this.get('mover').height();

                if (nT < 0) {
                    nT = 0;
                    _this.set('speedY', _this.get('speedY') * -1);
                    _this.set('speedY', _this.get('speedY') * _this.get('decay'));
                    _this.set('speedY', _this.get('speedY') < 0 ? Math.ceil(_this.get('speedY')) : Math.floor(_this.get('speedY')));
                    _this.set('speedX', _this.get('speedX') * _this.get('decay'));
                    _this.set('speedX', _this.get('speedX') < 0 ? Math.ceil(_this.get('speedX')) : Math.floor(_this.get('speedX')));
                } else if (nT > vh - bh) {
                    nT = vh - bh;
                    _this.set('speedY', _this.get('speedY') * -1);
                    _this.set('speedY', _this.get('speedY') * _this.get('decay'));
                    _this.set('speedY', _this.get('speedY') < 0 ? Math.ceil(_this.get('speedY')) : Math.floor(_this.get('speedY')));
                    _this.set('speedX', _this.get('speedX') * _this.get('decay'));
                    _this.set('speedX', _this.get('speedX') < 0 ? Math.ceil(_this.get('speedX')) : Math.floor(_this.get('speedX')));
                }

                if (nL < 0) {
                    nL = 0;
                    _this.set('speedX', _this.get('speedX') * -1);
                    _this.set('speedX', _this.get('speedX') * _this.get('decay'));
                    _this.set('speedX', _this.get('speedX') < 0 ? Math.ceil(_this.get('speedX')) : Math.floor(_this.get('speedX')));
                } else if (nL > vw - bw) {
                    nL = vw - bw;
                    _this.set('speedX', _this.get('speedX') * -1);
                    _this.set('speedX', _this.get('speedX') * _this.get('decay'));
                    _this.set('speedX', _this.get('speedX') < 0 ? Math.ceil(_this.get('speedX')) : Math.floor(_this.get('speedX')));
                }

                _this.get('mover').css({"left": nL, "top": nT});
            }, 25));
        },
        _bindEvent: function() {
            var _this = this,
                sSpeedX = 0,
                sSpeedY = 0,
                win = $(window),
                mover = _this.get('mover'),
                bw = mover.width(),
                bh = mover.height(),
                disX = 0,
                disY = 0;
            _this.get('target').on("mousedown", function(e) {

                clearInterval(_this.get('timer'));

                var vw = win.width(),
                    vh = win.height();

                sSpeedX = e.clientX;
                sSpeedY = e.clientY;

                disX = e.clientX - mover.offset().left;
                disY = e.clientY - mover.offset().top;

                $(document).on("mousemove", function(e) {
                    _this.set('speedX', e.clientX - sSpeedX);
                    _this.set('speedY', e.clientY - sSpeedY);

                    sSpeedX = e.clientX;
                    sSpeedY = e.clientY;

                    var dL = e.clientX - disX;
                    var dT = e.clientY - disY;

                    if (dL < 0) {
                        dL = 0;
                    } else if (dL > vw - bw) {
                        dL = vw - bw;
                    }

                    if (dT < 0) {
                        dT = 0;
                    } else if (dT > vh - bh) {
                        dT = vh - bh;
                    }

                    mover.css({"left": dL, "top": dT});

                }).on("mouseup", function(e){
                    $(document).off("mousemove mouseup");
                    _this._startMove();
                }).on("selectstart", function() {
                    return false;
                });
            });
        }
    };

    $.fn.eThrow = function() {
        return this.each(function(idx, dg){
            var _this = $(dg),
                opt = $.parseJSON(_this.attr('data-config') || '{}');
            opt = $.extend({}, $.fn.eThrow.default, opt);
            opt.target = _this;
            $.fn.eThrow.instanceObjects.push(new EThrow(opt));
        });
    };

    $.fn.eThrow.default = {
        target: '.J_EThrow', // 拖动控制器
        mover: '.J_EThrowBox', // 被拖动节点
        decay: 0.75,
        size: {w: 200, h: 200},
        speedX: 0,
        speedY: 0,
        delay: 1,
        zIndex: 10
    };

    $.fn.eThrow.instanceObjects = [];

})(window, jQuery);