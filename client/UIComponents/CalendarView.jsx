import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const CalendarView = (props) => {
  const { bookings } = props;

  return (
    <Calendar
      localizer={localizer}
      events={bookings}
      eventPropGetter={(event) => ({
        className: 'category-' + event.roomIndex,
      })}
      onSelectEvent={props.onSelect}
      defaultView="month"
      showMultiDayTimes
      step={60}
      views={['month', 'week', 'day', 'agenda']}
      popup
      popupOffset={30}
      allDayAccessor="isMultipleDay"
      culture="en-GB"
    />
  );
};

export default CalendarView;
