import React from 'react'
import { Card, CardContent, Typograph, Typography } from '@material-ui/core'
import './InfoBox.css'

function InfoBox({ title, cases, total, active, isRed, ...props }) {  // onClick will be inside of ...props
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`}>  
            <CardContent>                                             {/* -- because this is not an element but a modification */}
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>

                <h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>{cases}</h2>

                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
