let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let res = null;
    let request = {};
    if (param.data[0].x_status === "Insert" && (param.data[0].is_area_org1 === true || param.data[0].is_area_org1 === "true")) {
      var new_org_id = param.data[0].sys_orgId;
      let fun3 = extrequire("GT34544AT7.org.areaDeptInsert");
      request.par = new_org_id;
      request.code = param.data[0].sys_code;
      request.name = param.data[0].name;
      request._status = param.data[0].x_status;
      let result3 = fun3.execute(request).res.data;
      // 同步新建自有组织
      let func4 = extrequire("GT34544AT7.org.syncSysDept");
      request.dept = result3;
      request.is_dept = 1;
      request.is_area_org = 0;
      request.is_area_org1 = 0;
      request.par = param.data[0].id;
      res = func4.execute(request).acc;
    }
    return { res };
  }
}
exports({ entryPoint: MyTrigger });