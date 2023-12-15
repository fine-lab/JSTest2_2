viewModel.on("customInit", function (data) {
  // 厂家承担补差单详情--页面初始化
});
viewModel.get("button27jf") &&
  viewModel.get("button27jf").on("click", function (data) {
    debugger;
    // 赋值--单击
    let kehufenlei = viewModel.get("kehufenlei").getValue(); //客户分类
    let chunxiaodidianbianma = viewModel.get("chunxiaodidianbianma").getValue(); //促销地点编码
    //处理分页
    var gridModel = viewModel.get("J00101List");
    //获取表格当前页面所有的行数据
    const rowAllDatas = gridModel.getRows();
    if (rowAllDatas == 0) {
      cb.utils.alert("请选择表体行数据");
      return;
    }
    let arrData = []; //存储每页的结果
    let pageSize = 100; //每页数量
    let rowSize = rowAllDatas.length;
    let totalNum = Math.ceil(rowSize / pageSize); //总分页
    let productConditions = "";
    let productConditionsArr = []; //存储生成条件的数组
    if (rowAllDatas[rowSize - 1].wuliaobianma == undefined || rowAllDatas[rowSize - 1].wuliaobianma == null) {
      delete rowAllDatas[rowSize - 1]; //移除最后一行空数据
      rowSize = rowSize - 1;
    }
    for (let i = 0; i < rowSize; i++) {
      if (rowAllDatas[i].wuliaobianma == undefined || rowAllDatas[i].wuliaobianma == null) {
        let currentRowPage = i + 1; //页面显示的表格行数据
        cb.utils.alert("第" + currentRowPage + "行没有选择物料");
        return;
      }
      //当前存储数据的数组下标
      let currentBottom = i >= pageSize ? parseInt(i / pageSize) : 0;
      if ((i + 1) % pageSize != 1 && rowAllDatas[i].wuliaobianma) {
        productConditions = productConditions + ", '" + rowAllDatas[i].wuliaobianma + "'";
      } else if (rowAllDatas[i].wuliaobianma) {
        productConditions = productConditions + "'" + rowAllDatas[i].wuliaobianma + "'";
      }
      productConditionsArr.push(rowAllDatas[i]); //将数据添加到条件数组中
      if (((i + 1) % pageSize == 0 && currentBottom < Math.ceil(rowSize / pageSize)) || i == rowSize - 1) {
        arrData[currentBottom] = { condition: productConditions, arr: productConditionsArr };
        productConditions = "";
        productConditionsArr = [];
      }
    }
    //调用后端函数
    if (
      kehufenlei == "1647343064549687310" ||
      kehufenlei == "1647343107499360277" ||
      kehufenlei == "1647343107499360270" ||
      kehufenlei == "1647343107499360272" ||
      kehufenlei == "1647343107499360311" ||
      kehufenlei == "1647343116089294857" ||
      kehufenlei == "1647343116089294864" ||
      kehufenlei == "1647343116089294868" ||
      kehufenlei == "1647343116089294875" ||
      kehufenlei == "1647343116089294881" ||
      kehufenlei == "1647343107499360273" ||
      kehufenlei == "1647343107499360269" ||
      kehufenlei == "1647343107499360280" ||
      kehufenlei == "1647343107499360274" ||
      kehufenlei == "1647343107499360276" ||
      kehufenlei == "1647343107499360278" ||
      kehufenlei == "1647343107499360275" ||
      kehufenlei == "1647343107499360279" ||
      kehufenlei == "1647343107499360271" ||
      kehufenlei == "1647343064549687300" ||
      kehufenlei == "1647343064549687305" ||
      kehufenlei == "1647343064549687302" ||
      kehufenlei == "1647343064549687301" ||
      kehufenlei == "1647343064549687309" ||
      kehufenlei == "1647343064549687308" ||
      kehufenlei == "1647343064549687304" ||
      kehufenlei == "1647343064549687303" ||
      kehufenlei == "1647343064549687306" ||
      kehufenlei == "1647343064549687299" ||
      kehufenlei == "1647373000467546115" ||
      kehufenlei == "1647343064549687360" ||
      kehufenlei == "1647343064549687361" ||
      kehufenlei == "1647343064549687367" ||
      kehufenlei == "1508039511138893837" ||
      kehufenlei == "1508039511138893843" ||
      kehufenlei == "1508039511138893846" ||
      kehufenlei == "1508039511138893838" ||
      kehufenlei == "1614540234643996681" ||
      kehufenlei == "1628111042810740742"
    ) {
      //根据客户分类获取原价
      for (let i = 0; i < arrData.length; i++) {
        let result = cb.rest.invokeFunction("GT9640AT12.api.queryYjByWlbm01", { kehufenlei: kehufenlei, _productConditions: arrData[i].condition }, function (err, res) {}, viewModel, {
          async: false
        });
        if (result.error != undefined) {
          cb.utils.alert("请先选择促销地点编码!");
          return;
        }
        let currentResPageCondition = arrData[i].arr; //生成当前返回数据的数组
        let resultResponse = result.result.res; //响应结果
        for (let x = 0; x < currentResPageCondition.length; x++) {
          //拼装key值
          let resultKey = kehufenlei + currentResPageCondition[x].wuliaobianma;
          if (resultResponse.hasOwnProperty(resultKey)) {
            let useProductInfo = resultResponse[resultKey]; //当前行要使用的物料信息
            let baseIndex = i == 0 ? 0 : i * pageSize; //每次分页初始编号
            let rowNo = x + baseIndex; //行号
            gridModel.setCellValue(rowNo, "yuanjia", useProductInfo.price); //赋值原价
          }
        }
      }
    } else {
      //根据促销地点编码获取原价
      for (let i = 0; i < arrData.length; i++) {
        let result = cb.rest.invokeFunction(
          "GT9640AT12.api.queryTjByWlbm02",
          { chunxiaodidianbianma: chunxiaodidianbianma, _productConditions: arrData[i].condition },
          function (err, res) {},
          viewModel,
          { async: false }
        );
        if (result.error != undefined) {
          cb.utils.alert("请先选择促销地点编码!");
          return;
        }
        let currentResPageCondition = arrData[i].arr; //生成当前返回数据的数组
        let resultResponse = result.result.res; //响应结果
        for (let x = 0; x < currentResPageCondition.length; x++) {
          //拼装key值
          let resultKey = chunxiaodidianbianma + currentResPageCondition[x].wuliaobianma;
          if (resultResponse.hasOwnProperty(resultKey)) {
            let useProductInfo = resultResponse[resultKey]; //当前行要使用的物料信息
            let baseIndex = i == 0 ? 0 : i * pageSize; //每次分页初始编号
            let rowNo = x + baseIndex; //行号
            gridModel.setCellValue(rowNo, "yuanjia", useProductInfo.price); //赋值原价
          }
        }
      }
    }
  });
viewModel.get("button28yc") &&
  viewModel.get("button28yc").on("click", function (data) {
    // 合计--单击
    var gridModel = viewModel.get("J00101List");
    //获取表格当前页面所有的行数据
    const rowAllDatas = gridModel.getRows();
    if (rowAllDatas == 0) {
      cb.utils.alert("请输入表体行数据");
      return;
    }
    let xiangjinchengdanjineheji = 0;
    let changjiachengdanjineheji = 0;
    let zongjineheji = 0;
    for (var i = 0; i < rowAllDatas.length; i++) {
      //翔锦承担金额合计
      if (rowAllDatas[i].gongsichengdanjine != undefined) {
        xiangjinchengdanjineheji += rowAllDatas[i].gongsichengdanjine;
      }
      //厂家承担金额合计
      if (rowAllDatas[i].changjiachengdanjine != undefined) {
        changjiachengdanjineheji += rowAllDatas[i].changjiachengdanjine;
      }
      //总金额合计
      if (rowAllDatas[i].heji != undefined) {
        zongjineheji += rowAllDatas[i].heji;
      }
    }
    viewModel.get("xiangjinchengdanjineheji").setValue(xiangjinchengdanjineheji);
    viewModel.get("changjiachengdanjineheji").setValue(changjiachengdanjineheji);
    viewModel.get("zongjineheji").setValue(zongjineheji);
  });
viewModel.on("customInit", function (data) {
  // 共同承担补差单详情--页面初始化
  // 设置保存前校验
  viewModel.on("beforeSave", function (args) {
    // 获取页面的合计字段
    let xiangjinchengdanjineheji = viewModel.get("xiangjinchengdanjineheji").getValue();
    let changjiachengdanjineheji = viewModel.get("changjiachengdanjineheji").getValue();
    let zongjineheji = viewModel.get("zongjineheji").getValue();
    // 获取子表
    var gridModel = viewModel.get("J00101List");
    //获取表格当前页面所有的行数据
    const rowAllDatas = gridModel.getRows();
    if (rowAllDatas == 0) {
      cb.utils.alert("请选择表体行数据");
      return;
    }
    let zibiao_xjcdheji = 0;
    let zibiao_cjcdheji = 0;
    let zibiao_heji = 0;
    for (var i = 0; i < rowAllDatas.length; i++) {
      //翔锦承担金额合计
      if (rowAllDatas[i].gongsichengdanjine != undefined) {
        zibiao_xjcdheji += rowAllDatas[i].gongsichengdanjine;
      }
      //厂家承担金额合计
      if (rowAllDatas[i].changjiachengdanjine != undefined) {
        zibiao_cjcdheji += rowAllDatas[i].changjiachengdanjine;
      }
      //总金额合计
      if (rowAllDatas[i].heji != undefined) {
        zibiao_heji += rowAllDatas[i].heji;
      }
    }
    if (xiangjinchengdanjineheji != zibiao_xjcdheji || changjiachengdanjineheji != zibiao_cjcdheji || zongjineheji != zibiao_heji) {
      cb.utils.alert("保存前必须先进行合计！");
      return false;
    }
  });
});