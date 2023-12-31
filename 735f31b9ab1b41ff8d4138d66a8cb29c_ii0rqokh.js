let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var dateData = getData();
    let dqkjqj = substring(dateData.data.startDate, 0, 7);
    //上期会计月
    let beforedate = getBeforeData(dateData.data.startDate);
    let beforekjqj = beforedate.data.month;
    let func1 = extrequire("GT62395AT3.backDefaultGroup.getHTZCBalance");
    let func2 = extrequire("GT62395AT3.backDefaultGroup.getBalanceQuery");
    let func3 = extrequire("GT62395AT3.backDefaultGroup.getCBGJdata");
    let func4 = extrequire("GT62395AT3.backDefaultGroup.getBeforeCbjzMoney");
    let func5 = extrequire("GT59740AT1.backDefaultGroup.addcbjz");
    let body = {
      pageIndex: "1",
      pageSize: "500",
      nextStatusName: "DELIVERGOODS",
      isSum: false,
      simpleVOs: [
        {
          op: "between",
          value1: dateData.data.startDate,
          value2: dateData.data.endDate,
          field: "auditDate"
        }
      ]
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT59740AT1", JSON.stringify(body));
    let apiResponseJson = JSON.parse(apiResponse);
    let xmhtList = [];
    if (apiResponseJson.code == "200") {
      let data = apiResponseJson.data;
      let recordList = data.recordList;
      if (data.recordCount > 0) {
        for (var i = 0; i < recordList.length; i++) {
          let record = recordList[i];
          if (record.saleDepartmentId_name !== "null" && record.saleDepartmentId_name == "吊装部") {
            xmhtList.push(record.headFreeItem.define1);
          }
        }
      }
    }
    let deptName = "吊装部";
    let result = [];
    if (xmhtList.length > 0) {
      for (var j = 0; j < xmhtList.length; j++) {
        var xm = xmhtList[j];
        let xmxqurl = "https://www.example.com/" + xm;
        let xmResponse = openLinker("GET", xmxqurl, "GT59740AT1", null);
        let xmJson = JSON.parse(xmResponse);
        let xmdata = xmJson.data;
        let xmCode = xmdata.code;
        let benqi = func1.execute(dqkjqj, xmCode);
        let sjygj = func2.execute(dqkjqj, xmCode);
        if (benqi.dataMoney.CurrentamountMoney != undefined && benqi.dataMoney.CurrentamountMoney == 0) {
          continue;
        } else {
          let cbgjdata = func3.execute(dqkjqj, xmCode);
          let sqyjzcbMoney = func4.execute(beforekjqj, deptName, xmCode);
          let sqyjzcb = sqyjzcbMoney.sqjzmonry;
          let mainID = cbgjdata.id;
          let totxmje = xmdata.defines.define6;
          let ystitalMoney = xmdata.defines.define12;
          let sjygjcb = sjygj.dataMoney.CurrentamountMoney;
          let jzje = (benqi.dataMoney.CurrentamountMoney / totxmje) * (sjygjcb - sqyjzcb);
          let cbjzdata = {
            cbjzMoney: jzje,
            deptName: "吊装部",
            main_Id: mainID,
            httotalMoney: totxmje,
            ystitalMoney: ystitalMoney
          };
          let addcbjzMoney = func5.execute(cbjzdata);
          result.push(addcbjzMoney);
        }
      }
    }
    return { result };
    //获取上个月开始结尾
    function getData() {
      var nowdays = new Date();
      var year = nowdays.getFullYear();
      var month = nowdays.getMonth();
      if (month == 0) {
        month = 12;
        year = year - 1;
      }
      if (month < 10) {
        month = "0" + month;
      }
      var myDate = new Date(year, month, 0);
      var startDate = "2022-02-01 00:00:00";
      var endDate = "2022-02-28 23:59:00";
      var data = {
        startDate: startDate,
        endDate: endDate
      };
      return { data };
    }
    function getBeforeData(date) {
      var nowdays = new Date(date);
      var year = nowdays.getFullYear();
      var month = nowdays.getMonth();
      if (month == 0) {
        month = 12;
        year = year - 1;
      }
      if (month < 10) {
        month = "0" + month;
      }
      var myDate = new Date(year, month, 0);
      var monthdate = year + "-" + month; //上个月
      var data = {
        month: monthdate
      };
      return { data };
    }
  }
}
exports({ entryPoint: MyAPIHandler });