const http = require('http');
const fs = require('fs')
const LitJsSdk = require('lit-js-sdk')
const url = require('url')

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true)

  if (parsedUrl.pathname === '/verify') {
    const { jwt } = parsedUrl.query

    const { verified, header, payload } = LitJsSdk.verifyJwt({ jwt })

    if (payload.baseUrl !== "my-dynamic-content-server.com" || payload.orgId !== "" || payload.role !== "" || payload.extraData !== "") {
      res.statusCode = 401
      res.end()
      return false
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      verified,
      header,
      payload
    }))
    return
  }

  fs.readFile(__dirname + "/index.html", function (err, data) {
    if (err) {
      res.writeHead(404)
      res.end(JSON.stringify(err))
      return
    }
    res.writeHead(200)
    res.end(data)
  });

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
});