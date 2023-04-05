const rootConfig = require('../../.eslintrc.cjs');

module.exports = {
  ...rootConfig,
  root: true,
  plugins: [
    ...(rootConfig.plugins ?? []),
    'svelte3',
  ],
  overrides: [
    ...(rootConfig.overrides ?? []),
    { files: ['*.svelte'], processor: 'svelte3/svelte3' },
  ],
  settings: {
    ...(rootConfig.settings ?? []),
    'svelte3/typescript': () => require('typescript'),
  },
};
