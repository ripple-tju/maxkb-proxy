var http = require('http'),
    httpProxy = require('http-proxy');
const fs = require('fs')
const path = require('path')
//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

const assetsPathname = path.join(__dirname, '/ui/assets');
//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
const REPLACING_ASSETS = {
    'default-0e36dbc5': {
        pathname: path.join(assetsPathname, 'default.jpg'),
        headers: {}
    },

    'MaxKB-logo-3d0615e0': {
        pathname: path.join(assetsPathname, 'MaxKB-logo-3d0615e0.svg'),
        headers: {
            'content-type': 'image/svg+xml'
        }
    },

    'index-4e5428fc': {
        pathname: path.join(assetsPathname, 'index-4e5428fc.js'),
        headers: {
            'content-type': 'text/javascript'
        }
    }
}
var server = http.createServer(function (req, res) {
    for (const keyword in REPLACING_ASSETS) {
        if (req.url.includes(keyword)) {
            const rs = REPLACING_ASSETS[keyword];

            res.setHeaders(new Headers(rs.headers))

            return fs.createReadStream(rs.pathname).pipe(res);
        }
    }
    // You can define here your custom logic to handle the request
    // and then proxy the request.
    proxy.web(req, res, { target: 'http://172.28.102.5:3005' });
});

console.log("listening on port 5050")
server.listen(5050);