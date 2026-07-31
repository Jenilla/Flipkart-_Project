import { Link } from 'react-router-dom';
import './Footer.css';

const footerColumns = [
  {
    heading: 'About',
    links: ['Contact Us', 'About Us', 'Careers', 'Press'],
  },
  {
    heading: 'Help',
    links: ['Payments', 'Shipping', 'Cancellation & Returns', 'FAQ'],
  },
  {
    heading: 'Policy',
    links: ['Return Policy', 'Terms of Use', 'Security', 'Privacy'],
  },
  {
    heading: 'Social',
    links: ['Facebook', 'Twitter', 'Instagram', 'YouTube'],
  },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-columns">
          {footerColumns.map((column) => (
            <div key={column.heading} className="footer-column">
              <h4>{column.heading}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#top">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <Link to="/" className="footer-logo">
            Shop<span>Kart</span>
          </Link>
          <p>&copy; {new Date().getFullYear()} ShopKart. Built for demo purposes only.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
