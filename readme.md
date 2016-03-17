<p>dir-tree-creator is a node.js module that simply creates an npm like directory structure of provided root path and outputs it to the console. It also accepts an array of paths to ignore as an optional argument.</p>

<h5>install</h5>
  <p>use `npm install dir-tree-creator` to install the module. if you want to add it to your application dependencies, simply run `npm install --save dir-tree-creator`.</p>

<h5>usage</h5>
  `var dir_tree = require('dir-tree-creator');`  
  `var root = '/path/to/root';`  
  `var paths_to_ignore = ['/path1/to/ignore', '/path2/to/ignore'];`  
  `dir_tree(root);`  
  `dir_tree(root, paths_to_ignore);`
