const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const respond = (request, response, statusCode, content, type) => {
  response.writeHead(statusCode, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const xmlResponse = (resText) => {
  let responseXML = '<response>';
  responseXML += `<message>${resText.message}</message>`;
  if (resText.id) {
    responseXML += `<id>${resText.id}</id>`;
  }
  responseXML += '</response>';
  return responseXML;
};

const getIndex = (request, response) => {
  respond(request, response, 200, index, 'text/html');
};

const getCSS = (request, response) => {
  respond(request, response, 200, css, 'text/css');
};

const success = (request, response, acceptedTypes) => {
  const resText = {
    message: 'This is a successful response',
  };
  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = xmlResponse(resText);
    return respond(request, response, 200, responseXML, 'text/xml');
  }

  const resTextString = JSON.stringify(resText);
  return respond(request, response, 200, resTextString, 'application/json');
};

const badRequest = (request, response, acceptedTypes, params) => {
  const resText = {
    message: 'Missing valid query parameter to set to true',
  };

  // if the request does not contain a valid=true query parameter
  if (!params.valid || params.valid !== 'true') {
    resText.id = 'badRequest';
    if (acceptedTypes[0] === 'text/xml') {
      const responseXML = xmlResponse(resText);
      return respond(request, response, 400, responseXML, 'text/xml');
    }

    const resTextString = JSON.stringify(resText);
    return respond(request, response, 400, resTextString, 'application/json');
  }

  resText.message = 'This request has the required parameters';

  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = xmlResponse(resText);
    return respond(request, response, 200, responseXML, 'text/xml');
  }

  const resTextString = JSON.stringify(resText);
  return respond(request, response, 200, resTextString, 'application/json');
};

const unauthorized = (request, response, acceptedTypes, params) => {
  const resText = {
    message: 'Missing loggedIn query parameter to set to yes',
  };

  // if the request does not contain a valid=true query parameter
  if (!params.loggedIn || params.loggedIn !== 'yes') {
    resText.id = 'unauthorized';
    if (acceptedTypes[0] === 'text/xml') {
      const responseXML = xmlResponse(resText);
      return respond(request, response, 401, responseXML, 'text/xml');
    }

    const resTextString = JSON.stringify(resText);
    return respond(request, response, 401, resTextString, 'application/json');
  }

  resText.message = 'You have successfully viewed the content';

  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = xmlResponse(resText);
    return respond(request, response, 200, responseXML, 'text/xml');
  }

  const resTextString = JSON.stringify(resText);
  return respond(request, response, 200, resTextString, 'application/json');
};

const forbidden = (request, response, acceptedTypes) => {
  const resText = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };
  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = xmlResponse(resText);
    return respond(request, response, 403, responseXML, 'text/xml');
  }

  const resTextString = JSON.stringify(resText);
  return respond(request, response, 403, resTextString, 'application/json');
};

const internal = (request, response, acceptedTypes) => {
  const resText = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };
  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = xmlResponse(resText);
    return respond(request, response, 500, responseXML, 'text/xml');
  }

  const resTextString = JSON.stringify(resText);
  return respond(request, response, 500, resTextString, 'application/json');
};

const notImplemented = (request, response, acceptedTypes) => {
  const resText = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };
  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = xmlResponse(resText);
    return respond(request, response, 501, responseXML, 'text/xml');
  }

  const resTextString = JSON.stringify(resText);
  return respond(request, response, 501, resTextString, 'application/json');
};

const notFound = (request, response, acceptedTypes) => {
  const resText = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };
  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = xmlResponse(resText);
    return respond(request, response, 404, responseXML, 'text/xml');
  }

  const resTextString = JSON.stringify(resText);
  return respond(request, response, 404, resTextString, 'application/json');
};

module.exports = {
  getIndex,
  getCSS,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
