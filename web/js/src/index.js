define(function(require, exports, module) {
    var ef = require('ui'),
        server = require('requester');
    $H = require('hobbit');
    require('lazyload');
    
    window.onload = function() {
        ef.analytics();
    };

    var app = {
        init:function(){
            this.checkLogin();
            this.bind();
            this.getProduct();
            this.resize();
            this.headerLogic();
        },
        bind:function(){
          
        },
        resize:function(){
            var w = $(window).width();
            if(w>1300){
                $(".product-module").css({"left":"0"});
                $(".product-content").css({"left":"0"});
                $(".header-active").css({"left":"0"});
            }else{
                $(".product-module").css({"left":"5%"});
                $(".product-content").css({"left":"5%"});
                $(".header-active").css({"left":"5%"});
            }
            ef.abPosition('.side-bar', '.product-module', 0);
        },
        checkLogin:function(s, f) {
            server.checkLogin({}, function(data) {
                var res = data.result;
                if (res.status == '0') {
                    // 未登录
                    $('.user-action').show();
                } else if (res.status == '1') {
                    // 登录
                    $('.user-action').hide();
                    $('.user_info').show().text(res.userName);
                }
            });
        },

        //写入产品信息
        getProduct:function(){
            server.getProduct({},function(res){
                if(res.result&&res.result.groupList){    //取参遍历
                    app.render(res.result.groupList);
                }
                $('.product-img img[data-original]').lazyload({
                    placeholder: "http://hd.itrip.com/magazine/huodong/shopping/imgs/loading_new.gif",
                    effect: "fadeIn",
                    threshold: 200,
                    skip_invisible: true
                });
            });
        },
        render:function(list){
            for(var i in list){
                if(list[i].groupName=="冰岛"){
                    app.renderItem(list[i].memberList,"p1");
                }else if(list[i].groupName=="芬兰"){
                    app.renderItem(list[i].memberList,"p2");
                }else if(list[i].groupName=="挪威"){
                    app.renderItem(list[i].memberList,"p3");
                }else if(list[i].groupName=="瑞典"){
                    app.renderItem(list[i].memberList,"p4");
                }else if(list[i].groupName=="丹麦"){
                    app.renderItem(list[i].memberList,"p5");
                }
            }
        },
        renderItem : function(data,dom){
            var html  = "",price;
            data.forEach(function(item,index){
                if(item == undefined) return;

                price = Number(item.price*item.exrate).toFixed(0);

                html+='<li class="product-item">'+
                    '<a href="'+item.href+'" target="_blank" class="product-img">'+
                    '<img data-original="'+item.showImg+'?imageView2/5/w/326/h/216/q/100" src="http://hd.itrip.com/magazine/huodong/shopping/imgs/loading_new.gif" alt="">'+
                    '</a>'+
                    '<div class="product-info">'+
                    '<p class="product-txt">'+item.showName+'</p>'+
                    '</div>'+
                    '<div class="product-price clearfix">'+
                    '<span class="product-money">￥<strong>'+price+'</strong>起</span>'+
                    '<a href="'+item.href+'" target="_blank" class="product-buy">马上出发</a>'+
                    '</div>'+
                    '</li>';
            });
            $("#"+dom).find(".product-list").html(html);
            app.countLength();
            setTimeout(function (){
                ef.linkAge('.side-bar-item','.product');
            },2000);
        },

        countLength:function (){
            $(".product-txt").each(function(){
                var maxwidth=35;
                if($(this).text().length>maxwidth){
                    $(this).text($(this).text().substring(0,maxwidth));
                    $(this).html($(this).html()+'...');
                }
            });
        },

        headerLogic:function () {
            var Request = app.GetRequest();
            var areaId = Request['areaId'];
            if (areaId == 2 || !areaId) {
                $('.header-nav.aodaliya').removeClass('hide');
                $('.header-nav:not(".aodaliya")').remove();
            } else if (areaId == 1) {
                $('.header-nav.ouzhou').removeClass('hide');
                $('.header-nav:not(".ouzhou")').remove();
            } else if (areaId == 3) {
                $('.header-nav.xinfei').removeClass('hide');
                $('.header-nav:not(".xinfei")').remove();
            } else if (areaId == 4) {
                $('.header-nav.dny').removeClass('hide');
                $('.header-nav:not(".dny")').remove();
            } else if (areaId == 5) {
                $('.header-nav.meizhou').removeClass('hide');
                $('.header-nav:not(".meizhou")').remove();
            }else{
                $('.header-nav.aodaliya').removeClass('hide');
                $('.header-nav:not(".aodaliya")').remove();
            }
        },
        GetRequest:function () {
            var url = location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }
    }
    module.exports = app;

    var isTest = location.href.indexOf("http://www.itrip.com") > -1 ? false : true;
    var settingid = isTest ? "kf_9680_1448432403231" : "kf_9680_1447207361586";
    NTKF_PARAM = {
        siteid: "kf_9680", //小能提供企业id,
        settingid: settingid, //小能分配的缺省客服组id
        uid: $H.cookie.get('uin'),
        uname: $H.cookie.get('acc'),
        isvip: "",
        userlevel: ""
    };
    //小能客服
    if ($('.linkonline .xiaoneng').length > 0) {
        //售前
        $('.linkonline #pre-sales').click(function(){
            settingid = 'kf_9680_1458959605873';
            NTKF.im_openInPageChat(settingid);
        });
        //售后
        $('.linkonline #next-sales').click(function(){
            settingid = 'kf_9680_1461738767319';
            NTKF.im_openInPageChat(settingid);
        });
    }
    ef.toTop('.linkTop');
    ef.scrollLocate('.side-bar',60);
});
/**
 * Created by sky on 2016/7/14.
 */

