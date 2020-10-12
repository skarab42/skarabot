'use strict'

const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const rimraf = promisify(require('rimraf'))

module.exports = function({ targets = [], silent = true } = {}) {
  return {
    name: 'cleaner',
    async buildStart(options) {
      for (const targetPath of targets) {
        const normalisedPath = path.normalize(targetPath)
        if (fs.existsSync(normalisedPath)) {
          if (!silent) {
            console.log(`cleaning path: ${normalisedPath}`)
          }
          await rimraf(normalisedPath)
        }
      }
    },
  }
}
