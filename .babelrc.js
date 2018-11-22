'use strict'

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: '6.0.0' },
        useBuiltIns: 'usage',
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
  shouldPrintComment: comment => comment.includes('istanbul ignore'),
}
