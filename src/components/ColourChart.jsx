import React, { useState, useEffect } from "react";

export const mapNumberToColour = (inputNumber, colourRange, numberRange) => {
	const interpolateColour = (colour1, colour2, weight) => {
		let a = [
			Math.round(colour1[0] + (colour2[0] - colour1[0]) * weight),
			Math.round(colour1[1] + (colour2[1] - colour1[1]) * weight),
			Math.round(colour1[2] + (colour2[2] - colour1[2]) * weight),
		];
		return a;
	};
	for (let i = 0; i < numberRange.length - 1; i++) {
		const num1 = numberRange[i];
		const num2 = numberRange[i + 1];
		const colour1 = colourRange[i];
		const colour2 = colourRange[i + 1];

		if (inputNumber >= num1 && inputNumber <= num2) {
			const weight = (inputNumber - num1) / (num2 - num1);
			return interpolateColour(colour1, colour2, weight);
		}
	}
	return null; // Return null if the input number is outside the defined number range
};

const ColourChart = ({ test, mappedNumber = 0 }) => {
	const [colourRange, numberRange, unit] = [test?.range_cols, test?.range_vals, test?.unit || ""];
	const [arrowPosition, setArrowPosition] = useState(0);
	const [mappedColour, setMappedColouer] = useState([0, 0, 0]);

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
	}, [test, mappedNumber, numberRange]);

	useEffect(() => {
		setMappedColouer(mapNumberToColour(mappedNumber - 5, colourRange, numberRange));
	}, [mappedColour]);

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
						top: arrowPosition ? `calc(${arrowPosition}% - 20px)` : "-10px",
						right: "0px",
						display: "flex",
						alignItems: "center",
						textAlign: "right",
					}}
				>
					<div style={{ marginRight: "5px" }}>{mappedNumber.toFixed(2) + " " + unit}</div>
					<div
						style={{
							borderTop: "10px solid transparent",
							borderBottom: "10px solid transparent",
							borderLeft: `20px solid rgb(${mappedColour})`,
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
					<div key={index} style={{ display: "flex" }}>
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
