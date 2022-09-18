const http = require('http');
const url = require('url');
const query = require('querystring');

const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// our url 'dictionary' for matching url to function
const urlStruct = {
  '/': responseHandler.getIndex,
  '/client.html': responseHandler.getIndex,
  '/style.css': responseHandler.getCSS,
  '/success': responseHandler.success,
  '/badRequest': responseHandler.badRequest,
  '/unauthorized': responseHandler.unauthorized,
  '/forbidden': responseHandler.forbidden,
  '/internal': responseHandler.internal,
  '/notImplemented': responseHandler.notImplemented,
  notFound: responseHandler.notFound,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  // Ex. most to least preferable type: application/json,text/xml,text/plain
  const acceptedTypes = request.headers.accept ? request.headers.accept.split(',') : 'application/json';
  const params = query.parse(parsedUrl.query);

  //   if (!acceptedTypes) {
  //     acceptedTypes = 'application/json';
  //   }
  console.log(parsedUrl);
  console.log(acceptedTypes);

  const handlerFunction = urlStruct[parsedUrl.pathname];
  if (handlerFunction) {
    handlerFunction(request, response, acceptedTypes, params);
  } else {
    urlStruct.notFound(request, response, acceptedTypes);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
