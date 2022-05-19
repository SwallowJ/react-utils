# React 工具库

## redux model 使用

-   扫描指定目录

```js
import { loadModel } from "@swallowj/react-utils";

loadModel(params:modelConfigType);

interface modelConfigType {
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
```

## 路由

-   解析路由配置文件

```js
import { loadRouter } from "@swallowj/react-utils";

loadRouter(params:routerConfigType);

interface routerConfigType {
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
```

## 入口启用

-   生成页面入口文件

```js
import { entrance } from "@swallowj/react-utils";

entrance(params: entranceType);


interface entranceType {
	namespace?: string;

	/**输出目录 */
	output: string;

	appPage?: string;
	notFoundPage?: string;
}
```
