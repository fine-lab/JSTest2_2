run = function (event) {
  var viewModel = this;
  let zzChildGridModel = viewModel.getGridModel("SY01_supply_licence_childList");
  let zzfw_gridModel = viewModel.getGridModel("SY01_supply_licence_sunList");
  viewModel.on("beforeDelete", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    let supplierCode = viewModel.get("supplierCode").getValue();
    let promiseArr = [];
    let licenceChildRes = [];
    promiseArr.push(
      getPerInfo(orgId, supplierCode).then((res) => {
        licenceChildRes = res;
      })
    );
    let returnPromise = new cb.promise();
    Promise.all(promiseArr).then((res) => {
      let mId = viewModel.get("id").getValue();
      let exist = false;
      if (licenceChildRes.length > 0) {
        for (let i = 0; i < licenceChildRes.length; i++) {
          if (licenceChildRes[i].licenseName == mId) {
            exist = true;
            break;
          }
        }
      }
      if (exist) {
        cb.utils.alert("该证照已被预审单引用，无法删除", "error");
        returnPromise.reject();
      } else {
        returnPromise.resolve();
      }
    });
    return returnPromise;
  });
  viewModel.get("supplierCode_code").on("afterValueChange", function (data) {
    zzfw_gridModel.deleteAllRows();
    zzChildGridModel.deleteAllRows();
  });
  var zzGridModelName = "SY01_supply_licence_childList";
  var zzsqlxFieldCellName = "authType";
  let switchDisplayFields = function (gridModel, number) {
    number = parseInt(number);
    let fields = ["authProduct_name", "authProductType_catagoryname", "authDosageForm_dosagaFormName", "authSku_name", "item92sh", "authProductCode"];
    for (let i = 0; i < fields.length; i++) {
      gridModel.setColumnState(fields[i], "visible", false);
      gridModel.setColumnState(fields[i], "bCanModify", false);
    }
    switch (number) {
      case 1:
        gridModel.setColumnState("authProduct_name", "visible", true);
        gridModel.setColumnState("authProduct_name", "bCanModify", true);
        gridModel.setColumnState("authProductCode", "visible", true);
        gridModel.setColumnState("authProductCode", "bCanModify", true);
        break;
      case 2:
        gridModel.setColumnState("authProductType_catagoryname", "visible", true);
        gridModel.setColumnState("authProductType_catagoryname", "bCanModify", true);
        break;
      case 3:
        gridModel.setColumnState("authDosageForm_dosagaFormName", "visible", true);
        gridModel.setColumnState("authDosageForm_dosagaFormName", "bCanModify", true);
        break;
      case 4:
        gridModel.setColumnState("authSku_name", "visible", true);
        gridModel.setColumnState("authSku_name", "bCanModify", true);
        gridModel.setColumnState("authProduct_name", "visible", true);
        gridModel.setColumnState("authProduct_name", "bCanModify", true);
        gridModel.setColumnState("authProductCode", "visible", true);
        gridModel.setColumnState("authProductCode", "bCanModify", true);
        gridModel.setColumnState("item92sh", "visible", true);
        gridModel.setColumnState("item92sh", "bCanModify", false);
        break;
      case 10:
        gridModel.setState("bIsNull", true);
        break;
    }
  };
  //孙表判断重复
  let validateRangeRepeat = function (rows, idFieldName, value) {
    let set = new Set();
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][idFieldName] != "" && rows[i][idFieldName] != null && rows[i][idFieldName] != undefined && rows[i]._status != "Delete") {
        set.add(rows[i][idFieldName]);
      }
    }
    return set.has(value);
  };
  //相关证照切换时，删除所有孙表，将列换成对应的参照
  viewModel.getGridModel(zzGridModelName).on("afterCellValueChange", function (data) {
    if (data.cellName == zzsqlxFieldCellName && data.value != data.oldValue) {
      zzfw_gridModel.deleteAllRows();
      let sqType = viewModel.getGridModel(zzGridModelName).getCellValue(data.rowIndex, zzsqlxFieldCellName);
      switchDisplayFields(zzfw_gridModel, sqType);
    }
  });
  //初始化时参照查询值
  zzfw_gridModel.on("beforeSetDataSource", function (data) {
    let sqType = viewModel.getGridModel(zzGridModelName).getCellValue(viewModel.getGridModel(zzGridModelName).getFocusedRowIndex(), zzsqlxFieldCellName);
    switchDisplayFields(zzfw_gridModel, sqType);
  });
  zzfw_gridModel.on("beforeCellValueChange", function (data) {
    debugger;
    let rows = zzfw_gridModel.getRows();
    let sqType = viewModel.getGridModel(zzGridModelName).getCellValue(viewModel.getGridModel(zzGridModelName).getFocusedRowIndex(), zzsqlxFieldCellName);
    if (sqType == undefined) {
      cb.utils.alert("请先选择授权范围");
      return false;
    }
    let flag = true;
    if (data.cellName == "authProduct_name" && sqType == 1 && data.value.id != undefined) {
      flag = !validateRangeRepeat(rows, "authProduct", data.value.id);
    } else if (data.cellName == "authProductType_catagoryname" && sqType == 2 && data.value.id != undefined) {
      flag = !validateRangeRepeat(rows, "authProductType", data.value.id);
    } else if (data.cellName == "extend_dosage_auth_type_dosagaFormName" && sqType == 3 && data.value.id != undefined) {
      flag = !validateRangeRepeat(rows, "authDosageForm", data.value.id);
    } else if (data.cellName == "authSku_name" && sqType == 4 && data.value.id != undefined) {
      //商品+sku
      flag = !validateRangeRepeat(rows, "authSku", data.value.id);
      if (data.value.code == rows[data.rowIndex].item92sh) {
        cb.utils.alert("第" + (data.rowIndex + 1) + "行，未启用多SKU的物料不支持按照商品+SKU授权类型授权!", "error");
        return false;
      }
    }
    if (!flag) {
      cb.utils.alert("已有相同选项,请勿重复选择!");
      return false;
    }
  });
  let selectParamOrg = function () {
    return new Promise((resolve) => {
      cb.rest.invokeFunction("ISY_2.public.getParamInfo", {}, function (err, res) {
        console.log(res);
        console.log(err);
        if (typeof res != "undefined") {
          let paramRres = res.paramRes;
          resolve(paramRres);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  };
  let selectMerchandise = function (orgId) {
    return new Promise((resolve) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getMerchandise", { orgId: orgId }, function (err, res) {
        let data;
        if (typeof res != "undefined") {
          let resInfo = res.res;
          data = res.huopinIds;
          resolve(data);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  };
  //组织过滤
  viewModel.get("org_id_name").on("beforeBrowse", function (data) {
    debugger;
    let returnPromise = new cb.promise();
    selectParamOrg().then(
      (data) => {
        let orgId = [];
        if (data.length == 0) {
          orgId.push("-1");
        } else {
          for (let i = 0; i < data.length; i++) {
            orgId.push(data[i].org_id);
          }
        }
        let treeCondition = {
          isExtend: true,
          simpleVOs: []
        };
        if (orgId.length > 0) {
          treeCondition.simpleVOs.push({
            field: "id",
            op: "in",
            value1: orgId
          });
        }
        this.setTreeFilter(treeCondition);
        returnPromise.resolve();
      },
      (err) => {
        cb.utils.alert(err, "error");
        returnPromise.reject();
      }
    );
    return returnPromise;
  });
  //供应商过滤
  viewModel.get("supplierCode_code").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "vendorApplyRange.org",
      op: "eq",
      value1: orgId
    });
    this.setFilter(condition);
  });
  //授权范围-物料过滤
  zzfw_gridModel
    .getEditRowModel()
    .get("authProduct_name")
    .on("beforeBrowse", function (data) {
      let orgId = viewModel.get("org_id").getValue();
      let type = "授权委托书范围";
      let promises = [];
      let huopinRes = [];
      let idObjects = [];
      promises.push(
        selectMerchandise(orgId).then((res) => {
          huopinRes = res;
        })
      );
      let returnPromise = new cb.promise();
      Promise.all(promises).then(
        () => {
          let proIds = [];
          if (huopinRes.length == 0) {
            proIds.push("-1");
          }
          for (let j = 0; j < huopinRes.length; j++) {
            proIds.push(huopinRes[j]);
          }
          let condition = {
            isExtend: true,
            simpleVOs: []
          };
          condition.simpleVOs.push({
            field: "id",
            op: "in",
            value1: proIds
          });
          this.setFilter(condition);
          returnPromise.resolve();
        },
        (err) => {
          cb.utils.alert(err, "error");
          returnPromise.reject();
        }
      );
      return returnPromise;
    });
  zzfw_gridModel.on("afterCellValueChange", function (data) {
    if (data.cellName == "authProduct_name") {
      zzfw_gridModel.setCellValue(data.rowIndex, "authSku", null);
      zzfw_gridModel.setCellValue(data.rowIndex, "authSku_name", null);
      zzfw_gridModel.setCellValue(data.rowIndex, "item92sh", null);
    }
  });
  //授权范围-物料SKU过滤
  zzfw_gridModel
    .getEditRowModel()
    .get("authSku_name")
    .on("beforeBrowse", function (data) {
      let orgId = viewModel.get("org_id").getValue();
      let authProduct = zzfw_gridModel.getEditRowModel().get("authProduct").getValue();
      let type = "授权委托书范围";
      let promises = [];
      let huopinRes = [];
      let idObjects = [];
      let condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push(
        {
          field: "productId",
          op: "eq",
          value1: authProduct
        },
        {
          field: "productId.productApplyRange.orgId",
          op: "eq",
          value1: orgId
        }
      );
      this.setFilter(condition);
    });
  //保存后将授权范围同步给合格供应商的授权范围
  viewModel.on("afterSave", function () {
    let id = viewModel.get("id").getValue(); //供应商资质证照id
    synSupplyAuthCope(id).then((res) => {});
  });
  function synSupplyAuthCope(personId) {
    return new Promise((resolve) => {
      cb.rest.invokeFunction(
        "ISY_2.public.synAuthCope",
        {
          mainId: personId,
          synType: 2
        },
        function (err, res) {
          console.log(res);
          console.log(err);
          if (res != null) {
            resolve();
          } else if (err != null) {
            reject();
          }
        }
      );
    });
  }
  function getPerInfo(orgId, supplierCode) {
    return new Promise((resolve) => {
      cb.rest.invokeFunction(
        "ISY_2.public.getperInfo",
        {
          orgId: orgId,
          supplierCode: supplierCode,
          type: "证照范围"
        },
        function (err, res) {
          console.log(res);
          console.log(err);
          if (typeof res != "undefined" && res != null) {
            let licenceChildRes = res.object.licenceChildRes;
            resolve(licenceChildRes);
          } else if (err != null) {
            reject();
          }
        }
      );
    });
  }
  viewModel.on("beforeSave", function () {
    let childIndex = viewModel.getGridModel(zzGridModelName).getRows();
    let sunIndex = viewModel.getGridModel("SY01_supply_licence_sunList").getRows();
    let orgId = viewModel.get("org_id").getValue();
    let promises = [];
    let orgRes = [];
    promises.push(
      selectParamOrg().then((res) => {
        orgRes = res;
      })
    );
    var returnPromise = new cb.promise();
    Promise.all(promises).then(() => {
      let orgIdList = [];
      for (let j = 0; j < orgRes.length; j++) {
        orgIdList.push(orgRes[j].org_id);
      }
      let index = orgIdList.indexOf(orgId);
      if (index == -1) {
        cb.utils.alert("该组织没有开启GMP参数,请检查", "error");
        returnPromise.reject();
      } else {
        returnPromise.resolve();
      }
    });
    if (childIndex.length > 1) {
      cb.utils.alert("一个证照只能授权一个类型");
      return false;
    }
    if (childIndex[0].authType != "10") {
      if (sunIndex.length < 1) {
        cb.utils.alert("证照授权范围不能为空", "error");
        return false;
      } else {
        for (let i = 0; i < sunIndex.length; i++) {
          if (
            (typeof sunIndex[i].authProduct == "undefined" || sunIndex[i].authProduct == null) &&
            (typeof sunIndex[i].authProductType == "undefined" || sunIndex[i].authProductType == null) &&
            (typeof sunIndex[i].authDosageForm == "undefined" || sunIndex[i].authDosageForm == null) &&
            (typeof sunIndex[i].authSku == "undefined" || sunIndex[i].authSku == null)
          ) {
            cb.utils.alert("第" + (i + 1) + "行证照授权范围不能为空", "error");
            return false;
          }
          childIndex;
          if (childIndex[0].authType == "4" || childIndex[0].authType == 4) {
            if (sunIndex[i].authProductCode == sunIndex[i].item92sh) {
              cb.utils.alert("第" + (i + 1) + "行，未启用多SKU的物料不支持按照商品+SKU授权类型授权！", "error");
              return false;
            }
          }
        }
      }
      if (childIndex[0].authType == 4) {
        for (let i = 0; i < sunIndex.length; i++) {
          if (typeof sunIndex[i].authProduct != "undefined" && sunIndex[i].authProduct != null && (typeof sunIndex[i].authSku == "undefined" || sunIndex[i].authSku == null)) {
            cb.utils.alert("第" + (i + 1) + "行物料SKU不能为空", "error");
            return false;
          }
        }
      }
    }
    return returnPromise;
  });
};