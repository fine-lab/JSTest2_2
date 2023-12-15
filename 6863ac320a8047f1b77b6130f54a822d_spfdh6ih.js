let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //项目id
    var project = request.project;
    //物料id
    var product = request.product;
    //物料编码
    var productCode = request.productCode;
    //出库单子表id
    var bodyid = request.bodyid;
    //查询关系表主表
    var queryPro = "select id from GT65690AT1.GT65690AT1.prjMaterRelevance where dr=0 and project='" + project + "'";
    var prores = ObjectStore.queryByYonQL(queryPro, "developplatform");
    if (prores.length === 1) {
      //查询关系表子表
      var querySql = "select * from GT65690AT1.GT65690AT1.prjMaterRelevance_a where dr=0 and product='" + product + "' and prjMaterRelevance_id='" + prores[0].id + "'";
      var res = ObjectStore.queryByYonQL(querySql, "developplatform");
      if (res.length === 1) {
        //查询出库申请单子表老数量
        var queyCkdBody = "select * from st.pickingrequisition.PickingRequisitionDetail where id=" + bodyid;
        var resCkdBody = ObjectStore.queryByYonQL(queyCkdBody);
        if (resCkdBody.length === 1) {
          var oldqty = 0;
          if (resCkdBody[0].quantity !== undefined) {
            oldqty = resCkdBody[0].quantity;
          }
          var useshuliang = 0;
          if (res[0].useshuliang !== undefined) {
            useshuliang = res[0].useshuliang;
          }
          var shuliang = 0;
          if (res[0].shuliang !== undefined) {
            shuliang = res[0].shuliang;
          }
          if (useshuliang - oldqty < 0) {
            throw new Error("物料编码【" + productCode + "】还原关系表子表【使用数量】错误，数据还原后小于0");
          }
          if (shuliang < useshuliang - oldqty) {
            throw new Error("物料编码【" + productCode + "】还原关系表子表【使用数量】错误，数据还原后大于【数量】");
          }
          var newuseshuliang = useshuliang - oldqty;
          let func1 = extrequire("ST.backDefaultGroup.getApitoken");
          let resToken = func1.execute();
          var token = resToken.access_token;
          let contenttype = "application/json;charset=UTF-8";
          let header = {
            "Content-Type": contenttype
          };
          var body = { useshuliang: newuseshuliang, tableName: "GT65690AT1.GT65690AT1.prjMaterRelevance_a", formcode: "d99047a0", id: res[0].id };
          let getExchangerate = "https://www.example.com/" + token;
          let rateResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(body));
          let rateresponseobj = JSON.parse(rateResponse);
        }
      }
    }
    return { request };
  }
}
exports({ entryPoint: MyAPIHandler });