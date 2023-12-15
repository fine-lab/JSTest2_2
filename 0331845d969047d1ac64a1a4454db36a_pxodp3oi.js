viewModel.on("afterMount", function (params) {
  hideObjFromDB();
});
const hideObjFromDB = () => {
  cb.rest.invokeFunction(
    "GT3734AT5.APIFunc.getLimitFieldApi",
    { billNo: viewModel.getParams().billNo },
    function (err, res) {
      if (err != null) {
        cb.utils.alert("权限控制异常");
      } else {
        if (res.data.length > 0) {
          let data = res.data;
          for (let i in data) {
            let dataObj = data[i];
            let fieldParamsList = dataObj.FieldParamsList;
            let isList = dataObj.isList;
            for (j in fieldParamsList) {
              let fieldParams = fieldParamsList[j];
              let fieldName = fieldParams.fieldName;
              let isMain = fieldParams.isMain;
              let childrenField = fieldParams.childrenField;
              let isVisilble = fieldParams.isVisilble;
              if (isList) {
                //列表单据
                viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
                viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
              } else {
                //单据
                if (isMain) {
                  //主表
                  viewModel.get(fieldName).setVisible(isVisilble);
                  viewModel.get(fieldName).setState("bShowIt", isVisilble);
                  viewModel.get(fieldName).setState("bHidden", !isVisilble);
                } else {
                  viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
                  viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
                }
              }
            }
          }
        }
      }
    },
    viewModel,
    { domainKey: "yourKeyHere" }
  );
};
viewModel.get("button25le") &&
  viewModel.get("button25le").on("click", function (data) {
    //事业部信息--单击
    let gridModel = viewModel.getGridModel().getData();
    console.log("result:" + gridModel);
    for (var i = 0; i < gridModel.length; i++) {
      let grid = gridModel[i];
      let id = grid.id; //shiyebu_name
      let shiyebu = "1573823532355289104";
      let shiyebuName = "AIMIX建机事业部";
      viewModel.getGridModel().setCellValue(i, "shiyebu_name", shiyebuName);
      viewModel.getGridModel().setCellValue(i, "shiyebu", shiyebu);
      console.log("id:" + id);
      let result = cb.rest.invokeFunction("AT17854C0208D8000B.backOpenApiFunction.updateShiYeBu", { id: id, shiyebu: shiyebu, shiyebuName: shiyebuName }, function (err, res) {}, viewModel, {
        async: false
      });
    }
  });
function getDate() {
  var date = new Date();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentDate = date.getFullYear() + "-" + month + "-" + strDate;
  return currentDate;
}
viewModel.on("beforeSearch", (args) => {
  let startDate = viewModel.getCache("FilterViewModel").get("ziduan1").getFromModel().getValue();
  let endDate = viewModel.getCache("FilterViewModel").get("ziduan1").getToModel().getValue();
  if (startDate) {
    if (!endDate) {
      endDate = getDate();
    }
    //删除commonvos中的ziduan1
    let commonVOs = args.params.condition.commonVOs;
    let newCommonVOs = commonVOs.filter((item, index) => {
      return item.itemName !== "ziduan1";
    });
    args.params.condition.commonVOs = newCommonVOs;
    args.params.condition.simpleVOs = [];
    args.params.condition.simpleVOs.push({
      logicOp: "and",
      conditions: [
        {
          field: "ziduan1",
          op: "egt",
          value1: startDate
        },
        {
          field: "ziduan1",
          op: "elt",
          value1: endDate
        }
      ]
    });
  }
});