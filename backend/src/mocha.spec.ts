// temporary code to have typescript recognize this file as a module
export { };

const expect = require('chai').expect;
const db = require('../db/db');

describe('Mocha', () => {

  before(async function () {
    this.timeout(15000);
    await db.initDb();
  });

  it('Should pass', () => {
    expect(true).to.eq(true);
  });

  it('Should fail', () => {
    expect(true).to.eq(false);
  });

});
