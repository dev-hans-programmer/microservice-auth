import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    ignores: ['eslint.config.mjs', 'node_modules', 'dist', 'jest.config.js'],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          defaultProject: './tsconfig.json',
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-console': 'error',
      'dot-notation': 'warn',
      'func-style': ['error', 'expression'],

      // Prefer arrow callbacks everywhere (for promises, map, filter, etc.)
      'prefer-arrow-callback': ['error'],

      // Enforce concise arrow bodies when possible
      'arrow-body-style': ['error', 'as-needed'],

      // Optional: disallow `var` to keep things modern
      'no-var': 'error',

      // Optional: prefer `const` when variables are not reassigned
      'prefer-const': 'error',
    },
  },
);
