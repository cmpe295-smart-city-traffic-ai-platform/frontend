import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const TableDevice = (device) =>{
  const tableHeaders = Object.keys(device.device)
  const tableValues = Object.values(device.device)
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {tableHeaders.map((header, index) => (
              <StyledTableCell key={index} align='right'>{header}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
            <StyledTableRow>
              {tableValues.map((value, index) => (
                <StyledTableCell key={index} align='right'>{value !== null ? value.toString() : "--"}</StyledTableCell>
              ))}
            </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default TableDevice;