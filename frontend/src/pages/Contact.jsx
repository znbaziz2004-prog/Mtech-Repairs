import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { sendContactMessage } from '../utils/api.js';
import useDocumentMeta from '../utils/useDocumentMeta.js';
import '../styles/forms.css';
import './Contact.css';

export default function Contact() {
  useDocumentMeta(
    'Contact | Mtech & repairs',
    'Get in touch with Mtech & repairs for questions about repairs, diagnostics, or buying and selling devices.'
  );

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Enquiry', device: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const { device, ...rest } = form;
      await sendContactMessage({
        ...rest,
        message: device ? `[Device: ${device}] ${form.message}` : form.message,
      });
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', subject: 'General Enquiry', device: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Questions before you book? Ask away."
        subtitle="We usually reply within a few hours during business hours."
      />

      <section className="section">
        <div className="container contact-grid">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>
                Email
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>
            </div>
            <div className="form-row">
              <label>
                Phone (optional)
                <input name="phone" value={form.phone} onChange={handleChange} />
              </label>
              <label>
                Subject
                <select name="subject" value={form.subject} onChange={handleChange}>
                  <option>General Enquiry</option>
                  <option>Repair Question</option>
                  <option>Buy &amp; Sell</option>
                  <option>Accessories</option>
                  <option>Diagnostics</option>
                </select>
              </label>
            </div>
            <label>
              Device (optional)
              <input name="device" value={form.device} onChange={handleChange} placeholder="e.g. iPhone 14 Pro" />
            </label>
            <label>
              Message
              <textarea name="message" value={form.message} onChange={handleChange} required rows={5} />
            </label>
            <button type="submit" className="btn btn--gold" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            {status === 'sent' && <p className="form-note form-note--ok">Message sent — we'll be in touch.</p>}
            {status === 'error' && <p className="form-note form-note--err">Couldn't send — please try again shortly.</p>}
          </form>

          <aside className="contact-aside">
            <h3>Visit or reach us</h3>
            <div className="contact-aside__block">
              <p className="mono-tag">Email</p>
              <p>info@mtechnrepairs.co.uk</p>
            </div>
            <div className="contact-aside__block">
              <p className="mono-tag">Phone</p>
              <p>+44 000 000 0000</p>
            </div>
            <div className="contact-aside__block">
              <p className="mono-tag">WhatsApp</p>
              <p>+44 000 000 0000</p>
            </div>
            <div className="contact-aside__block">
              <p className="mono-tag">Address</p>
              <p>Longmeade gravesend 
DA12 2NX</p>
            </div>
            <div className="contact-aside__block">
              <p className="mono-tag">Hours</p>
              <p>Mon–Sat, 9am–6pm</p>
            </div>
            <div className="contact-aside__map" aria-label="Map placeholder">
              Map placeholder
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
