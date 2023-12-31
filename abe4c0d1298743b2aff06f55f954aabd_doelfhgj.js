let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var jsonContext = JSON.parse(AppContext());
    var currentUser = jsonContext.currentUser;
    var id = param.data[0].id;
    var code = param.data[0].code;
    var token = jsonContext.token;
    var tenantId = currentUser.tenantId;
    var env = "";
    if (!tenantId || !token) {
      throw new Error("用户过期未认证");
    }
    if (tenantId === "x3hacpnx") {
      //沙箱环境
      env = "https://www.example.com/";
    } else {
      //生产环境
      env = "https://www.example.com/";
    }
    var body = {
      id: id,
      code: code,
      tenantId: tenantId,
      docType: "voucher_order", //销售订单
      eventType: "voucher_order_audit" //销售订单审核
    };
    var header = {
      "Content-Type": "application/json;charset=utf-8",
      Cookie: "yht_access_token=" + token
    };
    var url = "/opn/rec/orderExt?domainKey=ilogwms";
    var resp = postman("POST", env + url, JSON.stringify(header), JSON.stringify(body));
    if (resp) {
      var obj = JSON.parse(resp);
      if ("200" != obj.code) {
        throw new Error(obj.message);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });