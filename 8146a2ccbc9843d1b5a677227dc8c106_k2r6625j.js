let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param.data[0]._status === undefined || param.data[0]._status === null) {
      throw new Error("无法判断页面状态： _status=" + param.data[0]._status);
    }
    let funcx = extrequire("GT6948AT29.custom.getZFund_MTB_docid");
    let request = {};
    let resx = funcx.execute(request).res;
    let docId = resx.id;
    // 获取自定义档案系统id
    let ids = param.data[0].GL_fundID;
    function savecosdoc(args, condition) {
      // 通过args.data[0]._status判断当前页面状态是insert还是update
      let insert = args.data[0]._status !== undefined || args.data[0]._status !== null ? (args.data[0]._status === "Insert" ? true : false) : true;
      let code = args.data[0].code;
      let name = args.data[0].name;
      let orgid = args.data[0].org_id;
      let orgid_name = args.data[0].org_id_name;
      let id = ids;
      let body = {
        data: {
          orgid_name: orgid_name,
          orgid: orgid,
          code: code,
          name: name,
          custdocdefid: docId,
          dr: 0,
          enable: args.data[0]._status === "Insert" ? 1 : args.data[0].enable !== undefined ? (args.data[0].enable === 0 || args.data[0].enable === "0" ? 2 : args.data[0].enable) : 1,
          _status: args.data[0]._status
        }
      };
      // 如果不是Insert状态就是Update状态就需要添加id
      if (!insert) body.data.id = id;
      // 通过是否是工作经费判断自定义档案数据是否要添加description
      if (condition != "A1") {
        let description = args.data[0].org_id + "," + args.data[0].fund_usedirection;
        body.data.description = description;
      }
      // 插入自定义档案api
      let func2 = null;
      switch (args.data[0]._status) {
        case "Insert":
          func2 = extrequire("GT6948AT29.custom.insertCustomCnfData");
          break;
        case "Update":
          func2 = extrequire("GT6948AT29.custom.updateCustom");
          break;
      }
      request.docId = docId;
      request.body = body;
      let res2 = func2.execute(request).res;
      // 是否插入成功
      if (res2.code !== "200") {
        throw new Error("res2 =" + JSON.stringify(res2));
        return args;
      }
      // 如果同步成功则添加实体自定义档案id的GL_fundID的值
      else {
        let id = res2.data.id;
        param.data[0].set("GL_fundID", id);
        return param;
      }
    }
    function svcustom(args) {
      let agsdata = args.data;
      if (agsdata.length !== 0) {
        let condition = args.data[0].fund_item_code;
        return savecosdoc(args, condition);
      } else return args;
    }
    let res = svcustom(param);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });