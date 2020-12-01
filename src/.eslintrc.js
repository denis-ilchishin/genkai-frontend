module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'import/order': 'off',
    'vue/valid-v-bind': 'off',
    'no-use-v-if-with-v-for': 'off',
  },
}
