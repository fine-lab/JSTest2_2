let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(null);
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    let getsdUrl = "https://www.example.com/" + token;
    var apiResponse = postman("POST", getsdUrl, JSON.stringify(header), JSON.stringify(param));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });