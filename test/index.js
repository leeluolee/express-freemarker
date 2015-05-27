var fmpp = require("../");
var path = require('path');


var render  = fmpp();

render( path.join(__dirname, 'template/index.ftl'), {
  flowers: [
    ["zhenghaibo", 'hello' ,100],
    ["zhenghaibo2", 'hello2' ,200]
  ]
}, function(err, content){
  if(err) return console.log(err)
  else console.log(content)
})