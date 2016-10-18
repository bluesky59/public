define(function(require, exports, module) {
    var ef = module.exports = {
        abPosition: abPosition,             // a相对于b定位
        scrollLocate: scrollLocate,         // 元素一直固定在元素的初始化位置(x,y)
        linkAge: linkAge,                   // 连接2个选择器，一个锚点，一个目标
        followMouse: followMouse,           // 元素随着鼠标移动，自身也跟着轻微移动
        analytics: analytics,               // 加载统计代码
        toTop: toTop,                       // 到顶部
        search: search,
        Page: Page                          // 分页
    };
    /**
    * 分页类
    * pageCount     // 分页总数
    * currentPage   // 当前页
    * link          // 连接地址
    */
    function Page(opts) {
        this.opts = {
            // 基本配置
            pageCount:          0,                       // 分页总数
            currentPage:        1,                       // 当前页码
            link:               '',                      // 分页连接地址前缀
            lastNum:            4,                       // 尾部页码数字
            end:                9,                       // 在7页以前显示的分页数量要和7页以后的分页数量一直
            // 文字常量
            prevText:           '上一页',                 // 上一页文字
            nextText:           '下一页',                 // 下一页文字
            // 样式配置
            pageListClass:      'page-list',             // 分页数字样式
            prevClass:          'page-prev',             // 上一页样式
            nextClass:          'page-next',             // 下一页样式
            currentPageClass:   'page-current',          // 当前页样式
            disabledClass:      'page-disabled',         // 分页连接不可用
        };
        // 覆写属性
        for(key in opts) {
            this.opts[key] = opts[key];
        }
        opts = this.opts;

        this.htlm = '';
        // 获取分页html
        this.getHtml = function() {
            if(opts.currentPage > opts.pageCount) {
                opts.currentPage = opts.pageCount;
            }
            if(opts.currentPage < 1) {
                opts.currentPage = 1;
            }
            this.html = '';
            this.getPrevPage();             // 上一页
            this.getFirstPage();            // 首页
            this.getPageNumber();           // 页码
            this.getNextPage();             // 下一页
            return this.html;
        };
        // 获取页码
        this.getPageNumber = function() {
            // 1 2-11 30
            // 显示更多
            if(opts.pageCount > 11) {

                // 当前页码前面有3个页码，当前页码后面有6个页码 == 10
                var start = 2;
                if(opts.currentPage > 5) {
                    start = opts.currentPage - 3;
                    opts.end = opts.currentPage + opts.lastNum;
                }
                if(opts.currentPage + opts.lastNum > opts.pageCount) {
                    opts.end = opts.pageCount;
                }
                for(var i = start; i <= opts.end; i++) {
                    var classArr = [];

                    classArr.push(opts.pageListClass);
                    if(getCurrentPage(i)) {
                        classArr.push(getCurrentPage(i));
                        this.html += '<em class="' + classArr.join(' ') + '">' + i + '</em>';
                    } else {
                        //' + getLink(i) + '
                        this.html += '<a href="javascript:;" class="' + classArr.join(' ') + '">' + i + '</a>';
                    }
                }

                // 是否显示尾页逻辑
                if((opts.currentPage + opts.lastNum) < opts.pageCount) {
                    this.getLastPage(); // 尾页
                }
            } else {
                for(var i = 2; i <= opts.pageCount; i++) {
                    var classArr = [];

                    classArr.push(opts.pageListClass);
                    if(getCurrentPage(i)) {
                        classArr.push(getCurrentPage(i));
                        this.html += '<em class="' + classArr.join(' ') + '">' + i + '</em>';
                    } else {
                        //' + getLink(i) + '
                        this.html += '<a href="javascript:;" class="' + classArr.join(' ') + '">' + i + '</a>';
                    }

                }
            }
        };
        // 获取首页页码
        this.getFirstPage = function() {
            var classArr = [];

            classArr.push(opts.pageListClass);
            if(getCurrentPage(1)) {
                classArr.push(getCurrentPage(1));
            }
            if(getCurrentPage(1)) {
                this.html += '<em class="' + classArr.join(' ') + '">' + 1 + '</em>';
            } else {
                //' + getLink(1) + '
                this.html += '<a href="javascript:;" class="' + classArr.join(' ') + '">1</a>';
            }
        };
        // 获取尾页页码
        this.getLastPage = function() {
            var classArr = [];

            classArr.push(opts.pageListClass);
            if(getCurrentPage(opts.pageCount)) {
                classArr.push(getCurrentPage(opts.pageCount));
            }
            if(getCurrentPage(opts.pageCount)) {
                this.html += '<em class="' + classArr.join(' ') + '">' + opts.pageCount + '</em>';
            } else {
                //' + getLink(opts.pageCount) + '
                this.html += '<a href="javascript:;" class="' + classArr.join(' ') + '">' + opts.pageCount + '</a>';
            }

        };
        // 获取上一页
        this.getPrevPage = function() {
            var classArr = [];
            var href = "";

            classArr.push(opts.prevClass);
            if(opts.currentPage == 1) {
                // 如果是在第一页则不显示上一页
                return;
                classArr.push(opts.disabledClass);
                href = 'javascript:;';
            } else {
                href = getLink(opts.currentPage - 1);
            }
            //' + href + '
            this.html += '<a href="javascript:;" class="' + classArr.join(' ') + '">' + opts.prevText + '</a>';
        };
        // 获取下一页
        this.getNextPage = function() {
            var classArr = [];
            var href = "";

            classArr.push(opts.nextClass);
            if(opts.currentPage == opts.pageCount) {
                // 如果是在最后一页则不显示下一页
                return;
                classArr.push(opts.disabledClass);
                href = 'javascript:;';
            } else {
                href = getLink(opts.currentPage + 1);
            }
            //' + href + '
            this.html += '<a href="javascript:;" class="' + classArr.join(' ') + '">' + opts.nextText + '</a>';
        };
        // 获取连接路径
        function getLink(num) {
            return opts.link+ '/' + num;
        }
        // 检测是否是当前页
        function getCurrentPage(pageNum) {
            if(opts.currentPage == pageNum) {
                return opts.currentPageClass;
            }
            return '';
        }
    };

    function search() {
        //搜索提交
        $('.searchBtn').click(function() {
            var wd = $('.siteTopSearchIpt').val();
            if (wd && $.trim(wd) != '') {
                $('#searchForm').submit();
            } else if (wd == '') {
                alert("请输入关键字");
                $('.siteTopSearchIpt').focus();
            }
        });
    }
    // 到顶部
    function toTop(selector) {
        $(selector).click(function() {
            $("body,html").animate({
                scrollTop: 0
            });
        });
    }
    /**
     * a相对于b定位
     * targetSelector    要定位的a元素
     * adjuctSelector    a定位的相对元素b
     * offset            a相对于b的左边偏移量
     */
    function abPosition(targetSelector, adjuctSelector, offset) {
        var pElemLeft = $(adjuctSelector).offset().left;
        var targetElem = $(targetSelector);
        offset = offset || 0;
        var adjuct_F = function() {
            $(targetElem).css({
                'left': pElemLeft - targetElem.width() + offset + 'px'
            })
        };
        adjuct_F();
        $(window).on('resize', function(e) {
            setTimeout(function() {
                pElemLeft = $(adjuctSelector).offset().left;
                targetElem = $(targetSelector);
                adjuct_F();
            }, 50);
        });
    };

    /**
     * 元素一直固定在元素的初始化位置(x,y)
     * locateSelector 固定元素
     * offset        顶部偏移量
     * fn            hook
     */
    function scrollLocate(locateSelector, offset, fn) {
        var locateElem = $(locateSelector),
            locateElemTop = locateElem.offset().top - offset,
            locateElemOldTop = locateElem.css('top').replace('px', '');

            $(window).scroll(function(e) {
                 var scrollTop = $(this).scrollTop();
                 if (scrollTop >= locateElemTop) {
                     locateElem.css({
                         position: 'fixed',
                         top: offset + 'px'
                     });
                 } else if (scrollTop <= locateElemTop) {
                     locateElem.css({
                         position: 'absolute',
                         top: locateElemOldTop + 'px'
                     });
                 }
                 if (typeof fn === 'function') {
                     fn.call(this, {
                         locateElem: locateElem,
                         scrollTop: scrollTop,
                         locateElemTop: locateElemTop,
                         locateElemOldTop: locateElemOldTop
                     });
                 }
             })
    };

    /**
     * 连接2个选择器，一个锚点，一个目标
     * linkAgeSelector   菜单选择器，一般是左侧的导航菜单
     * scrollSelector    滚动内容选择器，这个些选择器会和linkAgeSelector绑定
     */
    function linkAge(linkAgeSelector, scrollSelector) {
        var linkAge_E = $(linkAgeSelector);
        var scroll_E = $(scrollSelector);
        var scrollPosition = [];
        var click_F = false;

        scroll_E.each(function() {
            scrollPosition.push($(this).offset().top);
        });
        linkAge_E.click(function() {
            var linkAgeIndex = $(linkAgeSelector).index(this);
            scroll_E = $(scrollSelector);
            var scrollTop = scroll_E.eq(linkAgeIndex).offset().top;
            click_F = true;
            clearMenuClass();

            var Obj=countIndex(linkAgeIndex);
            var oldClass=Obj.removeClass;
            var newClass=Obj.addClass;
            $(this).addClass(newClass).removeClass(oldClass);


            $("body,html").animate({
                scrollTop: scrollTop
            }, function() {
                click_F = true;
            });
            setTimeout(function(argument) {
                click_F = false;
            },800);
        });
        $(window).scroll(function(e) {
            if (click_F) {
                return;
            }
            var scrollTop = $(this).scrollTop();
            if (scrollTop < scrollPosition[0]) {
                //clearMenuClass();
                return;
            }
            // 超出最后一个scroll元素高度取消菜单高亮
            if (scrollTop > (scrollPosition[scrollPosition.length - 1] + scroll_E.eq(scrollPosition.length - 1).outerHeight())) {
                clearMenuClass();
                return;
            }
            for (var i = 0, l = scrollPosition.length; i < l; i++) {
                if (scrollTop > scrollPosition[i] && i + 1 == l) {
                    clearMenuClass();

                    var Obj=countIndex(i);
                    var oldClass=Obj.removeClass;
                    var newClass=Obj.addClass;
                    linkAge_E.eq(i).addClass(newClass).removeClass(oldClass);
                    return;
                }
                if (scrollTop > scrollPosition[i] && scrollTop < scrollPosition[i + 1]) {
                    clearMenuClass();

                    var Obj=countIndex(i);
                    var oldClass=Obj.removeClass;
                    var newClass=Obj.addClass;
                    linkAge_E.eq(i).addClass(newClass).removeClass(oldClass);
                    return;
                }
            }

        });

        function clearMenuClass() {
            for(var i=0;i<6;i++){
                var Obj=countIndex(i);
                var removeClass=Obj.removeClass;
                var addClass=Obj.addClass;
                $(".side-bar-item").eq(i).addClass(removeClass).removeClass(addClass);
            }
        }
        function countIndex(i){
            var addClass="",removeClass="";
            if(i==0){
                addClass="side-bar-product1-active";
                removeClass="side-bar-product1";
            }else if(i==1){
                addClass="side-bar-product2-active";
                removeClass="side-bar-product2";
            }else if(i==2){
                addClass="side-bar-product3-active";
                removeClass="side-bar-product3";
            }else if(i==3){
                addClass="side-bar-product4-active";
                removeClass="side-bar-product4";
            }else if(i==4){
                addClass="side-bar-product5-active";
                removeClass="side-bar-product5";
            }else if(i==5){
                addClass="side-bar-product6-active";
                removeClass="side-bar-product6";
            }
            return {
                addClass:addClass,
                removeClass:removeClass
            };
        }
    };

    /**
     * 元素随着鼠标移动，自身也跟着轻微移动
     * followSelector  移动的元素
     * wrapSelector    鼠标在什么元素上触发移动
     * ratio           移动比例
     */
    function followMouse(followSelector, wrapSelector, ratio) {
        var wrap_E = $(wrapSelector),
            follow_E = $(followSelector);
        ratio = ratio || 100;
        $(wrapSelector).on('mousemove', function(e) {
            var wrapLeft = wrap_E.offset().left,
                wrapTop = wrap_E.offset().top,
                pageX = e.pageX,
                pageY = e.pageY,
                fixLeft = pageX - wrapLeft,
                fixTop = pageY - wrapTop,
                marginLeft = -fixLeft / ratio,
                marginTop = -fixTop / ratio;

            follow_E.css({
                'margin-left': marginLeft,
                'margin-top': marginTop
            });
        });
    }
    /**
    * 弹出框+遮罩 暴露全局方法，单例
    * dialog.show(opts, cb); opts.text
    * dislog.hide();
    */
    (function() {
        // 遮罩
        var oDialog = window.dialog;
        var _mask = {};
        var _maskEntity = null;
        var _maskDom = '<div class="ck-mask"></div>';
        var _width = 0;
        var _height = 0;
        _mask.show = function() {
            if (!_maskEntity) {
                _maskEntity = $(_maskDom).appendTo($('body').append());
            }
            _maskEntity.show();
        };
        _mask.hide = function() {
            if (!_maskEntity) {
                _maskEntity = $(_maskDom).appendTo($('body').append());
            }
            _maskEntity.hide();
        }

        // 弹窗
        var dialog = window.dialog = {};
        var _dialogDom = [
            '<div class="ck-dialog">',
            '<div class="ck-dialog-close"></div>',
            '<div class="ck-dialog-body"></div>',
            '</div>'
        ].join('');
        var _dialogEntity = null;
        var _createDialog;
        dialog.show = function(opts, cb) {
            var opts = {
                text: opts || ''
            };
            if (!_dialogEntity) {
                _createDialog();
            }
            cacle();
            _mask.show();
            _dialogEntity.show();
            _dialogEntity.find('.ck-dialog-body').html(opts.text).show();
            if (typeof cb == 'function') {
                cb(_dialogEntity);
            }
        };
        dialog.hide = function() {
            if (!_dialogEntity) {
                _createDialog();
                _dialogEntity.hide();
            }
            _mask.hide();
            _dialogEntity.hide();
        };
        _createDialog = function() {
            _dialogEntity = $(_dialogDom).appendTo($('body').append());
            _dialogEntity.find('.ck-dialog-close').on('click', function(e) {
                dialog.hide();
            });
        };

        function cacle() {
            _width = $(window).width() / 2;
            _height = $(window).height() / 2;
            $(_dialogEntity).css({
                left: _width - (_dialogEntity.width() / 2),
                top: _height - (_dialogEntity.height() / 2)
            })
        }
    })()

    // 获取cookies  for 99lcick
    function getAreaIdCookies(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return unescape(arr[2]);
        }else {
            return null;
        }
    }
    // 加载统计代码
    function analytics() {
        // 获取cookies数据  for 99click
        if(getAreaIdCookies('uin') && getAreaIdCookies('uin').length>0){
            var _ozuid=getAreaIdCookies('uin');
            _vds.push(['setCS1','user_id', _ozuid]);
        }
        // load url list
        var scriptMap = [
            {url: '//hm.baidu.com/hm.js?a63f93d647323db53fe9d21befcaabcd'},    // baidu
            {url: 'http://static.itrip.com/js/lib/99click/o_code.js'},              // 99click
            {
                url: 'http://www.googleadservices.com/pagead/conversion_async.js',  //Google 再营销代码
                load: function(){
                    window.google_trackConversion({
                      google_conversion_id: 949765398,
                      google_custom_params: window.google_tag_params,
                      google_remarketing_only: true
                    });
                }
        }
        ]
        for(var i = 0; i < scriptMap.length; i++) {
            (function(script){
                var bodyScript = document.getElementsByTagName("script")[0];
                var scriptElem =  document.createElement("script");
                if(!script.url) {
                    console.log('load url error!');
                    return;
                }
                scriptElem.src = script.url;
                scriptElem.onload = script.load || function(){};
                bodyScript.parentNode.insertBefore(scriptElem, bodyScript);
            })(scriptMap[i]);
        }

        //GrowingIO
        (function(){
         _vds.push(['setAccountId', '85a6b38dd701488ca63d51cb8211101d']);

         (function() {var vds = document.createElement('script');
         vds.type='text/javascript';
         vds.async = true;
         vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
         var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(vds, s);})();
         })();

        // google analytics
        (function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,"script","//www.google-analytics.com/analytics.js","ga");

        ga("create", "UA-61956206-1", "auto");
        ga("send", "pageview");

    }
});
