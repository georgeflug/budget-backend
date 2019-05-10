module.exports = function(milliseconds) {
  return new Promise((res, rej) => {
    setTimeout(_ => {
      res();
    }, milliseconds);
  });
};
