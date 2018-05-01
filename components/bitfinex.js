const axios = require('axios');

const Bitfinex = class {
  constructor(time, code, count) {
    this._time = time;
    this._code = code;
    this._count = count;
  }
  async _ticks() {
    try {
      let arr = [];
      let res = await axios.get(`https://api.bitfinex.com/v2/candles/trade:${this._time}:${this._code}/hist?limit=${this._count}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }
  async _getPrice() {
    let arr = [];
    for (let val of await this._ticks()) {
      // [ MTS, OPEN, CLOSE, HIGH, LOW, VOLUME ], 
      arr.push(val[1]);
    }
    return arr.reverse();
  }
  // 트리거    
  async init() {
    return await this._getPrice();
  }
};
module.exports = Bitfinex;
