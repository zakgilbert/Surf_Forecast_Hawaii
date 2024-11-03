
import React, { useState, useEffect } from "react"
import { Icon, Label, Menu, Popup, Table, TableCell } from 'semantic-ui-react'

const StationInput = ({ id }) => {
    const [data, setData] = useState([{}])


    useEffect(() => {
        fetch(`/report/${id}`).then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
            }
        )
    }, [id])

    return (((data.cols !== undefined) && (data.rows !== undefined)) ? (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    {
                        data.cols.map((col) =>
                            <Popup trigger=
                                {
                                    <Table.HeaderCell key={col} >{col.value}</Table.HeaderCell>
                                }>
                                {col.toolTip}
                            </Popup>)
                    }
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    data.rows.map((row) =>
                        <Table.Row key={row}>
                            {
                                row.map((val) =>
                                    <TableCell key={val}>{val}</TableCell>)
                            }
                        </Table.Row>
                    )
                }
            </Table.Body>
        </Table>
    ) : (<></>))
}
export default StationInput
