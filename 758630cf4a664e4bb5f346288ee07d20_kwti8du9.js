let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var returnList = getInterface(param, context);
    function getInterface(param, context) {
      let URL = extrequire("GT101792AT1.common.PublicURL");
      let URLData = URL.execute(null, null);
      var id = param.id;
      let func123 = extrequire("PU.public.GetToken");
      let res = func123.execute(require);
      let token = res.access_token;
      let headers = { "Content-Type": "application/json;charset=UTF-8" };
      // 采购订单主表
      let CGSql = "select * from pu.purchaseorder.PurchaseOrder where id = '" + id + "'";
      let CGRes = ObjectStore.queryByYonQL(CGSql, "upu");
      // 交易类型
      var bustype = CGRes[0].bustype;
      let bustypeResponse = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/transtype/detail?access_token=" + token + "&id=" + bustype, JSON.stringify(headers), null);
      let bustypeObject = JSON.parse(bustypeResponse);
      if (bustypeObject.code == 200) {
        var bustype_code = bustypeObject.data.code;
      } else {
        throw new Error("查询交易类型失败！");
      }
      // 质量状态自定义字段
      var inventoryType = "";
      if (bustype_code == "CG02") {
        inventoryType = "DJ";
      } else if (bustype_code == "CG05") {
        inventoryType = "DISABLE";
      } else {
        inventoryType = "FX";
      }
      var code = CGRes[0].code;
      var org = CGRes[0].org;
      // 供方地址
      var contactAddress = "";
      let Address = CGRes[0].hasOwnProperty("contactAddress");
      if (Address == true) {
        contactAddress = CGRes[0].contactAddress;
      }
      // 采购部门ID
      var department = "";
      // 采购部门名称
      var deptName = "";
      // 判断采购部门是否存在
      var deptSates = CGRes[0].hasOwnProperty("department");
      if (deptSates == true) {
        department = CGRes[0].department;
        let deptDeatil = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/admindept/detail?access_token=" + token + "&id=" + department, JSON.stringify(headers), null);
        let deptAPI = JSON.parse(deptDeatil);
        if (deptAPI.code == 200) {
          deptName = deptAPI.data.name.zh_CN;
        }
      }
      // 采购员ID
      var operator = "";
      // 采购员名称
      var atorName = "";
      // 判断采购员是否存在
      var atorSates = CGRes[0].hasOwnProperty("operator");
      if (atorSates == true) {
        operator = CGRes[0].operator;
        let atorDeatil = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/staff/detail?access_token=" + token + "&id=" + operator, JSON.stringify(headers), null);
        let atorAPI = JSON.parse(atorDeatil);
        if (atorAPI.code == 200) {
          atorName = atorAPI.data.name;
        }
      }
      // 开票供应商ID
      var invoiceVendor = "";
      // 开票供应商名称
      var invoiceVendorName = "";
      // 判断开票供应商是否存在
      var invoiceVendorSates = CGRes[0].hasOwnProperty("invoiceVendor");
      if (invoiceVendorSates == true) {
        invoiceVendor = CGRes[0].invoiceVendor;
        let invoiceVendorSql = "select code,name from aa.vendor.Vendor where id = '" + invoiceVendor + "'";
        let invoiceVendorRes = ObjectStore.queryByYonQL(invoiceVendorSql, "yssupplier");
        if (invoiceVendorRes.length > 0) {
          invoiceVendorName = invoiceVendorRes[0].name;
        }
      }
      // 供应商id
      var vendor = CGRes[0].vendor;
      // 供应商档案
      let vendorSql = "select code,name from aa.vendor.Vendor where id = '" + vendor + "'";
      let vendorRes = ObjectStore.queryByYonQL(vendorSql, "yssupplier");
      // 供应商名称
      var vendor_name = vendorRes[0].name;
      // 供应商编码
      var vendorCode = vendorRes[0].code;
      // 创建时间
      var createTime = CGRes[0].createTime;
      var RKbustype_code = "";
      if (bustype_code == "CG01") {
        RKbustype_code = "RK01";
      } else if (bustype_code == "CG02") {
        RKbustype_code = "RK02";
      } else if (bustype_code == "A20003") {
        RKbustype_code = "TK";
      } else if (bustype_code == "CG03") {
        RKbustype_code = "RK03";
      } else if (bustype_code == "CG06") {
        RKbustype_code = "RK06";
      }
      // 币种id
      var natCurrency = CGRes[0].natCurrency;
      // 币种表
      let CurrencySql = "select code from bd.currencytenant.CurrencyTenantVO where id = '" + natCurrency + "'";
      let CurrencyRes = ObjectStore.queryByYonQL(CurrencySql, "ucfbasedoc");
      // 币种
      var natCurrency_code = CurrencyRes[0].code;
      // 汇率
      var exchRate = CGRes[0].exchRate;
      //汇率类型
      var exchRateType = CGRes[0].exchRateType;
      // 子表信息
      let purSql = "select * from pu.purchaseorder.PurchaseOrders where mainid = '" + id + "'";
      var purchaseOrders = ObjectStore.queryByYonQL(purSql, "upu");
      // 组织单元详情查询
      let apiResponse1 = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/orgunit/detail?access_token=" + token + "&id=" + org, JSON.stringify(headers), null);
      let api1 = JSON.parse(apiResponse1);
      if (api1.code == "200") {
        var orgCode = api1.data.code;
        var SunData = {};
        var orderLines = new Array();
        var productData = {};
        var extendPropsSun = {};
        // 采购订单子表数组
        if (purchaseOrders.length > 0) {
          for (let i = 0; i < purchaseOrders.length; i++) {
            let SunId = purchaseOrders[i].id;
            // 物料SKU
            let productsku = purchaseOrders[i].productsku;
            // 查询物料SKU档案
            let SkuSQL = "select code,name from pc.product.ProductSKU where id = '" + productsku + "'";
            let SkuRES = ObjectStore.queryByYonQL(SkuSQL, "productcenter");
            var firstupcode = purchaseOrders[i].firstupcode;
            // 自定义档案查询
            let ZDYsql = "select * from pu.purchaseorder.PurchaseOrdersCustomItem where id = '" + SunId + "'";
            let ZDYres = ObjectStore.queryByYonQL(ZDYsql, "upu");
            // 收件人姓名
            var receiver = purchaseOrders[i].receiver;
            // 收件人地址
            var receiveAddress = purchaseOrders[i].receiveAddress;
            // 收件人手机
            var receiveTelePhone = purchaseOrders[i].receiveTelePhone;
            // 无税金额
            var unTaxFee = purchaseOrders[i].oriMoney;
            // 含税金额
            var totalFee = purchaseOrders[i].oriSum;
            // 本币无税金额
            var localUnTaxFee = purchaseOrders[i].natMoney;
            // 本币含税金额
            var localTotalFee = purchaseOrders[i].natSum;
            // 税额
            var taxFee = purchaseOrders[i].oriTax;
            // 本币税额
            var localTaxFee = purchaseOrders[i].natTax;
            // 库存换算率
            let invExchRate = purchaseOrders[i].invExchRate;
            // 库存换算率换算方式
            let unitExchangeType = purchaseOrders[i].unitExchangeType;
            // 计价换算率换算方式
            let unitExchangeTypePrice = purchaseOrders[i].unitExchangeTypePrice;
            // 计价换算率
            let invPriceExchRate = purchaseOrders[i].invPriceExchRate;
            // 库存单位
            // 税率
            var taxRate = purchaseOrders[i].taxRate;
            // 税目税率
            var taxitems_code = purchaseOrders[i].taxitems;
            // 仓库
            var warehouse = purchaseOrders[i].warehouse;
            if (warehouse == undefined || warehouse == null) {
              throw new Error("请维护仓库信息！");
            }
            let Sql = "select code,bWMS from aa.warehouse.Warehouse where id = '" + warehouse + "'";
            let warehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
            var bWMS = warehouseRes[0].bWMS;
            var warehouseCode = warehouseRes[0].code;
            // 单位
            let priceUOM = purchaseOrders[i].priceUOM;
            let unit = purchaseOrders[i].unit;
            let UOMSql = "select name from pc.unit.Unit where id = '" + priceUOM + "'";
            let UOMRes = ObjectStore.queryByYonQL(UOMSql, "productcenter");
            let purUOM_Name = UOMRes[0].name;
            // 物料id
            var product = purchaseOrders[i].product;
            let productSql = "select code,name,manageClass from pc.product.Product where id = '" + product + "'";
            let productRes = ObjectStore.queryByYonQL(productSql, "productcenter");
            // 商品类型
            let materialClassId = productRes[0].manageClass;
            if (materialClassId == undefined || materialClassId == null) {
              throw new Error("获取商品类型失败！");
            }
            // 物料分类详情查询
            let productClassResponse = postman(
              "get",
              URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/managementclass/newdetail?access_token=" + token + "&id=" + materialClassId,
              JSON.stringify(headers),
              null
            );
            let productClassObject = JSON.parse(productClassResponse);
            if (productClassObject.code == "200") {
              var materialClassCode = productClassObject.data.parentCode;
              var materialClassName = productClassObject.data.parentName;
              var product_cCode = productRes[0].code;
              var product_cName = productRes[0].name;
              let productDeatliSql = "select isBatchManage from pc.product.ProductDetail where productId = '" + product + "'";
              let productDeatliRes = ObjectStore.queryByYonQL(productDeatliSql, "productcenter");
              var isBatchManage = productDeatliRes[0].isBatchManage;
              var batchno = null;
              // 生产日期
              var vouchdate = null;
              if (isBatchManage == true) {
                let BroNoSql = "select batchno,createTime from st.batchno.Batchno where product = '" + product + "' and org = '" + org + "' order by pubts desc";
                let BroNoRes = ObjectStore.queryByYonQL(BroNoSql, "yonbip-scm-scmbd");
                if (BroNoRes.length > 0) {
                  for (let s = 0; s < BroNoRes.length; s++) {
                    var batchnoSSD = BroNoRes[s].hasOwnProperty("batchno");
                    if (batchnoSSD == true) {
                      batchno = BroNoRes[s].batchno;
                      vouchdate = BroNoRes[0].createTime;
                    } else {
                      throw new Error("该仓库下没有此物料批次信息请维护！");
                    }
                  }
                }
              }
              let getDate = new Date(vouchdate);
              let GENT = getDate.getTime();
              let expireTime = GENT + 31536000000;
              let expDate = new Date(expireTime);
              let Year = expDate.getFullYear();
              let Moth = expDate.getMonth() + 1 < 10 ? "0" + (expDate.getMonth() + 1) : expDate.getMonth() + 1;
              let Day = expDate.getDate() < 10 ? "0" + expDate.getDate() : expDate.getDate();
              let Hour = expDate.getHours() < 10 ? "0" + expDate.getHours() : expDate.getHours();
              let Minute = expDate.getMinutes() < 10 ? "0" + expDate.getMinutes() : expDate.getMinutes();
              let Sechond = expDate.getSeconds() < 10 ? "0" + expDate.getSeconds() : expDate.getSeconds();
              // 到期日期
              var expireDate = Year + "-" + Moth + "-" + Day + " " + Hour + ":" + Minute + ":" + Sechond;
              let qty = purchaseOrders[i].qty;
              var number = Math.sign(qty);
              if (number == -1) {
                var sum = qty * -1;
                productData = {
                  itemCode: SkuRES[0].code,
                  itemName: SkuRES[0].name,
                  itemType: materialClassCode,
                  itemTypeName: materialClassName
                };
                extendPropsSun = {
                  product: product, // 物料
                  isBatchManage: isBatchManage, //是否批次管理
                  batchno: batchno, // 批次号
                  productDate: vouchdate,
                  expireDate: expireDate,
                  quantity: qty,
                  invExchRate: invExchRate, //库存换算率
                  unitExchangeType: unitExchangeType, //库存换算率换算方式
                  stockUnitId: priceUOM, //库存单位
                  unitExchangeTypePrice: unitExchangeTypePrice, //计价换算率换算方式
                  invPriceExchRate: invPriceExchRate, //计价换算率
                  priceUOM: priceUOM, //计价单位
                  taxitems: taxitems_code, //税目税率
                  unTaxFee: unTaxFee,
                  totalFee: totalFee,
                  localUnTaxFee: localUnTaxFee,
                  localTotalFee: localTotalFee,
                  taxRate: taxRate, //税率
                  taxFee: taxFee,
                  localTaxFee: localTaxFee,
                  autoCalcCost: false //	存货自动计算成本标识，是否由存货核算回写成本金额、成本单价 示例：false
                };
                SunData = {
                  orderLineNo: SunId,
                  planQty: sum,
                  unit: purUOM_Name,
                  bWMS: bWMS,
                  inventoryType: inventoryType,
                  itemInfo: productData,
                  extendProps: extendPropsSun
                };
                orderLines.push(SunData);
              } else {
                productData = {
                  itemCode: SkuRES[0].code,
                  itemName: SkuRES[0].name,
                  itemType: materialClassCode,
                  itemTypeName: materialClassName
                };
                extendPropsSun = {
                  product: product, // 物料
                  isBatchManage: isBatchManage, //是否批次管理
                  batchno: batchno, // 批次号
                  productDate: vouchdate,
                  expireDate: expireDate,
                  quantity: qty,
                  invExchRate: invExchRate, //库存换算率
                  unitExchangeType: unitExchangeType, //库存换算率换算方式
                  stockUnitId: priceUOM, //库存单位
                  unitExchangeTypePrice: unitExchangeTypePrice, //计价换算率换算方式
                  invPriceExchRate: invPriceExchRate, //计价换算率
                  priceUOM: priceUOM, //计价单位
                  taxitems: taxitems_code, //税目税率
                  unTaxFee: unTaxFee,
                  totalFee: totalFee,
                  localUnTaxFee: localUnTaxFee,
                  localTotalFee: localTotalFee,
                  taxRate: taxRate, //税率
                  taxFee: taxFee,
                  localTaxFee: localTaxFee,
                  autoCalcCost: false //	存货自动计算成本标识，是否由存货核算回写成本金额、成本单价 示例：false
                };
                SunData = {
                  orderLineNo: SunId,
                  planQty: qty,
                  unit: purUOM_Name,
                  bWMS: bWMS,
                  inventoryType: inventoryType,
                  itemInfo: productData,
                  extendProps: extendPropsSun
                };
                orderLines.push(SunData);
              }
            }
          }
          var extendPropsMain = {
            ysId: id,
            org: org, //收货组织
            purchaseOrg: org, //采购组织
            accountOrg: org, //会计主体
            inInvoiceOrg: org, //收票组织
            bustype: "TK", //交易类型
            warehouse: warehouse, //仓库
            vendor: vendorCode, //供应商
            currency: natCurrency_code, //币种
            natCurrency: natCurrency_code, //本币
            exchRateType: exchRateType, //汇率类型
            exchRate: exchRate //汇率
          };
          var extendPropsMains = {
            ysId: id,
            org: org, //收货组织
            cgDepart: deptName,
            cgOperator: atorName,
            invoiceSupplier: invoiceVendorName,
            purchaseOrg: org, //采购组织
            accountOrg: org, //会计主体
            inInvoiceOrg: org, //收票组织
            bustype: RKbustype_code, //交易类型
            warehouse: warehouse, //仓库
            vendor: vendorCode, //供应商
            currency: natCurrency_code, //币种
            natCurrency: natCurrency_code, //本币
            exchRateType: exchRateType, //汇率类型
            exchRate: exchRate //汇率
          };
        }
        var receiverInfo = { name: receiver, detailAddress: receiveAddress, contacts: receiver, mobile: receiveTelePhone };
        // 退货订单
        if (bustype_code == "A20003" || bustype_code == "CG05" || bustype_code == "CG04") {
          // 组装数据
          let jsonBody = {
            outBizOrderCode: code,
            superOutBizOrderCode: firstupcode,
            invoiceSupplierName: vendor_name,
            invoiceSupplierCode: vendorCode,
            invoiceSupplierAddress: contactAddress,
            supplierId: vendor,
            bizOrderType: "OUTBOUND",
            subBizOrderType: "TGCK",
            createTime: createTime,
            warehouseCode: warehouseCode,
            ownerCode: orgCode,
            orderLines: orderLines,
            channelCode: "XDQD",
            supplierCode: vendorCode,
            supplierName: vendor_name,
            senderInfo: {},
            receiverInfo: receiverInfo,
            bizFlow: "4822bb5e-efa7-11ec-9896-6c92bf477043",
            SourcePlatformCode: "电商渠道",
            extendProps: extendPropsMain,
            status: "WAIT_OUTBOUND"
          };
          let body = {
            appCode: "beiwei-ys",
            appApiCode: "standard.return.supplier.order.create",
            schemeCode: "bw47",
            jsonBody: jsonBody
          };
          return { body: body };
        } else if (bustype_code == "CG02" || bustype_code == "CG01" || bustype_code == "CG03" || bustype_code == "CG06") {
          // 正常采购订单
          // 组装数据
          let jsonBody = {
            outBizOrderCode: code,
            bizOrderType: "INBOUND",
            subBizOrderType: "CGRK",
            supplierId: vendor,
            createTime: createTime,
            warehouseCode: warehouseCode,
            ownerCode: orgCode,
            orderLines: orderLines,
            channelCode: "XDQD",
            supplierCode: vendorCode,
            supplierName: vendor_name,
            senderInfo: null,
            receiverInfo: receiverInfo,
            extendProps: extendPropsMains,
            SourcePlatformCode: "DY",
            bizFlow: "4822bb5e-efa7-11ec-9896-6c92bf477043",
            status: "WAIT_INBOUND"
          };
          let body = {
            appCode: "beiwei-ys",
            appApiCode: "standard.purchase.order.entry.create",
            schemeCode: "bw47",
            jsonBody: jsonBody
          };
          return { body: body };
        }
      } else {
        throw new Error("查询库存组织失败！");
      }
    }
    return { returnList: returnList };
  }
}
exports({ entryPoint: MyTrigger });