let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = request.code; //类型编码
    var name = request.name; //类型名称
    var qualificationClassification_name = request.qualificationClassification; //资质分类
    var validityManagement = request.validityManagement; //效期管理
    var businessScopeManagement = request.businessScopeManagement; //经营范围管理
    var remarks = request.remarks; //备注
    if (request === null) {
      return { status: "fail", error: "请写入数据!" };
    } else {
      var data = {};
      if (typeof code == "undefined" || code === null || typeof name == "undefined" || name === null) {
        return { status: "fail", error: "code和name字段为必填项,请写入code和name数据!" };
      } else {
        if (typeof qualificationClassification_name == "undefined" || qualificationClassification_name === null) {
          data = {
            code: code,
            name: name,
            validityManagement: validityManagement,
            businessScopeManagement: businessScopeManagement,
            remarks: remarks
          };
        } else {
          var parent = "";
          var parentSql = "select * from GT59181AT30.GT59181AT30.XPH_EQType where name='" + qualificationClassification_name + "'";
          var parentSelect = ObjectStore.queryByYonQL(parentSql);
          if (parentSelect.length === 0) {
            return { status: "fail", error: "未查询到该上级分类,请确认后重新调用!" };
          } else {
            parent = parentSelect[0].id;
          }
          data = {
            code: code,
            name: name,
            validityManagement: validityManagement,
            businessScopeManagement: businessScopeManagement,
            remarks: remarks,
            qualificationClassification_name: qualificationClassification_name,
            qualificationClassification: parent
          };
        }
        var res = ObjectStore.insert("GT59181AT30.GT59181AT30.XPH_TypeOfEQ", data, "80eef7f3");
        return { status: "success", data: data, url: "GT59181AT30.GT59181AT30.XPH_TypeOfEQ", massage: res };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });