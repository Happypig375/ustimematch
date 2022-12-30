/** @type {import("prettier").Config} */
module.exports = {
  plugins: [
    require.resolve("prettier-plugin-tailwindcss"),
    require.resolve("@trivago/prettier-plugin-sort-imports"),
  ],
  trailingComma: "all",
  importOrder: [
    "^@components/(.*)$",
    "^@ui/(.*)$",
    "^@store/(.*)$",
    "^@hooks/(.*)$",
    "^@utils/(.*)$",
    "^@types//(.*)$",
    "^[./]",
  ],
};
