const path = require("path");

const config = {
	mode: "production",
	resolve: {
		extensions: [".js", ".ts", ".tsx", ".json", ".d.ts"],
	},
	optimization: {
		usedExports: true,
	},
};

/**外部扩展 */
const externals = ["dayjs", "@swallowj/logjs"].map((x) => ({ [x]: x }));

module.exports = [
	{
		target: "node",
		entry: "./script/index.ts",
		output: {
			path: path.resolve(__dirname, "script"),
			filename: "index.js",
			library: { name: "react-utils-script", type: "umd" },
		},
		module: {
			rules: [
				{
					test: /\.(js|mjs|jsx|ts|tsx)$/,
					include: path.resolve(__dirname, "script"),
					loader: "babel-loader",
				},
			],
		},
		externals,
		...config,
	},
];

module.exports.parallelism = 2;
