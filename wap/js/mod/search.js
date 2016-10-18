define(function(require, exports, module){

    var selector  ={
        layHdEl:$(".layout-header")
    }
    var search = {
        init:function(){
            $.extend(this,selector);

            search.config = search.getSearch();

            search.isShowHeader();
        },
        getSearchInfo:function(){
            return search.config;
        },
        isShowHeader : function(){
            var channel = $H.url.parse().query.channel || 1000,shareBtn = search.config.shareBtn,locHref = location.href,newHash=locHref;//newHash=location.search;
            /*if(!shareBtn && channel == "2000"){
             if(locHref.indexOf("?")!=-1){
             newHash = newHash.replace("?","?shareBtn=1&");
             }else{
             newHash = newHash + "?shareBtn=1";
             }
             window.location.href = "itrip://addShareButton";

             setTimeout(function(){
             window.location.href=newHash;
             },300);

             }*/
            if(channel == "2000"){
                this.layHdEl.hide();
                window.location.href = "itrip://addShareButton";
            }else if(channel == "3000"){
                window.itripapp.setHeaderFooterPriceShow(false);
                this.layHdEl.show();
            }else{
                var isWeiXin = this.is_weixin();
                if(!isWeiXin){
                    this.layHdEl.show();
                }
                if(channel == 1000){
                    $(".appDown").show();
                }
            }
        },
        getSearch : function(){
            var
                reData = {channel:1000,vc:0},
                search = location.search.split("?")[1] ;
            try{
                if(search != ""){
                    var getData = search.split("&");
                    for(var j = 0 ; j < getData.length ; j++){
                        var data = getData[j].split("=");
                        reData[data[0]] = data[1];
                    }
                }
            }catch(e){

            }
            return reData;

        },
        removeParams:function(str,params){
            var arr={};
            for (var i in params) {
                if(i!=str){
                    arr[i] = params[i];
                }
            };
            return arr;
        },
        getParams:function(params){
            var str = "?";
            for (var i in params) {
                str += i+"="+params[i]+"&";
            };
            str=str.substring(0,str.length-1);
            return location.href.split("?")[0]+str;
        },
        is_weixin:function () {
            var a = navigator.userAgent.toLowerCase();
            if (a.match(/MicroMessenger/i) == "micromessenger" || a.match(/weibo/i) == "weibo") {
                return true
            } else {
                return false;
            }
        }
    }

    module.exports = search;
});

