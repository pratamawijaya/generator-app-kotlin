const path = require('path');
const rimraf = require('rimraf');
const replace = require('replace');
const ncp = require('ncp').ncp;
const nodegit = require('nodegit');
const clone = nodegit.Clone;
const mv = require('mv');

const {replaceConfig, createReplacement} = require('./config/replace');