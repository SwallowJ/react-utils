import dayjs from "dayjs";
import * as fs from "fs";
import * as path from "path";

export const createWriteStream = (filepath: string) => (
	fs.rmSync(filepath, { force: true, maxRetries: 3 }),
	fs.mkdirSync(path.dirname(filepath), { recursive: true }),
	fs.createWriteStream(filepath)
);

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

/** 获取对象类型 */
export const callType = (obj: any) => Object.prototype.toString.call(obj);

interface compareProps {
	/** 待比较对象 */
	obj1: object | undefined | null;
	obj2: object | undefined | null;

	/** 递归深度对比 */
	deep?: boolean;

	/** 数组是否排序 */
	sort?: boolean;
}

/**
 * 递归比较两个对象是否一致
 * 支持Object, Array
 * TODO - Map, Set
 */
export const isEqual = (opionts: compareProps): boolean => {
	const { obj1, obj2, deep, sort = true } = opionts;

	if (obj1 === undefined || obj2 === undefined || obj1 === null || obj2 === null) {
		return obj1 === obj2;
	}

	const type1 = callType(obj1);
	const type2 = callType(obj2);
	if (type1 !== type2) {
		return false;
	}

	switch (type1) {
		case "[object Object]":
			const key1 = Object.keys(obj1);
			const key2 = Object.keys(obj2);
			if (key1.length != key2.length) {
				return false;
			}
			return key1.every((k) => isEqual({ ...opionts, obj1: obj1[k], obj2: obj2[k] }));

		case "[object Array]":
			const temp1 = obj1 as Array<any>;
			const temp2 = obj2 as Array<any>;
			if (temp1.length !== temp2.length) {
				return false;
			}
			if (sort) {
				temp1.sort();
				temp2.sort();
			}
			return temp1.every((x, i) => isEqual({ ...opionts, obj1: temp2[i], obj2: x }));

		default:
			return deep ? JSON.stringify(obj1) === JSON.stringify(obj2) : obj1 === obj2;
	}
};
