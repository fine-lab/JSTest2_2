let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var yhtUserId = request.userId;
    var partnerName = request.partnerName;
    let token_url = "https://www.example.com/" + yhtUserId;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let tokenResponse = postman("get", token_url, null, null);
    var d;
    var data = { code: 200, data: 1 };
    var tr = JSON.parse(tokenResponse);
    if (tr.code == "200") {
      let appkey = tr.data.appkey;
      let token = tr.data.token;
      let cookie = "appkey=" + appkey + ";token=" + token;
      let header = {
        "Content-Type": hmd_contenttype,
        Cookie: cookie
      };
      var body = {};
      let query_url = "https://www.example.com/" + partnerName;
      let agent = postman("get", query_url, JSON.stringify(header), null);
      data = JSON.parse(agent);
    }
    return data;
  }
}
exports({ entryPoint: MyAPIHandler });