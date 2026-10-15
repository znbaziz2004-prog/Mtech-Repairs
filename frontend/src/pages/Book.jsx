import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { createBooking } from '../utils/api.js';
import { deviceCategories } from '../data/fallback.js';
import brands from '../data/brands.js';
import repairTypes from '../data/repairTypes.js';
import useDocumentMeta from '../utils/useDocumentMeta.js';
import '../styles/forms.css';
import './Book.css';

const STEP_LABELS = ['Device', 'Brand', 'Model', 'Repair', 'Estimate', 'Details', 'Confirmed'];

export default function Book() {
  useDocumentMeta(
    'Book a Repair | Mtech n repairs',
    'Book your device repair in a few steps and get an instant estimate before you commit.'
  );

  const location = useLocation();
  const prefillDeviceType = location.state?.deviceCategory || '';
  const prefillModel = location.state?.deviceModel || '';
  const prefillServiceNote = location.state?.service ? `Interested in: ${location.state.service}` : '';

  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    deviceType: deviceCategories.some((c) => c.label === prefillDeviceType) ? prefillDeviceType : '',
    brand: brands.some((b) => b.name === prefillDeviceType) ? prefillDeviceType : '',
    model: prefillModel,
    repairKey: '',
    customerName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    notes: prefillServiceNote,
  });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');

  const set = (patch) => setData((d) => ({ ...d, ...patch }));
  const next = () => setStep((s) => Math.min(s + 1, 7));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const isValidUKPhone = (phone) => {
  const cleaned = phone.replace(/[\s()-]/g, '');

  return /^(?:(?:\+44)|0)(?:7\d{9}|[12358]\d{8,9})$/.test(cleaned);
};

  const activeBrand = brands.find((b) => b.name === data.brand);
  const activeRepair = repairTypes.find((r) => r.key === data.repairKey);

  const handleConfirm = async (e) => {
    e.preventDefault();

const phone = data.phone.trim();

if (!isValidUKPhone(phone)) {
  setError(
    'Please enter a valid UK phone number, e.g. 07123 456789 or +44 7123 456789.'
  );
  setStatus('error');
  return;
}

setStatus('sending');
setError('');
    const ref = `MTR-${Date.now().toString(36).toUpperCase()}`;
    try {
      await createBooking({
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        deviceCategory: `${data.deviceType} — ${data.brand}`,
        deviceModel: data.model,
        issue: `${activeRepair?.label || 'Repair'}${data.notes ? ' — ' + data.notes : ''}`,
        preferredDate: data.preferredDate,
      });
      setReference(ref);
      setStatus('sent');
      setStep(7);
    } catch (err) {
      setStatus('error');
      setError(
        err?.response?.data?.message ||
          "Couldn't submit your booking right now — please check the backend is running, or contact us directly."
      );
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Book a repair"
        title="Let's get your device fixed."
        subtitle="A few quick steps — device, repair type, instant estimate, then your details."
      />

      <section className="section wizard">
        <div className="container">
          {step < 7 && (
            <div className="wizard__progress">
              {STEP_LABELS.slice(0, 6).map((label, i) => (
                <div key={label} className={`wizard__progress-item ${step === i + 1 ? 'is-active' : ''} ${step > i + 1 ? 'is-done' : ''}`}>
                  <span className="wizard__progress-num">{step > i + 1 ? '✓' : i + 1}</span>
                  <span className="wizard__progress-label">{label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="wizard__panel" key={step}>
            {step === 1 && (
              <StepChoice
                title="Select your device"
                options={deviceCategories.map((c) => c.label)}
                value={data.deviceType}
                onSelect={(v) => {
                  set({ deviceType: v });
                  next();
                }}
              />
            )}

            {step === 2 && (
              <StepChoice
                title="Select the brand"
                options={brands.map((b) => b.name)}
                value={data.brand}
                onSelect={(v) => {
                  set({ brand: v, model: '' });
                  next();
                }}
                onBack={back}
              />
            )}

            {step === 3 && (
              <StepChoice
                title={`Select the model — ${data.brand}`}
                options={activeBrand ? activeBrand.models : ['Other']}
                value={data.model}
                onSelect={(v) => {
                  set({ model: v });
                  next();
                }}
                onBack={back}
              />
            )}

            {step === 4 && (
              <StepChoice
                title="What needs repairing?"
                options={repairTypes.map((r) => r.label)}
                value={activeRepair?.label}
                onSelect={(label) => {
                  const r = repairTypes.find((rt) => rt.label === label);
                  set({ repairKey: r.key });
                  next();
                }}
                onBack={back}
              />
            )}

            {step === 5 && activeRepair && (
              <div className="wizard__step">
                <h2 className="wizard__step-title">Your estimate</h2>
                <div className="estimate-card">
                  <div className="estimate-card__row">
                    <span>Device</span>
                    <strong>{data.brand} {data.model}</strong>
                  </div>
                  <div className="estimate-card__row">
                    <span>Repair</span>
                    <strong>{activeRepair.label}</strong>
                  </div>
                  <div className="estimate-card__row estimate-card__row--price">
                    <span>Estimated price</span>
                    <strong>£{activeRepair.priceFrom}–£{activeRepair.priceTo}</strong>
                  </div>
                  <div className="estimate-card__row">
                    <span>Estimated time</span>
                    <strong>{activeRepair.time}</strong>
                  </div>
                  <div className="estimate-card__row">
                    <span>Warranty</span>
                    <strong>{activeRepair.warranty}</strong>
                  </div>
                  <p className="estimate-card__note">
                    Sample pricing shown for illustration — your final quote is confirmed after inspection.
                  </p>
                </div>
                <div className="wizard__nav">
                  <button type="button" className="btn btn--ghost" onClick={back}>
                    ← Back
                  </button>
                  <button type="button" className="btn btn--gold" onClick={next}>
                    Continue to details
                  </button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="wizard__step">
                <h2 className="wizard__step-title">Your details</h2>
                <form className="wizard__form" onSubmit={handleConfirm}>
                  <div className="form-row">
                    <label>
                      Full name
                      <input value={data.customerName} onChange={(e) => set({ customerName: e.target.value })} required />
                    </label>
                    <label>
   Phone Number
  <input
    type="tel"
    name="phone"
    value={data.phone}
    onChange={(e) => {
      const value = e.target.value;

      if (/^[0-9+\s()-]*$/.test(value) && value.length <= 20) {
        set({ phone: value });
      }
    }}
    placeholder="07123 456789"
    autoComplete="tel"
    maxLength={20}
    required
  />
  <small>Enter a valid  mobile or landline number.</small>
</label>
                  </div>
                  <label>
                    Email
                    <input type="email" value={data.email} onChange={(e) => set({ email: e.target.value })} required />
                  </label>
                  <div className="form-row">
                    <label>
                      Preferred date
                      <input type="date" value={data.preferredDate} onChange={(e) => set({ preferredDate: e.target.value })} />
                    </label>
                    <label>
                      Preferred time
                      <input type="time" value={data.preferredTime} onChange={(e) => set({ preferredTime: e.target.value })} />
                    </label>
                  </div>
                  <label>
                    Additional notes
                    <textarea rows={3} value={data.notes} onChange={(e) => set({ notes: e.target.value })} />
                  </label>

                  <div className="wizard__nav">
                    <button type="button" className="btn btn--ghost" onClick={back}>
                      ← Back
                    </button>
                    <button type="submit" className="btn btn--gold" disabled={status === 'sending'}>
                      {status === 'sending' ? 'Submitting…' : 'Submit repair request'}
                    </button>
                  </div>
                  {status === 'error' && <p className="form-note form-note--err">{error}</p>}
                </form>
              </div>
            )}

            {step === 7 && (
              <div className="wizard__step wizard__confirm">
                <span className="wizard__confirm-check">✓</span>
                <h2 className="wizard__step-title">Repair request submitted</h2>
                <p className="wizard__confirm-ref">Booking reference: <strong>{reference}</strong></p>

                <div className="estimate-card">
                  <div className="estimate-card__row">
                    <span>Device</span>
                    <strong>{data.brand} {data.model}</strong>
                  </div>
                  <div className="estimate-card__row">
                    <span>Repair</span>
                    <strong>{activeRepair?.label}</strong>
                  </div>
                  <div className="estimate-card__row estimate-card__row--price">
                    <span>Estimated price</span>
                    <strong>£{activeRepair?.priceFrom}–£{activeRepair?.priceTo}</strong>
                  </div>
                  <div className="estimate-card__row">
                    <span>Estimated time</span>
                    <strong>{activeRepair?.time}</strong>
                  </div>
                  <div className="estimate-card__row">
                    <span>Name</span>
                    <strong>{data.customerName}</strong>
                  </div>
                  <div className="estimate-card__row">
                    <span>Contact</span>
                    <strong>{data.phone} · {data.email}</strong>
                  </div>
                </div>

                <p className="wizard__confirm-sub">
                  We'll confirm your slot shortly by email or phone.
                </p>
                <Link to="/" className="btn btn--gold">
                  Back to home
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function StepChoice({ title, options, value, onSelect, onBack }) {
  return (
    <div className="wizard__step">
      <h2 className="wizard__step-title">{title}</h2>
      <div className="wizard__choice-grid">
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            className={`wizard__choice ${value === opt ? 'is-selected' : ''}`}
            onClick={() => onSelect(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      {onBack && (
        <div className="wizard__nav">
          <button type="button" className="btn btn--ghost" onClick={onBack}>
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
