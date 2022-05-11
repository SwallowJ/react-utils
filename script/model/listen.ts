/**
 * Date       2022-04-21
 * Desc       文件监听
 */

import chokiar from "chokidar";
import { check } from "./check";
import { debounce } from "../utils";
import Logger from "@swallowj/logjs";
import { outputModel } from "./output";
import { modelConfigType } from "./typing";

let __OUTPATH: string = "";
let __MODELS: string[] = [];
let __MODELBASK: string[] = [];

const logger = Logger.New({ name: "model.listener" });

const handleFunc = debounce(() => {
	const isequire = __MODELS.length === __MODELBASK.length && __MODELS.every((x) => __MODELBASK.includes(x));

	if (!isequire) {
		outputModel(__OUTPATH, __MODELS);
		__MODELBASK = [...__MODELS];
		logger.Debug("Model 更新完成");
	}
}, 2000);

let __m: string[] = [];
let __timer: NodeJS.Timeout | null = null;
const onChange = (filename: string) => {
	__m.push(filename);
	__timer && clearTimeout(__timer);

	__timer = setTimeout(() => {
		/**去重,判断 */
		[...new Set(__m)].forEach((f) => {
			if (__MODELS.includes(f) && !check(f)) {
				__MODELS = __MODELS.filter((x) => x !== f);
			} else if (!__MODELS.includes(f) && check(f)) {
				__MODELS.push(f);
			}
		});

		handleFunc();

		__timer && clearTimeout(__timer);
		__timer = null;
		__m.length = 0;
	}, 5000);
};

const listener = (dirs: string[] | string, ignored?: RegExp) => {
	chokiar
		.watch(dirs, {
			ignoreInitial: true,
			ignored: (name) => {
				if (!/.*\.\w+$/.test(name)) {
					return false;
				}
				return !(ignored ?? /\.[tj]sx?/).test(name);
			},
		})
		.on("add", (filename: string) => {
			if (check(filename)) {
				__MODELS.push(filename);
				handleFunc();
			}
		})
		.on("unlink", (filename: string) => {
			__MODELS = __MODELS.filter((x) => x !== filename);
			handleFunc();
		})
		.on("change", (filename: string) => {
			onChange(filename);
		});
};

interface childMes extends modelConfigType {
	initArry: string[];
}

process.on("message", ({ pages, customes, output, initArry }: childMes) => {
	logger.Info("model监听进程已启动");

	__OUTPATH = output ?? "";
	__MODELS = [...initArry];
	__MODELBASK = [...initArry];

	pages && listener(pages, /.*\/model\.[jt]sx?$/);
	customes && listener(customes);
});
