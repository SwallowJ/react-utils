import fs from "fs";
import path from "path";
import { fork } from "child_process";
import { outputRouter } from "./output";
import { routerConfigType, RouterApi, outType } from "./typing";

const main = (params: routerConfigType) => {
	const { routerPath, namespace = "index", output, watch } = params;

	if (!fs.statSync(routerPath).isFile()) {
		throw new Error(`${routerPath} 不存在`);
	}

	const outPath = path.resolve(output, `router/${namespace}.tsx`);

	const routers: RouterApi[] = require(routerPath).default;

	const config: outType = { ...params, output: outPath, routers };

	outputRouter(config);

	if (watch) {
		const childPath = path.resolve(__dirname, "routerlistener");
		const listener = fork(childPath);

		listener.send(config);
	}
};

export default main;
