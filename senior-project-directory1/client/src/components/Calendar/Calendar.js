import React, { useState } from 'react';
import moment from 'moment';
import { Container, Container2} from '../../globalStyles';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer, Views, DateLocalizer} from 'react-big-calendar'
import InfoSection from '../InfoSection';
import {
    InfosSecCal,
    InfoRow,
    InfoColumn,
    ImgWrapper,
    Img,
    TextWrapper,
    InfoSec
    } from '../InfoSection.elements';
import image from '../../Images/kitten2-removebg-preview.png';


const localizer = momentLocalizer(moment);

const CalendarRender = ({primary,
    lightBg,
    imgStart, 
    start}) => {
   const [myEvents] = useState([]);
   return (
     <>
     
     <InfosSecCal lightBg={lightBg}>
         <Container>
             <InfoRow imgStart={imgStart}>
                 <InfoColumn>
                    <TextWrapper>
                 <h1>Your Schedule </h1>

                     <Container2>
                       <Calendar
                         localizer={localizer}
                         events={myEvents}
                         startAccessor="start"
                         endAccessor="end"
                         defaultView='week'
                         toolbar ={false}
                         step = {60}
                         min = {new Date(2023, 3, 13, 6, 0)}
                          style={{height:550,
                           width:600,
                         
                           color: 'black'}}
                         >
                         </Calendar>
                          </Container2>
                          </TextWrapper>
                 </InfoColumn>
                 <InfoColumn> 
                    <Container>
                  <ImgWrapper start={start}>
                    <Img src = {image} alt = 'Kitty' />
                  </ImgWrapper> 
                  </Container>
                </InfoColumn>
                 </InfoRow>
         </Container>
     </InfosSecCal>
     </>
   );
 }
 
 export default CalendarRender