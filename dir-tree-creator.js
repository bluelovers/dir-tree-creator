'use strict'
const path = require('path')
const archy = require('archy')
const klaw = require('klaw')

function addNode (tree, par, node) {
  if (par === tree.label) {
    tree.nodes.push({
      label: node,
      nodes: []
    })
  } else {
    tree.nodes.forEach(n => {
      if (typeof n === 'object' && n.label === par) {
        n.nodes.push({
          label: node,
          nodes: []
        })
      } else if (typeof n === 'object' && n.label !== par) {
        addNode(n, par, node)
      }
    })
  }
}

function dirTree (root, label, cb) {
  if (typeof label === 'function') {
    cb = label
    label = path.basename(root)
  }
  const paths = []
  klaw(root).on('error', er => cb(er)).on('data', i => paths.push(i.path))
    .on('end', () => {
      const tree = {
        label: label,
        nodes: []
      }
      for (let i = 0; i < paths.length; i += 1) {
        const p = paths[i]
        const par = path.dirname(p)
        if (par === root) {
          addNode(tree, label, path.basename(p))
        } else {
          addNode(tree, path.basename(par), path.basename(p))
        }
      }
      return cb(null, archy(tree).trim())
    })
}

module.exports = dirTree
