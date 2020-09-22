const http = require('http')
const { hostname } = require('os')

const requestListener = function (req, res) {
  var data = ''
  req.on('data', function(chunk) {
    data += chunk
  });
  req.on('end', function() {
    data = JSON.parse(data)
    if(!valid(data)) {
      res.writeHead(500)
      res.end(JSON.stringify(
        {
          status: "fail",
          message: "Incorrect data"
        }
      ))
    } else {
      let [hostname, path] = data['url'].split('.com/'); //todo
      hostname += '.com'
      
      if(data['data'].lenght != 0) {
        path += '?' + parseGetUrl(data['data'])
      }

      let port = 80;
      let portSeparaotrPosition = hostname.indexOf(':', 5); 
      if(portSeparaotrPosition >= 0) {
        port = hostname.substring(portSeparaotrPosition);
      }
      let options = {
        hostname: hostname,
        port: port,
        path: path,
        method: data['method'],
        headers: data['headers']
      }

      let receivedData = '';
      const proxyRequest = http.request(options, destResponse => {
        console.log(`statusCode: ${destResponse.statusCode}`)
      
        destResponse.on('data', d => {
          receivedData = d
          res.writeHead(200)
          res.end(receivedData)
        })
      })
      
      proxyRequest.on('error', error => {
        console.error(error)
      })
      
      proxyRequest.end()
      
    }
  });
}

const server = http.createServer(requestListener);
server.listen(8080);

function valid(data) {
  //todo: add validation
  return true;
}

function parseGetUrl(args) {
  let getParams = ''
  let paramsCount = Object.keys(args).length
  let index = 1
  for(let key in args) {
    getParams += key + '=' + args[key]
    if(index != paramsCount) getParams += '&'
    index++
  }
  return getParams
}