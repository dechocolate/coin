const RSI = require('technicalindicators').RSI;
const EMA = require('technicalindicators').EMA
const Upbit = require('./components/upbit');
const Bitfinex = require('./components/bitfinex');

setInterval(async _ => {
  // const chart = new Upbit('CRIX.UPBIT.KRW-BTC', 500);
  const chart = new Bitfinex('1D', 'tBTCUSD', 400);
  // const chart = new Bitfinex('1h', 'tBTCUSD', 400);
  let data = await chart.init();
  let input = {
    values: data,
    period: 14
  };

  // RSI
  let rsi = RSI.calculate(input);

  // EMA 21
  input.period = 21
  let ema_21 = EMA.calculate(input);

  // EMA 50
  input.period = 50
  let ema_50 = EMA.calculate(input);

  console.log(data[data.length - 1]);
  console.log('RSI', rsi[rsi.length - 1]);
  console.log('EMA 21', ema_21[ema_21.length - 1]);
  console.log('EMA 50', ema_50[ema_50.length - 1]);

}, 1000);
