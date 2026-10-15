import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import brands from '../data/brands.js';
import './DeviceSelector.css';

export default function DeviceSelector() {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const navigate = useNavigate();

  const activeBrand = brands.find((b) => b.name === selectedBrand);

  const handleModel = (model) => {
    navigate('/book', { state: { deviceCategory: selectedBrand, deviceModel: model } });
  };

  return (
    <section className="section device-select">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <p className="mono-tag">Choose your device</p>
            <h2 className="section-title">What are we fixing today?</h2>
            <p className="section-sub">Pick a brand to see supported models, then jump straight into booking.</p>
          </div>
        </Reveal>

        <div className="brand-grid">
          {brands.map((b, i) => {
            const isSelected = selectedBrand === b.name;
            return (
              <Reveal delay={i * 40} key={b.name}>
                <button
                  type="button"
                  className={`brand-card ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setSelectedBrand(isSelected ? null : b.name)}
                  aria-pressed={isSelected}
                >
                  {isSelected && <span className="brand-card__check">✓</span>}
                  <span className="brand-card__label">{b.name}</span>
                </button>
              </Reveal>
            );
          })}
        </div>

        {activeBrand && (
          <div className="model-panel">
            <p className="mono-tag model-panel__label">{activeBrand.name} models</p>
            <div className="model-grid">
              {activeBrand.models.map((m) => (
                <button type="button" className="model-chip" key={m} onClick={() => handleModel(m)}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
