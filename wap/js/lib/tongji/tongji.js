define(function(require, exports, module){
	var ui = require("ui");

	var tongji={
		init:function(){
			//this.ba();
			//this.ga();
			this.oa();
			this.cnzz();
			this.growing();
		},
		
		ba:function(){
			window._hmt = window._hmt || [];
			(function() {
				var hm = document.createElement("script");
				hm.src = "//hm.baidu.com/hm.js?fb79392ca18572796a1accfcac3a72c1";
				var s = document.getElementsByTagName("script")[0]; 
				s.parentNode.insertBefore(hm, s);
			})();
		},
		ga:function(){
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-61956206-2', 'auto');
			ga('send', 'pageview');
		},
		oa:function(){
			window._ozuid = $H.cookie.get("uin");
			(function() {
				var oc = document.createElement("script");
				oc.src = "//res.itrip.com/assets/js/lib/99click/m/om_code.js";
				var s = document.getElementsByTagName("script")[0]; 
				s.parentNode.insertBefore(oc, s);
			})();
		},
		cnzz:function(){
			var url = document.location.protocol+"//c.cnzz.com/wapstat.php",
					siteID = "1256687492",
					r = document.referrer||"",
					rnd = parseInt(Math.random() * 0x7fffffff),
					img = new Image();
			url += "?siteid=" + siteID + "&r=" + encodeURIComponent(r) + "&rnd=" + rnd;
			img.src = url;
		},
		growing:function(){
			window._vds = window._vds || [];
			_vds.push(['setAccountId', '85a6b38dd701488ca63d51cb8211101d']);
			if($H.cookie.get("uin")){
				_vds.push(['setCS1','user_id',$H.cookie.get("uin")]);
			}
			(function() {
				var vds = document.createElement('script');
				vds.type='text/javascript';
				vds.async = true;
				vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
				var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(vds, s);
			})();
		}
	};
	
	module.exports = tongji;
})
