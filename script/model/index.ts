import * as fs from "fs";
import dayjs from "dayjs";
import * as path from "path";
import * as crypto from "crypto";
import Logger from "@swallowj/logjs";
import { modelConfigType } from "./typing";
import { createWriteStream } from "../utils";

const logger = Logger.New({ name: "model" });

const defaultpath = (p: string) => path.resolve(process.cwd(), "src", p);

const removeExt = (f: string) => f.replace(/\.[jt]sx?$/, "");

const checkname = (f: string): string => {
	for (const name of removeExt(f).split(path.sep).reverse()) {
		if (name !== "model") {
			return name;
		}
	}
	return "";
};

const __Reg_Model = /(namespace)(\S|\s)*(state:)(\S|\s)*(effects:)(\S|\s)*(reducers:)(\S|\s)*(export default).*/;

const test_model = (content: string) => __Reg_Model.test(content);

const __scanModel = (stack: string[], nameReg?: RegExp): string[] => {
	logger.Info(`开始扫描目录列表: ${stack}`);
	const res: string[] = [];
	while (stack.length > 0) {
		const dir = stack.shift();
		dir &&
			fs.readdirSync(dir).forEach((f) => {
				const p = path.resolve(dir, f);

				fs.statSync(p).isFile()
					? (nameReg && !nameReg.test(f)) ||
					  (/\.[jt]sx?$/.test(path.extname(f)) &&
							test_model(fs.readFileSync(p, { encoding: "utf8" })) &&
							res.push(p))
					: stack.push(p);
			});
	}
	return res;
};

/**  model加载 */
const load = (params?: modelConfigType) => {
	const {
		watch = false,
		pages = defaultpath("pages"),
		output = defaultpath("models.ts"),
		customes = [defaultpath("models")],
	} = params || {};

	if (!fs.statSync(pages).isDirectory()) {
		throw new Error(`${pages} 不是一个目录`);
	}

	customes.forEach((p) => {
		if (!fs.existsSync(p)) {
			throw new Error(`目录/文件 ${p} 不存在`);
		}
	});

	const models = [...__scanModel([pages], /model\.[tj]sx?$/), ...__scanModel(customes)];

	const writeStream = createWriteStream(output);
	const time = dayjs().add(8, "h").format("YYYY-MM-DD HH:mm:ss.SSS");

	writeStream.write("/**\n");
	writeStream.write(` * Date       ${time}\n`);
	writeStream.write(` * Desc       model加载\n`);
	writeStream.write(" */\n\n");

	models.forEach((f) => {
		const hash8 = crypto.createHash("sha256").update(f).copy().digest("hex").slice(0, 8);
		writeStream.write(`export { default as ${checkname(f)}_${hash8} } from "${removeExt(f)}";\n`);
	});

	writeStream?.close();
	logger.Info("model 加载完成");
};

export default load;
