import React from "react";
import store from "./reducer";
import ReactDOM from "react-dom";
import AppRouter from "./router";
import { Provider } from "react-redux";
import { Application } from "./pages";

ReactDOM.render(
	<Provider store={store}>
		<Application>
			<AppRouter />
		</Application>
	</Provider>,
	document.getElementById("root"),
);
