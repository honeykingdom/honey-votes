const withPWA = require("next-pwa");
const withTM = require("next-transpile-modules")([
  "d3-array",
  "internmap",
  "d3-ease",
]);

module.exports = withTM(
  withPWA({
    pwa: {
      disable: process.env.NODE_ENV === "development",
      dest: "public",
    },
  })
);
