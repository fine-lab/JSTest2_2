viewModel.on("customInit", function (data) {
  // 组件实践--页面初始化
});
let gridModel = viewModel.getGridModel();
gridModel.on("afterSetDataSource", () => {
  debugger;
  //选中行
  gridModel.select(1);
  //获取列表所有数据
  const rows = gridModel.getRows(false);
  //从缓存区获取按钮
  const actions = gridModel.getCache("actions");
  if (!actions) return;
  const actionsStates = [];
  rows.forEach((data) => {
    const actionState = {};
    actions.forEach((action) => {
      actionState[action.cItemName] = { visible: true };
      //设置按钮是否可见
      if (data.verifystate == "1") {
        if (action.cItemName == "btnEdit") {
          actionState[action.cItemName] = { visible: false };
        }
      }
    });
    actionsStates.push(actionState);
  });
  debugger;
  setTimeout(function () {
    gridModel.setActionsState(actionsStates);
  }, 10);
});