'use strict';
var path = require('path');
var archy = require('archy');
const klaw = require('klaw');
const thru = require('through2');
const match = require('anymatch');

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

function dir_tree(opts, cb) {
  const def_ignore = ['**/node_modules', '**/node_modules/**', '**/.git', '**/.git/**'];
  opts.label = opts.label ? opts.label : path.basename(opts.root);
  opts.ignore = (opts.ignore && Array.isArray(opts.ignore) && opts.ignore.length > 0) ? opts.ignore.concat(def_ignore) : def_ignore;
  var filter = thru.obj(function(item, enc, next) {
    if (!match(opts.ignore, item.path)) this.push(item);
    next();
  });

  var tree = {
    label: opts.label,
    nodes: []
  };
  klaw(opts.root).pipe(filter).on('error', (er) => {
    return cb(er);
  }).on('data', (item) => {
    var parent_dir;
    if (item.path !== opts.root) {
      parent_dir = path.parse(item.path).dir;
      if (parent_dir === opts.root) {
        add_node_to_tree(tree, opts.label, path.basename(item.path));
      } else {
        add_node_to_tree(tree, path.basename(parent_dir), path.basename(item.path));
      }
    }
  }).on('end', () => {
    return cb(null, archy(tree));
  });
}

module.exports = dir_tree;
