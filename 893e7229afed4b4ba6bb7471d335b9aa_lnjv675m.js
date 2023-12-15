let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let obj = JSON.parse(param.requestData);
    //在弃审的时候，需要校验账户参数表，该年度该组织是否已经年度计提公积分配
    let AccYear = obj.AccYear; //账务年度
    let baseOrg = obj.org_id; //组织单元
    let Surplus_AccrualFlagSql = "select Surplus_AccrualFlag from GT104180AT23.GT104180AT23.AccParameter where AccYear = '" + AccYear + "' and baseOrg = '" + baseOrg + "' and dr = 0";
    let Surplus_AccrualFlagRes = ObjectStore.queryByYonQL(Surplus_AccrualFlagSql);
    if (Surplus_AccrualFlagRes.length !== 0) {
      let Surplus_AccrualFlag = Surplus_AccrualFlagRes[0].Surplus_AccrualFlag;
      if (Surplus_AccrualFlag !== "0") {
        throw new Error("\n本年计提盈余已分配，不能取消审核！");
      }
    } else {
      throw new Error("\n该组织没有" + AccYear + "年度的账户参数，\n请联系管理员！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });