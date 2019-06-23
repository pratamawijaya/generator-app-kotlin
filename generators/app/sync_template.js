const path = require('path');
const rimraf = require('rimraf');
const replace = require('replace');
const ncp = require('ncp').ncp;
const git = require('simple-git/promise');
const mv = require('mv');

const REPO = 'http://github.com/pratamawijaya/BaseKotlinAndroid';

const {replaceConfig, createReplacement} = require('./config/config');

const tempDir = path.join(__dirname, './tmp');
const appPath = 'basekotlinandroid';

console.log('Running… ');

rimraf.sync(tempDir);

git()
    .clone(REPO, tempDir)
    .then(function(){
        console.log('clear template and copy');
        return clearTemplate().then(() => checkOutAndCopy());
    })
    .catch((err) => console.error('failed: ', err));

    // .then(function () {
    //     console.log('clear template and copy');

    //     return clearTemplate().then(() => checkOutAndCopy());
    // })
    // .catch((err) => console.error('failed: ', err));

function clearTemplate() {
    console.log("clear template");
    return new Promise(resolve => {
        rimraf.sync(path.join(__dirname, `/templates/${appPath}/*`));
        rimraf.sync(path.join(__dirname, `/templates/${appPath}/.*`));
        resolve();
    });
}

function checkOutAndCopy() {
    console.log('Setting up code base…');

    replace({
        regex: 'com.pratamawijaya.basekotlin',
        replacement: '<%= appPackage %>',
        paths: [tempDir],
        recursive: true,
        silent: true
    });

    replaceConfig.forEach(config => {
        console.log('Replaceing ' + config.name);
        replace({
            regex: config.replace,
            replacement: createReplacement(config),
            paths: [tempDir],
            recursive: true,
            silent: true
        });
    });

    // maskDotFile(tempDir + '/.gitignore');
    // maskDotFile(tempDir + '/app/.gitignore');

    // rimraf.sync(path.join(__dirname, '/tmp/.git'));

    console.log(`Copying files to ./templates/${appPath}`);

    ncp.limit = 1600;
    ncp(tempDir, path.join(__dirname, `templates/${appPath}`), err => {
        if (err) {
            return console.error(err);
        }
        console.log('Copying complete!');
        rimraf.sync(tempDir);
    });
}

function maskDotFile(filePath) {
    const masked = filePath.replace('.', '');
    mv(filePath, masked, err => {
      if (err) {
        console.log('Mask dot file error:', err);
      } else {
        console.log('Successfully masked to ' + masked);
      }
    });
}