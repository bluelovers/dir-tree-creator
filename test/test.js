'use strict'
const assert = require('assert')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const dirTree = require('../dir-tree-creator.js')

describe('dir-tree-creator', () => {
  const testDir = path.join(os.tmpdir(), 'dir-tree-creator')
  beforeEach(done => fs.emptyDir(testDir, done))

  it('should return string representation of dir tree structure - default label', done => {
    fs.ensureFileSync(path.join(testDir, 'dir1', 'f1'))
    fs.ensureFileSync(path.join(testDir, 'dir2', 'dir22', 'f2'))
    fs.ensureFileSync(path.join(testDir, 'dir2', 'dir22', 'f3'))
    fs.ensureFileSync(path.join(testDir, 'dir3', 'dir33', 'dir333', 'f4'))

    const wanted = `dir-tree-creator
├─┬ dir1
│ └── f1
├─┬ dir2
│ └─┬ dir22
│   ├── f2
│   └── f3
└─┬ dir3
  └─┬ dir33
    └─┬ dir333
      └── f4`

    dirTree(testDir, (er, tr) => {
      if (er) assert.ifError(er)
      assert.strictEqual(tr, wanted)
      done()
    })
  })

  it('should return string representation of dir tree structure - custom label', done => {
    fs.ensureFileSync(path.join(testDir, 'dir1', 'f1'))
    fs.ensureFileSync(path.join(testDir, 'dir2', 'dir22', 'f2'))
    fs.ensureFileSync(path.join(testDir, 'dir2', 'dir22', 'f3'))
    fs.ensureFileSync(path.join(testDir, 'dir3', 'dir33', 'dir333', 'f4'))

    const wanted = `custom-label
├─┬ dir1
│ └── f1
├─┬ dir2
│ └─┬ dir22
│   ├── f2
│   └── f3
└─┬ dir3
  └─┬ dir33
    └─┬ dir333
      └── f4`

    dirTree(testDir, { label: 'custom-label' }, (er, tr) => {
      if (er) assert.ifError(er)
      assert.strictEqual(tr, wanted)
      done()
    })
  })

  // TODO: Rewrite test to also work on Windows systems. For now it doesn't
  // run if testing on Windows.
  if (process.platform !== 'win32') {
    it('should return string representation of dir tree structure - no hidden files', done => {
      fs.ensureFileSync(path.join(testDir, 'dir1', 'f1'))
      fs.ensureFileSync(path.join(testDir, 'dir2', 'dir22', 'f2'))
      fs.ensureFileSync(path.join(testDir, 'dir2', 'dir22', 'f3'))
      fs.ensureFileSync(path.join(testDir, 'dir3', 'dir33', 'dir333', 'f4'))
      fs.ensureFileSync(path.join(testDir, '.dir4', 'f5'))
      fs.ensureFileSync(path.join(testDir, '.dir5', '.f6'))
      fs.ensureFileSync(path.join(testDir, 'dir6', '.f7'))
      fs.ensureFileSync(path.join(testDir, 'dir6', 'f8'))
      fs.ensureFileSync(path.join(testDir, 'dir7', '.dir77', 'f9'))

      const wanted = `dir-tree-creator
├─┬ dir1
│ └── f1
├─┬ dir2
│ └─┬ dir22
│   ├── f2
│   └── f3
├─┬ dir3
│ └─┬ dir33
│   └─┬ dir333
│     └── f4
├─┬ dir6
│ └── f8
└── dir7`

      dirTree(testDir, { hidden: false }, (er, tr) => {
        if (er) assert.ifError(er)
        assert.strictEqual(tr, wanted)
        done()
      })
    })
  }
})
