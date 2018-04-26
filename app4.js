const axios = require('axios');
const RSI = require('technicalindicators').RSI;
const EMA = require('technicalindicators').EMA


// var inputRSI = {
//   // values: [127.75, 129.02, 132.75, 145.40, 148.98, 137.52, 147.38, 139.05, 137.23, 149.30, 162.45, 178.95, 200.35, 221.90, 243.23, 243.52, 286.42, 280.27, 277.35, 269.02, 263.23, 214.90],  
//   values: [1.36, 1.37, 1.34, 1.33, 1.31, 1.31, 1.31, 1.32, 1.30, 1.29, 1.30, 1.30, 1.29, 1.31, 1.31],
//   period: 14
// };
// var expectedResult = [
//   86.41, 86.43, 89.65, 86.50, 84.96, 80.54, 77.56, 58.06
// ];

// let rsi = RSI.calculate(inputRSI);

// console.log(inputRSI.values.length);
// console.log(expectedResult.length);
// console.log(rsi);



let api = 'https://api.coindesk.com/v1/bpi/historical/close.json;
let BTC = [];

const init = async () => {
  let res_50 = await axios.get(api+'?start=2018-03-06&end=2018-04-26');
  for (var key in res_50.data.bpi) {
    BTC.push(res.data.bpi[key]);
  }
  // let res = await axios.get(api+'?start=2018-04-06&end=2018-04-26');

  let inputRSI = {
    values: BTC,
    period: 14
  };

  let rsi = RSI.calculate(inputRSI);
  let ema = EMA.calculate(inputRSI);

  console.log(inputRSI.values.length);
  console.log(BTC.length);
  // console.log(rsi);
  console.log(ema);
  console.log('ema', ema[ema.length - 1]);
  console.log('RSI', rsi[rsi.length - 1]);
}

init();