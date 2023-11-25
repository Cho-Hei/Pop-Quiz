const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // base url, if port changes need to change here
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
