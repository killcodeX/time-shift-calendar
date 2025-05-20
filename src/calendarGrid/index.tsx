import { useState, useEffect } from "react";
import {
  formatHourToAMPM,
  formatMinutes,
  processingEvents,
  calculateEventStyle,
} from "./utils";
import "./style.css";

type BaseEvent = {
  id: number;
  title: string;
  start: { hour: number; minute: number };
  end: { hour: number; minute: number };
  color: string;
};

type ProcessedEvent = {
  id: number;
  title: string;
  start: { hour: number; minute: number };
  end: { hour: number; minute: number };
  color: string;
  column: number;
  columnSpan: number;
  totalColumns: number;
};

type CalendarGridProps = {
  events: BaseEvent[];
};

function CalendarGrid({ events }: CalendarGridProps) {
  const [processedEvents, setProcessedEvents] = useState<ProcessedEvent[]>([]);

  // Process events to handle overlaps
  useEffect(() => {
    processingEvents({ events, setProcessedEvents });
  }, [events]);

  return (
    <div className="calendar-container">
      <div className="calendar-grid">
        {/* Hours labels column */}
        <div className="time-labels">
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={hour} className="hour-label">
              <span className="hour-text">{formatHourToAMPM(hour)}</span>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="time-grid">
          {/* Hour rows */}
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={hour} className="hour-row">
              {/* Half-hour mark */}
              <div className="half-hour"></div>

              {/* Quarter-hour marks */}
              <div className="quarter-hour"></div>
              <div className="quarter-hour"></div>
              <div className="quarter-hour"></div>
            </div>
          ))}
        </div>

        {/* Events layer */}
        <div className="events-layer">
          {processedEvents.map((event) => (
            <div
              key={event.id}
              className="event-item"
              style={calculateEventStyle(event)}
            >
              <div className="event-title">{event.title}</div>
              <div className="event-time">
                {formatHourToAMPM(event.start.hour)}:
                {formatMinutes(event.start.minute)} -
                {formatHourToAMPM(event.end.hour)}:
                {formatMinutes(event.end.minute)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarGrid;
