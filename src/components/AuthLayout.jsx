import { Link } from 'react-router-dom';
import './AuthLayout.css';

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AuthLayout({ eyebrow, title, subtitle, benefits, children }) {
  return (
    <div className="auth-shell">
      <aside className="auth-panel">
        <Link to="/" className="auth-panel-logo">
          Shop<span>Kart</span>
        </Link>

        <div className="auth-panel-content">
          <p className="auth-panel-eyebrow">{eyebrow}</p>
          <h1 className="auth-panel-title">{title}</h1>
          <p className="auth-panel-subtitle">{subtitle}</p>

          <ul className="auth-panel-benefits">
            {benefits.map((benefit) => (
              <li key={benefit}>
                <span className="auth-panel-check">
                  <CheckIcon />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="auth-panel-glow" aria-hidden="true" />
        <div className="auth-panel-dots" aria-hidden="true" />
      </aside>

      <div className="auth-form-panel">
        <div className="auth-form-card">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
