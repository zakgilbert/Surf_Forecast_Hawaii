import React, {useState, useEffect} from "react";
import { Container, Header, Button, Icon, Menu, Popup, Table, TableCell, Text } from 'semantic-ui-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import moment from 'moment'; // Import moment.js for date formatting
const Forecast = ({id}) => {
    const [data, setData] = useState([{}])
    
    useEffect(() => {
        fetch(`/forecast`).then(
            res => res.json()
        ).then(
            data => {
               setData(data) 
               console.log(data)
            }
        )
    }, [id])

    return (((data !== undefined) ) ? (
        <div>
        <h1>Surf Zone Forecast</h1>
        {data.length > 0 ? (
            data.map((segment) => (
                <div key={segment.segment_number} style={{ marginBottom: '20px' }}>
                    <h2>Segment {segment.segment_number}</h2>
                    <p>{segment.forecast_text}</p>
                </div>
            ))
        ) : (
            <p>Loading forecast...</p>
        )}
    </div>
    ) : (<></>))

}
export default Forecast