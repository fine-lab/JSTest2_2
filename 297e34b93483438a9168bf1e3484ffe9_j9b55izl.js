//读取身份证
viewModel.get("button23zb") &&
  viewModel.get("button23zb").on("click", function (data) {
    //读取身份证--单击
    const options = {
      // 定义请求选项
      hostname: "127.0.0.1", // 请求的主机名
      port: 38088, // 请求的端口号
      path: "/card=idcard", // 请求的路径
      method: "POST" // 请求的方法为POST
    };
    fetch("http://127.0.0.1:38088/card=idcard", options) // 发送请求
      .then((response) => response.json()) // 将响应数据解析为JSON格式
      .then((result) => {
        console.log(result.IDCardInfo.cardID); // 输出身份证号
        console.log(result);
        cb.rest.invokeFunction("", {}, function (err, res) {
          viewModel.get("xuanzemaishouren_code").setValue(result.IDCardInfo.cardID);
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });