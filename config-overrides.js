const { injectBabelPlugin } = require('react-app-rewired');
const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
    injectBabelPlugin(['transform-react-jsx', { pragma: 'Glamor.createElement' }], config);
    config.plugins.push(
        new webpack.ProvidePlugin({
            Glamor: 'glamor/react'
        })
    );
    return config;
};
