import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import storybook from 'eslint-plugin-storybook'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    '**/dist',
    '**/storybook-static',
    '**/node_modules',
    '**/.turbo',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // Storybook-specific lint rules (story exports, naming, addon checks). The
  // plugin's flat config scopes itself to *.stories.* and .storybook/.
  ...storybook.configs['flat/recommended'],
  // Stories and Storybook config legitimately export non-component values
  // (meta objects, parameters) alongside stories — the react-refresh rule
  // doesn't apply to them.
  {
    files: ['**/*.stories.{ts,tsx}', '**/.storybook/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
