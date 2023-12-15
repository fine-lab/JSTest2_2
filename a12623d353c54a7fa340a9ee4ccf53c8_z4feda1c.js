let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var replyId = request.replyId;
    var receiver = [];
    receiver.push(replyId);
    var tenantId = request.tenantId;
    var channels = ["uspace"];
    var templateCode = "todo##3d55Ydpv";
    var busiData = {
      name: "testuser"
    };
    var createToDoExt = {
      webUrl: "https://www.example.com/"
    };
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: tenantId,
      receiver: receiver,
      templateCode: templateCode,
      channels: channels,
      busiData: busiData,
      messageType: "createToDo",
      createToDoExt: createToDoExt
    };
    var result = sendMessage(messageInfo);
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });