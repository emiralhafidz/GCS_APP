import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";

const columns = [
  { id: "number", label: "Nomor", minWidth: 100 },
  { id: "timestamp", label: "Timestamp", minWidth: 170 },
  { id: "mqttResponse", label: "MQTT Res", minWidth: 100 },
  { id: "kafkaResponse", label: "Kafka Res", minWidth: 100 },
  { id: "mqttLatency", label: "MQTT Lat", minWidth: 100 },
  { id: "kafkaLatency", label: "Kafka Lat", minWidth: 100 },
  { id: "sumResponse", label: "Response", minWidth: 100 },
  { id: "sumLatency", label: "Latency", minWidth: 100 },
];

export default function StickyHeadTable() {
  const [data, setData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const printTableRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:3000/data/response";
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
  const handlePrint = useReactToPrint({
    content: () => printTableRef.current,
    documentTitle: "Sensor Data Table",
  });

  return (
    <div style={{ width: "100%" }}>
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
                      <TableCell align="center">{row.mqttResponse}</TableCell>
                      <TableCell align="center">{row.kafkaResponse}</TableCell>
                      <TableCell align="center">{row.mqttLatency}</TableCell>
                      <TableCell align="center">{row.kafkaLatency}</TableCell>
                      <TableCell align="center">{row.sumResponse}</TableCell>
                      <TableCell align="center">{row.sumLatency}</TableCell>
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
      <button
        onClick={handlePrint}
        style={{
          color: "white",
          border: "none",
          backgroundColor: "#2b9fed",
          padding: "3px 15px",
          margin: "9px 0px",
          cursor: "pointer",
          borderRadius: "3px",
        }}
      >
        Print
      </button>
      <div style={{ display: "none" }}>
      <Table ref={printTableRef} style={{ width: "90%", margin: "auto" }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow style={{ backgroundColor: "gray" }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="{column.align}"
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
                      <TableCell align="center">{row.mqttResponse}</TableCell>
                      <TableCell align="center">{row.kafkaResponse}</TableCell>
                      <TableCell align="center">{row.mqttLatency}</TableCell>
                      <TableCell align="center">{row.kafkaLatency}</TableCell>
                      <TableCell align="center">{row.sumResponse}</TableCell>
                      <TableCell align="center">{row.sumLatency}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
      </div>
    </div>
  );
}
