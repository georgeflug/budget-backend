module.exports = function (milliseconds) {
  return new Promise((res) => {
    setTimeout(_ => {
      res();
    }, milliseconds);
  });
};
