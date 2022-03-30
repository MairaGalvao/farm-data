import "./App.css";
import * as Mui from "@material-ui/core";
import React, { useState, useEffect } from "react";

function App() {
	let [contentCrop, setContentCrop] = useState();

	let [contentField, setContentField] = useState();
	let [parsedData, setParsedData] = useState();

	const token =
		"Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2NDEzOTM5NTUsInN1YiI6InV6aS5jb2hlbkBjcm9weC5jb21AeFxuVFBFYVFPY213bnFqM2ZaMnNPdmRDUT09In0.Ijc4czVElCuuV8EJqAPdX21Sb82TvDirkNbvDSdNvSjCG_vnhiZqKZ80E-apXyc9y_JZBwPARmgdjfeL-4aR-A";

	function fetchDataFieldData() {
		fetch("https://api.cropx.info/api/fields/centers", {
			headers: { Authorization: token },
		})
			.then((respField) => respField.json())
			.then((json) => {
				setContentField(json.content);
			});
	}
	function fetchDataCropData() {
		fetch("https://api.cropx.info/api/general/refdata?type=Crops&version=v2", {
			headers: { Authorization: token },
		})
			.then((respCrop) => respCrop.json())
			.then((json) => {
				setContentCrop(json.content);
			});
	}

	function parseData() {
		let array = [];
		if (contentField != undefined) {
			contentField.map((elemFarm, indexFarm) => {
				const filteredArray = elemFarm.fields.filter(
					(elem) =>
						elem.status == "Optimal" ||
						elem.status == "Full" ||
						elem.status == "Refill"
				);

				filteredArray.map((elemField, indexField) => {
					let currentObj = {
						farmName: elemFarm.farmName,
						fieldName: elemField.fieldName,
						qrCode: elemField.moistureBarData.qrCode,
						status: elemField.status,
						cropsName: elemField.cropsIds.map((cropId) => {
							return convertCropIdToCropName(cropId);
						}),
						cropsIcon: elemField.cropsIds.map((cropId) => {
							return convertCropIdToIcon(cropId);
						}),
					};
					array.push(currentObj);
				});
			});
		}
		setParsedData(array);
	}

	function convertCropIdToCropName(cropId) {
		if (contentCrop != undefined) {
			const idArray = contentCrop.filter((elem) => elem.id == cropId);
			// assuming that cropId is unique
			return idArray[0].description;
		}
	}

	function convertCropIdToIcon(cropId) {
		if (contentCrop != undefined) {
			const idArray = contentCrop.filter((elem) => elem.id == cropId);
			// assuming that cropId is unique
			return idArray[0].additionals.icon_url;
		}
	}

	useEffect(() => {
		fetchDataFieldData();
		fetchDataCropData();
	}, []);

	useEffect(() => {
		parseData();
	}, [contentField, contentCrop]);

	console.log(contentField, "parsedData");

	return (
		//Access Denied on the crop icon
		<>
			<h1>Optimal</h1>
			{parsedData &&
				parsedData
					.filter((elem) => {
						return elem.status == "Optimal";
					})
					.map((elem, idx) => (
						<div key={idx}>
							<div>{elem.farmName}</div>
							<div>{elem.fieldName}</div>
							<div>{elem.qrCode}</div>
							<div>{elem.status}</div>
							<div>{elem.cropsName}</div>
							<img src={elem.cropsIcon} />
						</div>
					))}

			<h1>Full</h1>
			{parsedData &&
				parsedData
					.filter((elem) => {
						return elem.status == "Full";
					})
					.map((elem, idx) => (
						<div key={idx}>
							<div>{elem.farmName}</div>
							<div>{elem.fieldName}</div>
							<div>{elem.qrCode}</div>
							<div>{elem.status}</div>
							<div>{elem.cropsName}</div>

							<img src={elem.cropsIcon} />
						</div>
					))}

			<h1>Refill</h1>
			{parsedData &&
				parsedData
					.filter((elem) => {
						return elem.status == "Refill";
					})
					.map((elem, idx) => (
						<div key={idx}>
							<div>{elem.farmName}</div>
							<div>{elem.fieldName}</div>
							<div>{elem.qrCode}</div>
							<div>{elem.status}</div>
							<div>{elem.cropsName}</div>
							<img src={elem.cropsIcon}> </img>
						</div>
					))}
		</>
	);
}
export default App;
