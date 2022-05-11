import path from "path";
import crypto from "crypto";
import { createWriteStream } from "../utils";

const __HASHMAP = new Map<string, string>();

const checkname = (f: string): string => {
	let hash8 = __HASHMAP.get(f);
	if (!hash8) {
		hash8 = crypto.createHash("sha256").update(f).copy().digest("hex").slice(0, 8);
		__HASHMAP.set(f, hash8);
	}

	let res = "";
	for (const name of f.split(path.sep).reverse()) {
		if (name !== "model") {
			res = name.replace(/\s/g, "_");
			break;
		}
	}
	return `${res}_${hash8}`;
};

export const outputModel = (filepath: string, models: string[]) => {
	const writeStream = createWriteStream(filepath);

	models.forEach((f) => {
		const __name = f.replace(/\.[jt]sx?$/, "");
		writeStream.write(`export { default as ${checkname(__name)} } from "${__name}";\n`);
	});

	writeStream.close();
};
