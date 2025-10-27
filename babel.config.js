module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: '12'
      }
    }],
    '@babel/preset-typescript'
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', {
          targets: {
            node: 'current'
          }
        }],
        '@babel/preset-typescript'
      ]
    }
  }
};