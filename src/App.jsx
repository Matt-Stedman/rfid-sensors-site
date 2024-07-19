import "./App.css";
import { useState, useEffect } from "react";
import ColourChart from "./components/ColourChart";
import Timer from "./components/Timer";

const col_chart = {
	name: "temperature",
	safe: [0, 50],
	range_vals: [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70],
	range_cols: [
		[135, 206, 250], // -20°C: Sky blue
		[173, 216, 230], // -10°C: Light sky blue
		[176, 224, 230], // 0°C: Powder blue
		[211, 211, 211], // 10°C: Light grey
		[240, 240, 240], // 20°C: Very light grey
		[240, 150, 128], // 30°C: Light coral (more vibrant red)
		[255, 99, 71], // 40°C: Tomato (vibrant red)
		[255, 69, 0], // 50°C: Orange red
		[255, 0, 0], // 60°C: Red
		[215, 0, 0], // 70°C: Dark red
	],
	unit: "°C",
};

function App() {
	// Tests
	const [temperature, setTemperature] = useState(0);
	console.log(col_chart);

	const [NDEFReader, setNDEFReader] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [noteData, setNoteData] = useState(null);
	const [extraElement, setExtraElement] = useState();

	const onReading = (event) => {
		const decoder = new TextDecoder();
		setNoteData(null);
		setExtraElement(null);
		for (const record of event.message.records) {
			const text = decoder.decode(record.data);
			console.log("Scanned Data:", text);
			const temperature_str = "s=";
			if (text.startsWith(temperature_str)) {
				const value_to_set = parseFloat(text.replace(temperature_str, ""));
				setTemperature(value_to_set);
				setNoteData(value_to_set);
			} else {
				setNoteData(text);
				setExtraElement(
					<Timer
						totalTime={5}
						title="Tap again!"
						onComplete={() => {
							setExtraElement(null);
						}}
					/>
				);
			}
		}
	};

	useEffect(() => {
		const checkNfcSupport = async () => {
			if ("NDEFReader" in window) {
				try {
					const ndef = new window.NDEFReader();
					await ndef.scan();
					ndef.onreading = onReading;
				} catch (error) {
					console.error("Error reading NFC:", error);
					setErrorMessage("NFC reading error: " + error.message);
				}
			} else {
				setErrorMessage("Web NFC is not supported on this browser.");
			}
		};

		checkNfcSupport();
	}, [NDEFReader]);

	return (
		<>
			<header>
				<>RFID Temperature Sensor</>
			</header>
			<div className="App">
				<h1>Scan the temperature tag</h1>
				{!NDEFReader && errorMessage && (
					<button
						onClick={() => {
							try {
								const ndef = new window.NDEFReader();
								setNDEFReader(ndef);
							} catch (error) {
								console.log("Argh! " + error);
							}
						}}
					>
						Click for NFC
					</button>
				)}
				{extraElement}
				{errorMessage ? (
					<p>{errorMessage}</p>
				) : (
					<>
						{noteData && (
							<p style={{ backgroundColor: "yellow", border: "2px solid #999933", borderRadius: "5px" }}>
								Scanned Data: {noteData}
							</p>
						)}
						<ColourChart test={col_chart} mappedNumber={temperature} />
					</>
				)}
			</div>
			<footer>
				<span>
					made by <strong>Matt Stedman</strong>
				</span>
			</footer>
		</>
	);
}

export default App;
