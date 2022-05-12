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
	output?: string;
}

declare const loadModel: (params: modelConfigType) => void;
