module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // 缩进  1tab = 2space
    'indent': [1, 2],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-tab': 0, // 屏蔽 eslint tab-space的警告
    'no-mixed-spaces-and-tabs': 0,
    'indent': ['off', 'tab'],
    'no-trailing-spaces': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
