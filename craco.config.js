module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  //   unclear if this is working
  devServer: {
    historyApiFallback: true,
  },
  output: {
    publicPath: "/",
  },
};
