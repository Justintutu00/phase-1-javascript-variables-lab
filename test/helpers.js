const chai = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const babel = require('@babel/core');

global.expect = chai.expect;

const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf-8');

// Transform JavaScript using Babel
const babelResult = babel.transformFileSync(
  path.resolve(__dirname, '..', 'index.js'),
  { presets: ['@babel/preset-env'] }
);

// Create a JSDOM environment
const dom = new JSDOM(html, { runScripts: 'dangerously' });
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Inject transformed JavaScript into the JSDOM environment
const scriptEl = document.createElement('script');
scriptEl.textContent = babelResult.code;
document.body.appendChild(scriptEl);

// Expose necessary variables to global scope for tests
global.companyName = dom.window.companyName;
global.mostProfitableNeighborhood = dom.window.mostProfitableNeighborhood;
global.companyCeo = dom.window.companyCeo;
