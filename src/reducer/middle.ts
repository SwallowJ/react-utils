import models from "./register";
import { AnyAction, Middleware } from "redux";

/**
 * action 拦截中间件
 * 调用优先级 reducers > effects
 */
export const effectMiddleware: Middleware =
	({ getState }) =>
	(next) => {
		const callActions = (action: AnyAction, init = true) => {
			let [namespace, type] = (action.type as string).split("/");

			/** 获取model */
			const model = models.find((m) => m.namespace == namespace);

			if (!model) {
				throw new Error(`namespace [${namespace}] not found`);
			}

			if (model.reducers.hasOwnProperty(type)) {
				const res = next(action);
				if (init && typeof action.onFinish === "function") {
					action.onFinish(action.type);
				}
				return res;
			} else if (model.effects.hasOwnProperty(type)) {
				const finishGen = (nx: IteratorResult<void, void>) => {
					nx.done && init && typeof action.onFinish === "function" && action.onFinish(action.type);
					return nx;
				};

				/**
				 * 异步函数调用
				 * @param fn 异步函数
				 * @param args 参数
				 */
				const call = <T>(p: Promise<T>) => {
					p.then((v) => finishGen(gen.next(v)));
				};

				/**
				 * reducer 调用
				 * @param newAction action
				 */
				const put = (newAction: AnyAction) => {
					Promise.resolve()
						.then(() => {
							newAction.type = `${namespace}/${newAction.type}`;
							callActions(newAction);
						})
						.then(() => finishGen(gen.next()));
				};

				const change = (params: any) => {
					put({ type: "changeState", params });
				};

				/** 获取当前State */
				const select = (name = namespace) => getState()[name];

				/** effect 生成器 */
				const gen = model.effects[type](action, { call, put, select, change });
				finishGen(gen.next());
			} else {
				console.error(`No such action: ${action.type}`);
			}
		};

		return callActions;
	};
