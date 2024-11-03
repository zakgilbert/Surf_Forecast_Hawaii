import React, {useState, useEffect} from "react";
import { Button, Icon, Label, Menu, Popup, Table, TableCell } from 'semantic-ui-react'


const Power = ({id}) => {
    const [data, setData] = useState([{}])
    
    useEffect(() => {
        fetch(`/power/${id}`).then(
            res => res.json()
        ).then(
            data => {
               setData(data) 
               console.log(data)
            }
        )
    }, [id])

    return (((data !== undefined) ) ? (
        <Button size='small' color='green'>
        <Icon name='download' />
        Download
      </Button>
    ) : (<></>))

}
export default Power