#dir-tree-creator

[![npm](https://img.shields.io/npm/v/dir-tree-creator.svg?maxAge=2592000?style=flat-square)](https://www.npmjs.com/package/dir-tree-creator)

dir-tree-creator is a tiny module that creates an npm like directory tree structure of the given path and returns the string representation of it.

####Install

Please use `npm install dir-tree-creator`.

####API

**dirtree(options, cb)**

 * `options` `{Object}`
  
  * `root` `{String}` *root path*
  * `label` `{String}` (optional) *label for the root node of the directory tree; if nothing specified, then the root path's basename will be used.*
  * `ignore` `{Array}` (optional) *an array of [anymatch](https://github.com/es128/anymatch) patterns to ignore. By default, `node_modules` and `.git` are ignored.*

 * `cb` `{Function}`

  * `err` `{Error | null}`
  * `dirtree` `{String}` String representation of the directory structure

```javascript
const dir_tree = require('dir-tree-creator');

var opts = {
  root: '/path/to/root/directory',
  label: 'your label',
  ignore: ['**/test', '**/test/**'] // ignore test dir and everything in it
};

dir_tree(opts, (er, tree) => {
  if (er) {
    console.error(er);
  } else {
    console.log(tree);
  }
});
```

#####Sample output
```
your label
├─┬ dir0
│ └── file0.js  
├─┬ dir1
│ ├─┬ dir2  
│ │ └── file2.js  
│ └── file1.md 
├── file-under-root.js
└── .gitignore  
```

