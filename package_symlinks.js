// ***
// NOTE: MUST RUN THIS IN "node_modules", OTHERWISE, SYMLINKS WILL NOT WORK !!!
//
// - "$ yarn" command will run this automatically. (package.json - postinstall)
// - This script creates symlinks (e.g. "src/api" to "node_modules/api")
//   so we can do this from anywhere: require("api/utils/Utils") without using ".." paths.
// ***

/* eslint-disable */
const fs = require('fs');
// const execSync = require('child_process').execSync;

const arr = ['api', 'config', ]; // symlinks

const path = [
  {
    target : 'api/controllers',
    alias  : "@controllers"
  },
  {
    target : 'api/models',
    alias  : '@models'
  },
  {
    target : 'api/routes/v1',
    alias  : '@routes'
  },
  {
    target : 'api/validations',
    alias  : '@validations'
  },
  {
    target : 'api/helper',
    alias  : '@helper'
  }
]

for (let i = 0; i < path.length; i += 1) {
  const srcpath = '../src/' + path[i]['target'];
  const dstpath = path[i]['alias'];

  try {
    fs.symlinkSync(srcpath, dstpath, 'dir');
  } catch (ex) {
    console.log(ex)
  }
}
