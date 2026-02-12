import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
  },
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettier,
  {
    ignores: ['eslint.config.ts'],
  },
  {
    files: ['src/**/*.{ts,mts,cts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Code formatting
      'prettier/prettier': 'error',
      'capitalized-comments': ['error', 'always'],

      // Consistent Arrow Functions
      'func-style': ['error', 'expression'],
      'prefer-arrow-callback': 'error',

      // No Unused Variables
      '@typescript-eslint/no-unused-vars': 'error',

      // Strict Equality (=== and !==)
      eqeqeq: ['error', 'always'],

      // Async/Await Consistency
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',

      // Naming Conventions (camelCase/PascalCase)
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
        { selector: 'function', format: ['camelCase'] },
        { selector: 'typeLike', format: ['PascalCase'] },
      ],
    },
  },
]);
