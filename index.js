// libs/fmpp/bin/fmpp  test/template/index.ftl -D "tdd(../data.json)" -o test/index.html
var spawn = require("child_process").spawn;
var mkdirp = require("mkdirp");
var path = require("path");
var fs = require("fs");


var path2fmpp = path.join( __dirname, "./libs/bin/fmpp" +(process.platform==='win32'?'.bat':'') );


module.exports = function( options){
  options = options || {};
  var staticTmp = options.tmp;

  return function render( filename, data, callback ){

    var sourceRoot = data.settings.views;
    //clean the data
    delete data.settings;
    delete data._locals;
    delete data.cache;

    var data = JSON.stringify(data);
    var dirname = staticTmp || path.dirname(filename);
    var rdname = randomname(), tname;

    // dataname = randomname() + ".json";
    var tname = path.join(dirname, randomname() + ".html") ;


    // writeFile( path.join(basedir, dataname), data, function(err){
    //   if(err) throw err
      // if data is too long
      // args = [filename, "-D", "tdd(" + path.join( basedir, dataname) + ")", "-o", path.join(basedir, tname)];
    var args = [filename, "-D", data, "-o", tname ,"-S", sourceRoot  ];
    var fmpp = spawn(path2fmpp, args, {})

    var errorMsg = "";
    fmpp.stderr.on('data', function (data) {
      // console.log(data.toString(), 'error')
      // callback(data.toString())
    });
    // @TODO FIX.
    fmpp.stdout.on('data', function (data) {
      errorMsg += data.toString();
      // callback(data.toString())
    });

    fmpp.on('close', function (code) {
      if(~errorMsg.indexOf(">>> ABORTED! <<<") || code !== 0){
        var isError = true;
        callback(errorMsg || "uncatched freemarker parse Error occurs in " + filename)
      }
      fs.exists(tname, function(flag){
        if(isError) return fs.unlink(tname, function(){});
        fs.readFile(tname, 'utf8', function(err, content){
          callback(err, content);
          fs.unlink(tname, function(){});
        })
      })
    });

  }
}




function randomname(){
  return "tmp" + (+new Date);
}


function writeFile(fullpath, data, callback){
    function write(cb){
        fs.writeFile(fullpath, data, cb)
    }
    write(function(error){
        if(!error) return callback(null, fullpath, data);
        mkdirp(path.dirname(fullpath), 0755, function(error){
            if(error) return callback(error);
            write(function(error){
                callback(error, fullpath, data)
            })
        })
    })
}