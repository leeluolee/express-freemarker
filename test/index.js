var fmpp = require("../");
var path = require('path');


var render  = fmpp();

render( path.join(__dirname, 'template/index.ftl'), {
  name: 'zhenghaibo',
  flowers: [
    ["zhenghaibo", 'hello' ,100],
    ["zhenghaibo2", 'hello2' ,200]
  ]
}, function(err, content){
  console.log(content)
})