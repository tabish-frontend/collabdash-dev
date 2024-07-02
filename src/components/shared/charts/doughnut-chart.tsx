// import type { ApexOptions } from "apexcharts";
// import { useTheme } from "@mui/material/styles";

// import { Chart } from "./style";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Typography,
//   tableCellClasses,
// } from "@mui/material";
// import numeral from "numeral";
// import { Box } from "@mui/system";
// import { NoRecordFound } from "../no-record";

// const useChartOptions = (labels: string[]): ApexOptions => {
//   const theme = useTheme();

//   return {
//     chart: {
//       background: "transparent",
//       stacked: false,
//       toolbar: {
//         show: false,
//       },
//     },
//     colors: [
//       theme.palette.warning.main,
//       theme.palette.success.light,
//       theme.palette.info.main,
//       theme.palette.primary.main,
//     ],
//     dataLabels: {
//       enabled: false,
//     },
//     fill: {
//       opacity: 1,
//       type: "solid",
//     },
//     labels,
//     legend: {
//       show: false,
//     },
//     plotOptions: {
//       pie: {
//         expandOnClick: false,
//       },
//     },
//     states: {
//       active: {
//         filter: {
//           type: "none",
//         },
//       },
//       hover: {
//         filter: {
//           type: "none",
//         },
//       },
//     },
//     stroke: {
//       width: 0,
//     },
//     theme: {
//       mode: theme.palette.mode,
//     },
//     tooltip: {
//       fillSeriesColor: false,
//     },
//   };
// };

// export const DoughnutChart = ({
//   chartsValues,
//   chartLabels,
//   isDemo,
// }: {
//   chartsValues?: number[] | undefined;
//   chartLabels: string[];
//   isDemo?: boolean;
// }) => {
//   const labels: string[] = chartLabels;
//   const chartOptions = useChartOptions(labels);

//   const hasNoData =
//     chartsValues?.length === 0 || chartsValues?.every((value) => value === 0);

//   return (
//     <>
//       {" "}
//       {hasNoData ? (
//         <NoRecordData
//           title={true}
//           text={"no results found"}
//           imageSize={110}
//           cardHeight={"27vh"}
//           fontSize={"18px"}
//         />
//       ) : (
//         <Chart
//           height={275}
//           options={chartOptions}
//           series={chartsValues}
//           type="donut"
//         />
//       )}
//       <Table sx={{ mt: isDemo ? 10 : 0 }}>
//         <TableHead
//           sx={{
//             [`& .${tableCellClasses.root}`]: {
//               background: "transparent",
//             },
//           }}
//         >
//           <TableRow>
//             <TableCell>Monthly View</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody
//           sx={{
//             [`& .${tableCellClasses.root}`]: {
//               border: 0,
//             },
//           }}
//         >
//           {chartsValues?.map((item, index) => {
//             const amount = numeral(item).format("0");

//             return (
//               <TableRow key={index}>
//                 <TableCell>
//                   <Box
//                     sx={{
//                       alignItems: "center",
//                       display: "flex",
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         backgroundColor: chartOptions.colors![index],
//                         borderRadius: "50%",
//                         height: 8,
//                         mr: 1,
//                         width: 8,
//                       }}
//                     />
//                     <Typography variant="subtitle2">{labels[index]}</Typography>
//                   </Box>
//                 </TableCell>
//                 <TableCell align="right">
//                   <Typography color="text.secondary" variant="body2">
//                     {amount}
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>
//     </>
//   );
// };
