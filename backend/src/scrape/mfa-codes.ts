let fccuRes: any[] = [];
let fccuTimeouts: any[] = [];

function saveFccu(token) {
  fccuRes.forEach((res: any) => res(token));
  fccuRes = [];
  fccuTimeouts.forEach(timeout => clearTimeout(timeout));
  fccuTimeouts = [];
}

function getFccuToken() {
  return new Promise((res, rej) => {
    fccuRes.push(res);
    const timeout = setTimeout(() => {
      const resIndex = fccuRes.indexOf(res);
      if (resIndex != -1) {
        rej("Timeout exceeded waiting for Fccu Token");
        fccuRes.splice(resIndex, 1);
      }
    }, 15 * 60 * 1000);
    fccuTimeouts.push(timeout);
  });
}

module.exports = {
  saveFccu: saveFccu,
  getFccuToken: getFccuToken,
};
