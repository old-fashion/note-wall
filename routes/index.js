
var util = require('util')
    , fs = require('fs');

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

var redis = require("redis"),
    rclient = redis.createClient();

rclient.on("error", function(err) {
  console.log("Error " + err);
});

function itemHtml(msg) {
  console.log("itemHtml");
}

//---------------------------------------------------------------------
// Board view functions
//---------------------------------------------------------------------

exports.wall = function(req, res) {
  total = 0;
  result = [];

  rclient.lrange("posts", 0, -1, function(err, replies) {
    replies.forEach(function(reply, i) {
      basename = reply.replace(/^.*\/|\.[^.]*$/g, '');

      if (reply.charAt(0) == '/') {
        result.push({type: "image", title: basename, msg: reply});
      } else {
        result.push({type: "text", title: 'memo', msg: reply});
      } 
      total += 1;
    });

    res.render('wall', {
      title: 'Hello',
      count: total,
      posts: result,
    })
  });
};

exports.mwall = function(req, res) {
  total = 0;
  result = [];

  rclient.lrange("mposts", 0, -1, function(err, replies) {
    replies.forEach(function(reply, i) {
      basename = reply.replace(/^.*\/|\.[^.]*$/g, '');

      if (reply.charAt(0) == '/') {
        result.unshift({type: "image", title: basename, msg: reply});
      } else {
        result.unshift({type: "text", title: 'memo', msg: reply});
      } 
      total += 1;
    });

    res.render('mwall', {
      title: 'Hello',
      count: total,
      posts: result,
    })
  });
};

//---------------------------------------------------------------------
// Message posting functions
//---------------------------------------------------------------------

exports.msg = function(req, res) {
  rclient.rpush("posts", req.body['msg'], function(err, status) {

    console.log("POST : " + req.body['msg']);
    
    var result = '<div class="note">' + req.body['msg'] + '</div>';

    res.send(result, { "Content-Type": "application/text" }, 200);
  });
};

//---------------------------------------------------------------------
// File uploading functions
//---------------------------------------------------------------------

exports.test = function(req, res) {
  res.render('test', { title: 'Upload Test' });
};

function _upload(file, list) {
  console.log('UPLOAD: ' + file.name);
  

  var kb = file.size / 1024 | 0;
  isImage = checkType(file);
  name = moveToPublic(file);
  console.log('->> isImage: ' + isImage);

  rclient.rpush(list, name, function(err, status) {
    console.log('POST : ' + name);
  });
 
  return {name: file.name, size: kb, isImage: isImage};
}

function upload(req, res, list) {
  console.log('-> upload was called\n\n');
  console.log('-> ' +  util.inspect(req.files));

  var images = [];
  var isImage = false;

  if (Array.isArray(req.files.imgs)) {
    req.files.imgs.forEach(function(image) {
      images.push(_upload(image, list));
    });
  } else {
    var image = req.files.imgs;
    images.push(_upload(image, list));
  }
  res.render('show', { title: 'show', images: images });
}

exports.upload = function(req, res) {
  upload(req, res, "posts");
}

exports.mupload = function(req, res) {
  upload(req, res, "mposts");
}

function checkType(file) {
  var isImage = false;
  
  console.log('->> image.type.indexOf : ' + file.type.indexOf('image'));
  if (file.type.indexOf('image') > -1){
    console.log('->>> req.files.img is img');
    isImage = true;
  } else {
    console.log('->>> req.files.img is not img');
    isImage = false;
  }
  return isImage;
}

function moveToPublic(file){
  var target_path = './public/uploaded/' + file.name;
  console.log('-> tmp_path: ' + file.path + ' -> ' + target_path);
  fs.rename(file.path, target_path, function(err){
    if (err) throw err;
    console.log('->> upload done');
  });
  return "/uploaded/" + image.name;
}

