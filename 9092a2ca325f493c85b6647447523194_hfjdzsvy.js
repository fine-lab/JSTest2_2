let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var server = extrequire("GT15312AT4.tool.getServer").execute();
    let header = extrequire("GT15312AT4.tool.getApiHeader").execute();
    // 参数
    var query = "";
    if (request.accountId) {
      query = query + "?accountId=" + request.accountId;
    }
    var requestUrl = server.url + "/api/app-cmp-console/res/tags/key" + query;
    var strResponse = postman("GET", requestUrl, JSON.stringify(header), null);
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      return responseObj;
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });