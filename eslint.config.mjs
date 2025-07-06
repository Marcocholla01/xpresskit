// eslint.config.js
// import bunPlugin from 'eslint-plugin-bun'; // ✅ fix: this was missing
import importPlugin from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-node';
import prettierPlugin from 'eslint-plugin-prettier';
import prismaPlugin from 'eslint-plugin-prisma';
import promisePlugin from 'eslint-plugin-promise';
import vitestPlugin from 'eslint-plugin-vitest';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        console: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin,
      import: importPlugin,
      promise: promisePlugin,
      node: nodePlugin,
      vitest: vitestPlugin,
      prisma: prismaPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-param-reassign': ['error', { props: true }],
      'node/no-unsupported-features/es-syntax': 'off',
      'node/no-missing-import': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // ✅ Import ordering
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },

  // ✅ Vitest override for tests
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    plugins: {
      vitest: vitestPlugin,
    },
    // languageOptions: {
    //   globals: vitestPlugin.environments.vitest.globals,
    // },
  },

  // ✅ Ignore folders
  {
    ignores: ['node_modules', 'dist', 'build', 'coverage'],
  },
]);
