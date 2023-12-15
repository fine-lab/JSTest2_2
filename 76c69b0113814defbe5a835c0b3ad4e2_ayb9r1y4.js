let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取全部数据
    let data = param.return;
    // 获取id
    let id = param.return.id;
    // 字段赋初始化为零
    let expendAmount = 0;
    let totalAmountOfExpenditure = 0;
    // 获取子表集合
    //根据id查询子表
    var sql1 = "select * from GT102917AT3.GT102917AT3.expend_Information_details where spending_on_information_id = '" + id + "'and dr = 0";
    var List = ObjectStore.queryByYonQL(sql1);
    if (List.length != 0) {
      for (var i = 0; i < List.length; i++) {
        // 获取合计支出金额
        totalAmountOfExpenditure = totalAmountOfExpenditure + List[i].expendAmount;
      }
      // 更新主表条件
      var updateWrapper = new Wrapper();
      updateWrapper.eq("id", id);
      // 待更新字段内容
      var toUpdate = { totalAmountOfExpenditure: totalAmountOfExpenditure };
      // 执行更新
      var res = ObjectStore.update("GT102917AT3.GT102917AT3.spending_on_information", toUpdate, updateWrapper, "95792ca8");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });