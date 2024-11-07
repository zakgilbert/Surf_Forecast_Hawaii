import React, {useState, useEffect} from "react";
import { Container, Header, Button, Icon, Menu, Popup, Table, TableCell } from 'semantic-ui-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import moment from 'moment'; // Import moment.js for date formatting
const Tide = ({id}) => {

    const data = { "predictions" : [
        {"t":"2024-11-06 06:18", "v":"2.147", "type":"H"},{"t":"2024-11-06 21:56", "v":"0.186", "type":"L"},{"t":"2024-11-07 07:21", "v":"2.095", "type":"H"},{"t":"2024-11-07 16:46", "v":"0.441", "type":"L"},{"t":"2024-11-07 18:47", "v":"0.527", "type":"H"},{"t":"2024-11-07 22:54", "v":"0.328", "type":"L"}
        ]}
    console.log(data)
        

    return (((data !== undefined) ) ? (
        <Container textAlign="center">
            <Header as="h2" color="blue">Tide</Header>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.predictions} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="t" 
                        tickFormatter={(timeStr) => 
                            moment(timeStr, 'YYYY-MM-DD hh:mm A').format('MMM D, h:mm A')} // Format for x-axis
                    />
                     <YAxis
                     label={{ value: 'Height in ft', angle: -90, position: 'insideLeft' }} 
                     />
                    <Tooltip 
                        formatter={(value, name, props) => {
                            const dateTime = moment(props.payload.dataTime, 'YYYY-MM-DD hh:mm A'); // Specify format
                            return [`Value: ${value}ft`]; // Return formatted value and dateTime
                        }}
                        labelFormatter={(label) => {
                            const dateTime = moment(label, 'YYYY-MM-DD hh:mm A'); // Specify format
                            if (!dateTime.isValid()) {
                                console.error('Invalid label date:', label);
                                return 'Invalid date';
                            }
                            return `Date: ${dateTime.format('MMM D, YYYY h:mm A')}`; // Format the label
                        }} 
                    />
                    <Legend />
                    <Line type="natural" dataKey="v" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </Container>
    ) : (<></>))

}
export default Tide