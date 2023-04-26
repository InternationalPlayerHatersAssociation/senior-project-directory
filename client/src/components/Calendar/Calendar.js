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
   const [solutionChoice, setSolutionChoice] = useState(0);
   const [solutions, setSolutions] = useState([]);
   const [myConflictEvents, setMyConflictEvents] = useState([]);

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
      setMyEvents([...events,...myConflictEvents]);
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
      title: `${course_code}`,
      start: moment().day(dayOfWeek).hours(startTime.hours()).minutes(startTime.minutes()).toDate(),
      end: moment().day(dayOfWeek).hours(endTime.hours()).minutes(endTime.minutes()).toDate(),
      color: '#6d5078',
    }));
  
    return events;
  };

    const convertToConflict = ((conflict) => {
      const { day, name, start_time, end_time } = conflict;

      const startTime = moment(start_time, 'Hmm');
      const endTime = moment(end_time, 'Hmm');

      const daysArray = day.split('').map(d => {
        switch (d) {
          case 'M': return 1;
          case 'T': return 2;
          case 'W': return 3;
          case 'R': return 4;
          case 'F': return 5;
          case 'H': return 4;
          default: return -1;
        }

      });

      const conflicts = daysArray.map((dayOfWeek, index) => ({
        title: `Conflict Entry`,
        start: moment().day(dayOfWeek).hours(startTime.hours()).minutes(startTime.minutes()).toDate(),
        end: moment().day(dayOfWeek).hours(endTime.hours()).minutes(endTime.minutes()).toDate(),
        color: 'salmon',
      }));
    
      return conflicts;
    })


    const formatEvents = ((data) => {

      setSolutions(data[1]);
      const conflicts = Object.values(data[0]);
      console.log("conflicts are:",conflicts);
      const solutions = data[1][solutionChoice];
      console.log("solutions are:", solutions);
      if (solutions) {
        const events = solutions.flatMap(course => convertToEvent(course));
        const conflictEvents = conflicts.flatMap(con => convertToConflict(con));

        console.log("Final events are", events);
        console.log("Final Conflicts are", conflictEvents);
        setMyConflictEvents(conflictEvents);
        setMyEvents([...events, ...conflictEvents]);
      }

    })

    const eventStyleGetter = (event, start, end, isSelected) => {
      const backgroundColor = event.color;
      const style = {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
        'text-align': 'left',
        'font-size': '12px',
      };
      return {
        style,
      };
    };

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
                        eventPropGetter={eventStyleGetter}
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