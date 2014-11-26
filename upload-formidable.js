var formidable = require('formidable')
  , http = require('http')
  , util = require('util')
  , fs = require('fs')
  ;

http.createServer(function(req, res){
  if(!((req.url === "/upload") && (req.method === "POST"))){
    home(res);
  }else{
    upload(req, res);
  }
}).listen(3000);

function home(res){
    res.end("<html><body><form action='/upload' method='post' enctype='multipart/form-data'><input name='image' type='file'/><input type='submit'></form></body></html>");
}

function upload(req, res){
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    var image = files.image
      , image_upload_path = './upload/'
      , image_upload_name = image.name
      , image_upload_path_name = image_upload_path + image_upload_name
      ;

    if (fs.existsSync(image_upload_path)) {
      fs.rename(image.path, image_upload_path_name, function() {
        var msg = 'Imagem ' + image_upload_name + ' salva em: ' + image_upload_path;
        console.log(msg);
        res.end(msg);
      });
    }
    else {
      fs.mkdir(image_upload_path, function () {
        fs.rename(image.path, image_upload_path_name, function() {
          var msg = 'Imagem ' + image_upload_name + ' salva em: ' + image_upload_path;
          console.log(msg);
          res.end(msg);
        });
      });
    }
    // console.log(util.inspect({fields: fields, files: files}));
    // res.end(util.inspect({fields: fields, files: files}));
  });

}
