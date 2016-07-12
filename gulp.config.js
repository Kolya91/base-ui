exports.sources = function(){
    return {
        index: './src/index.jade',
        appLess: './src/app/app.less',
        jade: './src/app/**/*.jade',
        assets: './src/assets/**/*',
        less: './src/**/*.less',
        scripts: './src/app/**/*.js'
    };
};
