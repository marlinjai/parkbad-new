module.exports = {
  extends: [
    'next/core-web-vitals',
  ],
  rules: {
    // Relaxed rules for specific files/paths
  },
  overrides: [
    {
      // Disable TypeScript checking for Sanity schema files completely
      files: ['src/sanity/schemas/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-empty-interface': 'off'
      }
    }
  ]
}; 