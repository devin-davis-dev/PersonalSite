const babelOptions = {
  presets: [
    [
      "babel-preset-gatsby",
      {
        reactRuntime: "automatic",
        reactImportSource: "theme-ui",
      },
    ],
    "@babel/preset-typescript",
  ],
};

module.exports = require("babel-jest").default.createTransformer(babelOptions);
