import CardACSS from './CardACSS.module.css'
import birthday from '../style/images/birthday2.jpg'
import cake from '../style/images/cake.jpg'
import Celebrants from './Celebrants'
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Me from '../style/images/me.png'
import Box from '@mui/material/Box';
import { birthdayCelebrants } from '../services/LandingPageAPI';
import React, {useState, useEffect} from 'react'
import moment from 'moment-timezone';

const CardA = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const [birthdayCeleb, setBirthdayCeleb] = useState([])

    useEffect(() => {
        const getBirthday = async() => {
            const birthdayData = await birthdayCelebrants()
            setBirthdayCeleb(birthdayData)
        }

        getBirthday()
    }, [])
    return (
        <Box sx={{ minWidth: 275, mb: 2}}>
            <Card variant="outlined" sx={{borderRadius: '10px'}}>
                <CardContent sx={{paddingBottom: 0}}>
                    <Stack direction="row" spacing={2} sx={{alignItems: 'center'}} mb={2}>
                        <Avatar alt="Remy Sharp" src={cake} />
                        <div>
                            <Typography variant="body2" sx={{fontSize: '16px'}}>
                                {months[(new Date()).getMonth()]} Birthday Celebrants\s
                            </Typography>
                        </div>
                    </Stack>
                    {birthdayCeleb.length > 0 ? birthdayCeleb.map((bday, index) => (
                        <Celebrants key={index} name={`${bday.LastName.toLowerCase()}, ${bday.FirstName}`} birthday={moment(bday.Birthday).tz('Asia/Manila').format('DD')}/>
                    )) : undefined}
                </CardContent>
                <CardMedia component={"img"} image={birthday} alt='birthday' width={'auto'} height={'auto'}/>
            </Card>
        </Box>
    )
}

export default CardA