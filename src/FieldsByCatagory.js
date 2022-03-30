import Field from "./Field";
import * as Mui from "@material-ui/core";

function FieldsByCatagory({ data, category }) {
	return (
		<>
			<Mui.Typography variant="h3">{category}</Mui.Typography>
			{data
				.filter((elem) => {
					return elem.status == category;
				})
				.map((elem, idx) => (
					<Field
						idx={idx}
						farmName={elem.farmName}
						fieldName={elem.fieldName}
						qrCode={elem.qrCode}
						cropsName={elem.cropsName}
						cropsIcon={elem.cropsIcon}
						iconAlt={"crop icon"}
						moistureBarData={elem.moistureBarData}
					/>
				))}
		</>
	);
}

export default FieldsByCatagory;
