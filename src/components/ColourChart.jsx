import React, { useState, useEffect } from "react";

const ColourChart = ({ test, mappedNumber, mappedColour }) => {
	const [colourRange, numberRange, unit] = [test?.range_cols, test?.range_vals, test?.unit || ""];
	const [arrowPosition, setArrowPosition] = useState(0);

	useEffect(() => {
		const rangeCount = numberRange.length;

		// Find the range in which the newMappedNumber falls
		let rangeIndex = -1;
		for (let i = 0; i < rangeCount - 1; i++) {
			if (mappedNumber >= numberRange[i] && mappedNumber <= numberRange[i + 1]) {
				rangeIndex = i;
				break;
			}
		}

		if (rangeIndex !== -1) {
			// Calculate the position relative to the specific range
			const rangeStart = numberRange[rangeIndex];
			const rangeEnd = numberRange[rangeIndex + 1];
			const rangePercentage =
				(rangeIndex * 100) / rangeCount +
				(((mappedNumber - rangeStart) / (rangeEnd - rangeStart)) * 100) / rangeCount;
			// console.log("arrowPosition of ", test?.name, arrowPosition);
			setArrowPosition(rangePercentage);
		} else {
			// Set arrow position to 0 if the mapped number is outside the range
			setArrowPosition(mappedNumber >= numberRange[numberRange.length - 1] ? 100 : 0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [test, mappedNumber, mappedColour, numberRange]);

	return (
		<div
			style={{
				display: "flex",
				margin: "40px",
			}}
		>
			<div
				// Part 1
				style={{
					position: "relative",
					display: "flex",
				}}
			>
				<div
					style={{
						position: "absolute",
						top: arrowPosition ? `calc(${arrowPosition}% + 10px)` : "-10px",
						right: "0px",
						display: "flex",
						alignItems: "center",
						textAlign: "right",
					}}
				>
					<div style={{ marginRight: "5px" }}>{mappedNumber && mappedNumber.toFixed(2) + " " + unit}</div>
					<div
						style={{
							borderTop: "10px solid transparent",
							borderBottom: "10px solid transparent",
							borderLeft: `15px solid rgb(${mappedColour})`,
						}}
					/>
				</div>
			</div>

			<div
				// Part 2
				style={{
					display: "flex",
					flexDirection: "column",
				}}
			>
				{colourRange.map((mappedColour, index) => (
					<div key={index} style={{ display: "flex", alignItems: "center" }}>
						<div
							style={{
								marginLeft: "5px",
								width: "15px",
								height: "40px",
								backgroundColor: `rgb(${mappedColour})`,
							}}
						></div>
						<div style={{ marginLeft: "10px" }}>
							{numberRange[index]}
							{" " + unit}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ColourChart;
