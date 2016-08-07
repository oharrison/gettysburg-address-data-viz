var express = require('express');
var hyperquest = require('hyperquest');
var cheerio = require('cheerio');
var bl = require('bl');

var router = express.Router();

// GET Gettysburg Address json data
router.get('/address', function(req, res, next) {

  function processHtml(error, data) {
    if (error) return console.error(err);

    var $ = cheerio.load(data);
    var $gettysburgAddress = $('p');

    var words = $gettysburgAddress.text().match(/[\b\w\b]+/g);
    if (!words) return console.error("No words found.");

    var frequencies = { };
    words.forEach((word) => {
      word = word.toLowerCase();
      frequencies[word] ? frequencies[word] += 1 : frequencies[word] = 1;
    });

    var json = { frequencies: frequencies };
    res.json(json);
  }

  // Gettysburg Address URL
  var url = 'http://avalon.law.yale.edu/19th_century/gettyb.asp';

  hyperquest(url).pipe(bl(processHtml));
});

module.exports = router;
