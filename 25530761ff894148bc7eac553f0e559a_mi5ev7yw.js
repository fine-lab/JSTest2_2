run = function (event) {
  var viewModel = this;
  var secScript = document.createElement("script");
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GT22176AT10/xlsx.core.min.js?domainKey=developplatform");
  document.body.insertBefore(secScript, document.body.lastChild);
  var secScript1 = document.createElement("script");
  secScript1.setAttribute("type", "text/javascript");
  secScript1.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GT22176AT10/xlsx.common.extend.js?domainKey=developplatform");
  document.body.insertBefore(secScript1, document.body.lastChild);
  //损毁出库
  viewModel.get("button43pd").on("click", function () {
    let gridModel = viewModel.getGridModel();
    let data = gridModel.getSelectedRows();
    if (data.length < 1) {
      cb.utils.alert("请选择要导出的数据");
      return false;
    }
    let ids = [];
    let codeArr = [];
    let busTypeList = {}; //交易类型
    for (let i = 0; i < data.length; i++) {
      if (codeArr.indexOf(data[i].code) > -1) {
        cb.utils.alert("请切换显示样式为【表头】，进行导出, 不要选择【表头+表体】");
        return false;
      } else {
        codeArr.push(data[i].code);
      }
      let index = ids.indexOf(data[i].id);
      if (index == -1) {
        let proId = data[i].id;
        busTypeList.proId = data[i].bustype;
        ids.push(data[i].id);
      }
    }
    getDamage = function () {
      return new Promise(function (resolve) {
        cb.rest.invokeFunction(
          "ST.exportDrugAdministrationData.damageExportM",
          {
            ids: ids,
            busTypeList: busTypeList
          },
          function (err, res) {
            debugger;
            if (typeof res != "undefined") {
              console.log(res);
              let damageOrderInfos = res.orderInfos;
              resolve(damageOrderInfos);
            } else if (typeof err != "undefined") {
              cb.utils.alert(err, "error");
              return false;
            }
            resolve();
          }
        );
      });
    };
    getDamage().then((damageOrderInfos) => {
      //第一个sheet
      let sheetData1 = [];
      for (let i = 0; i < damageOrderInfos.length; i++) {
        sheetData1.push({
          出库日期: export_parseDate(damageOrderInfos[i].vouchdate),
          出库单号: damageOrderInfos[i].code,
          处理人: damageOrderInfos[i].operator_name
        });
      }
      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheetData1), "sheet1");
      for (let i = 0; i < damageOrderInfos.length; i++) {
        let sheetData2 = [];
        for (let j = 0; j < damageOrderInfos[i].entry.length; j++) {
          sheetData2.push({
            生产批号: damageOrderInfos[i].entry[j].batchno,
            生产日期: export_parseDate(damageOrderInfos[i].entry[j].producedate),
            有效期至: export_parseDate(damageOrderInfos[i].entry[j].invaliddate),
            毁损数量: damageOrderInfos[i].entry[j].qty,
            毁损原因: "过期",
            供货企业名称: damageOrderInfos[i].entry[j].cust_name,
            销售单号: "",
            本位码: damageOrderInfos[i].entry[j].extend_standard_code,
            包装规格: damageOrderInfos[i].entry[j].extend_package_specification
          });
        }
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheetData2), "sheet" + (i + 2));
      }
      // 导出最后的总表
      let workbookBlob = workbook2blob(wb);
      openDownloadDialog(workbookBlob, "损毁出库.xlsx");
    });
  });
  function export_parseDate(date) {
    let getDate = new Date(date);
    let year = getDate.getFullYear();
    let month = (getDate.getMonth() + 1).toString();
    let day = getDate.getDate().toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    if (day.length == 1) {
      day = "0" + day;
    }
    let dateTime = year + "-" + month + "-" + day;
    return dateTime;
  }
};