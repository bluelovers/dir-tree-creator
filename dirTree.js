var fs = require('fs-extra');
var path = require('path');
var archy = require('archy');
  
function add_dir_to_tree(tree, parent_dir_to_find, dir_to_add) {
  var i;
  if (parent_dir_to_find === tree.label) {
    tree.nodes.push({
      label: dir_to_add,
      nodes: []
    });
  } else {
      for (i = 0; i < tree.nodes.length; i += 1) {
        if (typeof tree.nodes[i] === 'object' && tree.nodes[i].label === parent_dir_to_find) {
          tree.nodes[i].nodes.push({
            label: dir_to_add,
            nodes: []
          });
        } else if (typeof tree.nodes[i] === 'object' && tree.nodes[i].label !== parent_dir_to_find) {
            add_dir_to_tree(tree.nodes[i], parent_dir_to_find, dir_to_add);
        }
    }
  }
}

function add_file_to_tree(tree, parent_dir_to_find, file_to_add) {
  var i;
  if (parent_dir_to_find === tree.label) {
    tree.nodes.push(file_to_add);
  } else {
      for (i = 0; i < tree.nodes.length; i += 1) {
        if (typeof tree.nodes[i] === 'object' && tree.nodes[i].label === parent_dir_to_find) {
          tree.nodes[i].nodes.push(file_to_add);
        } else if (typeof tree.nodes[i] === 'object' && tree.nodes[i].label !== parent_dir_to_find) {
                add_file_to_tree(tree.nodes[i], parent_dir_to_find, file_to_add);
        }
      }
  }
}

module.exports = function(root_path, paths_to_ignore) {
  var root_label = 'root(' + root_path + ')';
  var dir_tree = {
    label: root_label,
    nodes: []
  };
  if (paths_to_ignore === undefined) {
    fs.walk(root_path).on('data', function(item) {
      if (item.stats.isDirectory() && item.path !== root_path) {
        parent_dir = path.parse(item.path).dir;
        if (parent_dir === root_path) {
          add_dir_to_tree(dir_tree, root_label, path.basename(item.path));
        } else {
            add_dir_to_tree(dir_tree, path.basename(parent_dir), path.basename(item.path));
        }
      } else if (!item.stats.isDirectory()) {
          parent_dir = path.parse(item.path).dir;
          if (parent_dir === root_path) {
            add_file_to_tree(dir_tree, root_label, path.basename(item.path));
          } else {
              add_file_to_tree(dir_tree, path.basename(parent_dir), path.basename(item.path));
          }
      }
    }).on('end', function() {
        console.log(archy(dir_tree));
    }); 
  } else {
      fs.walk(root_path).on('data', function(item) {
        if (item.stats.isDirectory() && item.path !== root_path && paths_to_ignore.indexOf(item.path) === -1) {
          parent_dir = path.parse(item.path).dir;
          if (parent_dir === root_path) {
            add_dir_to_tree(dir_tree, root_label, path.basename(item.path));
          } else {
              add_dir_to_tree(dir_tree, path.basename(parent_dir), path.basename(item.path));
          }  
        } else if (!item.stats.isDirectory() && paths_to_ignore.indexOf(item.path) === -1) {
            parent_dir = path.parse(item.path).dir;
            if (parent_dir === root_path) {
              add_file_to_tree(dir_tree, root_label, path.basename(item.path));
            } else {
                add_file_to_tree(dir_tree, path.basename(parent_dir), path.basename(item.path));
            }
        }
      }).on('end', function() {
          console.log(archy(dir_tree));
      }); 
  }
};


