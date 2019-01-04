module.exports = {
    entry: {
        "js-error-generator": "./src/errors.js"
    },
    output: {
        path: __dirname + '/build/',
        filename: '[name].js',
        libraryExport: "default",
        library: 'ErrorGenerator',
        libraryTarget: 'umd'
    },
    mode: "production",
    externals: {
        global: glob()
    },
    resolve: {
        extensions: [".js"]
    },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader'
        }]
    },
    // watch: true

};
/**
 * Populates `global`.
 *
 * @api private
 */

function glob() {
    return 'typeof self !== "undefined" ? self : ' +
        'typeof window !== "undefined" ? window : ' +
        'typeof global !== "undefined" ? global : {}';
}