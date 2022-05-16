import { modelConfigType } from "./model/typing";
import { routerConfigType } from "./router/typing";

declare const loadModel: (params: modelConfigType) => void;

declare const loadRouter: (params: routerConfigType) => void;
