import { useState } from 'react';
import './RatingInput.css';

export default function RatingInput({ label, value, onChange, disabled = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="rating-input">
      <span className="rating-label">{label}</span>
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className={`star-btn ${star <= (hover || value) ? 'active' : ''}`}
            onClick={() => !disabled && onChange(star)}
            onMouseEnter={() => !disabled && setHover(star)}
            onMouseLeave={() => !disabled && setHover(0)}
            disabled={disabled}
            aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
        {value > 0 && (
          <span className="rating-value">{value}/5</span>
        )}
      </div>
    </div>
  );
}
