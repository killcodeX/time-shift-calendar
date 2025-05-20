import React, { useState } from "react";

interface Time {
  hour: number;
  minute: number;
}

interface TimeEntry {
  personId: string;
  inTime: Time | null;
  outTime: Time | null;
}

type BaseEvent = {
  id: number;
  title: string;
  start: { hour: number; minute: number };
  end: { hour: number; minute: number };
  color: string;
};

type TimeEntryFormProps = {
  events: BaseEvent[];
  setEvents: React.Dispatch<React.SetStateAction<BaseEvent[]>>;
};

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ events, setEvents }) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    { personId: "", inTime: null, outTime: null },
  ]);

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setTimeEntries((prevEntries) =>
      prevEntries.map((entry, i) =>
        i === index
          ? {
              ...entry,
              personId: name === "personId" ? value : entry.personId,
              inTime:
                name === "inTimeHour"
                  ? {
                      hour: parseInt(value, 10),
                      minute: entry.inTime?.minute ?? 0,
                    }
                  : name === "inTimeMinute"
                  ? {
                      hour: entry.inTime?.hour ?? 0,
                      minute: parseInt(value, 10),
                    }
                  : entry.inTime,
              outTime:
                name === "outTimeHour"
                  ? {
                      hour: parseInt(value, 10),
                      minute: entry.outTime?.minute ?? 0,
                    }
                  : name === "outTimeMinute"
                  ? {
                      hour: entry.outTime?.hour ?? 0,
                      minute: parseInt(value, 10),
                    }
                  : entry.outTime,
            }
          : entry
      )
    );
  };

  const handleAddTimeEntry = () => {
    setTimeEntries((prevEntries) => [
      ...prevEntries,
      { personId: "", inTime: null, outTime: null },
    ]);
  };

  const handleRemoveTimeEntry = (index: number) => {
    setTimeEntries((prevEntries) => prevEntries.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvents = timeEntries.map((entry) => {
      const startHour = entry.inTime?.hour ?? 0;
      const startMinute = entry.inTime?.minute ?? 0;
      const endHour = entry.outTime?.hour ?? 0;
      const endMinute = entry.outTime?.minute ?? 0;

      return {
        id: Date.now(), // Use a more reliable unique ID
        title: `Person ${entry.personId}`,
        start: { hour: startHour, minute: startMinute },
        end: { hour: endHour, minute: endMinute },
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };
    });
    setEvents((prev) => [...prev, ...newEvents]);
    setTimeEntries([{ personId: "", inTime: null, outTime: null }]);
  };

  return (
    <div className="add-events-container" style={formContainerStyle}>
      {timeEntries.map((entry, index) => (
        <div key={index} style={entryContainerStyle}>
          <h3 style={entryTitleStyle}>Entry #{index + 1}</h3>
          <div style={inputGroupStyle}>
            <label htmlFor={`personId-${index}`} style={labelStyle}>
              Person ID:
            </label>
            <input
              type="text"
              id={`personId-${index}`}
              name="personId"
              value={entry.personId}
              onChange={(e) => handleInputChange(index, e)}
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>In Time:</label>
            <div style={timeInputStyle}>
              <select
                name="inTimeHour"
                value={
                  entry.inTime?.hour !== undefined
                    ? String(entry.inTime.hour).padStart(2, "0")
                    : ""
                }
                onChange={(e) => handleInputChange(index, e)}
                style={selectStyle}
              >
                <option value="">Hour</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span style={colonStyle}>:</span>
              <select
                name="inTimeMinute"
                value={
                  entry.inTime?.minute !== undefined
                    ? String(entry.inTime.minute).padStart(2, "0")
                    : ""
                }
                onChange={(e) => handleInputChange(index, e)}
                style={selectStyle}
              >
                <option value="">Minute</option>
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Out Time:</label>
            <div style={timeInputStyle}>
              <select
                name="outTimeHour"
                value={
                  entry.outTime?.hour !== undefined
                    ? String(entry.outTime.hour).padStart(2, "0")
                    : ""
                }
                onChange={(e) => handleInputChange(index, e)}
                style={selectStyle}
              >
                <option value="">Hour</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span style={colonStyle}>:</span>
              <select
                name="outTimeMinute"
                value={
                  entry.outTime?.minute !== undefined
                    ? String(entry.outTime.minute).padStart(2, "0")
                    : ""
                }
                onChange={(e) => handleInputChange(index, e)}
                style={selectStyle}
              >
                <option value="">Minute</option>
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {timeEntries.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveTimeEntry(index)}
              style={removeButtonStyle}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <div style={buttonGroupStyle}>
        <button type="button" onClick={handleAddTimeEntry} style={addButton}>
          Add Entry
        </button>
        <button type="submit" style={submitButton} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

// --- Styles ---
const formContainerStyle: React.CSSProperties = {
  padding: "20px",
  backgroundColor: "#f8f8f8",
  borderRadius: "8px",
  width: "300px",
  overflowY: "auto",
};

const entryContainerStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "6px",
  backgroundColor: "white",
};

const entryTitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "10px",
  color: "#333",
  fontSize: "1.2em",
};

const inputGroupStyle: React.CSSProperties = {
  marginBottom: "10px",
  display: "flex",
  flexDirection: "column",
};

const labelStyle: React.CSSProperties = {
  marginBottom: "5px",
  color: "#555",
  fontSize: "0.9em",
};

const inputStyle: React.CSSProperties = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "1em",
};

const timeInputStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};

const selectStyle: React.CSSProperties = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "1em",
  marginRight: "5px",
};

const colonStyle: React.CSSProperties = {
  marginRight: "5px",
  marginLeft: "5px",
  fontSize: "1em",
  color: "#333",
};

const removeButtonStyle: React.CSSProperties = {
  padding: "8px 12px",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.9em",
  marginTop: "10px",
};

const buttonGroupStyle: React.CSSProperties = {
  marginTop: "20px",
  display: "flex",
  gap: "10px",
};

const addButton: React.CSSProperties = {
  padding: "10px 15px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "1em",
};

const submitButton: React.CSSProperties = {
  padding: "10px 15px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "1em",
};

export default TimeEntryForm;
