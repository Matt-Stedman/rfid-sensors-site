export const mapColourToNumber = (inputColour, colourRange, numberRange, threshold = 130) => {
	const isBetween = (colour, colour1, colour2) => {
		const distance1 = distance(colour, colour1);
		const distance2 = distance(colour, colour2);
		const segmentDistance = distance(colour1, colour2);
		return Math.abs(distance1 + distance2 - segmentDistance) < threshold;
	};

	const getWeight = (colour, colour1, colour2) => {
		const totalDistance = distance(colour1, colour2);
		const distanceToColour1 = distance(colour, colour1);
		return distanceToColour1 / totalDistance;
	};

	const distance = (colour1, colour2) => {
		return Math.sqrt(
			Math.pow(colour1[0] - colour2[0], 2) +
				Math.pow(colour1[1] - colour2[1], 2) +
				Math.pow(colour1[2] - colour2[2], 2)
		);
	};

	const interpolate = (num1, num2, weight) => {
		return num1 + (num2 - num1) * weight;
	};

	for (let i = 0; i < colourRange.length - 1; i++) {
		const colour1 = colourRange[i];
		const colour2 = colourRange[i + 1];
		const num1 = numberRange[i];
		const num2 = numberRange[i + 1];

		if (isBetween(inputColour, colour1, colour2)) {
			const weight = getWeight(inputColour, colour1, colour2);
			return interpolate(num1, num2, weight);
		}
	}

	return null; // Return null if the input colour is outside the defined colour range
};

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
