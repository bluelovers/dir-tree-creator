<p>dir-tree-creator is a node.js module that simply creates an npm like directory tree structure of the given path and returns the string representation of it. It also accepts an array of paths to ignore as an optional argument.</p>

<h5>Install</h5>
  <p>use `npm install dir-tree-creator` to install the module. if you want to add it to your application dependencies, simply run `npm install --save dir-tree-creator`.</p>

<h5>Function Signature</h5>
```javascript
var dir_tree = require('dir-tree-creator');
dir_tree(root_path, root_label, paths_to_ignore, callback)
```
root_path: path to root directory [type: string]  
root_label: label for the root node of the directory tree [type: string]  
paths_to_ignore: list of paths to ignore [type: array]  
callback function: it takes one argument, the final tree and returns the string representation of it [type: function]
	
<h5>Usage</h5>
  <p>As of version 0.0.2, the function header changed. In the new version, the function takes 4 arguments. First argument is the root path. Second argument is the root label. The third argument is the optional array of paths to ignore. If there is no path to ignore, we set that to `null`. Finally, the fourth argument is the callback function that contains the string representation of the final directory tree. The string representation can be outputted to the console, or written to a file or whatever else we want to do with it.</p>

<h5>Examples</h5>

<h6>exp1: output to the console with nothing to ignore</h6>
```javascript
var dir_tree = require('dir-tree-creator');
var root_path = '/path/to/root/directory';
dir_tree(root_path, 'my root label', null, function(final_dir_tree) {
  console.log(final_dir_tree);
});
```	
<h6>exp1 result:</h6>
```
my root label  
├─┬ dir1  
│ └── file1.js  
├─┬ dir2  
│ ├─┬ dir3  
│ │ └── file3.js  
│ └── file2.js 
├── file1-under-root.js  
└── file2-under-root.js  
```	
<h6>exp2: output to the console with paths to ignore</h6>
```javascript
var dir_tree = require('dir-tree-creator');
var root_path = '/path/to/root/directory';
var paths_to_ignore = ['/path1/to/ignore', '/path2/to/ignore'];
dir_tree(root_path, 'my root label', paths_to_ignore, function(final_dir_tree) {
  console.log(final_dir_tree);
});
```
<h6>exp2 result (excluded dir1 as an example):</h6>
```javascript
my root label  
├─┬ dir2 
│ ├─┬ dir3
│ │ └── file3.js  
│ └── file2.js 
├── file1-under-root.js  
└── file2-under-root.js  
```
<h6>exp3: write to a file</h6>
```javascript
var fs = require('fs');
var dir_tree = require('dir-tree-creator');
var root_path = '/path/to/root/directory';
dir_tree(root_path, 'my root label', null, function(final_dir_tree) {
  fs.writeFile('/dir-tree-structure.txt', final_dir_tree, 'utf8', function(err) {
    if (err) throw err;
    console.log('dir tree structure saved successfully');
  });
});
```
