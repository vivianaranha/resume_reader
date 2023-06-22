const express = require('express'),
      router  = express.Router(),
      parseIt = require('../utils/parseIt'),
      multer  = require('multer'),
      crypto  = require('crypto'),
      mime    = require('mime'),
      upload  = multer({
        storage: multer.diskStorage({
          destination: function (req, file, cb) {
            cb(null, './uploads/')
          },
          filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
              cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
            });
          }
        })
      });

var events = require('events');
var eventEmitter = new events.EventEmitter();

var fs = require('fs'),
    path = require('path');




/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Resume Translator'});
});


router.post('/', upload.single('upl'), async function (req, res, next) {
  console.log("success");
  console.log(req.file.path);

  var myEventHandler = function (fileName) {
    console.log('I hear a scream!');

    filePath = path.join('./compiled/'+fileName+'.json');

    console.log(filePath);

    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (!err) {
        console.log('received data: ' + data);
        res.json(JSON.parse(data));
      } else {
        console.log(err);
      }
    });



    
  }
  eventEmitter.on(req.file.path, myEventHandler);


  parseIt.parseResume(req.file.path, './compiled', eventEmitter);
  


  
});


module.exports = router;
