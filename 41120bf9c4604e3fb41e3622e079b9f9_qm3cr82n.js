let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = request.data;
    //插入数据
    var res = ObjectStore.insert("GT13741AT37.GT13741AT37.dayclosebill", object, "e297ef0b");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });