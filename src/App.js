import "./App.css";
import React, { useState, useEffect } from "react";
import FieldsByCatagory from "./FieldsByCatagory";

function App() {
	let [contentCrop, setContentCrop] = useState();
	let [contentField, setContentField] = useState();
	let [parsedData, setParsedData] = useState();

	const token =
		"Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2NDEzOTM5NTUsInN1YiI6InV6aS5jb2hlbkBjcm9weC5jb21AeFxuVFBFYVFPY213bnFqM2ZaMnNPdmRDUT09In0.Ijc4czVElCuuV8EJqAPdX21Sb82TvDirkNbvDSdNvSjCG_vnhiZqKZ80E-apXyc9y_JZBwPARmgdjfeL-4aR-A";

	function fetchFieldData() {
		fetch("https://api.cropx.info/api/fields/centers", {
			headers: { Authorization: token },
		})
			.then((respField) => respField.json())
			.then((json) => {
				setContentField(json.content);
			});
	}
	function fetchCropData() {
		fetch("https://api.cropx.info/api/general/refdata?type=Crops&version=v2", {
			// FYI, this API doesn't require the token for authentication
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
						moistureBarData: getAmountRelativeToday(elemField),
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

	function getAmountRelativeToday(fieldData) {
		return fieldData.moistureBarData.data[1].amountRelative;
	}

	useEffect(() => {
		fetchFieldData();
		fetchCropData();
	}, []);

	useEffect(() => {
		parseData();
	}, [contentField, contentCrop]);

	return (
		<>
			{parsedData && (
				<>
					<FieldsByCatagory data={parsedData} category={"Full"} />
					<FieldsByCatagory data={parsedData} category={"Refill"} />
					<FieldsByCatagory data={parsedData} category={"Optimal"} />
				</>
			)}
		</>
	);
}
export default App;
