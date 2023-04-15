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
import styled from 'styled-components';





const localizer = momentLocalizer(moment);

const StyledCalendar = styled(Calendar)`
  .rbc-time-view {
    border-radius: 20px;
    background-color:'#e0e0de' ;
  }
  .rbc-timeslot-group {

    min-height: 40px;
    display: flex;
    flex-flow: column nowrap;
    border-radius: 20px;
}

.rbc-today {
  background-color: #e0e0de; /* replace with your desired color */
}


`;

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
                       <StyledCalendar
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
                          fontFamily: 'Arial, sans-serif', // change font family
                          height: 550,
                          width: 600,
                          color: 'black',
                          backgroundColor: '#e0e0de',
                          borderRadius: '20px',
                          padding: '0px',
                          fontWeight: 'bold',
                          boxShadow: '4px 4px 10px black'
                        }}
                        
                         >
                         </StyledCalendar>
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