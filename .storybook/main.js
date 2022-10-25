module.exports = {
	stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'storybook-addon-next',
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-a11y',
	],
	features: {
		interactionsDebugger: true,
	},
	framework: '@storybook/react',
	core: {
		builder: '@storybook/builder-webpack5',
	},
}
