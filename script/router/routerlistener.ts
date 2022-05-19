import chokiar from "chokidar";
import { outType } from "../typing";
import { outputRouter } from "./output";
import { debounce, isEqual } from "../utils";
import { RouterApi } from "../../src/router/typing";

let __CONFIG: outType;
let __ROUTERS: RouterApi[] = [];

const handleFunc = debounce((routerPath: string) => {
	import("./dynamicImport").then((v) => {
		const routers: RouterApi[] = v.default(routerPath);
		const equal = isEqual({ obj1: __ROUTERS, obj2: routers });

		if (!equal) {
			outputRouter({ ...__CONFIG, routers });
			__ROUTERS = routers;
		}
	});
}, 2000);

const listener = (routerPath: string) => {
	chokiar.watch(routerPath, { ignoreInitial: true }).on("change", handleFunc);
};

process.on("message", (config: outType) => {
	const { routers, routerPath } = config;
	__ROUTERS = routers;
	__CONFIG = config;
	listener(routerPath);
});
