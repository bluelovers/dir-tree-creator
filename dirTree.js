(function() {
  var fs = require('fs-extra');
  var path = require('path');
  var archy = require('archy');
  
  function add_dir_to_tree(tree, parent_dir_to_find, dir_to_add) {
    if (parent_dir_to_find === tree.label) {
      tree.nodes.push({
        label: dir_to_add,
        nodes: []
      });
    } else {
        tree.nodes.forEach(function(t_node) {
          if (typeof t_node === 'object' && t_node.label === parent_dir_to_find) {
            t_node.nodes.push({
              label: dir_to_add,
              nodes: []
            });
          } else if (typeof t_node === 'object' && t_node.label !== parent_dir_to_find) {
              add_dir_to_tree(t_node, parent_dir_to_find, dir_to_add);
          }
        });
    }
  }

  function add_file_to_tree(tree, parent_dir_to_find, file_to_add) {
    if (parent_dir_to_find === tree.label) {
      tree.nodes.push(file_to_add);
    } else {
        tree.nodes.forEach(function(t_node) {
          if (typeof t_node === 'object' && t_node.label === parent_dir_to_find) {
            t_node.nodes.push(file_to_add);
          } else if (typeof t_node === 'object' && t_node.label !== parent_dir_to_find) {
              add_file_to_tree(t_node, parent_dir_to_find, file_to_add);
          }
        });
    }
  }

  module.exports = function(root_path, root_label, paths_to_ignore, cb) {
    var dir_tree = {
      label: root_label,
      nodes: []
    };
    if (paths_to_ignore === undefined || paths_to_ignore === null) {
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
          cb(archy(dir_tree));
      }); 
    } else if (paths_to_ignore !== undefined && paths_to_ignore !== null) {
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
            cb(archy(dir_tree));
        }); 
    }
  };
}());
