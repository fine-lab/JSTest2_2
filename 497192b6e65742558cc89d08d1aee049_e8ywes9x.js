let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    var { isdefault, supplier, id } = data;
    var sql = "select * from GT21402AT42.GT21402AT42.supplierbankaccA106 where dr = 0 and supplier='" + supplier + "'and isdefault='Y' and id!='" + id + "'";
    //如果当前设置了default
    if (isdefault == "Y") {
      let resp = ObjectStore.queryByYonQL(sql);
      resp.map((v) => {
        if (v.id !== null) {
          throw new Error("当前供应商唯一默认账户已存在，请检查！");
        }
      });
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });