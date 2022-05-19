import * as models from "../model";
import { modelType, ReducersMapObject } from "./typing";

const __models = Object.values(models);

const commonReducer: ReducersMapObject = {
	changeState(state, { params }) {
		return { ...state, ...params };
	},
};

export default [...__models].map<modelType>((x: modelType) => ({
	...x,
	reducers: { ...commonReducer, ...x.reducers },
}));
