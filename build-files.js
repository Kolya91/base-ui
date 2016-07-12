exports.scripts = [
	{
		files: [
			'components/lodash/lodash.js'
		],

		concat: 'scripts/libs.js'
	},
	{
		files: [
			'components/angular/angular.js',
			'components/angular-ui-router/release/angular-ui-router.js',
			'components/angular-sanitize/angular-sanitize.js',
			'components/angular-animate/angular-animate.js',
			'components/angular-local-storage/dist/angular-local-storage.js'
		],

		concat: 'scripts/ng-core.js'
	},
	{
		files: [
			'components/angular-bootstrap/ui-bootstrap.min.js',
			'components/angular-loading-bar/build/loading-bar.min.js',
			'components/angular-bootstrap/ui-bootstrap-tpls.min.js',
			'components/ng-dialog/js/ngDialog.min.js'
		],

		concat: 'scripts/ng-vendor.js'
	},
	{
		files: [
			'app/app.js',
			'app/app.config.js',
			'app/**/*.module.js',
			'app/**/*.config.js',
			'app/**/*.constant.js',
			'app/**/*.service.js',
			'app/**/*.filter.js',
			'app/**/*.directive.js',
			'app/**/*.controller.js',
			'app/**/*.js'
		],

		concat: 'scripts/app.js'
	}
];

exports.styles = [
	{
		files: [
			'components/ng-dialog/css/ngDialog.min.css'
		],
		concat: 'styles/utils.css'
	},
	{
		files: [
			'components/bootstrap/dist/css/bootstrap.css',
			'components/bootstrap/dist/css/bootstrap.css.map'
		]
	},
	{
		files: [
			'app/app.less'
		],
		less: true
	},
	{
		files: [
			'fonts/*.css',
			'fonts/**/*.ttf',
			'components/bootstrap/fonts/**/*',
			'components/font-awesome/fonts/**/*'
		],
		concat: 'styles/fonts.css'
	}
];
