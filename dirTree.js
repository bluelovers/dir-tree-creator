(function() {
  var fs = require('fs-extra');
  var path = require('path');
  var archy = require('archy');
  
  function add_node_to_tree(tree, parent_dir_to_find, node_to_add) {
    if (parent_dir_to_find === tree.label) {
      tree.nodes.push({
        label: node_to_add,
        nodes: []
      });
    } else {
        tree.nodes.forEach(function(t_node) {
          if (typeof t_node === 'object' && t_node.label === parent_dir_to_find) {
            t_node.nodes.push({
              label: node_to_add,
              nodes: []
            });
          } else if (typeof t_node === 'object' && t_node.label !== parent_dir_to_find) {
              add_node_to_tree(t_node, parent_dir_to_find, node_to_add);
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
        if (item.path !== root_path) {
          parent_dir = path.parse(item.path).dir;
          if (parent_dir === root_path) {
            add_node_to_tree(dir_tree, root_label, path.basename(item.path));
          } else {
              add_node_to_tree(dir_tree, path.basename(parent_dir), path.basename(item.path));
          }
        }
      }).on('end', function() {
          cb(archy(dir_tree));
      }); 
    } else if (paths_to_ignore !== undefined && paths_to_ignore !== null) {
        fs.walk(root_path).on('data', function(item) {
          if (item.path !== root_path && paths_to_ignore.indexOf(item.path) === -1) {
            parent_dir = path.parse(item.path).dir;
            if (parent_dir === root_path) {
              add_node_to_tree(dir_tree, root_label, path.basename(item.path));
            } else {
                add_node_to_tree(dir_tree, path.basename(parent_dir), path.basename(item.path));
            }  
          }
        }).on('end', function() {
            cb(archy(dir_tree));
        }); 
    }
  };
}());
