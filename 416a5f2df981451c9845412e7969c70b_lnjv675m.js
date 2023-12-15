let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    function logs(msg) {
      let method = "GT34544AT7.org.orgInsert";
      let { bizFlowId, bizFlowInstanceId } = request;
      let queen = "";
      if (!!bizFlowId && !!bizFlowInstanceId) {
        queen += bizFlowId;
      } else {
        queen += "hellword";
      }
      let msg1 = "";
      let type = typeof msg;
      if (type == "string") {
        msg1 = msg;
      } else {
        msg1 = JSON.stringify(msg);
      }
      let nmsg = "\n" + method + "\n" + msg1;
      let logfunc = extrequire("GT9912AT31.common.logQueen");
      if (!!bizFlowInstanceId) {
        nmsg = "\n" + bizFlowInstanceId + ":\n" + nmsg;
      }
      logfunc.execute({ queen, msg: nmsg });
    }
    //通过上下文获取当前的用户信息
    var currentUser = JSON.parse(AppContext()).currentUser;
    var tenantId = currentUser.tenantId;
    var body = {
      data: {
        code: request.code,
        name: {
          zh_CN: request.name
        },
        shortname: {
          zh_CN: request.shortname === undefined || request.shortname === null ? request.name : request.shortname
        },
        enable: request.enable === undefined || request.enable === null ? "1" : request.enable === "1" || request.enable === 1 || request.enable === true || request.enable === "true" ? "1" : "0",
        orgtype: 1,
        exchangerate: tenantId,
        exchangerate_name: "基准汇率",
        _status: request._status === undefined || request._status === null ? "Insert" : request._status,
        adminOrg: {
          enable: 1
        }
      },
      externalData: {
        typelist: ["adminorg"]
      }
    };
    if (!!request.other) {
      let keys = Object.keys(request.other);
      for (let i in keys) {
        let key = keys[i];
        body.data[key] = request.other[key];
      }
    }
    if (!!request.taxpayername) {
      body.data.taxpayername = request.taxpayername;
    }
    if (!!request.taxpayerid) {
      body.data.taxpayerid = request.taxpayerid;
    }
    if (!!request.principal) {
      body.data.principal = request.principal;
    }
    if (!!request.branchleader) {
      body.data.branchleader = request.branchleader;
    }
    if (!!request.contact) {
      body.data.contact = request.contact;
    }
    if (!!request.telephone) {
      body.data.telephone = request.telephone;
    }
    if (!!request.address) {
      body.data.address = { zh_CN: request.address };
    }
    if (request._status !== undefined && request._status !== null) {
      if (request._status === "Update") {
        body.data["id"] = request.id;
        body.data.adminOrg = { enable: "1", id: request.id };
      } else if (request._status === "Insert") {
        body.data.adminOrg = { enable: "1" };
        body.externalData = { typelist: ["adminorg"] };
      }
    }
    if (request.par !== undefined && request.par !== null) {
      body.data.parent = request.par;
      body.data.adminOrg.parentid = request.par;
      body.data.adminOrg.parentorgid = request.par;
    }
    let func1 = extrequire("GT34544AT7.common.baseOpenApi");
    request.body = body;
    logs("OrgInsert =>\n" + JSON.stringify(body));
    request.uri = "/yonbip/digitalModel/orgunit/save";
    let res1 = func1.execute(request);
    var res = res1.res;
    return { res, body };
  }
}
exports({ entryPoint: MyAPIHandler });