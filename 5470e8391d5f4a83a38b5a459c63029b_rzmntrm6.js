let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("SCMSA.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var id = request.id; //物料id
    var agentId = request.agentId; //客户id
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var reqkhdetailurl = "https://www.example.com/" + token;
    let detail = "";
    var body = {
      pageIndex: "1",
      pageSize: "100",
      priceTemplateId: 2660498622224677, //客户+商品
      status: "VALID",
      simpleVOs: [
        {
          op: "eq",
          field: "dimension.productId",
          value1: id
        },
        {
          op: "eq",
          field: "dimension.agentId",
          value1: agentId
        }
      ]
    };
    var returnData = {};
    var khcustResponse = postman("POST", reqkhdetailurl, JSON.stringify(header), JSON.stringify(body));
    var kehucustresponseobj = JSON.parse(khcustResponse);
    if ("200" == kehucustresponseobj.code) {
      detail = kehucustresponseobj.data.recordList;
      if (detail != null) {
        returnData.detail = detail[0];
        return { returnData };
      }
    }
    returnData = null;
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });