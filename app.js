
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.limit('100mb'));
  app.use(express.bodyParser({uploadDir: __dirname + '/tmp'}));
  app.use(express.methodOverride());
  app.use(express.favicon());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/wall', routes.wall);
app.get('/mwall', routes.mwall);
app.post('/msg', routes.msg);

app.get('/test', routes.test);
app.post('/upload', routes.upload);
app.post('/mupload', routes.mupload);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
