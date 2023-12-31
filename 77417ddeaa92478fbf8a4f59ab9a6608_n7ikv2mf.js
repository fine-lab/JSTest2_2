let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id; //反馈单id
    var responseStatus = request.responseStatus; //反馈状态
    var result = {};
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    //只有已承接的才能显示反馈人
    var responsePsn = responseStatus == "2" ? currentUser.staffId : "";
    var responsePsnName = responseStatus == "2" ? currentUser.name : "";
    var responsePsnContact = responseStatus == "2" ? currentUser.mobile : "";
    result.currentUser = currentUser;
    //查询内容
    var object = {
      id: id
    };
    //实体查询
    var res = ObjectStore.selectById("GT5258AT16.GT5258AT16.duty_outs_resource_prl", object);
    result.res = res;
    var sourcechild_id = res.sourcechild_id;
    var source_id = res.source_id;
    var responseDesc = res.xiangyingmiaoshu;
    var refuseReason = res.refuseReason;
    var resonDetail = res.resonDetail;
    var resAttachment = res.resAttrachment;
    var billType = res.billType;
    var kkWorkDay = res.kkWorkDay;
    var kkDayPrice = res.kkDayPrice;
    var kkTotalPrice = res.kkTotalPrice;
    //设置时间带时分秒
    var formatDateTime = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var hh;
      var mm;
      var ss;
      try {
        hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      } catch (e) {
        hh = "00";
      }
      try {
        mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      } catch (e) {
        mm = "00";
      }
      try {
        ss = date.getSeconds() < 10 ? "0" + date.getSeonds() : date.getSeconds();
      } catch (e) {
        ss = "00";
      }
      return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    };
    var updateList = [];
    var d = new Date(); //创建一个Date对象
    var localTime = d.getTime();
    var localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数
    var gmt = localTime + localOffset; //GMT时间
    var offset = 8; //东8区
    var beijing = gmt + 3600000 * offset;
    var nd = new Date(beijing);
    var currentTime = formatDateTime(nd);
    //根据预提单id获取预提单详情
    var ytobject = {
      id: source_id,
      compositions: [
        {
          name: "apply_partner_detailList",
          compositions: []
        }
      ]
    };
    //实体查询
    var ytRes = ObjectStore.selectById("GT5258AT16.GT5258AT16.apply_outs_resource_prl", ytobject, "9053a2cc");
    result.ytRes = ytRes;
    var partnerList = ytRes.apply_partner_detailList;
    var rps = [];
    for (let pi = 0; pi < partnerList.length; pi++) {
      var partner111 = partnerList[pi];
      if (partnerList[pi].id !== sourcechild_id) {
        rps.push(partner111.responseStatus);
      }
    }
    rps.push(responseStatus);
    var rp = ytRes.responseStatus;
    if (rps.includes("2")) {
      rp = "2";
    } else if (!rps.includes("2") && rps.includes("4")) {
      rp = "4";
    } else if (!rps.includes("2") && !rps.includes("4") && rps.includes("3")) {
      rp = "3";
    }
    var updateObj = {
      id: source_id,
      responseStatus: rp,
      apply_partner_detailList: [
        {
          id: sourcechild_id,
          responseStatus: responseStatus,
          responseDesc: responseDesc == null ? "" : responseDesc,
          responseTime: currentTime,
          responsePsn: responsePsn,
          responsePsnName: responsePsnName,
          responsePsnContact: responsePsnContact,
          refuseReason: refuseReason == null ? "" : refuseReason,
          reasonDetail: resonDetail == null ? "" : resonDetail,
          resAttachment: resAttachment,
          kkWorkDay: kkWorkDay,
          kkDayPirce: kkDayPrice,
          kkTotalPrice: kkTotalPrice,
          _status: "Update"
        }
      ]
    };
    result.updateObj = updateObj;
    var res22 = ObjectStore.updateById("GT5258AT16.GT5258AT16.apply_outs_resource_prl", updateObj, "9053a2cc");
    result.res22 = res22;
    var updateFKDObj = {
      id: id,
      responseStatus: responseStatus,
      responseTime: currentTime,
      responsePsn: currentUser.staffId,
      responsePsnName: currentUser.name,
      responsePsnContact: currentUser.mobile
    };
    result.updateFKDObj = updateFKDObj;
    var res33 = ObjectStore.updateById("GT5258AT16.GT5258AT16.duty_outs_resource_prl", updateFKDObj, "af1fd42b");
    result.res33 = res33;
    try {
      let sendMsgToYY = extrequire("GT5258AT16.yswbzyytd.sendMsgToYYYS");
      var mailReceiver = [];
      var uspaceReceiver = [];
      uspaceReceiver.push(ytRes.creator);
      try {
        let getStaffDetail = extrequire("GT5258AT16.pubFunction.getStaffDetail");
        let stRes = getStaffDetail.execute({ userId: ytRes.creator });
        mailReceiver.push(stRes.data.email);
      } catch (ee) {}
      var msgParam = {
        id: id,
        code: ytRes.code,
        partnerName: res33.partnerName,
        responseStatus: responseStatus,
        refuseReason: refuseReason,
        reasonDetail: resonDetail,
        responseTime: currentTime,
        responseDesc: responseDesc,
        responsePsn: responsePsn,
        responsePsnName: responsePsnName,
        responsePsnContact: responsePsnContact,
        projectName: ytRes.projectName,
        projectArea: ytRes.projectArea,
        deliveryTypes: ytRes.deliveryTypes,
        cooperationMode: ytRes.cooperationMode,
        personNum: ytRes.personNum,
        expectPeriod: ytRes.expectPeriod,
        billType: billType,
        mailReceiver: mailReceiver,
        uspaceReceiver: uspaceReceiver
      };
      let msgRes = sendMsgToYY.execute(msgParam);
      result.msgRes = msgRes;
      result.msgParam = msgParam;
    } catch (e) {}
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });