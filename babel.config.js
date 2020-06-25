// To get Jest to work Babel is needed

module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
  plugins: ['@babel/plugin-transform-modules-commonjs', '@babel/plugin-transform-runtime'],
};
