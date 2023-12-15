viewModel.on("customInit", function (data) {
  // 咨询伙伴资质申请详情--页面初始化
  var formatDate = function (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    return y + "-" + m + "-" + d;
  };
  viewModel.on("afterLoadData", function () {
    //当前页面状态
    var currentState = viewModel.getParams().mode; //add:新增态，edit:编辑态, browse:浏览态
    if (currentState == "add") {
      //新增状态
      viewModel.get("applyDate").setValue(formatDate(new Date()));
      //主组织默认值
      let staffRes = cb.rest.invokeFunction("GT5258AT16.pubFunction.getStaffByUserId", {}, function (err, res) {}, viewModel, { async: false });
      let staff = staffRes.result;
      if (staff && staff.code === "200" && staff.data && staff.data.data && staff.data.data.length > 0) {
        let staffData = staff.data.data[0];
        viewModel.get("org_id").setValue(staffData.org_id);
        viewModel.get("org_id_name").setValue(staffData.org_id_name);
        viewModel.get("orgName").setValue(staffData.org_id_name);
        viewModel.get("applyPerson").setValue(staffData.id);
        viewModel.get("applyPersonName").setValue(staffData.name);
        viewModel.get("applyPerson_name").setValue(staffData.name);
        if (staffData.mobile) {
          viewModel.get("applyMobile").setValue(staffData.mobile.split("-")[1]);
        }
      }
    }
  });
  //资质授权
  viewModel.get("button22ph").on("click", function () {
    //按钮设为不可用，防止重复传递
    viewModel.get("button22ph").setDisabled(true);
    var synstatus = viewModel.get("synstatus").getValue();
    cb.rest.invokeFunction("GT30659AT3.cot.SyncToPOMP", { id: viewModel.get("id").getValue(), userId: cb.rest.AppContext.user.userId }, function (err, res) {
      cb.utils.alert("授权成功！");
    });
  });
  var queryAdvisorNum = function (orgName) {
    if (!orgName) {
      return;
    }
    cb.rest.invokeFunction("GT30659AT3.backDefaultGroup.queryAdvisorNum", { partnerName: orgName, userId: cb.rest.AppContext.user.userId }, function (err, res) {
      if (res !== null) {
        var advisorAmount = res.hasOwnProperty("advisorNum") ? res.advisorNum : 0;
        var certAdvisorAmount = res.hasOwnProperty("regAdvisorNum") ? res.regAdvisorNum : 0;
        var prodAdvisorAmount = res.hasOwnProperty("prodLineAdvisorNum") ? res.prodLineAdvisorNum : 0;
        viewModel.get("advisorAmount").setValue(advisorAmount);
      }
    });
  };
  //申请伙伴值改变事件
  viewModel.get("partner_code").on("afterValueChange", function (data) {
    //参照选择的数据
    console.log("值改变事件：", data);
    if (data && data.value) {
      let name = data.value.name;
      viewModel.get("partnerName").setValue(name);
      queryAdvisorNum(name);
    }
  });
  viewModel.on("beforeSave", function (args) {
    var cotServiceTypeCode = viewModel.get("cotServiceTypeCode").getValue();
    var cotFiled = viewModel.get("cotFiled").getValue();
    var cotIndustry = viewModel.get("cotIndustry").getValue();
    if (cotServiceTypeCode == "01503" && (cotFiled == "" || cotFiled == null)) {
      cb.utils.alert("领域专项不能为空！", "error");
      return false;
    }
    if (cotServiceTypeCode == "01504" && (cotIndustry == "" || cotIndustry == null)) {
      cb.utils.alert("行业专项不能为空！", "error");
      return false;
    }
  });
  //联查顾问
  viewModel.get("button32fh").on("click", function () {
    var userId = cb.rest.AppContext.user.userId;
    var orgId = viewModel.get("partner").getValue();
    var partnerName = viewModel.get("partnerName").getValue();
    cb.rest.invokeFunction("GT30659AT3.backDefaultGroup.getPOMPToken", { userId: userId }, function (err, res) {
      if (res.code == "200") {
        let appkey = res.data.appkey;
        let token = res.data.token;
        var url = "https://pomp.yybip.com/app-bip/#/consultant/partnerList?orgId=" + orgId + "&orgName=" + partnerName + "&appkey=" + appkey + "&token=" + token;
        window.open(url);
      }
    });
  });
});
viewModel.get("button22ph") && viewModel.get("button22ph").on("click", function (data) {});