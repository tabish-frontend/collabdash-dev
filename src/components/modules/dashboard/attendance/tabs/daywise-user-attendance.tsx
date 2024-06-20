// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { useCallback, useEffect, useState } from 'react'
import { attendanceApi } from 'src/api'
import { formatDate, formatDuration, formatTime } from 'src/utils/helpers'
import { useAuth } from 'src/hooks'
import { AuthContextType } from 'src/contexts/auth'

const columns = ['Full Name', 'Shift Type', 'Shift Start', 'Shift End', 'ClockIn Time', 'ClockOut Time', 'Status']
const attendanceData = [
    {
        fullName: "Tabish Dehlvi",
        shiftType: "Morning",
        shiftStart: "10:00 AM",
        shiftEnd: "7:00 PM",
        clockInTime: "10:00 AM",
        clockOutTime: "7:00 PM",
        status: "Present"
    },
    {
        fullName: "Mouzzam Khan",
        shiftType: "Evening",
        shiftStart: "10:00 AM",
        shiftEnd: "7:00 PM",
        clockInTime: "03:00 PM",
        clockOutTime: "11:00 PM",
        status: "Present"
    },
    {
        fullName: "Zain Ahsan",
        shiftType: "Morning",
        shiftStart: "10:00 AM",
        shiftEnd: "7:00 PM",
        clockInTime: "10:00 AM",
        clockOutTime: "7:00 PM",
        status: "Present"
    },
]

export const DayWiseUserAttendance = ({ filters }: any) => {

    const [employees, setEmployees] = useState<undefined | []>([]);

  const handleGetAttendances = useCallback(async () => {
    const response = await attendanceApi.getAllUserAttendance(filters);
    let filteredEmployees = response.data;


    setEmployees(filteredEmployees);
  }, [filters]);

  useEffect(() => {
    handleGetAttendances();
  }, [handleGetAttendances]);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 8 }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label='sticky table'>
                    <TableHead>
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableCell key={index} align='center'>
                                    <span style={{ fontWeight: 700 }}>{column}</span>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendanceData.map((attendance, index) => (
                            <TableRow hover role='checkbox' key={index}>
                                <TableCell align='center'>{attendance.fullName}</TableCell>
                                <TableCell align='center'>{attendance.shiftType}</TableCell>
                                <TableCell align='center'>{attendance.shiftStart}</TableCell>
                                <TableCell align='center'>{attendance.shiftEnd}</TableCell>
                                <TableCell align='center'>{attendance.clockInTime}</TableCell>
                                <TableCell align='center'>{attendance.clockOutTime}</TableCell>
                                <TableCell align='center'>
                                    {attendance.status}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
