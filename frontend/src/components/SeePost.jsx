import React, {useState, useRef, useImperativeHandle, forwardRef, useEffect} from 'react'
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Fade from '@mui/material/Fade';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CancelIcon from '@mui/icons-material/Cancel';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Me from '../style/images/me.png'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { countReact, getUser, checkReact, reactPost} from '../services/LandingPageAPI';
import { capitalizeWords } from '../utils/global';
import moment from 'moment';

import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { TextSnippetTwoTone } from '@mui/icons-material';
import { Document, Page } from 'react-pdf';

import SeePostCSS from './SeePost.module.css'
import CardCCSS from './CardCCSS.module.css'
import {AiFillLike, AiFillHeart, AiOutlineLike} from 'react-icons/ai'
import {FaRegCommentAlt} from 'react-icons/fa'
import {FaLaughSquint, FaSadTear, FaSadCry, FaAngry} from 'react-icons/fa'
import {ImShocked2} from 'react-icons/im'
import AvatarGroup from '@mui/material/AvatarGroup';
import Popper from '@mui/material/Popper';

import InputBase from '@mui/material/InputBase';
import SendIcon from '@mui/icons-material/Send';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';

import { Worker, Viewer} from '@react-pdf-viewer/core';
import { DefaultLayoutPlugin, defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import samplePDF from '../style/images/pdf-succinctly.pdf'

const SeePost = forwardRef(({content}, ref) => {
    const[showFullCaption, setShowFullCaptio] = useState(false)
    const captionText = showFullCaption ? content.p.postCaption : content.p.postCaption.length > 400 ? `${(content.p.postCaption).substring(0, 400)}...Show more` : content.p.postCaption
    const style = {
        position: 'absolute',
        width: {xs: 320, md: '90%'},
        height: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 1,
        overflowY: 'auto',
        marginTop: '50px',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: {xs: 'column', md: 'row'}
    };
    const [post, setPost] = useState(false);
    const [poster, setPoster] = useState(null)
    const [postDate, setPostDate] = useState(null)
    const handleOpenPost = () => setPost(true);
    useImperativeHandle(ref, () => ({handleOpenPost}))
    const handleClosePost = () => setPost(false);
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setVideoKey(prev => prev + 1)
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setVideoKey(prev => prev + 1)
    };
    const [videoKey, setVideoKey] = useState(0)
    const newplugin = defaultLayoutPlugin()

    /*---------------------react-----------------*/
    let [countLike, setCountLike] = useState(0)
    let [likeList, setLikeList] = useState({data: []})
    const handleAddtoLikeList = () => {
        setLikeList((prevState) => `You, ${prevState}`)
    }
    /*Yung react na button na parang facebook */
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState();

    const handleHoverOpen = (newPlacement) => (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => placement !== newPlacement || !prev);
        setPlacement(newPlacement);
    };
    const handleHoverClose = (newPlacement) => (event) => {
        setAnchorEl(null);
        setOpen((prev) => placement !== newPlacement || !prev);
        setPlacement(newPlacement);
    };
    let [like, setLike] = useState('none')
   
    const handleSetLike = (l) => {
        let mode = 0
        if(like === l){
            setLike('none')
            mode = 2
        }
        else{
            setLike(l)
            mode = 1
        }
        const rPost = async () => {
            const r = await reactPost({
                post_id : content.p.ID,
                user_id : `${JSON.parse(sessionStorage.getItem('user')).ID_No}`,
                react_type : l,
                mode: mode
            })
            return r
        }
        rPost()
    }
    const handleLikeIncrement = () => {
        setCountLike((prevState) => prevState + 1)
    }
    const handleLikeDecrement = () => {
        setCountLike((prevState) => prevState - 1)
    }
    /*---------------------comment---------------*/
    const [commentList, setCommentList] = useState([
        {
            id: 0,
            name: `Jude David Acula`,
            department: `Systems`,
            avatar: `/static/images/avatar/1.jpg`,
            comment: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel risus vel arcu sodales gravida. Nunc facilisis massa quis fringilla. Fusce a ligula eu nulla eleifend iaculis. Praesent id scelerisque nulla. Vestibulum et urna a elit sollicitudin vehicula ut eu leo. Vestibulum fermentum, turpis sit amet auctor facilisis, ex nisi vulputate nulla, vel consequat dolor nisi eu tortor. Sed a metus a orci laoreet vehicula vel et sapien. Fusce eget justo nec libero laoreet convallis id in metus. Integer tincidunt ante vitae justo vestibulum, a rhoncus urna mattis. Sed sit amet mi bibendum, malesuada leo eu, tincidunt tortor. Donec nec leo eu urna elementum congue id nec purus. Suspendisse potenti. Nulla facilisi. Nunc bibendum lorem eu metus varius eleifend. Suspendisse potenti. Integer et nunc eget justo hendrerit convallis. Vivamus euismod luctus augue in mattis. Fusce ac auctor nunc. Nunc interdum risus sed auctor tincidunt. Vivamus ac nulla ac mi tincidunt viverra nec nec odio. Suspendisse potenti. Curabitur suscipit erat ut ex efficitur, quis viverra nisi ullamcorper. In hac habitasse platea dictumst. Duis vestibulum, dui ut tempus iaculis, metus justo bibendum tellus, eu pellentesque sapien tellus eget nisl. Proin vehicula diam ac efficitur. Integer sodales bibendum lectus, et bibendum libero blandit non. Curabitur dapibus, urna ut accumsan tincidunt, odio ex vehicula nisi, non vestibulum tellus massa quis neque. In hac habitasse platea dictumst. Integer iaculis eu elit eu luctus. Quisque eget justo nec est varius bibendum. Vivamus bibendum mi sit amet lacinia venenatis. Nulla facilisi. Quisque fermentum augue a purus consequat, et feugiat orci tincidunt. Donec congue ligula vel arcu vulputate tincidunt. Curabitur at augue viverra, pellentesque arcu eu, auctor libero. Nullam vitae mauris in mi maximus euismod. Sed eget tristique odio. Quisque nec felis vitae arcu lacinia pellentesque. Nullam nec justo eget neque pharetra blandit. In ultricies libero in urna mattis, id facilisis ligula consectetur. Fusce vehicula, erat eu blandit pharetra, mi justo tempor justo, a vulputate urna est ut arcu.`,
            showFullComment: false,
            date: 'September 12, 2023',
            time: '1:30 PM'
        },
        {
            id: 1,
            name: `Kent Steven Yedra`,
            department: `Systems`,
            avatar: `/static/images/avatar/2.jpg`,
            comment: `-Wish I could come, but I'm out of town this week...`,
            showFullComment: false,
            date: 'September 12, 2023',
            time: '2:05 PM'
        },
        {
            id: 2,
            name: `Rencell Arcillas`,
            department: `Systems`,
            avatar: `/static/images/avatar/3.jpg`,
            comment: `-Do you have Paris recommendations? Have you ever there?`,
            showFullComment: false,
            date: 'September 12, 2023',
            time: '2:57 PM'
        },
    ])
    const [showComment, setShowComment] = useState(false)
    const handleShowComment = () => {
        showComment ? setShowComment(false) : setShowComment(true)
    }
    const handleShowFullComment = (id, stat) => {
        const updatedCommentList = [...commentList]
        const indexToUpdate = updatedCommentList.findIndex(item => item.id === id)
        if(indexToUpdate !== -1){
            updatedCommentList[indexToUpdate].showFullComment = stat
            setCommentList(updatedCommentList)
        }
    }
    const [myComment, setMyComment] = useState('')
    const handleChangeMyComment = (event) => {
        setMyComment(event.target.value)
    }
    const handleSubmitMyComment = (event) => {
        event.preventDefault()
        const newComment = {
            //id: commentList[commentList.length - 1].id + 1,
            name: `Jhobert Erato`,
            department: `Systems`,
            avatar: `/static/images/avatar/3.jpg`,
            comment: myComment,
            showFullComment: false,
            date: 'September 13, 2023',
            time: '07:12 AM'
        }
        setCommentList([...commentList,newComment])
        event.target.clear
    }
    const validComment = (strng) => {
        const regex = /\S/
        return regex.test(strng)
    }

    const handleClose = () => {
        setPost(false)
    }

    useEffect(() => {
        const today = new Date()
        const today2 = new Date()
        today.setHours(0, 0, 0, 0)
        if(moment(content.p.postDate).tz('Asia/Manila').format('MMMM DD, YYYY') === moment(today).tz('Asia/Manila').format('MMMM DD, YYYY')){
            if(today2.getHours() == moment(content.p.postDate).tz('Asia/Manila').format('HH')){
                setPostDate('Just Now')
            }
            else{
                setPostDate(`${today2.getHours() - moment(content.p.postDate).tz('Asia/Manila').format('HH')} Hours Ago`)
            }
        }
        else{
            setPostDate(moment(content.p.postDate).tz('Asia/Manila').format('MMMM DD, YYYY hh:MM A'))
        }

        const cReact = async () => {
            const cr = await countReact({post_id: content.p.ID})
            setLikeList(cr)
            let c = 0
            cr.data.forEach(element => {
                c += element.count
            });
            setCountLike(c)
        }
        cReact()

        const chReact = async() => {
            const isLoggedIn = sessionStorage.getItem('user')
            
            if(isLoggedIn != "undefined"){
                const c = await checkReact({post_id: content.p.ID, user_id: JSON.parse(sessionStorage.getItem('user'))?.ID_No})
                c.data.length > 0 ? setLike(c.data[0].reactType) : setLike('none')
            }else{
                setLike('none')
            }
            
        }
        chReact()

        const user = async () => {
            const u = await getUser({id : content.p.postUserID})
            setPoster(capitalizeWords(`${u[0].FirstName} ${u[0].LastName}`))
        }
        user()
    }, [])
    useEffect(() => {
        const cReact = async () => {
            const cr = await countReact({post_id: content.p.ID})
            setLikeList(cr)
            let c = 0
            cr.data.forEach(element => {
                c += element.count
            });
            setCountLike(c)
        }
        cReact()
    }, [like])
    return (
        <>
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={post}
                    onClose={handleClosePost}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                    sx={{overflowY : 'scroll'}}
                >
                    <Fade in={post}>
                        <div style={{display:'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
                            <Card sx={style}>
                                <CardContent sx={{overflowY: 'scroll', flex: 2, width: {xs: 300, md: '90%'},}}>
                                    <Box sx={{border: '1px solid #cccccc', mt: 1, padding: 1.5, borderRadius: 1}}>
                                        <div className={SeePostCSS.hide}>
                                            <Stack direction="row" spacing={2}>
                                                <Avatar alt={poster} src={poster} />
                                                <div>
                                                    <Typography variant="body2">
                                                        {poster}
                                                    </Typography>
                                                    <Typography sx={{ mb: 1.5, fontSize: '12px'}} color="text.secondary">
                                                        {postDate}
                                                    </Typography>
                                                </div>
                                            </Stack>
                                        </div>
                                        <div className={SeePostCSS.hide}>
                                            <br />
                                        </div>
                                        <div className={SeePostCSS.hide}>
                                            <Button variant='body1' sx={{padding: 0, textTransform: 'none', textAlign: 'justify', fontWeight: 'normal'}} onClick={() => setShowFullCaptio(prevState => !prevState)}>
                                                <pre>{captionText}</pre>
                                            </Button>
                                        </div>
                                        {content.p.file.length > 0 ? (
                                            <div style={{display: 'flex', justifyContent:'center', flexDirection: 'column', alignItems: 'center'}}>
                                                {content.p.file[activeStep].type == 'image/jpeg' ? (
                                                    <img src={`http://192.168.5.3:4000/uploads/${content.p.file[activeStep].filename}`} width="100%" height="auto"/>
                                                ): content.p.file[activeStep].type == 'video/mp4' ? (
                                                    <video
                                                        // autoPlay
                                                        // loop
                                                        // muted
                                                        key={videoKey}
                                                        controls
                                                        poster={`http://192.168.5.3:4000/uploads/${content.p.file[activeStep].filename}`}
                                                        style={{width: '100%', objectFit: 'contain', height: '600px'}}
                                                    >
                                                        <source
                                                        src={`http://192.168.5.3:4000/uploads/${content.p.file[activeStep].filename}`}
                                                        type="video/mp4"
                                                        />
                                                    </video>
                                                ) : (
                                                    <div className="pdf-container" style={{width: '100%', height: '600px'}}>
                                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                                        <Viewer fileUrl={`http://192.168.5.3:4000/uploads/${content.p.file[activeStep].filename}`} plugins={[newplugin]} />
                                                        </Worker>
                                                    </div>
                                                )}
                                                <br />
                                                <MobileStepper
                                                    variant="dots"
                                                    steps={content.p.file.length}
                                                    position="static"
                                                    activeStep={activeStep}
                                                    sx={{ maxWidth: 400, flexGrow: 1 }}
                                                    nextButton={
                                                        <Button size="small" sx={{margin: 2}} onClick={handleNext} disabled={activeStep === content.p.file.length - 1}>
                                                        {theme.direction === 'rtl' ? (
                                                            <KeyboardArrowLeft />
                                                        ) : (
                                                            <KeyboardArrowRight />
                                                        )}
                                                        </Button>
                                                    }
                                                    backButton={
                                                        <Button size="small" sx={{margin: 2}} onClick={handleBack} disabled={activeStep === 0}>
                                                        {theme.direction === 'rtl' ? (
                                                            <KeyboardArrowRight />
                                                        ) : (
                                                            <KeyboardArrowLeft />
                                                        )}
                                                        </Button>
                                                    }
                                                />
                                            </div>
                                        ) : undefined}
                                    </Box>
                                </CardContent>
                                <div style={{flex: 1, width: '100%'}}>
                                    <CardContent sx={{overflowY: 'scroll'}}>
                                        <Stack direction="row-reverse" spacing={1} justifyContent={'flex-end'} sx={{float: 'right!important'}}>
                                            <IconButton aria-label="delete" size="medium" onClick={handleClose}>
                                                <CancelIcon fontSize="inherit" sx={{color: 'red'}} />
                                            </IconButton>
                                        </Stack>
                                        <br />
                                        <div className={SeePostCSS.show}>
                                            <Stack direction="row" spacing={2}>
                                                <Avatar alt={poster} src={poster} />
                                                <div>
                                                    <Typography variant="body2">
                                                        {poster}
                                                    </Typography>
                                                    <Typography sx={{ mb: 1.5, fontSize: '12px'}} color="text.secondary">
                                                        {postDate}
                                                    </Typography>
                                                </div>
                                            </Stack>
                                        </div>
                                        <div className={SeePostCSS.show}>
                                            <br />
                                        </div>
                                        <div className={SeePostCSS.show}>
                                            <Button variant='body2' sx={{padding: 0, textTransform: 'none', textAlign: 'justify', fontWeight: 'normal'}} onClick={() => setShowFullCaptio(prevState => !prevState)}>
                                                <pre>{captionText}</pre>
                                            </Button>
                                        </div>
                                        <div className={SeePostCSS.show} style={{marginTop: '10px'}}>
                                            <div className={CardCCSS['likesComments']}>
                                                {likeList.data.length > 0 ? (
                                                    <AvatarGroup sx={{ flexDirection: 'row-reverse' }}>
                                                        {likeList.data.slice(0, 3).map((like, index) => (
                                                            <div key={index}>
                                                                {like.reactType === 'laugh' ? (
                                                                    <Avatar key={index} size='sm' alt="HRD" sx={{width: '25px', height: '25px', bgcolor: '#ffbf00'}}>
                                                                        <FaLaughSquint color='#fff' size={15} style={{margin: '0'}}/> 
                                                                    </Avatar>
                                                                ) : like.reactType === 'like' ? (
                                                                    <Avatar key={index} size='sm' alt="HRD" sx={{width: '25px', height: '25px', bgcolor: '#0454d9'}}>
                                                                        <AiFillLike color='#fff' size={15} style={{margin: '0'}}/>
                                                                    </Avatar>
                                                                ) : like.reactType === 'heart' ? (
                                                                    <Avatar key={index} size='sm' alt="HRD" sx={{width: '25px', height: '25px', bgcolor: 'red'}}>
                                                                        <AiFillHeart color='#fff' size={15} style={{margin: '0'}}/>
                                                                    </Avatar>
                                                                    
                                                                ) : like.reactType === 'wow' ? (
                                                                    <Avatar key={index} size='sm' alt="HRD" sx={{width: '25px', height: '25px', bgcolor: '#ffbf00'}}>
                                                                        <ImShocked2 color='#fff' size={15} style={{margin: '0'}}/> 
                                                                    </Avatar>
                                                                ) : like.reactType === 'sad' ? (
                                                                    <Avatar key={index} size='sm' alt="HRD" sx={{width: '25px', height: '25px', bgcolor: '#ffbf00'}}>
                                                                        <FaSadTear color='#fff' size={20} style={{margin: '0'}}/>
                                                                    </Avatar>
                                                                ) : undefined}
                                                            </div>
                                                        ))}
                                                        
                                                        <Button sx={{paddingBottom: 0, textTransform: 'none', paddingLeft: '3px', width: '5px', height: '30px', justifyContent: 'flex-start', paddingTop: 0}} onClick={() => like.current?.handleOpen()}>
                                                            <Typography sx={{ mb: 1.5, fontSize: '14px', marginBottom: 0}} color="text.secondary">
                                                                {countLike}
                                                            </Typography>
                                                        </Button>
                                                    </AvatarGroup>
                                                ) : undefined}
                                                {/* <AvatarGroup sx={{ flexDirection: 'row-reverse' }}>
                                                    <Avatar size='sm' alt="Cindy Baker" sx={{width: '20px', height: '20px', bgcolor: '#0454d9'}}>
                                                        <AiFillLike color='#fff' size={15} style={{margin: '0'}}/>  
                                                    </Avatar>
                                                    <Avatar size='sm' alt="Cindy Baker" sx={{width: '20px', height: '20px', bgcolor: '#ffbf00'}}>
                                                        <FaLaughSquint color='#fff' size={15} style={{margin: '0'}}/>  
                                                    </Avatar>
                                                    <Avatar size='sm' alt="Cindy Baker" sx={{width: '20px', height: '20px', bgcolor: 'red'}}>
                                                        <AiFillHeart color='#fff' size={15} style={{margin: '0'}}/> 
                                                    </Avatar>
                                                    <Button size="small" sx={{paddingBottom: 0, textTransform: 'none', paddingLeft: '1px'}}>
                                                        <Typography sx={{ mb: 1.5, fontSize: '12px', marginBottom: 0}} color="text.secondary">
                                                            {countLike}
                                                        </Typography>
                                                    </Button>
                                                </AvatarGroup> */}
                                            </div>
                                        </div>
                                        <Divider />
                                        <div className={SeePostCSS.show}>
                                            {sessionStorage.getItem('isLogin') === 'true' ? (
                                                <div style={{display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                                                    <Button size="small" sx={{color: 'grey', borderRadius: 10, mt: 2}}
                                                        aria-owns={open ? 'mouse-over-popover' : undefined}
                                                        aria-haspopup="true"
                                                        onMouseEnter={handleHoverOpen('top-start')}
                                                        onBlur={handleHoverClose('top-start')}
                                                        onClick={() => handleSetLike('like')}
                                                    >   {
                                                            like === 'none' ? (
                                                                <AiOutlineLike color='grey' size={20}/>
                                                            ) : like === 'like' ? (
                                                                <AiFillLike color='blue' size={20}/>
                                                            ) : like === 'heart' ? (
                                                                <AiFillHeart color='red' size={20}/>
                                                            ) : like === 'laugh' ? (
                                                                <FaLaughSquint color='ffbf00' size={20}/>
                                                            ) : like === 'sad' ? (
                                                                <FaSadTear color='ffbf00' size={20}/>
                                                            ) : like === 'wow' ? (
                                                                <ImShocked2 color='ffbf00' size={20}/>
                                                            ) : (
                                                                <FaAngry color='ffa187' size={20}/>
                                                            )
                                                        }
                                                    </Button>
                                                    {/* <Button variant="outlined" size="small" sx={{color: 'grey', width: '90%', marginLeft: 2, marginRight: 2, borderRadius: 10}}
                                                        aria-owns={open ? 'mouse-over-popover' : undefined}
                                                        aria-haspopup="true"
                                                        onClick={() => handleShowComment()}
                                                    >   <FaRegCommentAlt color='grey' size={20}/>&nbsp;{commentList.length}
                                                    </Button> */}
                                                    <Popper open={open} anchorEl={anchorEl} placement={placement} transition sx={{zIndex: 9999}}>
                                                        {({ TransitionProps }) => (
                                                        <Fade {...TransitionProps} timeout={350}>
                                                            <Paper>
                                                                <div className={CardCCSS['likes']}>
                                                                    <div className={CardCCSS['likes-items']}>
                                                                        <Avatar size='sm' alt="Cindy Baker" sx={{width: '30px', height: '30px', bgcolor: '#0454d9'}} onClick={() => handleSetLike('like')}>
                                                                            <AiFillLike color='#fff' size={20} style={{margin: '0'}}/>  
                                                                        </Avatar>
                                                                    </div>
                                                                    <div className={CardCCSS['likes-items']}>
                                                                        <Avatar size='sm' alt="Cindy Baker" sx={{width: '30px', height: '30px', bgcolor: 'red'}} onClick={() => handleSetLike('heart')}>
                                                                            <AiFillHeart color='#fff' size={20} style={{margin: '0'}}/> 
                                                                        </Avatar>
                                                                    </div>
                                                                    <div className={CardCCSS['likes-items']}>
                                                                        <Avatar size='sm' alt="Cindy Baker" sx={{width: '30px', height: '30px', bgcolor: '#ffbf00'}} onClick={() => handleSetLike('laugh')}>
                                                                            <FaLaughSquint color='#fff' size={20} style={{margin: '0'}}/>  
                                                                        </Avatar>
                                                                    </div>
                                                                    <div className={CardCCSS['likes-items']}>
                                                                        <Avatar size='sm' alt="Cindy Baker" sx={{width: '30px', height: '30px', bgcolor: '#ffbf00'}} onClick={() => handleSetLike('sad')}>
                                                                            <FaSadTear color='#fff' size={20} style={{margin: '0'}}/>  
                                                                        </Avatar>
                                                                    </div>
                                                                    <div className={CardCCSS['likes-items']}>
                                                                        <Avatar size='sm' alt="Cindy Baker" sx={{width: '30px', height: '30px', bgcolor: '#ffbf00'}} onClick={() => handleSetLike('wow')}>
                                                                            <ImShocked2 color='#fff' size={20} style={{margin: '0'}}/>  
                                                                        </Avatar>
                                                                    </div>
                                                                    {/* <div className={CardCCSS['likes-items']}>
                                                                        <Avatar size='sm' alt="Cindy Baker" sx={{width: '30px', height: '30px', bgcolor: '#ffa187'}} onClick={() => handleSetLike('angry')}>
                                                                            <FaAngry color='#fff' size={20} style={{margin: '0'}}/>  
                                                                        </Avatar>
                                                                    </div> */}
                                                                </div>
                                                            </Paper>
                                                        </Fade>
                                                        )}
                                                    </Popper>                                                                                                                                                                                            
                                                </div>
                                            ) : (
                                                <Tooltip title="Kindly login to access full features =)" placement="right">
                                                    <Button size="small">Learn More</Button>
                                                </Tooltip>
                                            )}
                                        </div>
                                        <CardActions>
                                            {/* <Paper
                                                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', margin: '0 5 2 2'}}
                                            >
                                                <Avatar alt="Remy Sharp" src={Me} sx={{width: 24, height: 24}}/>
                                                <form onSubmit={handleSubmitMyComment} style={{width: '100%', display: 'flex'}}>
                                                    <InputBase
                                                        sx={{ ml: 1, flex: 1 }}
                                                        placeholder="Write a comment..."
                                                        inputProps={{ 'aria-label': 'search google maps' }}
                                                        required
                                                        value={myComment}
                                                        onChange={handleChangeMyComment}
                                                        autoFocus
                                                    />
                                                    {validComment(myComment) ? (
                                                        <IconButton sx={{ p: '10px', color: 'blue' }} aria-label="search" type={"submit"}>
                                                            <SendIcon/>
                                                        </IconButton>
                                                    ): undefined}
                                                </form>
                                            </Paper> */}
                                            {/* <Button size="medium" sx={{width: '100%'}} variant="contained" disableElevation onClick={() => {alert("yawa")}}>Post</Button> */}
                                        </CardActions>
                                        {showComment ? (
                                            <List sx={{ width: '100%', bgcolor: 'background.paper', height: 450}}>
                                                {(commentList.slice().reverse()).map((comments, index) => (
                                                    <React.Fragment key={index}>
                                                        <ListItem alignItems="flex-start">
                                                            <ListItemAvatar>
                                                                <Avatar alt={comments.name} src={comments.avatar} />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={comments.name}
                                                                secondary={
                                                                    <React.Fragment>
                                                                        <Button variant='body1' sx={{padding: 0, textTransform: 'none', textAlign: 'justify', fontWeight: 'normal'}}
                                                                            onClick={() => handleShowFullComment(comments.id, !comments.showFullComment)}>
                                                                            {/* {!comments.showFullComment && comments.comment.length > 400 ? `${(comments.comment).substring(0, 400)}...Show more` : comments.comment} */}
                                                                        </Button>
                                                                        <br />
                                                                        <span sx={{ mt: 2, fontSize: '8px', marginBottom: 0}} color="text.secondary">
                                                                            {`${comments.date} ${comments.time}`}
                                                                        </span>
                                                                    </React.Fragment>
                                                                }
                                                            />
                                                        </ListItem>
                                                        <Divider variant="inset" component="li" />
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                        ) : undefined}
                                    </CardContent>
                                </div>
                                
                            </Card>
                        </div>

                    </Fade>
                </Modal>
            </div>
        </>
    )
})

export default SeePost