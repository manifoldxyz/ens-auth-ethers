module.exports = {
  semi: true,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'always',
  overrides: [
    {
      files: '*.yml',
      options: { useTabs: true },
    },
  ],
};