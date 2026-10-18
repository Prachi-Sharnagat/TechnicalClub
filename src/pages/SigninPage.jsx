import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../fire.js";
import { useState } from "react";

const EVENTS = ["Web Dev Workshop", "Hack Night", "Project Demo Day"];
const YEARS = ["1st year", "2nd year", "3rd year", "4th year"];
const BRANCHES = ["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil", "Other"];
const TIMESLOTS = [
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
];

const EMPTY = {
  name: "",
  email: "",
  date: "",
  event: "",
  section: "",
  branch: "",
  year: "",
  contactNo: "",
  timeslot: "",
};

function validate(d) {
  const e = {};
  if (!d.name.trim()) e.name = "Enter your full name.";
  if (!/^\S+@\S+\.\S+$/.test(d.email.trim())) e.email = "Enter a valid email address.";
  if (!/^[6-9]\d{9}$/.test(d.contactNo.trim()))
    e.contactNo = "Enter a 10-digit mobile number.";
  if (!d.year) e.year = "Select your year.";
  if (!d.branch) e.branch = "Select your branch.";
  if (!d.section.trim()) e.section = "Enter your section.";
  if (!d.event) e.event = "Select an event.";
  if (!d.date) e.date = "Pick a date.";
  if (!d.timeslot) e.timeslot = "Select a time slot.";
  return e;
}

export default function SigninPage({ preselectedEvent = "" }) {
  const [details, setDetails] = useState(() => ({
    ...EMPTY,
    event: preselectedEvent || ""
  }));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | saving | done | error
  const [message, setMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(details);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("saving");
    setMessage("");
    try {
      if (!db) {
        setStatus("error");
        setMessage("Database service is temporarily unavailable. Please try again later or reach out to the club.");
        return;
      }
      // One registration per email per event
      const id = `${details.email.trim().toLowerCase()}_${details.event}`.replace(
        /[\/\s]/g,
        "-"
      );
      const ref = doc(db, "registrations", id);

      if ((await getDoc(ref)).exists()) {
        setStatus("error");
        setMessage("This email is already registered for that event.");
        return;
      }

      await setDoc(ref, {
        ...details,
        name: details.name.trim(),
        email: details.email.trim().toLowerCase(),
        contactNo: details.contactNo.trim(),
        section: details.section.trim().toUpperCase(),
        createdAt: serverTimestamp(),
      });

      setStatus("done");
      setMessage(`You're in for ${details.event}.`);
      setDetails(EMPTY);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Registration failed. Check your connection and try again.");
    }
  };

  const field = (name) => ({
    id: name,
    name,
    value: details[name],
    onChange: handleChange,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-err` : undefined,
  });

  const Err = ({ name }) =>
    errors[name] ? (
      <span className="tc-err" id={`${name}-err`} role="alert">
        {errors[name]}
      </span>
    ) : null;

  return (
    <>
      <style>{css}</style>
      <div className="tc-page">
        <header className="tc-nav">
          <span className="tc-logo">
            <i className="tc-logo-box" />
            Technical Club
          </span>
        </header>

        <main className="tc-main">
          <h1 className="tc-title">
            Join Web Dev<span className="tc-cursor" aria-hidden="true" />
          </h1>
          <p className="tc-lead">
            Pick an event and a time slot. We'll hold your seat.
          </p>

          <div className="tc-window">
            <div className="tc-window-bar">
              <span className="tc-dots" aria-hidden="true">
                <i /><i /><i />
              </span>
              <span className="tc-url">technicalclub.dev/register</span>
            </div>

            {status === "done" ? (
              <div className="tc-done" role="status">
                <h2>Registered!</h2>
                <p>{message}</p>
                <button
                  type="button"
                  className="tc-btn tc-btn-solid"
                  onClick={() => setStatus("idle")}
                >
                  Register another
                </button>
              </div>
            ) : (
              <form className="tc-form" onSubmit={handleSubmit} noValidate>
                <div className="tc-group">
                  <label htmlFor="name">Full name</label>
                  <input type="text" autoComplete="name" {...field("name")} />
                  <Err name="name" />
                </div>

                <div className="tc-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" autoComplete="email" {...field("email")} />
                  <Err name="email" />
                </div>

                <div className="tc-group">
                  <label htmlFor="contactNo">Mobile number</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel-national"
                    {...field("contactNo")}
                  />
                  <Err name="contactNo" />
                </div>

                <div className="tc-row">
                  <div className="tc-group">
                    <label htmlFor="year">Year</label>
                    <select {...field("year")}>
                      <option value="">Select</option>
                      {YEARS.map((y) => (
                        <option key={y}>{y}</option>
                      ))}
                    </select>
                    <Err name="year" />
                  </div>
                  <div className="tc-group">
                    <label htmlFor="branch">Branch</label>
                    <select {...field("branch")}>
                      <option value="">Select</option>
                      {BRANCHES.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                    <Err name="branch" />
                  </div>
                  <div className="tc-group">
                    <label htmlFor="section">Section</label>
                    <input type="text" maxLength={3} {...field("section")} />
                    <Err name="section" />
                  </div>
                </div>

                <div className="tc-group">
                  <label htmlFor="event">Event</label>
                  <select {...field("event")}>
                    <option value="">Select an event</option>
                    {EVENTS.map((ev) => (
                      <option key={ev}>{ev}</option>
                    ))}
                  </select>
                  <Err name="event" />
                </div>

                <div className="tc-row tc-row-2">
                  <div className="tc-group">
                    <label htmlFor="date">Date</label>
                    <input type="date" min={today} {...field("date")} />
                    <Err name="date" />
                  </div>
                  <div className="tc-group">
                    <label htmlFor="timeslot">Time slot</label>
                    <select {...field("timeslot")}>
                      <option value="">Select</option>
                      {TIMESLOTS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    <Err name="timeslot" />
                  </div>
                </div>

                {status === "error" && (
                  <p className="tc-banner" role="alert">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className="tc-btn tc-btn-solid"
                  disabled={status === "saving"}
                >
                  {status === "saving" ? "Saving..." : "Register"}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

const css = `
@import url("https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=VT323&family=Press+Start+2P&display=swap");

.tc-page {
  --bg: #070a14;
  --panel: #0e1428;
  --field: #141c36;
  --blue: #5588ff;
  --blue-deep: #2f4fa8;
  --ink: #f0f2ff;
  --muted: #9aa6d6;
  --danger: #ff7a8a;
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: "VT323", monospace;
  font-size: 1.35rem;
  padding: 18px 18px 56px;
  box-sizing: border-box;
}
.tc-page *, .tc-page *::before, .tc-page *::after { box-sizing: border-box; }

.tc-nav { max-width: 640px; margin: 0 auto; padding: 8px 0 28px; }
.tc-logo {
  display: inline-flex; align-items: center; gap: 14px;
  font-family: "Silkscreen", monospace; font-weight: 700;
  font-size: 1.1rem; letter-spacing: .08em; text-transform: uppercase;
}
.tc-logo-box {
  width: 20px; height: 20px; background: var(--blue);
  box-shadow: 4px 4px 0 var(--blue-deep);
}

.tc-main { max-width: 640px; margin: 0 auto; }
.tc-title {
  font-family: "Press Start 2P", monospace; font-weight: 400;
  font-size: clamp(1.4rem, 5.5vw, 2.2rem); line-height: 1.3;
  margin: 8px 0 18px;
}
.tc-cursor {
  display: inline-block; width: .6em; height: 1em; margin-left: .15em;
  background: var(--blue); vertical-align: -0.12em;
  animation: tc-blink 1.1s steps(1) infinite;
}
@keyframes tc-blink { 50% { opacity: 0; } }

.tc-lead { color: var(--muted); font-size: 1.5rem; line-height: 1.5; margin: 0 0 32px; max-width: 34em; }

/* window frame */
.tc-window {
  background: var(--panel);
  border: 4px solid var(--blue);
  box-shadow: 10px 10px 0 var(--blue-deep);
}
.tc-window-bar {
  background: var(--blue); color: #070a14;
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; font-family: "Silkscreen", monospace; font-size: .85rem;
}
.tc-dots { display: flex; gap: 10px; }
.tc-dots i { width: 14px; height: 14px; background: #070a14; display: block; }

.tc-form, .tc-done { padding: 28px 24px 32px; display: grid; gap: 22px; }

.tc-group { display: grid; gap: 8px; min-width: 0; }
.tc-group label {
  font-family: "Silkscreen", monospace; font-size: .9rem; color: var(--blue);
}
.tc-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.tc-row-2 { grid-template-columns: repeat(2, 1fr); }

.tc-page input, .tc-page select {
  width: 100%; font: inherit; color: var(--ink);
  background: var(--field); border: 3px solid var(--blue-deep);
  border-radius: 0; padding: 10px 12px; min-height: 48px;
  appearance: none; -webkit-appearance: none;
  color-scheme: dark;
}
.tc-page select {
  background-image:
    linear-gradient(45deg, transparent 50%, var(--blue) 50%),
    linear-gradient(135deg, var(--blue) 50%, transparent 50%);
  background-position: calc(100% - 20px) 50%, calc(100% - 14px) 50%;
  background-size: 6px 6px; background-repeat: no-repeat;
  padding-right: 36px;
}
.tc-page input:focus-visible, .tc-page select:focus-visible,
.tc-btn:focus-visible {
  outline: 3px solid var(--ink); outline-offset: 2px; border-color: var(--blue);
}
.tc-page [aria-invalid="true"] { border-color: var(--danger); }

.tc-err { color: var(--danger); font-size: 1.1rem; }
.tc-banner {
  margin: 0; padding: 10px 12px; color: var(--danger);
  border: 3px solid var(--danger); background: rgba(255,122,138,.08);
}

/* buttons */
.tc-btn {
  font-family: "Silkscreen", monospace; font-weight: 700; font-size: 1rem;
  letter-spacing: .06em; text-transform: uppercase;
  padding: 16px 24px; border: 4px solid var(--blue); border-radius: 0;
  cursor: pointer; min-height: 56px;
  transition: transform .08s steps(2), box-shadow .08s steps(2);
}
.tc-btn-solid {
  background: var(--blue); color: #070a14;
  box-shadow: 8px 8px 0 var(--blue-deep);
}
.tc-btn-solid:hover:not(:disabled) { transform: translate(2px, 2px); box-shadow: 6px 6px 0 var(--blue-deep); }
.tc-btn-solid:active:not(:disabled) { transform: translate(8px, 8px); box-shadow: 0 0 0 var(--blue-deep); }
.tc-btn:disabled { opacity: .6; cursor: progress; }

.tc-done h2 { font-family: "Press Start 2P", monospace; font-weight: 400; font-size: 1.2rem; margin: 0; }
.tc-done p { margin: 0; color: var(--muted); font-size: 1.5rem; }
.tc-done .tc-btn { justify-self: start; }

@media (max-width: 520px) {
  .tc-row, .tc-row-2 { grid-template-columns: 1fr; }
  .tc-form, .tc-done { padding: 22px 16px 26px; }
  .tc-url { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .tc-cursor { animation: none; }
  .tc-btn { transition: none; }
}
`;
