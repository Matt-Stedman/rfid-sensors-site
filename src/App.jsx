import "./App.css";
import { useState, useEffect } from "react";
// import ColourChart from "./components/ColourChart";
// import { mapNumberToColour } from "./science/number_util";

const col_chart = {
	name: "temperature",
	safe: [0, 50],
	range_vals: [-20, -10, 0, 5, 10, 15, 20, 30, 40],
	range_cols: [
		[0, 0, 255], // -20°C: Very blue
		[0, 127, 255], // -10°C: Lighter blue
		[0, 255, 255], // 0°C: Cyan
		[0, 255, 127], // 5°C: Light greenish-blue
		[127, 255, 255], // 10°C: Light cyan
		[128, 128, 128], // 15°C: Grey
		[255, 255, 0], // 20°C: Yellow
		[255, 127, 0], // 30°C: Orange
		[255, 0, 0], // 40°C: Red hot
	],
	unit: "°C",
};

function App() {
	// Tests
	// const [temperature, setTemperature] = useState(20);
	console.log(col_chart);

	const [scannedData, setScannedData] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		const checkNfcSupport = async () => {
			if ("NDEFReader" in window) {
				try {
					const ndef = new window.NDEFReader();
					await ndef.scan();
					ndef.onreading = (event) => {
						const decoder = new TextDecoder();
						for (const record of event.message.records) {
							const text = decoder.decode(record.data);
							console.log("Scanned Data:", text);
							setScannedData(text);
							// Process the scanned data as needed, for example, update the URL with query params
							window.location.search = `?param=${text}`;
						}
					};
				} catch (error) {
					console.error("Error reading NFC:", error);
					setErrorMessage("NFC reading error: " + error.message);
				}
			} else {
				setErrorMessage("Web NFC is not supported on this browser.");
			}
		};

		checkNfcSupport();
	}, []);

	return (
		<div>
			<h1>Scan your NFC tag</h1>
			{errorMessage && <p>{errorMessage}</p>}
			{scannedData && <p>Scanned Data: {scannedData}</p>}
		</div>
		// <>
		// 	<header>
		// 		<>RFID Temperature Sensor</>
		// 	</header>
		// 	<div className="App">
		// 		<ColourChart
		// 			test={col_chart}
		// 			mappedNumber={temperature}
		// 			mappedColour={mapNumberToColour(temperature, col_chart.range_cols, col_chart.range_vals)}
		// 		/>
		// 	</div>
		// 	<footer>
		// 		<span>
		// 			made by <strong>Hard Stuff</strong>
		// 		</span>
		// 	</footer>
		// </>
	);
}

export default App;
