import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import './AttendanceEntry.css';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const CLASSES = ['CSE01', 'CSE02', 'CSE03', 'CSE04', 'CSE05', 'CSE06'];
const PERIODS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];

type SaveState =
  | { type: 'idle'; message: string }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };

function parseAbsentRolls(value: string) {
  return [
    ...new Set(
      value
        .split(/[,\s]+/)
        .map((roll) => roll.trim())
        .filter(Boolean)
        .map(Number)
        .filter((roll) => Number.isInteger(roll) && roll > 0),
    ),
  ];
}

function AttendanceEntry() {
  const [year, setYear] = useState('3rd Year');
  const [selectedClass, setSelectedClass] = useState('CSE02');
  const [date, setDate] = useState('2026-07-01');
  const [period, setPeriod] = useState('P4');
  const [absentInput, setAbsentInput] = useState('');
  const [attendanceType, setAttendanceType] = useState('absent');
  const [saveState, setSaveState] = useState<SaveState>({
    type: 'idle',
    message: 'Ready to save attendance.',
  });
  const [isSaving, setIsSaving] = useState(false);

  const absentRolls = useMemo(() => parseAbsentRolls(absentInput), [absentInput]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setSaveState({ type: 'idle', message: 'Saving attendance...' });

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          class: selectedClass,
          date,
          period,
          attendanceType,
          absentRolls,
        }),
      });
      const data = (await response.json()) as { error?: string; absentCount?: number };

      if (!response.ok) {
        throw new Error(data.error ?? `Request failed with HTTP ${response.status}`);
      }

      setSaveState({
        type: 'success',
        message: `Saved attendance with ${data.absentCount ?? absentRolls.length} ${
          attendanceType === "absent" ? "absentees" : "presents"
        }.`,
      });

      setAbsentInput('');

    } catch (error) {
      setSaveState({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to save attendance.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="attendance-page">
      <form className="attendance-card" onSubmit={handleSubmit}>
        <header className="card-header">
          <div>
            <h1>Mark Attendance</h1>
            <p>CSE - period-wise entry</p>
          </div>
        </header>

        <section className="form-grid" aria-label="Attendance details">
          <label>
            <span>Year</span>
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              {YEARS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Class</span>
            <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}>
              {CLASSES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Date</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>

          <label>
            <span>Period</span>
            <select value={period} onChange={(event) => setPeriod(event.target.value)}>
              {PERIODS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </section>

        <div className="attendance-type" aria-label="Attendance entry type">
          <label className="attendance-option">
            <input
              type="radio"
              value="absent"
              checked={attendanceType === "absent"}
              onChange={(e) => setAttendanceType(e.target.value)}
            />
            Absentees
          </label>

          <label className="attendance-option">
            <input
              type="radio"
              value="present"
              checked={attendanceType === "present"}
              onChange={(e) => setAttendanceType(e.target.value)}
            />
            Presents
          </label>

        </div>

        <label className="roll-field">
          <span>
            {attendanceType === "absent" ? "Absent Roll Numbers" : "Present Roll Numbers"}
          </span>
          <textarea
            value={absentInput}
            onChange={(event) => setAbsentInput(event.target.value)}
            placeholder={
              attendanceType === "absent"
                ? "4, 17, 23"
                : "1, 2, 3, 4"
            }
            rows={4}
          />
        </label>

        <div className="count-row">
          <span>{attendanceType === "absent" ? "Absentees" : "Presents"}</span>
          <strong>{absentRolls.length}</strong>
        </div>

        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving attendance...' : 'Save attendance'}
        </button>

        <p className={`save-message ${saveState.type}`} role="status">
          {saveState.message}
        </p>
      </form>
    </main>
  );
}

export default AttendanceEntry;
