dir-tree-creator
================

[![npm](https://img.shields.io/npm/v/dir-tree-creator.svg?maxAge=2592000?style=flat-square)](https://www.npmjs.com/package/dir-tree-creator)

[Node.js](https://nodejs.org) module that creates an npm like directory tree structure of the given root path and returns the string representation of it.

Install
-------

`npm i dir-tree-creator`

Usage
-----

**dirtree(dir[, label], cb)**

- `dir` `<String>` root directory path
- `label` `<String>` *(optional)* label for the root node of the directory tree; if nothing specified, the root path's basename will be used.
- `cb` `<Function>`
  - `err` `<Error | null>`
  - `dirtree` `<String>` string representation of the directory structure

Example
-------

```js
const dirTree = require('dir-tree-creator')

dirTree('some/dir', (err, tr) => {
  if (err) return console.error(err)
  console.log(tr)
})
```

```js
const dirTree = require('dir-tree-creator')

dirTree('some/dir', 'custom label', (err, tr) => {
  if (err) return console.error(err)
  console.log(tr)
})
```

Sample output
-------------

```
custom label
├─┬ dir0
│ └── file0.js  
├─┬ dir1
│ ├─┬ dir2  
│ │ └── file2.js  
│ └── file1.md 
├── file-under-root.js
└── .gitignore  
```

