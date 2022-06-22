import React from "react";
import { Link } from "react-router-dom";

const notFound: React.FC = () => {
	return (
		<div
			style={{
				fontSize: 24,
				display: "flex",
				height: "100vh",
				color: "#ff7875",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
			}}
		>
			<span>{"Oh On 页面找不到啦"}</span>
			<Link to={"/"}>{"返回主页"}</Link>
		</div>
	);
};

export default notFound;
