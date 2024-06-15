import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const Timer = ({ totalTime, title, onComplete = null }) => {
	const [progress, setProgress] = useState(100);

	useEffect(() => {
		let timer = setInterval(() => {
			setProgress((prevProgress) => {
				const newProgress = prevProgress - 10 / totalTime;
				if (newProgress <= 0) {
					clearInterval(timer);
					try {
                        onComplete();
                    } catch {
                        console.log("onComplete failed. Prolly fine...");
                    }
					return 0;
				}
				return newProgress;
			});
		}, 100);

		return () => clearInterval(timer);
	}, [totalTime, onComplete]);

	return (
		<div style={{ display: "table-column", gap: "10px" }}>
			<h1>{title}</h1>
			<CircularProgress variant="determinate" value={progress} size={100} />
		</div>
	);
};

export default Timer;
