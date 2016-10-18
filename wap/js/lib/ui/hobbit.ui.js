define(function(require, exports, module){
var $H = require("hobbit"); require("ui-css");
$H.mask = {
    ui: $("<div id='imgBox'>"),
    show: function (options) {
        options = $.extend({
            scrollable: true,
            clickMask: function () { }
        }, options);

        //var height = $(document).height();
        //if ($H.browser.height() > height)
        //    height = $H.browser.height();
        var obj = {
            "background-color": "#000",
            "position": "absolute",
            "top": "0",
            "height": document.body.scrollHeight,
            "width": "100%",
            "z-index": "9998",
            "opacity": ".8"
        }
        if(options.opacity){
            obj.opacity = options.opacity;
        }
        $H.mask.ui.css(obj).appendTo($("body"));

        $H.mask.ui.off("tap");
        $H.mask.ui.on("tap", options.clickMask);

        if (!options.scrollable)
            $H.browser.discrollable();

        return $H.mask.ui;
    },
    close: function () {
        if ($H.mask.ui) {
            $H.mask.ui.empty();
            $H.mask.ui.remove();
        }
        $H.browser.scrollable();
    }
};
$H.cookie = {
    get: function (key) {
        if (!key)
            return null;
        key = key.toUpperCase();
        var cks = document.cookie.split("; ");
        var tmp = null;
        for (var i = 0; i < cks.length; i++) {
            tmp = cks[i].split("=");
            if (tmp[0].toUpperCase() == key)
                return unescape(tmp[1]);
        }
        return null;
    },
    set: function (options) {
        options = $.extend({
            key: "",
            value: "",
            expires: 0,
            path: "",
            domain: document.domain
        }, options);

        var ck = [options.key + "=" + escape(options.value)];
        if (!isNaN(options.expires) && options.expires != 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失
            var date = new Date();
            date.setTime(date.getTime() + options.expires * 60 * 1000);
            ck.push(";expires=" + date.toUTCString());
        }

        ck.push(";path=" + (options.path || "/"));
        if (options.domain && options.domain.toLowerCase() !== "localhost")
            ck.push(";domain=" + options.domain);
        document.cookie = ck.join("");
    },
    remove: function (options) {
        options = $.extend({
            key: "",
            path: "",
            domain: document.domain
        }, options);
        var date = new Date();
        date.setTime(date.getTime() - 999999);
        options.expires = date;
        $H.cookie.set(options);
        //document.cookie = options.key + "=;expires=" + date.toGMTString() + ";path=" + (options.path || "/") + ";domain=" + ((options.domain) || document.domain);
    }
};
$H.loader = {
    ui: $("<div>").addClass("loader"),
    show: function (options) {
        options = $.extend({
            text: "",
            mask: true,
            scrollable: false,
            clickMask: function () { },
            timeout: -1
        }, options);

        $H.loader.ui.empty();
        var text = $("<div>");
        var loading = $("<div>").addClass("loading");

        if (options.mask) {
            $H.mask.show({
                scrollable: true,
                clickMask: options.clickMask,
                opacity:options.opacity
            });
        }

        loading.appendTo($H.loader.ui);
        $H.loader.ui.appendTo($("body"));

        if (options.text) {
            text.addClass("text").html(options.text).appendTo($H.loader.ui);
        }
        $H.loader.ui.css("margin-left", -$H.loader.ui.width() / 2);

        //todo; 提炼出int解析方法
        //如果不传timeout，则永久显示
        var timeout = parseInt(options.timeout, 10);
/*        if (!isNaN(timeout) && timeout >= 0)
            setTimeout($H.loader.close, timeout * 1000);*/

        if (!options.scrollable)
            $H.browser.discrollable();

        return $H.loader.ui;
    },
    close: function () {
        $H.mask.close();
        if ($H.loader.ui) {
            $H.loader.ui.empty();
            $H.loader.ui.remove();
        }
    }
};

$H.toast = {
      ui:$("<div class='toast'></div>"),
      show:function(options){
             options = $.extend({
             content: "",
             scrollable: false
        }, options);
        $H.toast.ui.removeClass("t-out t-show").empty();
        if (options.content!="") {
            var span = $("<span class='content'>"+ options.content +"</span>");
            $H.toast.ui.html(span);
        };

        $H.toast.ui.appendTo($("body"));
        $H.toast.ui.addClass('t-show')

        if (!options.scrollable)
            $H.browser.discrollable();
            $H.toast.ui.on('webkitAnimationEnd AnimationEnd', function(event) {
               event.preventDefault();
                 t = setTimeout(function(){
                  $H.toast.ui.addClass("t-out");
                  $H.toast.hide();
                },2000)
             
           });
   },
   hide:function(){
    if ($H.toast.ui) {
            $H.toast.ui.empty();
            $H.toast.ui.remove();
            clearTimeout(t);
        }
        $H.browser.scrollable();
   }

};

$H.dialog = {
    ui: $("<div>").addClass("dialog"),
    show: function (options) {
        options = $.extend({
            title: "温馨提示",
            content: "",
            buttons: null,
            mask: false,
            scrollable: false,
            clickMask: function () { }
        }, options);

        $H.dialog.ui.empty();
        var title = $("<div>").addClass("title");
        var content = $("<div>").addClass("content");
        var btns = $("<div>").addClass("btns");

        if (options.mask) {
            $H.mask.show({
                scrollable: true,
                clickMask: options.clickMask
            });
        }

        if (options.title) {
            title.html(options.title);
            $H.dialog.ui.append(title);
        }

        $H.dialog.ui.append(content);
        if (options.content) {
            content.html(options.content).css("max-height", $H.browser.height() - 80);
        }
        //btn = {text:"",callback:"",className:"",css:{}}
        if (options.buttons) {
            $.each(options.buttons, function (index, item) {
                var zepBtn = $("<a href='javascript:void(0)'>").text(item.text);
                //todo: touchActive
                zepBtn.on("touchstart mousedown", function (event) {
                    $(this).addClass("active");
                    var This = $(this);
                    if ("android,windowsmobile,windowsphone,windowspc".indexOf($H.os.type()) != -1) {
                        setTimeout(function () { This.removeClass("active"); }, 800);
                    }
                }).on("touchcancel touchend mouseup click", function () {
                    $(this).removeClass("active");
                });

                if (item.className)
                    zepBtn.addClass(item.className);
                if (item.css)
                    zepBtn.css(item.css);
                if (item.callback)
                    zepBtn.off("touchend").on("touchend", function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        item.callback();
                    });
                content.append(zepBtn);
                zepBtn = null;
            });
            //$H.dialog.ui.append(btns);
            //content.append(btns);
        }

        $H.dialog.ui.appendTo($("body"));
        //$H.dialog.ui.css("margin-top", -$H.dialog.ui.height() / 2);
        $H.dialog.ui.css("margin-top", "-100px");
      
        if (!options.scrollable)
            $H.browser.discrollable();
        //$H.dialog.content.unbind("touchmove", $H.browser.preventEvent);

        return $H.dialog.ui;
    },
    close: function () {
        $H.mask.close();
        if ($H.dialog.ui) {
            $H.dialog.ui.empty();
            $H.dialog.ui.remove();
        }

        $H.browser.scrollable();
    }
};

$.extend($.fn, {
    radio: function () {
        var This = this;
        var dom = this[0];
        var ui = this.parent(".radio");

        this.checked = function (checked) {
            if (checked !== undefined) {
                dom.checked = checked;
            }

            $("input[name=" + dom.name + "]").each(function () {
                if ($(this)[0].checked)
                    $(this).parent().addClass("checked");
                else
                    $(this).parent().removeClass("checked");
            });

            return dom.checked;
        };

        this.disabled = function (disabled) {
            if (disabled !== undefined) {
                dom.disabled = disabled;
            }

            if (dom.disabled)
                ui.addClass("disabled");
            else
                ui.removeClass("disabled");

            return dom.disabled;

        };

        var init = (function () {
            if (!ui || ui.length == 0) {
                This.wrap("<span class='radio'></span>");
                ui = This.parent(".radio");
            }
            This.checked();
            This.disabled();

            This.on("change", function (e) {
                This.checked();
            });
        })();

        return this;
    },

    checkbox: function () {
        var This = this;
        var dom = this[0];
        var ui = this.parent(".checkbox");

        this.checked = function (checked) {
            if (checked !== undefined) {
                dom.checked = checked;
            }

            if (dom.checked)
                ui.addClass("checked");
            else
                ui.removeClass("checked");

            return dom.checked;
        };

        this.disabled = function (disabled) {
            if (disabled !== undefined) {
                dom.disabled = disabled;
            }

            if (dom.disabled)
                ui.addClass("disabled");
            else
                ui.removeClass("disabled");

            return dom.disabled;
        };

        var init = (function () {
            if (!ui || ui.length == 0) {
                This.wrap("<span class='checkbox'></span>");
                ui = This.parent(".checkbox");
            }

            This.checked();
            This.disabled();

            This.on("change", function (e) {
                This.checked();
            });
        })();

        return this;
    },

    switcher: function () {
        var This = this;
        var dom = this[0];
        var ui = this.parent(".switch");

        this.checked = function (checked) {
            if (checked !== undefined) {
                dom.checked = checked;
            }

            if (dom.checked)
                ui.removeClass("off").addClass("on");
            else
                ui.removeClass("on").addClass("off");

            dom.value = dom.checked ? "on" : "off";

            return dom.checked;
        };

        this.disabled = function (disabled) {
            if (disabled !== undefined) {
                dom.disabled = disabled;
            }

            if (dom.disabled)
                ui.addClass("disabled");
            else
                ui.removeClass("disabled");

            return dom.disabled;
        };

        var init = (function () {
            if (!ui || ui.length == 0) {
                This.wrap("<span class='switch'></span>");
                ui = This.parent(".switch");
            }

            This.checked();
            This.disabled();

            This.on("change", function (e) {
                This.checked();
            });
        })();

        return this;
    }
});

$.extend($.fn, {
    select: function (options) {
        var This = this;
        var dom = this[0];
        var ui = this.parent(".select");
        var text = ui.children("span");
        options = $.extend({
            displayText: function (opt) { return opt ? opt.text : ""; }
        }, options);

        this.count = function () {
            return dom.options.length;
        };
        this.displayText = options.displayText;

        //遵循原则：获取或操作只能针对dom元素进行
        //保证options的顺序是通过index从小到大
        this.options = function (opts) {
            opts = (opts == undefined) ? null : ($.isArray(opts) ? opts : [opts]);

            var selectedOptions = [], o, p;
            for (var j = 0; j < dom.options.length; j++) {
                o = dom.options[j];
                if (opts == null)
                    selectedOptions.push({ index: o.index, value: o.value, text: o.innerHTML, selected: o.selected });
                else
                    for (var i = 0; i < opts.length; i++) {
                        p = opts[i];
                        //如果匹配到相应的option的属性
                        if (opts.length == 0 ||
                            (p.value == undefined || o.value == p.value) &&
                            (p.index == undefined || o.index == p.index) &&
                            (p.text == undefined || o.innerHTML == p.text) &&
                            (p.selected == undefined || o.selected == p.selected)) {
                            selectedOptions.push({ index: o.index, value: o.value, text: o.innerHTML, selected: o.selected });
                            break;
                        }
                    }
            }

            return selectedOptions;
        };

        this.selected = function (opt) {
            var selectedOpt;
            if (opt === undefined) {
                if (dom.selectedIndex == -1) {
                    selectedOpt = null;
                }
                else {
                    var option = dom.options[dom.selectedIndex];
                    selectedOpt = {
                        index: dom.selectedIndex,
                        value: option ? option.value : option,
                        text: option ? option.innerHTML : option,
                        selected: true
                    };
                }
            }
            else {
                var opts = This.options(opt);
                if (opts.length >= 1) {
                    selectedOpt = opts[opts.length - 1];
                    if (dom.selectedIndex != selectedOpt.index) {
                        selectedOpt.selected = true;
                        dom.selectedIndex = selectedOpt.index;
                        This.trigger("change");
                    }
                }
            }

            return selectedOpt;
        };

        //按照index从小到大的insert，如果index超出select>options的长度范围则插入到最后
        //如果设置了selected，控件会选中最后一次被设置了selected的选项，忽略它的顺序
        this.insert = function (opts) {
            if (opts != undefined) {
                //先排序
                opts = $.isArray(opts) ? opts : [opts];
                opts.sort(function (a, b) {
                    return a.index - b.index;
                });
                var changed = false;
                for (var i = 0; i < opts.length; i++) {
                    var insertOpt = $("<option>").val(opts[i].value || "").text(opts[i].text || "");
                    if (This.count() == 0)
                        insertOpt.appendTo(This);
                    else {
                        var insertIndex = opts[i].index || 0;
                        if (insertIndex < This.count())
                            $(dom.options[insertIndex]).before(insertOpt);
                        else
                            $(dom.options[This.count() - 1]).after(insertOpt);
                    }

                    if (opts[i].selected) {
                        dom.selectedIndex = opts[i].index;
                        changed = true;
                    }
                }
                if (changed)
                    This.trigger("change");
                return opts;
            }
        };
        //按照index从大到小的remove
        this.remove = function (opts) {
            if (opts === undefined) {
                if (dom.options.length > 0) {
                    This.empty();
                    This.trigger("change");
                }
            }
            else {
                opts = This.options(opts);
                var selectedRemove = false;
                for (var i = opts.length - 1; i >= 0 ; i--) {
                    if (opts[i].selected) selectedRemove = true;
                    $(dom.options[i]).remove();
                }
                if (selectedRemove)
                    This.trigger("change");
            }
            return opts;
        };
        var init = (function () {
            if (!ui || ui.length == 0) {
                This.wrap("<span class='select'></span>");
                ui = This.parent(".select");
                This.transferCssTo(ui);
                ui.touchActive();
            }

            if (!text || text.length == 0) {
                text = $("<span>");
                ui.append(text);
            }
            text.html(This.displayText(This.selected()));

            This.on("change", function () {
                text.html(This.displayText(This.selected()));
            });
        })();

        return this;
    }
});

$.extend($.fn, {
    tabs: function (options) {
        var args = {},
            defaults = {
                selected: 0,
                disabled: [],
                callback: function (args) { }
            },
            opts = $.extend(defaults, options),
            This = $(this);

        this.init = function (opts) {
            if (!This.is("tabs")) {
                This.addClass("tabs");
            };
            var li = This.find("li.etc"),
                num = li.length,
                width = (100 / num).toFixed(2);
            for (var i = 0; i < num; i++) {
                if (i != num - 1) {
                    li.eq(i).css({ "width": width + "%" });
                } else {
                    var lastWidth = 100 - width * (num - 1);
                    li.eq(i).css({ "width": lastWidth + "%" });
                };
            };

            This.find("ul li.etc").eq(opts.selected).addClass("selected");
            This.children("div").hide().eq(opts.selected).show();
            This.find("ul li.etc").on("click", function (e) {
                e.stopPropagation();
                var index = $(this).index();
                args.index = index;
                for (var i = 0; i < opts.disabled.length; i++) {
                    if (index == opts.disabled[i]) {
                        return false;
                    };
                };
                $(this).addClass("selected").siblings().removeClass("selected");
                This.children("div").eq(index).show().siblings("div").hide();
                opts.callback(args);
            });
        };

        this.index = function (index) {
            if (index == undefined) {
                var index = 0,
                index = $("li.selected").index();
                return index;
            } else {
                if (index > -1 && index < This.find("ul").length && index == parseInt(index)) {
                    This.find("ul li.etc").eq(index).trigger("click");
                    opts.callback(args);
                };
            };
        };

        this.init(opts);

        return This;
    }
});
module.exports = $H;
});