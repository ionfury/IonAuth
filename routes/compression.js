const Solver = require('javascript-lp-solver');
const ESI = require('eve-swagger');
const data = require('../compression.json');

module.exports = function(app) {
  app.post('/compression', (req, res) => {
    //clone a copy of our compression data to modify
    compression=JSON.parse(JSON.stringify(data));
    var query = res.req.query;

    var tritanium, pyerite, mexallon, isogen, nocxium, zydrine, megacyte, refineRate;
    var useHighsec, useLowsec, useNullsec, useRaw;

    tritanium = validateInteger(query.tritanium);
    pyerite = validateInteger(query.pyerite);
    mexallon = validateInteger(query.mexallon);
    isogen = validateInteger(query.isogen);
    nocxium = validateInteger(query.nocxium);
    zydrine = validateInteger(query.zydrine);
    megacyte = validateInteger(query.megacyte);
    refineRate = validateNumber(query.refineRate);
    useHighsec = validateBoolean(query.useHigh);
    useLowsec = validateBoolean(query.useLow);
    useNullsec = validateBoolean(query.useNull);
    useRaw = validateBoolean(query.useRaw);

    ESI.types.prices()
    .then(prices => {
      for(var itemName in compression) {
        if((!useHighsec && compression[itemName].high) ||
           (!useLowsec  && compression[itemName].low)  ||
           (!useNullsec && compression[itemName].null) ||
           (!useRaw     && compression[itemName].raw)) {
          console.log(`deleting ${itemName}, ${useHighsec}, ${query.useHighsec}`)
          delete compression[itemName];
          continue;
        }
  
        var price = prices.find(price => price.type_id === compression[itemName].typeID);
        compression[itemName].price = price.average_price;
  
        compression[itemName].tritanium = Math.ceil(compression[itemName].tritanium *refineRate);
        compression[itemName].pyerite   = Math.ceil(compression[itemName].pyerite   *refineRate);
        compression[itemName].mexallon  = Math.ceil(compression[itemName].mexallon  *refineRate);
        compression[itemName].isogen    = Math.ceil(compression[itemName].isogen    *refineRate);
        compression[itemName].nocxium   = Math.ceil(compression[itemName].nocxium   *refineRate);
        compression[itemName].zydrine   = Math.ceil(compression[itemName].zydrine   *refineRate);
        compression[itemName].megacyte  = Math.ceil(compression[itemName].megacyte  *refineRate);
      }
      
      return compression;
    })
    .then(variables => {
      model = {
        "optimize": "price",
        "opType": "min",
        "constraints": {
          "tritanium": {"min": tritanium},
          "pyerite": {"min": pyerite},
          "mexallon": {"min": mexallon},
          "isogen": {"min": isogen},
          "nocxium": {"min": nocxium},
          "zydrine": {"min": zydrine},
          "megacyte": {"min": megacyte}
        },
        "variables": variables
      };
  
      return Solver.Solve(model);
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
  });
}

function validateNumber(num) {
  if(!num)
    return 0;
  else if(!isNaN(parseFloat(num)) && isFinite(num))
    return num;
  else return 0;
}

function validateBoolean(bool) {
  var num = validateNumber(bool);
  if(num == 1)
    return 1;
  else return 0;
}

function validateInteger(num) {
  if(!num)
    return 0;
  else if(Number.isInteger(parseInt(num)))
    return parseInt(num);
  else return 0;
}