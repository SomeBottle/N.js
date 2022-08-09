const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'N.min.js',
        library: {
            name: 'NDanmaku',
            type: 'umd',
            export: 'default'
        }
    },
    module: {
        //数组里每个元素为一个规则
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('autoprefixer')
                                ]
                            },
                        },

                    }
                ]
            }
        ]
    },
    mode: "production"
};