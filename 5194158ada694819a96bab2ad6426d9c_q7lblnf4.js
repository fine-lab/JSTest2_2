let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let idString = param.businessKey;
    let id = idString.substring(idString.indexOf("_"), idString.length);
    var object = { id: id };
    //实体查询
    var res = ObjectStore.selectById("GT68680AT9.GT68680AT9.fukuan", object);
    var sql = "select hanshuijine from GT68680AT9.GT68680AT9.fukuanzibiao where fukuan_id = '" + id + "'";
    var res1 = ObjectStore.queryByYonQL(sql);
    var payBillbArray = [];
    for (var i = 0; i < res1.length; i++) {
      var map = {};
      map.quickType_code = "6";
      map.oriSum = res1[i].hanshuijine;
      map.natSum = res1[i].hanshuijine;
      map.supplier_name = res.ProjectVO;
      map._status = "Insert";
      payBillbArray.push(map);
    }
    payBillbArray = distinctArrObj(payBillbArray);
    let body = {
      data: [
        {
          vouchdate: res.riq,
          accentity_code: "A01",
          exchangeRateType_code: "01",
          supplier_code: res.gongyingshangbianma,
          currency: "2560400749976320",
          natCurrency_priceDigit: "2",
          natCurrency_moneyDigit: "2",
          exchRate: "1",
          exchangeRateType_digit: "2",
          project_code: res.xiangmubianma,
          project_name: res.xiangmu,
          tradetype_code: "FBK",
          _status: "Insert",
          PayBillb: payBillbArray
        }
      ]
    };
    //请求数据
    let base_path = "https://www.example.com/";
    let apiResponse = openLinker("post", base_path, "GT68680AT9", JSON.stringify(body)); //  openLinker("post", base_path, "GT68680AT9", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });