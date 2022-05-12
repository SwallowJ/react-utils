import fs from "fs";
import path from "path";
import { check } from "./check";
import Logger from "@swallowj/logjs";
import { fork } from "child_process";
import { outputModel } from "./output";
import { modelConfigType } from "./typing";

const logger = Logger.New({ name: "model" });

const defaultpath = (p: string) => path.resolve(process.cwd(), "src", p);

/**扫描目录 */
const __scanModel = (stack: string[], nameReg?: RegExp): string[] => {
	logger.Info(`开始扫描目录列表: ${stack}`);
	const res: string[] = [];
	while (stack.length > 0) {
		const dir = stack.shift();
		dir &&
			fs.readdirSync(dir).forEach((f) => {
				const p = path.resolve(dir, f);

				fs.statSync(p).isFile()
					? (nameReg && !nameReg.test(f)) || (/\.[jt]sx?$/.test(path.extname(f)) && check(p) && res.push(p))
					: stack.push(p);
			});
	}
	return res;
};

const main = (params?: modelConfigType) => {
	const {
		watch = false,
		pages = defaultpath("pages"),
		output = defaultpath("@/cli/models"),
		customes = [defaultpath("models")],
		namespace = "",
	} = params || {};

	if (!fs.statSync(pages).isDirectory()) {
		throw new Error(`${pages} 不是一个目录`);
	}

	customes.forEach((p) => {
		if (!fs.existsSync(p)) {
			throw new Error(`目录/文件 ${p} 不存在`);
		}
	});

	const outPath = path.resolve(output, `${namespace}.ts`);

	const m1 = __scanModel([...customes]);
	const m2 = __scanModel([pages], /model\.[tj]sx?$/);
	const m = [...m1, ...m2];
	outputModel(outPath, m);

	if (watch) {
		const childPath = path.resolve(__dirname, "listen");
		const listener = fork(childPath);

		listener.send({ pages, customes, output: outPath, initArry: m });
	}

	logger.Info("model 加载完成");
};

export default main;
