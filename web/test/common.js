global.chai = require('chai');
global.sinon = require('sinon');
global.sinonChai = require('sinon-chai');
global.chaiJq = require('chai-jq');
global.expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiJq);

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = (new JSDOM(''));

global.document = window.document;
global.$ = require('jquery')(window);

global.tinycolor = require('tinycolor2');

global.btoa = function (string) {
  return new Buffer(string).toString('base64');
};
