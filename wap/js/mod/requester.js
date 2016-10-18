define(function(require, exports, module) {
  //send函数
  var config = require("config");
  var search = require("search");

  var searchInfo = {};

  var send = function (type, api, parameters, success,error,async) {
    var request = $.ajax({
      url: api + "?callback=?&channel="+searchInfo.channel,
      data: parameters,
      type: type,
      async: true,
      cache: false,
      dataType: "jsonp",
      headers: {"Cache-Control": "no-cache"}, 
      timeout: 60000,
      success: function (data, textStatus, jqXHR) {
        success && success(data);
      },
      complete: function (response,data) {     
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if(jqXHR.status == 401){
          location.href = contextPath + '/index';
        }else{
          if (!errorThrown) {
            return false;
          }
          var errors = {
            101: "网络不稳定或不畅通，请检查网络设置",
            403: "服务器禁止此操作！",
            500: "服务器遭遇异常阻止了当前请求的执行<br/><br/><br/>"
          };
          var msg = null;
          switch (textStatus) {
          case "timeout":
            msg = "网络连接超时，请检查网络是否畅通！";
            break;
          case "error":
            if (errors[jqXHR.status]) {
              var data = null;
              try {
                data = jQuery.parseJSON(jqXHR.responseText);
              } catch (e) {
              }
              if (data && data.message) {
                msg = data.message;
              } else {
                msg = errors[jqXHR.status];
              }
            } else {
              msg = "服务器响应异常<br/><br/>" + (jqXHR.status == 0 ? "" : jqXHR.status) + "&nbsp;" + errorThrown;
            }
            break;
          case "abort":
            msg = null;//"数据连接已被取消！";
            break;
          case "parsererror":
            msg = "数据解析错误！";
            break;
          default:
            msg = "出现错误:" + textStatus + "！";
          }
          if (errorThrown.code != null && errorThrown.message != null && !errors[errorThrown.code]) {
            msg += "</br>[code:" + errorThrown.code + "][message:" + errorThrown.message + "]" + (null == errorThrown.stack ? "" : errorThrown.stack);
          }
        }
      }
    });
  };
  module.exports={
    getProduct:function(data,callback){//获取产品列表
      return send("get","http://www.itrip.com/config/activity/jsonp/beiou_eu",data,callback);
    }
  }
});