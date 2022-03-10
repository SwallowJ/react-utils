import { Reducer, AnyAction } from "redux";

export interface modelConfigType {
	/**
	 * 页面目录,
	 * default=src/pages
	 */
	pages?: string;

	/**
	 * 自定义model目录、文件
	 * default = [src/models]
	 */
	customes?: string[];

	/**
	 * 监听文件、目录变更
	 * default=false
	 */
	watch?: boolean;

	/**输出目录 */
	output?: string;
}

export interface ReducersMapObject<S = any> {
	[key: string]: Reducer<S>;
}

export type Gen<T = any> = Generator<void, void, T>;

interface effectCode<S = any> {
	[key: string]: (action: AnyAction, effects: EffectsCommandMap<S>) => Gen;
}

interface EffectsCommandMap<S> {
	/**
	 * 获取 State属性
	 */
	select<T = S>(namespace?: string): T;

	/**
	 * 调用reducer
	 */
	put(action: AnyAction): void;

	change(params: S): void;

	/**
	 * 异步函数调用
	 */
	call<T = any>(p: Promise<T>): void;
}

export interface modelType<S = any> {
	/**
	 * 初始状态值
	 */
	state: S;
	/**
	 * 命名空间
	 * 唯一标识
	 */
	namespace: string;

	/**
	 * 异步请求调用
	 * 优先级低于reducers
	 */
	effects: effectCode<S>;

	/**
	 * reducer 函数
	 * 调用路径: ${namespace}/function
	 */
	reducers: ReducersMapObject<S>;
}

export type resultType<T> = T | undefined;
