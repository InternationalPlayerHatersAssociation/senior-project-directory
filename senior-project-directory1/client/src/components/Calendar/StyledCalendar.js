import styled from 'styled-components';
import { Calendar } from 'react-big-calendar'

const StyledCalendar = styled(Calendar)`
  .rbc-time-view {
    border-radius: 20px;
    background-color:'#e0e0de' ;
  }
  .rbc-timeslot-group {

    min-height: 40px;
    display: flex;
    flex-flow: column no wrap;
    border-radius: 20px;
}
.rbc-event-label {
  font-size: 0px;
}
.rbc-event-title {
  white-space: nowrap;
}

.weekdays-only .rbc-row-bg .rbc-off-range-bg,
.weekdays-only .rbc-row-content .rbc-off-range {
  display: none;
}

.weekdays-only .rbc-header.rbc-off-range {
  display: none;
}

.weekdays-only .rbc-calendar {
  border-collapse: separate;
}
.rbc-event {
  border: none;
  box-sizing: border-box;
  box-shadow: none;
  margin: 0;
  padding: $event-padding;
  background-color: $event-bg;
  border-radius: $event-border-radius;
  color: $event-color;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-size: 10px;

  .rbc-slot-selecting & {
    cursor: inherit;
    pointer-events: none;
  }

  &.rbc-selected {
    background-color: darken($event-bg, 10%);
  }

  &:focus {
    outline: 5px auto $event-outline;
  }
}

.rbc-time-slot {
  border-top: 1px solid lighten($cell-border, 10%);
  height: 60px;
}
.rbc-today {
  background-color: #e0e0de; /* replace with your desired color */
}
::-webkit-scrollbar {
  width: 10px; // Change the width here
  height: 10px; // Change the height here
  background-color: #f5f5f5; // Change the background color here
}

::-webkit-scrollbar-thumb {
  background-color: #aaa; // Change the thumb color here
  border-radius: 5px; // Change the border radius here
}

::-webkit-scrollbar-track {
  background-color: #f5f5f5; // Change the track color here
  border-radius: 5px; // Change the border radius here
}


`;

export default StyledCalendar;