var BundleTracker = require('webpack-bundle-tracker');
const pages = {
    'index': {
        entry: './src/main.js',
        template: 'public/index.html',
        title: 'Home',
        chunks: [ 'chunk-vendors', 'chunk-common', 'index' ]
      },
     
};
module.exports = {
    pages:pages,
    lintOnSave: 'warning',
    publicPath:'/iat-client/',
    chainWebpack: config=>{
        config
            .plugin('BundleTracker')
            .use(BundleTracker, [{filename: './webpack-stats.json'}]);

    },
    devServer: {
        disableHostCheck: true
      }

}

