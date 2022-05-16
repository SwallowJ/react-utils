import chokiar from "chokidar";
import { outputRouter } from "./output";
import { debounce, isEqual } from "../utils";
import { outType, RouterApi } from "./typing";

let __CONFIG: outType;
let __ROUTERS: RouterApi[] = [];

const handleFunc = debounce((routerPath: string) => {
	delete require.cache[routerPath];
	const routers: RouterApi[] = require(routerPath).default;
	const equal = isEqual({ obj1: __ROUTERS, obj2: routers });

	if (!equal) {
		outputRouter({ ...__CONFIG, routers });
		__ROUTERS = routers;
	}
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
