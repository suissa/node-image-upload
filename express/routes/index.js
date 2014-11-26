var express = require('express')
  , fs = require('fs')
  , router = express.Router()
  ;

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', function (req, res, next) {
  // var image = req.files.image
  //   , image_upload_path_old = image.path
  //   , image_upload_path_new = './upload/'
  //   , image_upload_name = image.name
  //   , image_upload_path_name = image_upload_path_new + image_upload_name
  //   ;

  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename);

    //Path where image will be uploaded
    // fstream = fs.createWriteStream(__dirname + '/' + filename);
    // file.pipe(fstream);
    // fstream.on('close', function () {
    //     console.log("Upload Finished of " + filename);
    //     res.redirect('back');           //where to go next
    // });
  });
});

module.exports = router;
