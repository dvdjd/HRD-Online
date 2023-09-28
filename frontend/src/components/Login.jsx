import React, {useState, useRef, useImperativeHandle, forwardRef, useEffect} from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TextField from '@mui/material/TextField';
import LockIcon from '@mui/icons-material/Lock';
import CardActions from '@mui/material/CardActions';
import { login } from '../services/LandingPageAPI';
import { json } from 'react-router-dom';

const Login = forwardRef(({}, ref) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {xs: 200, md: 400},
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 1,
    
    };
    const [openLogin, setOpenLogin] = useState(false);
    const handleOpen = () => setOpenLogin(true);
    const handleClose = () => setOpenLogin(false);

    useImperativeHandle(ref, () => ({handleOpen}))

    const userRef = useRef()
    const errRef = useRef()

    const [pin, setPin] = useState('')
    const [password, setPassword] = useState('') 
    const [err, setErr] = useState(false)
    const [user, setUser] = useState(null)

    useEffect( () => {
        //localStorage.setItem()
        //userRef.current.focus()

    }, [])
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        const getUser = await login({pin : pin, password: password})
        getUser.staus === 'failed' || getUser.status === 'error' ? setErr(true) : (
            setErr(false),
            setPin(''),
            setPassword(''),
            setUser(getUser),
            setOpenLogin(false),
            localStorage.setItem('user', JSON.stringify(getUser.data[0])),
            localStorage.setItem('isLogin', true)
        )

        if(getUser.status === 'success'){
            window.location.reload()
        }
    }
    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openLogin}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openLogin}>
                    <Card sx={style}>
                        <form onSubmit={handleSubmit}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <AccountCircle sx={{ color: err ? 'red' : '#1976d2', mr: 1, my: 0.5 }} />
                                    <TextField autoFocus error={err} id="pin" ref={userRef} autoComplete="off" onChange={(e) => setPin(e.target.value)} value={pin} label={err ? "Wrong pin..." : "Enter Pin..."} variant="standard" sx={{width: '100%'}}/>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 4}}>
                                    <LockIcon sx={{ color: err ? 'red' : '#1976d2', mr: 1, my: 0.5 }} />
                                    <TextField error={err} id="password" label={err ? "Wrong password..." : "Enter Password..."} variant="standard" type="password" sx={{width: '100%'}} onChange={(e) => setPassword(e.target.value)} value={password}/>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button size="medium" sx={{width: '100%', background : err ? 'red' : '#1976d2'}} variant="contained" disableElevation type="submit">Login</Button>
                            </CardActions>
                        </form>
                        
                    </Card>
                </Fade>
            </Modal>
        </>
    )
})

export default Login