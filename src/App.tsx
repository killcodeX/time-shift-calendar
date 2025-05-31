import { useState, useEffect } from "react";
import AddEvents from "./addEvents";
import CalendarGrid from "./calendarGrid";
import "./App.css";

interface Time {
  hour: number;
  minute: number;
}

type BaseEvent = {
  id: string;
  title: string;
  name: string;
  start: { hour: number; minute: number };
  end: { hour: number; minute: number };
  color: string;
};

// Sample events data structure
const sampleEvents = [
  {
    id: 1,
    title: "Team Meeting",
    start: { hour: 10, minute: 0 },
    end: { hour: 23, minute: 59 },
    color: "#4285F4",
  },
  {
    id: 2,
    title: "Lunch Break",
    start: { hour: 12, minute: 0 },
    end: { hour: 13, minute: 0 },
    color: "#0F9D58",
  },
  {
    id: 3,
    title: "Project Review",
    start: { hour: 14, minute: 15 },
    end: { hour: 15, minute: 45 },
    color: "#DB4437",
  },
  // Overlapping events for demonstration
  {
    id: 4,
    title: "Interview Candidate",
    start: { hour: 9, minute: 30 },
    end: { hour: 10, minute: 15 },
    color: "#F6BF26",
  },
  {
    id: 5,
    title: "Call with Client",
    start: { hour: 9, minute: 45 },
    end: { hour: 10, minute: 45 },
    color: "#8E24AA",
  },
];

function App() {
  const [events, setEvents] = useState<BaseEvent[]>([]);
  useEffect(() => {
    console.log(events);
  }, [events]);
  return (
    <div className="main-container">
      <AddEvents events={events} setEvents={setEvents} />
      <div className="calendar-wrapper">
        <CalendarGrid events={events} />
      </div>
    </div>
  );
}

export default App;

// Your initial events here (like sampleEvents)
// {
//   id: 1,
//   title: "Team Meeting",
//   start: { hour: 10, minute: 0 },
//   end: { hour: 23, minute: 59 },
//   color: "#4285F4",
// },
// {
//   id: 2,
//   title: "Lunch Break",
//   start: { hour: 12, minute: 0 },
//   end: { hour: 13, minute: 0 },
//   color: "#0F9D58",
// },
