'use strict';

module.exports = function(api) {
	api.cache.never();

	return {
		presets: [['@babel/preset-env'], ['@babel/preset-typescript']],
		plugins: [
			[
				'module-resolver',
				{
					root: ['./'],
					alias: {
						Src: './src',
					},
				},
			],
			['@babel/plugin-transform-runtime'],
			['@babel/plugin-proposal-decorators', { legacy: true }],
			['@babel/plugin-proposal-class-properties', { loose: true }],
		],
		env: {
			test: {
				presets: [['@babel/preset-env']],
			},
		},
	};
};
