import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Container, Container2} from '../../globalStyles';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { momentLocalizer} from 'react-big-calendar'
import {
    InfosSecCal,
    InfoRow,
    InfoColumn,
    TextWrapper,
    } from '../InfoSection.elements';
import SolutionList from './SolutionList';
import './SolutionList'
import  StyledCalendar from './StyledCalendar';




const localizer = momentLocalizer(moment);

const CalendarRender = ({
    lightBg,
    imgStart, 
  }) => {
  
   const [myEvents, setMyEvents] = useState([]);
   const [solutionChoice, setSolutionChoice] = useState(0)
   const [solutions, setSolutions] = useState([])

   useEffect(() => {
     if(myEvents.length < 1){
      fetch('/find_combinations')
      .then(response => response.json())
      .then(data => formatEvents(data))
      .catch(err => console.log(err));
     }
     updateEvents();
  }, [solutionChoice]);

  const updateEvents = () => {
    if(solutions[solutionChoice]){
      const events = solutions[solutionChoice].flatMap(course => convertToEvent(course));
      setMyEvents(events);
    }
  };
  const convertToEvent = (course) => {
    const { course_code, name, start_time, end_time, days } = course;
  
    const startTime = moment(start_time, 'Hmm');
    const endTime = moment(end_time, 'Hmm');
  
    const daysArray = days.split('').map(day => {
      switch (day) {
        case 'M': return 1;
        case 'T': return 2;
        case 'W': return 3;
        case 'R': return 4;
        case 'F': return 5;
        case 'H': return 4;
        default: return -1;
      }
    });
  
    const events = daysArray.map(dayOfWeek => ({
      title: `${course_code} - ${name}`,
      start: moment().day(dayOfWeek).hours(startTime.hours()).minutes(startTime.minutes()).toDate(),
      end: moment().day(dayOfWeek).hours(endTime.hours()).minutes(endTime.minutes()).toDate(),
    }));
  
    return events;
  };


    const formatEvents = ((data) => {
      console.log(data);
      setSolutions(data);
      const solutions = data[solutionChoice];
      if (solutions) {
        const events = solutions.flatMap(course => convertToEvent(course));
        console.log(events);

        setMyEvents(events);
      }

    })

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
                         step = {30}
                         min = {new Date(2023, 3, 13, 8, 0)}
                         max = {new Date(2023, 3, 13, 23, 0)}
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
                          boxShadow: '4px 4px 10px black',
                          overflowY: 'auto',
                        }}
                        
                         >
                         </StyledCalendar>
                          </Container2>
                          </TextWrapper>
                 </InfoColumn>
                 <InfoColumn> 
                    <Container>

                    <SolutionList setSolutionChoice={setSolutionChoice} solutions={solutions}/>

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