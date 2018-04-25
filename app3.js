var express = require('express');
var app = express();

var Promise = require('promise');
var request = require('request');
var nodemailer = require('nodemailer');
var axios = require('axios');

const url_upbit = "https://crix-api-cdn.upbit.com/v1/crix/marketcap?currency=KRW"
const url_coinmarketcap = "https://api.coinmarketcap.com/v1/ticker?limit=1000"
const url_bittrex = "https://bittrex.com/api/v1.1/public/getmarkets"
let arr_upbit = [];
let arr_coinmarketcap = [];
let arr_bittrex = []; 
let arr_target = [];
let arr_res = [];

const flatMapReducer = (accumulator, value, index, array) => {
  arr_upbit.forEach(val => {
    if (accumulator.indexOf(val) === -1) {
      console.log(val);
      accumulator.push(val);
    }
  });
  return accumulator;
};

const init = async () => {
  let res_upbit = await axios.get(url_upbit);
  let res_coinmarketcap = await axios.get(url_coinmarketcap);
  let res_bittrex = await axios.get(url_bittrex);
  
  for (coin of res_upbit.data) {
    arr_upbit.push(coin.symbol);
  }
  for (coin of res_coinmarketcap.data) {
    arr_coinmarketcap.push(coin.symbol);
  }
  for (coin of res_bittrex.data.result) {
    arr_bittrex.push(coin.MarketCurrency);
  }
  for (coin of arr_bittrex) {
    if (arr_upbit.indexOf(coin) === -1) {
      arr_target.push(coin);
    }
  }
  
  console.log('upbit', arr_upbit.length);
  console.log('coinmarketcap', arr_coinmarketcap.length);
  console.log('arr_bittrex', arr_bittrex.length);  
  console.log('arr_target', arr_target.length);  
  
  for (coin of arr_target) {
    try {
      let res = await axios.get(`https://static.upbit.com/logos/${coin}.png`);
      if(res.status === 200){
        arr_res.push(coin);
      }          
    } catch (err) {
      continue;
    }    
  }

  console.log('arr_res', arr_res.length);
  console.log('arr_res', arr_res);
}

init();