import store from "./index";
import { AnyAction } from "redux";

export class Actions<S = any> {
	namespace: string;

	constructor(namespace: string) {
		this.namespace = namespace;
	}

	/**修改状态action */
	changeState(params: S, namespace?: string): AnyAction {
		return store.dispatch({ type: `${namespace ?? this.namespace}/changeState`, params });
	}

	/**  调用effects */
	callAction<T = any>(actionName: string, params?: T, namespace?: string): AnyAction {
		return store.dispatch({ type: `${namespace ?? this.namespace}/${actionName}`, ...params });
	}
}
