import React from 'react';
import BigCalendar from 'react-big-calendar';
import events from './events';
import moment from 'moment';

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

let CalendarView = props => {

  const { gatherings } = props;

  gatherings.forEach(gather => {
    gather.start = moment(gather.startDate + gather.startTime, 'YYYY-MM-DD HH:mm').toDate();;
    gather.end = moment(gather.startDate + gather.startTime, 'YYYY-MM-DD HH:mm').toDate();;
    console.log(gather);
  });

  return (
    <div>
      <BigCalendar
        events={gatherings}
        defaultView="week"
        views={['week', 'day', 'agenda']}
      />
    </div>
  )
}

export default CalendarView;
