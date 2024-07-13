import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { format } from "date-fns";

const columns = [
  { id: "number", label: "Nomor", minWidth: 50 },
  { id: "timestamp", label: "Timestamp", minWidth: 150 },
  { id: "roll", label: "Roll", minWidth: 70 },
  { id: "pitch", label: "Pitch", minWidth: 70 },
  { id: "yaw", label: "Yaw", minWidth: 100 },
];

export default function StickyHeadTable() {
  const [data, setData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:3000/data/mpu";
        const response = await axios.get(url);

        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Fetch data for the first time

    const intervalId = setInterval(fetchData, 1000); // Fetch data every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">
                      {format(
                        new Date(row.timestamp),
                        "yyyy-MM-dd HH:mm:ss.SS"
                      )}
                    </TableCell>
                    <TableCell align="center">{row.roll}</TableCell>
                    <TableCell align="center">{row.pitch}</TableCell>
                    <TableCell align="center">{row.yaw}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
