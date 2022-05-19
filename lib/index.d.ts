import { RouterApi } from "../src/router/typing";

export interface modelConfigType {
	namespace?: string;
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
	output: string;
}

export interface routerConfigType {
	routerPath: string;

	/**
	 * 监听文件、目录变更
	 * default=false
	 */
	watch?: boolean;

	namespace?: string;

	/**输出目录 */
	output: string;

	/**loading页面组件 */
	loadComponent?: string;

	/**
	 * 代码分割
	 * default=true
	 */
	split?: boolean;
}

export interface entranceType {
	namespace?: string;

	/**输出目录 */
	output: string;

	appPage?: string;
	notFoundPage?: string;
}

export interface outType extends routerConfigType {
	routers: RouterApi[];
}

/**加载model模块 */
declare const loadModel: (params: modelConfigType) => void;

/**加载解析路由配置文件 */
declare const loadRouter: (params: routerConfigType) => void;

/**入口文件 */
declare const entrance: (params: entranceType) => void;
