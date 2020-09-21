const http = require('http');

const requestListener = function (req, res) {
  var data = '';
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    data = JSON.parse(data);
    if(!valid(data)) {
      res.writeHead(500);
      res.end(JSON.stringify(
        {
          status: "fail",
          message: "Incorrect data"
        }
      ));
    } else {
      fetch();
    }
  });
}

const server = http.createServer(requestListener);
server.listen(8080);

function valid(data) {
  return false;
}