const axios = require('axios');

const Upbit = class {
  constructor(code, count) {    
    this._code = code;
    this._count = count;
  }
  async _ticks() {
    try {
      let arr = [];
      let now = new Date().toISOString();      
      let res = await axios.get(`http://crix-api-cdn.upbit.com/v1/crix/candles/minutes/60?code=${this._code}&count=${this._count}&to=${now}`);
      console.log(res.data[0]);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }
  async _getPrice() {
    let arr = [];
    for (let val of await this._ticks()) {
      // [ MTS, OPEN, CLOSE, HIGH, LOW, VOLUME ], 
      arr.push(val.openingPrice);
    }
    return arr;
  }
  // 트리거    
  async init() {
    return await this._getPrice();
  }
};
module.exports = Upbit;
