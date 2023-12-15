let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT52133AT90", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });