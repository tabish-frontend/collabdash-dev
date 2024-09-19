import { Skeleton, TableBody, TableCell, TableRow } from "@mui/material";

export const ListSkeleton = (count: number, cols: number) => {
  return Array.from({ length: count }, (_, index) => (
    <TableBody key={index}>
      <TableRow key={index}>
        <TableCell
          colSpan={1}
          align="center"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Skeleton variant="circular" width={48} height={48} />
        </TableCell>
        <TableCell colSpan={cols}>
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="100%" />
        </TableCell>
      </TableRow>
    </TableBody>
  ));
};
