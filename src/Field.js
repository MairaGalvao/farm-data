import * as Mui from "@material-ui/core";

function Field({
	idx,
	farmName,
	fieldName,
	qrCode,
	cropsName,
	cropsIcon,
	iconAlt,
	moistureBarData,
}) {
	return (
		<Mui.Box className="mainContainer" key={idx}>
			<Mui.Typography variant="h4">{fieldName}</Mui.Typography>
			<Mui.Typography variant="h5">{farmName}</Mui.Typography>
			<Mui.Box style={{ display: "flex" }}>
				{/* I'm getting Access Denied (403) on the crop icon */}
				<img src={cropsIcon} alt={iconAlt} style={{ paddingRight: 5 }} />
				<Mui.Box>{cropsName}</Mui.Box>
			</Mui.Box>

			<Mui.Box>QR: {qrCode}</Mui.Box>
			{moistureBarData && (
				<>
					<Mui.Box className="slider">
						<Mui.Box className="wrapper">
							<Mui.Slider valueLabelDisplay="on" value={moistureBarData} />
						</Mui.Box>
					</Mui.Box>
				</>
			)}
		</Mui.Box>
	);
}

export default Field;
