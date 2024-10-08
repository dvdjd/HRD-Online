import React, { useEffect, useState } from 'react'
import styleOrig from '../style/style.module.css'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import notFound from '../style/images/notFound.jpg'
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import CancelIcon from '@mui/icons-material/Cancel';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { hrUpload, getHrUpload, getByMenu, removeItem, updateItem} from '../services/LandingPageAPI';
import { useParams } from 'react-router-dom';
import { Worker, Viewer} from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { isAdmin, isDeptESH } from '../utils/global';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useLocation } from 'react-router-dom';

const PDF3 = () => {
    const location = useLocation()
    const newplugin = defaultLayoutPlugin()
    const fullScreenPluginInstance = fullScreenPlugin()
    const { EnterFullScreen } = fullScreenPluginInstance;
    const zoomPluginInstance = zoomPlugin()
    const { Zoom } = zoomPluginInstance
    const [pdf, setPdf] = useState('')
    const [pdfKey, setPdfKey] = useState(0)
    const {cat} = useParams()
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {xs: 200, md: 600},
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 1,
    };
    const [openLoginFolder, setOpenLoginFolder] = useState(false);
    const [openLoginFile, setOpenLoginFile] = useState(false);
    const [openDelete, setOpenDelete] = useState(false)

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const [menus, setMenus] = useState([])
    const [inputPDF, setInputPDF] = useState()
    const [sendFile, setSendFile] = useState()
    const [hasSelected, setHasSelected] = useState(false)
    const [folderName, setFolderName] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [keyNum, setKeyNum] = useState(0)
    const [mode, setMode] = useState("")
    const handleSelectPDF = (e) => {
        const file = e.target.files[0]
        setSendFile(file)
        setInputPDF(URL.createObjectURL(file))
        setTimeout(() => {
            setHasSelected(true)
            setPdfKey((prev) => prev + 1)
        }, 2000)
    }
   
    const handleOpenFolder = () => {
        setMode("folder")
        setFolderName("")
        setDisplayName("")
        setOpenLoginFolder(true)
    };
    const handleCloseFolder = () => {
        setOpenLoginFolder(false)
    };
    const handleCloseFile = () => {
        setOpenLoginFile(false)
    };
    const [activeFolder, setActiveFolder] = useState()
    const [activeSubFolder, setActiveSubFolder] = useState()
    const [folderArr, setFolderArr] = useState([])
    const [isEdit , setIsEdit] = useState(false)
    const [isESH, setIsESH] = useState(false)
    const handleSubmitFolder = async (e) => {
        e.preventDefault()
        console.log(mode)
        if(folderName === "" || hasSelected === false || displayName === ""){
            alert("Kindly input folder name, display name and attached a pdf file.")
        }
        else{
            const newDate = Date.now()
            let formData = new FormData()
            // formData.append('type', uploadType.replace(/'/g, "\\'"))
            formData.append('type', cat)
            formData.append('file_name', newDate)
            formData.append('file', sendFile)
            formData.append('display_name', displayName)
            formData.append('menu', folderName)
            const upload = await hrUpload(formData)
            if(mode === "folder"){
                setMenus([{
                    uploadMenu : folderName,
                    isOpen: true,
                    files: [{file: `${newDate}.pdf`, name:displayName}]
                }, ...menus])
            }
            else{
                const upNestedArr = [...menus]
                console.log(upNestedArr[mode])
                const innerCopy = upNestedArr[mode]
                innerCopy.files.push({
                    file: `${newDate}.pdf`,
                    name: displayName
                })
                upNestedArr[mode] = innerCopy
                setMenus(upNestedArr)
            }
            setMenus(prev => {
                return prev.map((item, index) => {
                    return {...item, isOpen: index === 0 ? true : false}
                })
            })
            setFolderName("")
            setDisplayName("")
            setHasSelected(false)
            handleCloseFolder()
            handleCloseFile()
            //handleCloseFile()
            //window.location.reload()
        }
    }

    /*----------------------Nested List -------------------*/
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };
    useEffect(() => {
        const getMenu = async () => {
            const gMenu = await getByMenu({type: cat})
            gMenu.data.menu.length > 0 ? setMenus(gMenu.data.menu): undefined
        }
        getMenu()
    }, [hasSelected])

    useEffect(() => {
        setIsESH(location.pathname.includes('esh') ? true : false)
    }, [location])

    return (
        <>
            <br /><br />
            <div className={styleOrig['flex-container']}>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openDelete}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={openDelete}>
                        <Card sx={style} >
                            <Stack direction="row-reverse" spacing={1}>
                                <IconButton aria-label="delete" size="medium" onClick={() => setOpenDelete(false)}>
                                    <CancelIcon fontSize="inherit" sx={{color: 'red'}} />
                                </IconButton>
                            </Stack>
                            
                            <form onSubmit={async (e) => {
                                e.preventDefault()
                                folderArr.length > 1 ? 
                                    folderArr.forEach(async (item) => {
                                        await removeItem({id: item.id})
                                    })
                                :
                                    await removeItem({id: folderArr[0]})
                                window.location.reload()
                            }} >
                                <CardContent>
                                    <Typography sx={{textAlign: 'center'}} variant='h6'>Are you sure you want to delete this file/s?</Typography>
                                    <Box display={'flex'} justifyContent={'flex-end'} m={'20px 0 10px 0'}>
                                        <Button variant='outlined' sx={{ mr: '10px'}} color='error' type='submit'>Confirm</Button>
                                        <Button variant='contained' onClick={() => setOpenDelete((prev) => !prev)}>Cancel</Button>
                                    </Box>
                                </CardContent>
                            </form>
                        </Card>
                    </Fade>
                </Modal>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openLoginFolder}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={openLoginFolder}>
                        <Card sx={style} >
                            <Stack direction="row-reverse" spacing={1}>
                                <IconButton aria-label="delete" size="medium" onClick={handleCloseFolder}>
                                    <CancelIcon fontSize="inherit" sx={{color: 'red'}} />
                                </IconButton>
                            </Stack>
                            
                            <form onSubmit={handleSubmitFolder} >
                                <CardContent>
                                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                                        <TextField id="outlined-basic" label="Folder Name..." variant="outlined" size='small' onChange={(e) => setFolderName(e.target.value)}/>
                                        <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%", mb: 2 }}>
                                            <InputBase
                                                sx={{ ml: 1, flex: 1 }}
                                                placeholder="Enter Display Name ..."
                                                inputProps={{ 'aria-label': 'upload file' }}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                            />
                                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                            <Button component="label" sx={{justifyContent: 'center'}}>
                                                <CloudUploadIcon />
                                                <VisuallyHiddenInput type="file" accept="application/pdf" onChange={handleSelectPDF}/>
                                            </Button>
                                        </Paper>
                                    </Stack>
                                    
                                    {hasSelected ? (
                                        <>
                                            <div className="pdf-container" style={{width: '100%', height: '400px'}}>
                                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                                    <Viewer key={pdfKey} fileUrl={inputPDF} plugins={[newplugin]} />
                                                </Worker>
                                            </div>
                                        </>
                                    ) : undefined}
                                    <Button size="medium" sx={{width: '100%', background : '#1976d2', mt: 2}} variant="contained" disableElevation type="submit">Submit</Button>
                                </CardContent>
                            </form>
                        </Card>
                    </Fade>
                </Modal>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openLoginFile}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={openLoginFile}>
                        <Card sx={style} >
                            <Stack direction="row-reverse" spacing={1}>
                                <IconButton aria-label="delete" size="medium" onClick={handleCloseFile}>
                                    <CancelIcon fontSize="inherit" sx={{color: 'red'}} />
                                </IconButton>
                            </Stack>
                            
                            <form onSubmit={isEdit ? 
                                async (e) => {
                                    e.preventDefault()
                                    let formData = new FormData()
                                    if(hasSelected === false || displayName === ""){
                                        alert("Kindly input display name and attached a pdf file.")
                                    }
                                    else{
                                        formData.append('id', folderArr)
                                        formData.append('type', cat)
                                        formData.append('display_name', displayName)
                                        formData.append('file_name', Date.now())
                                        formData.append('file', sendFile)
                                        console.log(await updateItem(formData))
                                        setOpenLoginFile(false)
                                        window.location.reload()
                                    }
                                    
                                }
                                : handleSubmitFolder} >
                                <CardContent>
                                    <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%", mb: 2 }}>
                                        <InputBase
                                            sx={{ ml: 1, flex: 1 }}
                                            placeholder="Enter Display Name ..."
                                            inputProps={{ 'aria-label': 'upload file' }}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            value={displayName}
                                        />
                                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                        <Button component="label" sx={{justifyContent: 'center'}}>
                                            <CloudUploadIcon />
                                            <VisuallyHiddenInput type="file" accept="application/pdf" onChange={handleSelectPDF}/>
                                        </Button>
                                    </Paper>
                                    {hasSelected ? (
                                        <>
                                            <div className="pdf-container" style={{width: '100%', height: '400px'}}>
                                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                                    <Viewer key={pdfKey} fileUrl={inputPDF} plugins={[newplugin]} />
                                                </Worker>
                                            </div>
                                        </>
                                    ) : undefined}
                                    <Button size="medium" sx={{width: '100%', background : '#1976d2', mt: 2}} variant="contained" disableElevation type="submit">Submit File</Button>
                                </CardContent>
                            </form>
                        </Card>
                    </Fade>
                </Modal>
                <div className={`${styleOrig["flex-item"]} ${styleOrig["small"]}`}>
                    <Box sx={{ minWidth: 275, mb: 2, height : "95%"}}>
                        <Card variant="outlined" sx={{borderRadius: '10px', mb: 2}}>
                            <CardContent >
                                {/* {isAdmin() === 1 ? (
                                    <Button variant="outlined" endIcon={< AddCircleIcon/>} onClick={handleOpenFolder} sx={{width: '100%'}}>Add</Button>
                                ) : undefined} */}
                                {isESH ? isDeptESH() === 1 ? (
                                    <Button variant="outlined" endIcon={< AddCircleIcon/>} onClick={handleOpenFolder} sx={{width: '100%'}}>Add</Button>
                                ) : undefined : isAdmin() === 1 ? (
                                    <Button variant="outlined" endIcon={< AddCircleIcon/>} onClick={handleOpenFolder} sx={{width: '100%'}}>Add</Button>
                                ) : undefined}
                                <List
                                    sx={{ width: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', borderStyle: 'none', boxShadow: 'none'}}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                >
                                    {menus.length > 0 ? menus.map((menu, index) => (
                                        <React.Fragment key={index}>
                                            <ListItemButton
                                                sx={{width: '100%'}}
                                                onClick={() => {
                                                    menu.isOpen = menu.isOpen ? false : true
                                                    setKeyNum((prev) => prev + 1)
                                                    setFolderArr(menus[index].files)
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <FolderOutlinedIcon
                                                        sx={{color: activeFolder === index ? 'rgb(66, 165, 245, 0.5)' : 'none'}}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    secondary={<Typography variant='body1'>
                                                        {
                                                            menu.uploadMenu
                                                        }
                                                    </Typography>}
                                                    sx={{color: activeFolder === index ? 'rgb(66, 165, 245, 0.5)' : 'none'}}    
                                                />
                                                {isESH ? isDeptESH() === 1 ? (
                                                    <>
                                                        <AddCircleOutlineOutlinedIcon
                                                            sx={{
                                                                marginRight: 1,
                                                                color: activeFolder === index ? 'rgb(66, 165, 245, 0.5)' : 'none'
                                                            }}
                                                            onClick={() => {setMode(index), setFolderName(menu.uploadMenu), setOpenLoginFile(true)}}
                                                        />
                                                        <DeleteOutlinedIcon
                                                            sx={{
                                                                marginRight: 1,
                                                                color: activeFolder === index ? 'rgb(255, 0, 0, 0.5)' : 'none'
                                                            }}
                                                            onClick={() => setOpenDelete(true)}
                                                        />
                                                    </>
                                                ) : undefined : isAdmin() === 1 ? (
                                                    <>
                                                        <AddCircleOutlineOutlinedIcon
                                                            sx={{
                                                                marginRight: 1,
                                                                color: activeFolder === index ? 'rgb(66, 165, 245, 0.5)' : 'none'
                                                            }}
                                                            onClick={() => {setMode(index), setFolderName(menu.uploadMenu), setOpenLoginFile(true)}}
                                                        />
                                                        <DeleteOutlinedIcon
                                                            sx={{
                                                                marginRight: 1,
                                                                color: activeFolder === index ? 'rgb(255, 0, 0, 0.5)' : 'none'
                                                            }}
                                                            onClick={() => setOpenDelete(true)}
                                                        />
                                                    </>
                                                ) : undefined}
                                                
                                                {menu.isOpen ? <ExpandLess
                                                                    sx={{color: activeFolder === index ? '#42A5F5' : 'none'}}
                                                                /> : <ExpandMore
                                                                    sx={{color: activeFolder === index ? '#42A5F5' : 'none'}}
                                                                />}
                                            </ListItemButton>
                                            <Collapse in={menu.isOpen} timeout="auto" unmountOnExit sx={{width: '100%'}} key={keyNum}>
                                                <List component="div" disablePadding sx={{width: '100%'}}>
                                                    {menu.files.map((menuFile, fileIndex) => (
                                                        <ListItemButton sx={{ pl: 4 }} key={fileIndex} onClick={() => {setPdf(menuFile.file), setPdfKey(prev => prev + 1), setActiveFolder(index), setActiveSubFolder(fileIndex)}}>
                                                            
                                                            <ListItemText
                                                                secondary={<Typography variant='caption'>
                                                                    {
                                                                        menuFile.name
                                                                    }
                                                                </Typography>}
                                                                sx={{color: activeFolder === index && activeSubFolder === fileIndex ? '#42A5F5' : 'none'}}
                                                            />
                                                            {isESH ? isDeptESH() === 1 ? (
                                                                <>
                                                                    <DeleteOutlinedIcon
                                                                        sx={{
                                                                            color: activeFolder === index && activeSubFolder === fileIndex ? 'rgb(255, 0, 0)' : 'none',
                                                                            mr: '5px'
                                                                        }}
                                                                        onClick={() => {
                                                                            setFolderArr([menuFile.id])
                                                                            setOpenDelete(true)
                                                                        }}
                                                                    />
                                                                    <EditOutlinedIcon
                                                                        sx={{
                                                                            color: activeFolder === index && activeSubFolder === fileIndex ? '#42A5F5' : 'none'
                                                                        }}
                                                                        onClick={() => {
                                                                            setIsEdit(true)
                                                                            setFolderArr(menuFile.id)
                                                                            setDisplayName(menuFile.name)
                                                                            setOpenLoginFile(true)
                                                                        }}
                                                                    />
                                                                </>
                                                            ) : undefined : isAdmin() === 1 ? (
                                                                <>
                                                                    <DeleteOutlinedIcon
                                                                        sx={{
                                                                            color: activeFolder === index && activeSubFolder === fileIndex ? 'rgb(255, 0, 0)' : 'none',
                                                                            mr: '5px'
                                                                        }}
                                                                        onClick={() => {
                                                                            setFolderArr([menuFile.id])
                                                                            setOpenDelete(true)
                                                                        }}
                                                                    />
                                                                    <EditOutlinedIcon
                                                                        sx={{
                                                                            color: activeFolder === index && activeSubFolder === fileIndex ? '#42A5F5' : 'none'
                                                                        }}
                                                                        onClick={() => {
                                                                            setIsEdit(true)
                                                                            setFolderArr(menuFile.id)
                                                                            setDisplayName(menuFile.name)
                                                                            setOpenLoginFile(true)
                                                                        }}
                                                                    />
                                                                </>
                                                            ) : undefined}
                                                            
                                                        </ListItemButton>
                                                    ))}
                                                </List>
                                            </Collapse>
                                        </React.Fragment>
                                    )) : undefined}
                                </List>
                            </CardContent>
                        </Card>
                    </Box>
                </div>
                <div className={`${styleOrig["flex-item"]} ${styleOrig["large"]}`}>
                    <Box sx={{ minWidth: 275, mb: 2, height : "90%"}}>
                        <Card variant="outlined" sx={{borderRadius: '10px', mb: 2}}>
                            <CardContent >
                                <Stack direction="row-reverse" justifyContent="space-between" spacing={2} sx={{pb: 1}}>
                                    <div>
                                        {/* <IconButton aria-label="edit" size="large" sx={{color : "#42a5f5"}}>
                                            <EnterFullScreen />
                                        </IconButton> */}
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <EnterFullScreen />
                                            <Zoom />
                                        </div>
                                    </div>
                                </Stack>
                                {pdf != "" ? (
                                    <div className="pdf-container" style={{height : "750px", overflow: 'auto'}}>
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                            <Viewer key={pdfKey} fileUrl={`http://192.168.5.3:4000/hr_uploads/${pdf}`} plugins={[fullScreenPluginInstance, zoomPluginInstance]} />
                                        </Worker>
                                    </div>
                                ) : (
                                    <>
                                        <hr />
                                        <img src={notFound} alt="Not Found" width="40%" height="auto" style={{display: 'block', margin: "auto"}}/>
                                        <h2 style={{textAlign: "center", margin: 0}}>No file found</h2>
                                    </>
                                    
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                </div>
            </div>
        </>
    )
}

export default PDF3