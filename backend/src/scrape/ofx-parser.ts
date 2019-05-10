function parseToJson(rawOfxData) {
  var ofxData = ofx.parse(rawOfxData);
  var transactions = ofxData.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.BANKTRANLIST.STMTTRN;
  return transactions.map((t) => {
    return {
      datePosted: t.DTPOSTED,
      transactionType: t.TRNTYPE,
      amount: t.TRNAMT,
      fitId: t.FITID,
      name: t.NAME
    };
  });
}

module.exports = {
  parseToJson: parseToJson
};
