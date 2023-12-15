viewModel.get("purchaseOrders") &&
  viewModel.get("purchaseOrders").getEditRowModel() &&
  viewModel.get("purchaseOrders").getEditRowModel().get("product_cCode") &&
  viewModel
    .get("purchaseOrders")
    .getEditRowModel()
    .get("product_cCode")
    .on("afterValueChange", function (data) {
      // 物料编码--值改变
      debugger;
      var gridModel = viewModel.getGridModel("purchaseOrders");
      //获取物料编码
      let productArray = data.obj.select;
      for (var i = 0; i < productArray.length; i++) {
        // 获取行号
        let rowIndex = gridModel.__data.focusedRowIndex;
        let productId = productArray[i].id;
        let res = cb.rest.invokeFunction("PU.API.recentPrice", { productId: productId }, function (err, res) {}, viewModel, { async: false });
        let req = res.result.resquest1;
        if (req.length > 0) {
          let oriTaxUnitPrice = req[0].oriTaxUnitPrice;
          if (productArray.length == 1) {
            gridModel.setCellValue(rowIndex, "bodyFreeItem!define1", oriTaxUnitPrice);
          } else {
            gridModel.setCellValue(rowIndex - 1 + i, "bodyFreeItem!define1", oriTaxUnitPrice);
          }
        } else {
          cb.utils.alert("未查询到该物料");
        }
      }
    });