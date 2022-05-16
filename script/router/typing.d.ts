interface RouterApi {
	/** 路径 */
	path: string;

	/** 组件*/
	component?: any;
	push?: boolean;

	/** 重定向地址 */
	redirect?: string;

	/** 子路由 */
	routers?: RouterApi[];

	/** 名称 */
	name?: string;

	/** 图标 */
	icon?: string;

	/** 额外的数据 */
	data?: dataType;

	key?: string;

	exact?: boolean;
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

export interface outType extends routerConfigType {
	routers: RouterApi[];
}
