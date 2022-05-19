import path from "path";
import { WriteStream } from "fs";
import { outType } from "../typing";
import { createWriteStream } from "../utils";
import { RouterApi } from "../../src/router/typing";

interface ObjectCode {
	[key: string]: dataType;
}

type dataType = ObjectCode | number | string | boolean | Array<dataType>;

const parseData = (data: dataType, writeStream: WriteStream, t: number) => {
	const t1 = new Array(t).fill("\t").join("");
	const t2 = new Array(t + 1).fill("\t").join("");

	switch (Object.prototype.toString.call(data)) {
		case "[object String]":
			writeStream?.write(`"${data}",`);
			return;
		case "[object Object]":
			writeStream?.write(`{\n`);
			Object.entries(data).forEach(([key, value]) => {
				writeStream?.write(`${t2}${key}: `);
				parseData(value, writeStream, t + 2);
			});
			writeStream?.write(`\n${t1}},`);
			return;
		case "[object Array]":
			writeStream?.write(`[`);
			(data as Array<dataType>).forEach((d) => {
				parseData(d, writeStream, t + 2);
			});
			writeStream?.write(`],`);
			return;

		default:
			writeStream?.write(`${data},`);
			return;
	}
};

const __parseRouter = (routers: RouterApi[], writeStream: WriteStream, split: boolean, t = 1, rootPath = "/") => {
	const t1 = new Array(t).fill("\t").join("");
	const t2 = new Array(t + 1).fill("\t").join("");

	routers.forEach((router) => {
		const currentPath = path.resolve(rootPath, router.path.replace(/^\//, ""));
		writeStream.write(`${t1}{\n`);

		Object.entries(router).forEach(([key, value]) => {
			switch (key as keyof RouterApi) {
				case "routers":
					writeStream.write(`${t2}${key}: [\n`);
					__parseRouter(value, writeStream, split, t + 2, currentPath);
					writeStream.write(`${t2}],\n`);
					return;

				case "component":
					split
						? writeStream.write(`${t2}${key}: loadable(() => import("${value}"), options),\n`)
						: writeStream.write(`${t2}${key}: require("${value}").default,\n`);
					return;
				case "data":
					writeStream.write(`${t2}${key}: `);
					parseData(value, writeStream, t + 1);
					writeStream.write("\n");
					return;

				case "exact":
					writeStream.write(`${t2}${key}: ${value},\n`);
					return;

				case "redirect":
					writeStream.write(`${t2}${key}: "${value}",\n`);
					return;

				case "path":
					writeStream.write(`${t2}${key}: "${currentPath}",\n`);
					return;
				default:
					writeStream.write(`${t2}${key}: "${value}",\n`);
					return;
			}
		});

		writeStream?.write(`${t1}},\n`);
	});
};

export const outputRouter = (params: outType) => {
	const { output, split = true, loadComponent, routers } = params;

	if (split && !loadComponent) {
		throw new Error("loadComponent 不能为空");
	}

	const writeStream = createWriteStream(output);

	split &&
		(writeStream.write(`import React from "react";\n`),
		writeStream.write(`import loadable from "@loadable/component";\n`),
		writeStream.write(`import Loading from "${loadComponent}";\n\n`),
		writeStream.write(`const options = {\n\tfallback: <Loading />,\n};\n\n`));

	writeStream.write(`const routers: Aplication.router[] = [\n`);

	__parseRouter(routers, writeStream, split);
	writeStream.write(`];\n\nexport default routers;\n`);

	writeStream.close();
};
