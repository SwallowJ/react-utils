/**
 * Date          2021-01-07
 * Description   redux 注册
 */

import models from "./register";
import { effectMiddleware } from "./middle";
import { modelType, ReducersMapObject } from "./typing";
import { combineReducers, AnyAction, applyMiddleware, createStore } from "redux";

const check = {
	/**
	 * 校验namespace是否重复
	 */
	validateNamespace(rs: ReducersMapObject, md: modelType) {
		if (rs.hasOwnProperty(md.namespace)) {
			throw new Error(`namespace [${md.namespace}] is already exist`);
		}
	},

	/**
	 * 校验action
	 */
	validateAction(action: AnyAction) {
		if (!action || typeof action != "object" || Array.isArray(action)) {
			throw new Error("Action must be an object");
		}
		if (typeof action.type === "undefined") {
			throw new Error("Action must have a type!");
		}
	},
};

/**
 * 创建reducers
 */
const createReducer = () => {
	const r = models.reduce<ReducersMapObject>((rs, model: modelType) => {
		check.validateNamespace(rs, model);

		const reducer = (state = model.state, action: AnyAction) => {
			check.validateAction(action);
			const [namespace, type] = (action.type as string).split("/");

			if (namespace == model.namespace && model.reducers.hasOwnProperty(type)) {
				return model.reducers[type](state, action);
			}
			return state || {};
		};

		rs[model.namespace] = reducer;
		return rs;
	}, {});

	return combineReducers(r);
};

export default createStore(createReducer(), applyMiddleware(effectMiddleware));
