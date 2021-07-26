const config = require("config");
var rclient = require('../redis');
var request = require('request');

exports.refresh_exchange_price = async(req,res)=>{

    var endpoint = 'live'
    var access_key = config.get('currency_token');
  
    request({
      uri: 'http://apilayer.net/api/' + endpoint + '?access_key=' + access_key+"&currencies=MXN,CAD,USD",
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
    }, async function (err, re, body) {
  
      if (err) {
        console.log(err);
      }
  
      try {
        await rclient.set('currencies', re.body);

      } catch(err) {
        console.log(err); // TypeError: failed to fetch
      }
  
      res.send({'currencies': JSON.parse(re.body)});
  
    });
  
}