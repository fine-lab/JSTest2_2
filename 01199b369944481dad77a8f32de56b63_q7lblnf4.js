let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = { id: request.id };
    //实体查询
    var res = ObjectStore.selectById("GT74291AT31.GT74291AT31.shebeizulinfukuan", object);
    var sql = "select jine from GT74291AT31.GT74291AT31.shebeizulinfukuanzb where shebeizulinfukuan_id = '" + request.id + "'";
    var res1 = ObjectStore.queryByYonQL(sql);
    var payBillbArray = [];
    for (var i = 0; i < res1.length; i++) {
      var map = {};
      map.quickType_code = "6";
      map.oriSum = res1[i].jine;
      map.natSum = res1[i].jine;
      map.supplier_name = res.ProjectVO;
      map._status = "Insert";
      payBillbArray.push(map);
    }
    payBillbArray = distinctArrObj(payBillbArray);
    let body = {
      data: [
        {
          vouchdate: res.riqi,
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
          tradetype_code: "JXK",
          _status: "Insert",
          PayBillb: payBillbArray
        }
      ]
    };
    //请求数据
    let base_path = "https://www.example.com/";
    let apiResponse = ""; // openLinker("post", base_path, "GT74291AT31", JSON.stringify(body));
    return { apiResponse };
    function distinctArrObj(arr) {
      var MyShow = typeof arr != "object" ? [arr] : arr; //确保参数总是数组
      for (let i = 0; i < MyShow.length; i++) {
        if (MyShow[i] === null || MyShow[i] === "" || JSON.stringify(MyShow[i]) === "{}") {
          MyShow.splice(i, 1);
          i = i - 1;
        }
      }
      return MyShow;
    }
  }
}
exports({ entryPoint: MyAPIHandler });