import dayjs from "dayjs";
import * as fs from "fs";
import * as path from "path";

export const createWriteStream = (filepath: string) => (
	fs.rmSync(filepath, { force: true, maxRetries: 3 }),
	fs.mkdirSync(path.dirname(filepath), { recursive: true }),
	fs.createWriteStream(filepath)
);

export const writeTitle = (writeStream: fs.WriteStream, desc?: string) => {
	const time = dayjs().add(8, "h").format("YYYY-MM-DD HH:mm:ss.SSS");

	writeStream.write("/**\n");
	writeStream.write(` * Date       ${time}\n`);
	writeStream.write(` * Desc       ${desc}\n`);
	writeStream.write(" */\n\n");
};

/**
 * 防抖函数
 * @param fn 要执行的函数
 * @param wait 延迟时间 default=1000ms
 */
export function debounce<T extends Array<any>>(fn: (...args: T) => void, wait = 1000) {
	let timer: NodeJS.Timeout;
	return (...args: T) => {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fn(...args);
		}, wait);
	};
}
