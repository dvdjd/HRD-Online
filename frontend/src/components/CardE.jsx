import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import React, {useState, useEffect} from 'react'
import { Worker, Viewer} from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

const CardE = ({pdfFile}) => {

    const newplugin = defaultLayoutPlugin()
    const [pdf, setPdf] = useState("")
    const [pdfKey, setPdfKey] = useState(0)
    const handleSetPdf = (p) => {
        setPdfKey((prev) => prev + 1)
        setPdf(p)
    }
    useEffect(() => {
        pdfFile === "" ? undefined : handleSetPdf(pdfFile.uploadName)
    }, [pdfFile])
    return (
        <>
            <Box sx={{ minWidth: 275, mb: 2, height: "90%"}}>
                <Card variant="outlined" sx={{borderRadius: '10px', mb: 2, height: "100%"}}>
                    <CardContent sx={{paddingBottom: 0, height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        {pdf === "" ? (<h1>Please select from the left</h1>) : (
                            <div className="pdf-container" style={{width: '100%', height: '95%'}}>
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                    <Viewer key={pdfKey} fileUrl={`http://192.168.5.12:4000/hr_uploads/${pdf}`} plugins={[newplugin]} />
                                </Worker>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default CardE