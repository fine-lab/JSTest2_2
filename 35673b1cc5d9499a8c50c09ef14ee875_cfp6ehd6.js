viewModel.on("customInit", function (data) {
  // 相对方管理--页面初始化
});
viewModel.on("beforeSearch", function (args) {
  var user = cb.rest.AppContext.user;
  var promise = new cb.promise();
  debugger;
  setTimeout(function () {
    //相对方管理
    cb.rest.invokeFunction("43cc416616ac4fc0b2d7a0a1631a4f1d", { custdoctype: "3" }, function (err, res) {
      debugger;
      var allrole;
      if (err != null) {
        cb.utils.alert("查询数据异常" + err.message);
        return false;
      } else {
        debugger;
        var userid = res.userid;
        orgid = res.orgid;
        deptCode = res.deptCode;
        usercode = res.usercode;
        debugger;
        args.isExtend = true;
        var retorgid = res.retorgid;
        var retdeptid = res.retdeptid;
        if (args.params.condition.simpleVOs == null) {
          args.params.condition.simpleVOs = [
            {
              logicOp: "or",
              conditions: []
            }
          ];
        }
        var retorgid = res.retorgid;
        var retdeptid = res.retdeptid;
        if (retorgid.length > 0) {
          args.params.condition.simpleVOs[0].conditions.push({
            field: "chuangjianrenzuzhi",
            op: "in",
            value1: retorgid
          });
        }
        if (retdeptid.length > 0) {
          args.params.condition.simpleVOs[0].conditions.push({
            field: "chuangjianrenbumen",
            op: "in",
            value1: retdeptid
          });
        }
        if (userid.length > 0) {
          args.params.condition.simpleVOs[0].conditions.push({
            field: "chuangjianren",
            op: "in",
            value1: userid
          });
        }
      }
      promise.resolve();
    });
  }, 10);
  return promise;
});