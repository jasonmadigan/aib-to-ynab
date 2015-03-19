#!/usr/bin/env node

var csv = require('fast-csv');
var fs = require('fs');
var _ = require('lodash');

var argv = require('yargs')
  .usage('Usage: aib-to-ynab --input=Transaction_Export.csv --output=Transaction_Export_CONVERTED.csv [--map=map.json]')
  .demand(['input', 'output'])
  .describe('map', 'Optional Payee and Category mapping file')
  .argv;

var map = (argv.map) ? JSON.parse(fs.readFileSync(argv.map, 'utf8')) : null;

function _match(description) {
  if (!map) return description;

  var value = null;
  var key = _.findKey(map, function(value, key) {
    return _.startsWith(description, key);
  });

  if (!key) {
    console.log('No Match', description);
    return null;
  }

  return map[key];
}

function mapCategory(description) {
  var match = _match(description);
  if (!match) return description;

  return match.category;
}

function mapPayee(description) {
  var match = _match(description);
  if (!match) return description;

  return match.payee;
}

csv
  .fromPath(argv.input, {
    headers: true,
    trim: true
  })
  .transform(function(obj) {
    return {
      "Date": obj["Posted Transactions Date"],
      "Payee": mapPayee(obj.Description),
      "Category": mapCategory(obj.Description),
      "Memo": "",
      "Outflow": obj["Debit Amount"],
      "Inflow": obj["Credit Amount"]
    };
  })
  .pipe(csv.createWriteStream({
    headers: true
  }))
  .pipe(fs.createWriteStream(argv.output, {
    encoding: "utf8"
  }));