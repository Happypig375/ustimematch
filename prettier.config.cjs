/** @type {import("prettier").Config} */
module.exports = {
  plugins: [
    require.resolve("@trivago/prettier-plugin-sort-imports"),
    require.resolve("prettier-plugin-tailwindcss"),
  ],
  pluginSearchDirs: false,
  trailingComma: "all",
  importOrder: [
    "^@components/(.*)$",
    "^@store/(.*)$",
    "^@hooks/(.*)$",
    "^@utils/(.*)$",
    "^[./]",
  ],
};
