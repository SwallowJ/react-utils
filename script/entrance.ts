import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { entranceType } from "./typing";
import { createWriteStream } from "./utils";

const srcPath = (...name: string[]) => path.resolve(__dirname, "../src", ...name);

const main = (params: entranceType) => {
	const { output, namespace = "", notFoundPage = "./router/404", appPage = "./router/app" } = params;

	const outPath = path.resolve(output, namespace);
	const __modelPath = path.resolve(output, "model.ts");
	const __routerPath = path.resolve(outPath, "routerConfig.tsx");
	const __entrancePath = path.resolve(outPath, "index.tsx");

	fs.mkdirSync(outPath, { recursive: true });
	fs.existsSync(__modelPath) || fs.copyFileSync(srcPath("model.ts"), __modelPath);
	fs.existsSync(__routerPath) || fs.copyFileSync(srcPath("namespace", "routerConfig.tsx"), __routerPath);

	execSync(`cp -r ${srcPath("reducer")} ${output}`);
	execSync(`cp -r ${srcPath("namespace", "router")} ${outPath}`);
	fs.copyFileSync(srcPath("namespace", "index.tsx"), __entrancePath);

	const writeStream = createWriteStream(path.resolve(outPath, "pages.ts"));

	writeStream.write(`export { default as Application } from "${appPage}";\n`);
	writeStream.write(`export { default as NotFoundPage } from "${notFoundPage}";\n`);

	writeStream.close();
};

export default main;
