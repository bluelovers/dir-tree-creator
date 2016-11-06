'use strict';
const path = require('path');
const archy = require('archy');
const glob = require('glob');
const async = require('async');

function add_node_to_tree(tree, parent_dir, node_to_add) {
  if (parent_dir === tree.label) {
    tree.nodes.push({
      label: node_to_add,
      nodes: []
    });
  } else {
    tree.nodes.forEach((t_node) => {
      if (typeof t_node === 'object' && t_node.label === parent_dir) {
        t_node.nodes.push({
          label: node_to_add,
          nodes: []
        });
      } else if (typeof t_node === 'object' && t_node.label !== parent_dir) {
        add_node_to_tree(t_node, parent_dir, node_to_add);
      }
    });
  }
}

function dir_tree(opts, cb) {
  if (typeof opts !== 'object') {
    return cb(new TypeError(`'options' parameter must be of type object.`));
  }
  const def_ignore = ['{node_modules,.git}/**'];
  opts.label = opts.label ? opts.label : path.basename(opts.root);
  opts.ignore = (opts.ignore && Array.isArray(opts.ignore)) ? opts.ignore.concat(def_ignore) : def_ignore;
  glob('**/**', {absolute: true, ignore: opts.ignore}, (er, files) => {
    if (er) {
      return cb(er);
    } else {
      var tree = {
        label: opts.label,
        nodes: []
      };
      async.each(files, (f, callback) => {
        var parent_dir = path.parse(f).dir;
        if (parent_dir === opts.root) {
          add_node_to_tree(tree, opts.label, path.basename(f));
        } else {
          add_node_to_tree(tree, path.basename(parent_dir), path.basename(f));
        }
        return callback();
      }, (er) => {
        if (er) {
          return cb(er);
        } else {
          return cb(null, archy(tree).trim());
        }
      });
    }
  });
}

module.exports = dir_tree;
