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
import SolutionList from './SolutionList';
import './SolutionList'



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
                         formats={{
                          dayFormat: (date, culture, localizer) => localizer.format(date, 'ddd') // hide the date
                        }}
                        style={{
                          height: 550,
                          width: 600,
                          color: 'black',
                          backgroundColor: 'lightblue', // add a background color
                          
                          border: 'none', // add a border
                          padding: '0px',
                          borderRadius: '10px', // add border radius
                          boxShadow: '2px 2px 10px gray' // add a box shadow
                        }}
                         >
                         </Calendar>
                          </Container2>
                          </TextWrapper>
                 </InfoColumn>
                 <InfoColumn> 
                    <Container>

                    <SolutionList />

                  </Container>
                </InfoColumn>
                 </InfoRow>
         </Container>
     </InfosSecCal>
     <div class="fixed-image-container">
  <img src="./img/embry.PNG" alt="Image description"/>
</div>
     </>
   );
 }
 
 export default CalendarRender