// Helper function to format hours to AM/PM
export const formatHourToAMPM = (hour: any) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour} ${suffix}`;
};

// Helper function to format minutes with leading zero if needed
export const formatMinutes = (minutes: any) => {
  return minutes < 10 ? `0${minutes}` : `${minutes}`;
};

// Convert time to minutes for easier comparison
export const timeToMinutes = (hour: any, minute: any) => hour * 60 + minute;

// Check if two events overlap
export const eventsOverlap = (event1: any, event2: any) => {
  const event1Start = timeToMinutes(event1.start.hour, event1.start.minute);
  const event1End = timeToMinutes(event1.end.hour, event1.end.minute);
  const event2Start = timeToMinutes(event2.start.hour, event2.start.minute);
  const event2End = timeToMinutes(event2.end.hour, event2.end.minute);

  return (
    (event1Start < event2End && event1End > event2Start) ||
    (event2Start < event1End && event2End > event1Start)
  );
};

// process event

type BaseEvent = {
  id: number;
  title: string;
  start: { hour: number; minute: number };
  end: { hour: number; minute: number };
  color: string;
};

type ProcessedEvent = BaseEvent & {
  column: number;
  columnSpan: number;
  totalColumns: number;
};

export const processingEvents = ({
  events,
  setProcessedEvents,
}: {
  events: BaseEvent[];
  setProcessedEvents: React.Dispatch<React.SetStateAction<ProcessedEvent[]>>;
}) => {
  // Sort events by start time and then by duration (shorter first)
  const sortedEvents = [...events].sort((a, b) => {
    const aStart = timeToMinutes(a.start.hour, a.start.minute);
    const bStart = timeToMinutes(b.start.hour, b.start.minute);

    if (aStart === bStart) {
      const aDuration = timeToMinutes(a.end.hour, a.end.minute) - aStart;
      const bDuration = timeToMinutes(b.end.hour, b.end.minute) - bStart;
      return aDuration - bDuration;
    }

    return aStart - bStart;
  });

  // Process events to assign column positions
  const processed = sortedEvents.map((event) => {
    return { ...event, column: 0, columnSpan: 1, totalColumns: 1 };
  });

  // Find overlapping events and assign columns
  for (let i = 0; i < processed.length; i++) {
    // Find all events that overlap with the current event
    const overlappingEvents = processed.filter((event, index) => {
      return index !== i && eventsOverlap(processed[i], event);
    });

    if (overlappingEvents.length > 0) {
      // Find the maximum column number among overlapping events
      const usedColumns = overlappingEvents.map((event) => event.column);

      // Find the first available column
      let column = 0;
      while (usedColumns.includes(column)) {
        column++;
      }

      processed[i].column = column;

      // Calculate the total number of columns needed for this group
      const maxColumn = Math.max(
        column,
        ...overlappingEvents.map((event) => event.column)
      );

      // Update all related events with the total columns count
      const allRelatedEvents = [processed[i], ...overlappingEvents];
      const maxColumnValue = maxColumn + 1;

      allRelatedEvents.forEach((event) => {
        if (event.totalColumns < maxColumnValue) {
          event.totalColumns = maxColumnValue;
        }
      });
    }
  }

  setProcessedEvents(processed);
};

// Calculate position and size for events
export const calculateEventStyle = (event: any) => {
  const startHour = event.start.hour;
  const startMinute = event.start.minute;
  const endHour = event.end.hour;
  const endMinute = event.end.minute;

  // Calculate top position (60px per hour + minutes)
  const top = startHour * 60 + startMinute;

  // Calculate height (end time - start time in minutes)
  const durationMinutes =
    (endHour - startHour) * 60 + (endMinute - startMinute);

  // Calculate width based on column position and total columns
  const columnWidth = 100 / event.totalColumns;
  const left = event.column * columnWidth;
  const width = columnWidth;

  return {
    top: `${top}px`,
    height: `${durationMinutes}px`,
    backgroundColor: event.color,
    left: `${left}%`,
    width: `${width}%`,
  };
};
