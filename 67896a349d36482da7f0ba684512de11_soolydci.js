let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let bsdata = request.bsdata;
    let detail = request.detail;
    let url = "https://www.example.com/" + access_token;
    let bodiesArr = new Array(detail.length);
    let numIndex = 0;
    for (let i = 0; i < detail.length; i++) {
      let debit = {};
      let debit_clientauxiliary = [
        {
          field: "vr1",
          value: detail[i].dept
        },
        {
          field: "vr2",
          value: detail[i].project
        }
      ];
      debit["description"] = detail[i].description;
      debit["recordnumber"] = numIndex + 1;
      debit["accsubject"] = detail[i].debit_subjects;
      debit["currency"] = bsdata.currency;
      debit["debit_original"] = detail[i].amount;
      debit["credit_original"] = "";
      debit["debit_org"] = detail[i].amount;
      debit["credit_org"] = "";
      debit["rate_org"] = 1;
      debit["ratetype"] = bsdata.ratetype;
      debit["quantity"] = 0;
      debit["secondorg"] = bsdata.pk_org;
      debit["clientauxiliary"] = debit_clientauxiliary;
      bodiesArr[numIndex] = debit;
      let credit_clientauxiliary = [
        {
          field: "vr2",
          value: detail[i].project
        },
        {
          field: "vr4",
          value: detail[i].supplier
        }
      ];
      let crebit = {};
      crebit["description"] = detail[i].description;
      crebit["recordnumber"] = numIndex + 2;
      crebit["accsubject"] = detail[i].credit_subjects;
      crebit["currency"] = bsdata.currency;
      crebit["debit_original"] = "";
      crebit["credit_original"] = detail[i].amount;
      crebit["debit_org"] = "";
      crebit["credit_org"] = detail[i].amount;
      crebit["rate_org"] = 1;
      crebit["ratetype"] = bsdata.ratetype;
      crebit["quantity"] = 0;
      crebit["secondorg"] = bsdata.pk_org;
      crebit["clientauxiliary"] = credit_clientauxiliary;
      bodiesArr[numIndex + 1] = crebit;
      numIndex = numIndex + 2;
    }
    let vo = {
      voucherVO: {
        pk_org: bsdata.pk_org,
        accbook: bsdata.accbook,
        period: bsdata.period,
        maker: bsdata.creator,
        maketime: new Date().getTime(),
        vouchertype: bsdata.vouchertype,
        srcsystemid: bsdata.srcsystemid,
        totaldebit_org: bsdata.totaldebit_org,
        totalcredit_org: bsdata.totalcredit_org,
        attachedbill: detail[0].settlementCount,
        bodies: bodiesArr
      },
      reqid: uuid(),
      businessid: bsdata.businessid
    };
    var voJson = JSON.stringify(vo);
    var strResponse = postman("post", url, null, voJson);
    return { voucherResp: strResponse, voJson };
  }
}
exports({ entryPoint: MyAPIHandler });