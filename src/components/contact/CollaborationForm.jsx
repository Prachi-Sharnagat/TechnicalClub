import { useState, useRef, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../fire.js";
import { CLUB_CONTACT } from "../../data/contact.js";
import Px from "../graphics/Px.jsx";

const INTEREST_AREAS = [
  "Web Development",
  "Graphics & Design",
  "Electronics & Robotics",
  "Project Collaboration",
  "Other"
];

const STUDY_YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Postgraduate / Other"
];

const INITIAL_FORM = {
  fullName: "",
  email: "",
  yearOfStudy: "",
  areaOfInterest: "",
  subject: "",
  message: ""
};

const MIN_MESSAGE_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 2000;

export default function CollaborationForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState("");
  const [lastSubmitted, setLastSubmitted] = useState(null);

  // Spam protection
  const [honeypot, setHoneypot] = useState("");
  const mountTimeRef = useRef(Date.now());

  useEffect(() => {
    mountTimeRef.current = Date.now();
  }, []);

  const validate = () => {
    const errs = {};
    const nameTrimmed = form.fullName.trim();
    const emailTrimmed = form.email.trim();
    const subjectTrimmed = form.subject.trim();
    const messageTrimmed = form.message.trim();

    // Full name validation
    if (!nameTrimmed) {
      errs.fullName = "Full name is required.";
    } else if (nameTrimmed.length < 2) {
      errs.fullName = "Full name must be at least 2 characters.";
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailTrimmed) {
      errs.email = "Student email is required.";
    } else if (!emailRegex.test(emailTrimmed)) {
      errs.email = "Please enter a valid student email address (e.g. name@rknec.edu).";
    }

    // Area of interest validation
    if (!form.areaOfInterest) {
      errs.areaOfInterest = "Please select an area of interest.";
    }

    // Subject validation
    if (!subjectTrimmed) {
      errs.subject = "Subject is required.";
    } else if (subjectTrimmed.length < 4) {
      errs.subject = "Subject must be at least 4 characters.";
    } else if (subjectTrimmed.length > 120) {
      errs.subject = "Subject cannot exceed 120 characters.";
    }

    // Message validation
    if (!messageTrimmed) {
      errs.message = "Message is required.";
    } else if (messageTrimmed.length < MIN_MESSAGE_LENGTH) {
      errs.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters. Tell us a bit more about your idea!`;
    } else if (messageTrimmed.length > MAX_MESSAGE_LENGTH) {
      errs.message = `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`;
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error dynamically as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Spam protection: Honeypot check
    if (honeypot) {
      // Silently reject bot submissions
      console.warn("Spam protection triggered: honeypot field filled.");
      setStatus("success");
      setStatusMessage("Enquiry received. Thank you!");
      return;
    }

    // 2. Spam protection: Rate/timing check (submission under 1.2s is likely a bot)
    const timeElapsed = Date.now() - mountTimeRef.current;
    if (timeElapsed < 1200) {
      console.warn("Submission too fast. Anti-spam delay check.");
    }

    // 3. Validation
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      // Focus first error field for accessibility
      const firstField = Object.keys(validationErrors)[0];
      const el = document.getElementById(`collab-${firstField}`);
      if (el) el.focus();
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      yearOfStudy: form.yearOfStudy || "Not specified",
      areaOfInterest: form.areaOfInterest,
      subject: form.subject.trim(),
      message: form.message.trim(),
      createdAt: serverTimestamp(),
      status: "unread",
      platform: "web"
    };

    try {
      if (!db) {
        throw new Error("Firestore database is not initialized.");
      }

      await addDoc(collection(db, "contact_enquiries"), payload);

      setLastSubmitted({
        name: form.fullName.trim(),
        email: form.email.trim(),
        subject: form.subject.trim()
      });
      setStatus("success");
      setStatusMessage("Your collaboration enquiry has been sent successfully!");
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error("Firestore contact submission error:", err);
      setStatus("error");
      // Provide honest feedback - do not pretend message was sent
      setStatusMessage(
        "Direct database submission is currently unavailable (service offline or permissions restricted). Please use the button below to email your enquiry directly to the club."
      );
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setStatusMessage("");
    setErrors({});
    setForm(INITIAL_FORM);
  };

  const remainingChars = MAX_MESSAGE_LENGTH - form.message.length;

  return (
    <div className="collab-form-container" id="collaboration-enquiry">
      <div className="collab-form-header">
        <div className="collab-tag-row">
          <span className="collab-tag">// COLLABORATION DISPATCH</span>
          <span className="collab-badge">PROJECTS & WORK</span>
        </div>
        <h3 className="collab-form-title">PROJECT / COLLABORATION ENQUIRY</h3>
        <p className="collab-form-subtitle">
          Have an idea for a web app, robotics prototype, workshop, or design collaboration? Drop us a message below and we’ll get back to you!
        </p>
      </div>

      {status === "success" ? (
        <div className="collab-success-box" role="status" aria-live="polite">
          <div className="collab-success-icon" aria-hidden="true">
            ✓
          </div>
          <h4 className="collab-success-title">MESSAGE RECEIVED!</h4>
          <p className="collab-success-desc">
            {lastSubmitted ? (
              <>
                Thank you, <strong>{lastSubmitted.name}</strong>! Your collaboration proposal regarding{" "}
                <strong>&ldquo;{lastSubmitted.subject}&rdquo;</strong> has been logged to the Technical Club dispatch queue.
                Our team will review it and reply to <strong>{lastSubmitted.email}</strong>.
              </>
            ) : (
              "Thank you for contacting Technical Club RBU. We will get back to you soon!"
            )}
          </p>
          <div className="collab-success-actions">
            <button
              type="button"
              className="btn go collab-reset-btn"
              onClick={resetForm}
            >
              <span>SEND ANOTHER ENQUIRY</span>
              <Px name="arrow" className="inl" />
            </button>
          </div>
        </div>
      ) : (
        <form className="collab-form" onSubmit={handleSubmit} noValidate>
          {/* Honeypot anti-spam field */}
          <div
            className="visually-hidden-field"
            aria-hidden="true"
            style={{ display: "none" }}
          >
            <label htmlFor="collab-website">Leave this field blank</label>
            <input
              type="text"
              id="collab-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Error Banner if submission failed */}
          {status === "error" && (
            <div className="collab-error-banner" role="alert">
              <div className="collab-error-banner-top">
                <span className="collab-error-sym">⚠</span>
                <strong>SUBMISSION NOTICE</strong>
              </div>
              <p className="collab-error-banner-msg">{statusMessage}</p>
              <div className="collab-error-banner-action">
                <a
                  href={`mailto:${CLUB_CONTACT.email}?subject=${encodeURIComponent(
                    `[Collaboration] ${form.subject || "Project Enquiry"}`
                  )}`}
                  className="btn go collab-mailto-fallback"
                  aria-label={`Open email app to send message to ${CLUB_CONTACT.email}`}
                >
                  <span>SEND VIA EMAIL CLIENT →</span>
                </a>
              </div>
            </div>
          )}

          {/* Row 1: Full Name & Student Email */}
          <div className="collab-form-row">
            <div className="collab-field-group">
              <label htmlFor="collab-fullName" className="collab-label">
                Full name <span className="collab-req" aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                id="collab-fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`collab-input ${errors.fullName ? "is-invalid" : ""}`}
                aria-required="true"
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "collab-fullName-err" : undefined}
                disabled={status === "submitting"}
              />
              {errors.fullName && (
                <span className="collab-field-err" id="collab-fullName-err" role="alert">
                  {errors.fullName}
                </span>
              )}
            </div>

            <div className="collab-field-group">
              <label htmlFor="collab-email" className="collab-label">
                Student email <span className="collab-req" aria-hidden="true">*</span>
              </label>
              <input
                type="email"
                id="collab-email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`collab-input ${errors.email ? "is-invalid" : ""}`}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "collab-email-err" : undefined}
                disabled={status === "submitting"}
              />
              {errors.email && (
                <span className="collab-field-err" id="collab-email-err" role="alert">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Year of Study & Area of Interest */}
          <div className="collab-form-row">
            <div className="collab-field-group">
              <label htmlFor="collab-yearOfStudy" className="collab-label">
                Year of study <span className="collab-opt">(optional)</span>
              </label>
              <div className="collab-select-wrapper">
                <select
                  id="collab-yearOfStudy"
                  name="yearOfStudy"
                  value={form.yearOfStudy}
                  onChange={handleChange}
                  className="collab-select"
                  disabled={status === "submitting"}
                >
                  <option value="">Select year of study...</option>
                  {STUDY_YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                <span className="collab-select-arrow" aria-hidden="true">▼</span>
              </div>
            </div>

            <div className="collab-field-group">
              <label htmlFor="collab-areaOfInterest" className="collab-label">
                Area of interest <span className="collab-req" aria-hidden="true">*</span>
              </label>
              <div className="collab-select-wrapper">
                <select
                  id="collab-areaOfInterest"
                  name="areaOfInterest"
                  value={form.areaOfInterest}
                  onChange={handleChange}
                  className={`collab-select ${errors.areaOfInterest ? "is-invalid" : ""}`}
                  aria-required="true"
                  aria-invalid={!!errors.areaOfInterest}
                  aria-describedby={errors.areaOfInterest ? "collab-areaOfInterest-err" : undefined}
                  disabled={status === "submitting"}
                >
                  <option value="">Choose a domain...</option>
                  {INTEREST_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                <span className="collab-select-arrow" aria-hidden="true">▼</span>
              </div>
              {errors.areaOfInterest && (
                <span className="collab-field-err" id="collab-areaOfInterest-err" role="alert">
                  {errors.areaOfInterest}
                </span>
              )}
            </div>
          </div>

          {/* Row 3: Subject */}
          <div className="collab-field-group full-width">
            <label htmlFor="collab-subject" className="collab-label">
              Subject <span className="collab-req" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="collab-subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Tell us what you'd like to collaborate on..."
              className={`collab-input ${errors.subject ? "is-invalid" : ""}`}
              aria-required="true"
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "collab-subject-err" : undefined}
              disabled={status === "submitting"}
              maxLength={120}
            />
            {errors.subject && (
              <span className="collab-field-err" id="collab-subject-err" role="alert">
                {errors.subject}
              </span>
            )}
          </div>

          {/* Row 4: Message */}
          <div className="collab-field-group full-width">
            <div className="collab-label-row">
              <label htmlFor="collab-message" className="collab-label">
                Message <span className="collab-req" aria-hidden="true">*</span>
              </label>
              <span className="collab-char-count" aria-live="polite">
                {form.message.length} / {MAX_MESSAGE_LENGTH} chars (min {MIN_MESSAGE_LENGTH})
              </span>
            </div>
            <textarea
              id="collab-message"
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your idea, requirements, tech stack, or team..."
              className={`collab-textarea ${errors.message ? "is-invalid" : ""}`}
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "collab-message-err" : undefined}
              disabled={status === "submitting"}
              maxLength={MAX_MESSAGE_LENGTH}
            />
            {errors.message && (
              <span className="collab-field-err" id="collab-message-err" role="alert">
                {errors.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="collab-submit-wrapper">
            <button
              type="submit"
              className="btn go collab-submit-btn"
              disabled={status === "submitting"}
              aria-busy={status === "submitting"}
            >
              <span>
                {status === "submitting" ? "SENDING MESSAGE..." : "SEND MESSAGE →"}
              </span>
            </button>
          </div>

          {/* Transparent service footer */}
          <p className="collab-service-note">
            Enquiries are routed directly to the Technical Club dispatch queue. You can also contact us directly at{" "}
            <a href={`mailto:${CLUB_CONTACT.email}`} className="collab-note-link">
              {CLUB_CONTACT.email}
            </a>.
          </p>
        </form>
      )}
    </div>
  );
}
