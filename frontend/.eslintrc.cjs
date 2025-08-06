module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'eslint-config-prettier', // <-- Siempre al final
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 'off', // No es necesario con el nuevo JSX Transform
    'react/prop-types': 'off', // No es necesario cuando se usa TypeScript
  },
  settings: {
    react: {
      version: 'detect', // Detecta automáticamente la versión de React
    },
  },
};
