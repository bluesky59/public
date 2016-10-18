define(function(require, exports, module){
	var
		server = require("requester");
		require("lib/echo/echo.min");
	    $H = require("ui");

	function App(){
		this.init();
	};
	var app,redParams = {},click_F = false,calNum = 0;
	App.prototype={	
		init:function(){
			this.bind();
			//获取产品列表
			this.getProduct();
		},
		bind:function(){
			app = this;
	         //跳转产品详情页
		    $(document).on("click",".p-content li",function(event){
		    	var pid = $(this).data("pid");
		    	app.goDetail(pid);
		    	event = event || window.event;
				event.preventDefault();
　　			event.stopPropagation();
		    });
		},
		goDetail:function(pid){
			var channel = $H.url.parse().query.channel || 1000;
            app.openApp(pid,channel);
		},
		openApp:function(pid,channel){
			switch(parseInt(channel)) {
				case 2000: {
					app.openiOS(pid,channel);
				}
				break;
				case 3000: {
					app.openAndroid(pid,channel);
				}
				break;
				default: {
					pid = '/p'+pid;
					window.location = pid;
					return false;
				}
			}
		},
		openiOS :function(pid,channel) {
	      var id = "929393811";
	      var appStore = "https://itunes.apple.com/cn/app/id" + id;
	      var appPath = "itrip" + id + "://productdetail?id=" + pid;
	      window.location = appPath;
	      if (channel != "2000") {
	          setTimeout(function() {
	              window.location = appStore;
	          }, 1000)
	      }
	    },
	    openAndroid:function(pid,channel) {
	        if (navigator.userAgent.indexOf('UCBrowser') > -1) {
	            window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.aoliday.android.phone";
	        } else {
	            var apkUrl = "http://a.app.qq.com/o/simple.jsp?pkgname=com.aoliday.android.phone";
	            var appPath = "itrip://productdetail?id=" + pid;
	            window.location.href = appPath;
	            if (channel != "3000") {
	                setTimeout(function() {
	                    window.location = apkUrl;
	                }, 1000)
	            }
	        }
	    },
		//产品
		getProduct:function(){
			server.getProduct({},function(data){
				if(data.result && data.result.groupList){
					app.showProductInfo(data.result.groupList);
				}
			});
		},
		showProductInfo:function(list){
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
			//加载图片
			app.imgLazyLoad();
		},
		renderItem:function(d,t){
			var html  = "",price,cal;
			d.forEach(function(item,index){
				if(item == undefined) return;

				price = Number(item.price*item.exrate).toFixed(0);
				
				html+='<li class="p-item" data-pid="'+item.entityId+'">'+
							'<img class="p-img" data-echo="'+item.showImg+'" src="http://hd.itrip.com/magazine/huodong/shopping/imgs/loading_new.gif" alt=""/>'+
							'<p class="p-txt">'+item.showName+'</p>'+
							'<div class="p-buy">'+
								'<span class="p-price">¥ <strong>'+price+'</strong>起</span>'+
								'<a href="#" target="_blank" class="p-go">立即出发</a>'+
							'</div>'+
						'</li>';

			});
			$("#"+t).find(".p-content").html(html);
		},
		imgLazyLoad:function(){
			echo.init({
				offset: 100,
				throttle: 250,
				unload: false,
				callback: function (element, op) {

				}
			});
		},
		loginCheck:function(){
			var channel = $H.url.parse().query.channel,
				vc = $H.url.parse().query.vc;
			if (channel == 2000 && vc > 132) {
				window.location.href = "itrip://loadWebViewCookie";
			}else if(channel == 3000 && vc > 132){
				window.itripapp.loginByWebView('');
			}
		}
	};
	module.exports = new App;
});

