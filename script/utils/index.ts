import * as fs from "fs";
import * as path from "path";

export const createWriteStream = (filepath: string) => (
	fs.rmSync(filepath, { force: true, maxRetries: 3 }),
	fs.mkdirSync(path.dirname(filepath), { recursive: true }),
	fs.createWriteStream(filepath)
);
