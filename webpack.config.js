const fs = require("fs");
const path = require("path");

fs.copyFileSync("script/typing.d.ts", "lib/index.d.ts");

const buildScript = (entry, filename) => ({
	entry,
	target: "node",
	mode: "production",
	output: {
		filename,
		path: path.resolve(__dirname, "lib"),
		library: { name: "react-utils-script", type: "umd" },
		chunkFilename: "dynamicImport.js",
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
	externals: ["dayjs", "@swallowj/logjs", "chokidar"].map((x) => ({ [x]: x })),
	resolve: { extensions: [".js", ".ts", ".tsx", ".json", ".d.ts"] },
	optimization: { usedExports: true },
});

module.exports = [
	buildScript("./script/index.ts", "index.js"),
	buildScript("./script/model/modellistener.ts", "modellistener.js"),
	buildScript("./script/router/routerlistener.ts", "routerlistener.js"),
];

module.exports.parallelism = 2;
