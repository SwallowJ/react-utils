import fs from "fs";

const __REGX = /(namespace)(\S|\s)*(state:)(\S|\s)*(effects:)(\S|\s)*(reducers:)(\S|\s)*(export default).*/;

/**读取文件内容，判断是否满足条件 */
export const check = (filepath: string) => {
	const content = fs.readFileSync(filepath, { encoding: "utf8" });
	return __REGX.test(content);
};
