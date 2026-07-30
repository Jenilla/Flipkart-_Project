<<<<<<< HEAD
export default function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}
=======
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div
      style={{
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        textAlign: 'center',
        padding: '48px 16px',
      }}
    >
      <h1 style={{ fontSize: '28px', fontWeight: 800 }}>404</h1>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
>>>>>>> 4ff4200c6dd726ed94a558b4bdc604012afcf19f
