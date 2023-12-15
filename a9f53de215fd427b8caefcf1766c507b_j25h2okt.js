let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let arrivalOrders = param.orderProduct;
    let order = param;
    let strParam = JSON.stringify(order);
    let strReplace = replace(strParam, "orderAttrextItem!", "orderAttrextItem");
    order = JSON.parse(strReplace);
    let details = new Array();
    let func1 = extrequire("GT101792AT1.common.getDateTime");
    let resDate = func1.execute(null, null);
    let dhWarehouse = undefined;
    if (arrivalOrders.length > 0) {
      a: for (var i = 0; i < arrivalOrders.length; i++) {
        let arrivalOrder = arrivalOrders[i];
        if (i == 0) {
          let func3 = extrequire("GZTBDM.backDesignerFunction.getWarehouse");
          let dhWarehouseList = func3.execute(null, arrivalOrder.warehouseId).res;
          if (dhWarehouseList.length > 0) {
            dhWarehouse = dhWarehouseList[0].code;
          } else {
            throw new Error("生产订单未维护预入仓库");
          }
        }
        let batchNo = arrivalOrder.isBatchManage == false ? "" : arrivalOrder.batchNo; // 批次号
        let productDateValue = arrivalOrder.produceDate == null ? "" : substring(arrivalOrder.produceDate, 0, 10); // 生产日期
        let lotAtt03 = substring(resDate.dateStr, 0, 10);
        let detail = {
          referenceNo: order.code, // 订单号
          lineNo: i + 1, // 行号
          sku: arrivalOrder.materialCode, // 物料编码
          expectedQty: arrivalOrder.quantity, // 预期数量
          totalPrice: "",
          lotAtt01: productDateValue, // 生产日期
          lotAtt02: "", // 失效日期
          lotAtt03: lotAtt03, // 入库日期
          lotAtt04: arrivalOrder.define6, // 批次属性04（批次号）
          lotAtt05: "",
          lotAtt06: "", // 质量状态
          lotAtt07: "",
          lotAtt08: "01",
          lotAtt09: "",
          lotAtt10: "",
          lotAtt11: "",
          lotAtt12: "",
          lotAtt13: "",
          lotAtt14: "",
          lotAtt15: "",
          lotAtt16: "",
          lotAtt17: "",
          lotAtt18: "",
          lotAtt19: "",
          lotAtt20: "",
          lotAtt21: "",
          lotAtt22: "",
          lotAtt23: "",
          lotAtt24: "",
          dedi04: "", // 净重
          dedi05: order.id, // 上游单据主表id
          dedi06: arrivalOrder.id, // 上游单据子表id
          dedi07: "",
          dedi08: "",
          dedi09: "", // 单价
          dedi10: "",
          dedi11: "",
          dedi12: "",
          dedi13: "",
          dedi14: "",
          dedi15: "",
          dedi16: "",
          userDefine1: "",
          userDefine2: "",
          userDefine3: "",
          userDefine4: "",
          userDefine5: "",
          userDefine6: "",
          notes: ""
        };
        details.push(detail);
      }
    } else {
      throw new Error("表体行无数据");
    }
    let warehouseId = "";
    let customerId = "";
    if (order.orgId == "1473045320098643975") {
      //依安工厂
      warehouseId = "yourIdHere";
      customerId = "yourIdHere";
    } else if (order.orgId == "1473041368737644546") {
      //克东
      warehouseId = "yourIdHere";
      customerId = "yourIdHere";
    }
    let body = {
      data: {
        header: [
          {
            warehouseId: warehouseId,
            customerId: customerId,
            asnType: "WG01", // 交易类型
            docNo: order.code, // 单据编号
            createSource: "YS",
            asnReferenceA: "",
            asnReferenceB: "",
            asnReferenceC: "",
            asnReferenceD: "",
            asnCreationTime: "",
            expectedArriveTime1: resDate.dateStr,
            expectedArriveTime2: "",
            supplierId: order.orderAttrextItemdefine3,
            supplierName: order.orderAttrextItemdefine2,
            supplierAddress1: "",
            supplierAddress2: "",
            supplierAddress3: "",
            supplierAddress4: "",
            supplierCountry: "",
            supplierProvince: "",
            supplierCity: "",
            supplierDistrict: "",
            supplierStreet: "",
            supplierContact: "",
            supplierFax: "",
            supplierMail: "",
            supplierTel1: "",
            supplierTel2: "",
            supplierZip: "",
            carrierId: "",
            carrierName: "",
            countryOfDestination: "",
            countryOfOrigin: "",
            followUp: "",
            hedi01: dhWarehouse, //入库编码  (不确定)
            hedi02: "", //出库编码
            hedi03: "",
            hedi04: "",
            hedi05: "",
            hedi06: "",
            hedi07: "",
            hedi08: "",
            hedi09: "",
            hedi10: "",
            placeOfDischarge: "",
            placeOfLoading: "",
            placeOfDelivery: "",
            priority: "",
            userDefine1: "",
            userDefine2: "",
            userDefine3: "",
            userDefine4: "",
            userDefine5: "",
            userDefine6: "",
            userDefine7: "",
            userDefine8: "",
            userDefine9: "",
            userDefine10: "",
            notes: "",
            crossdockFlag: "",
            details: details
          }
        ]
      }
    };
    return { body };
  }
}
exports({ entryPoint: MyTrigger });