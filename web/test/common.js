global.chai = require('chai');
global.sinon = require('sinon');
global.sinonChai = require('sinon-chai');
global.chaiJq = require('chai-jq');
global.expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiJq);

global.jsdom = require('jsdom');
global.$ = require('jquery')(jsdom.jsdom().parentWindow);

global.tinycolor = require('tinycolor2');

global.btoa = function (string) {
  return new Buffer(string).toString('base64');
};
