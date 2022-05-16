const fs = require("fs");
const path = require("path");

fs.copyFileSync("script/index.d.ts", "lib/script/index.d.ts");

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
const externals = ["dayjs", "@swallowj/logjs", "chokidar"].map((x) => ({ [x]: x }));

const buildScript = (entry, filename) => ({
	target: "node",
	entry,
	output: {
		filename,
		path: path.resolve(__dirname, "lib/script"),
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
});

module.exports = [
	buildScript("./script/index.ts", "index.js"),
	buildScript("./script/model/modellistener.ts", "modellistener.js"),
	buildScript("./script/router/routerlistener.ts", "routerlistener.js"),
];

module.exports.parallelism = 2;
