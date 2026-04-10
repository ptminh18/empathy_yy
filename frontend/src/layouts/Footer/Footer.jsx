import "./Footer.css";

export default function Footer() {
  return (
    <>
      <div className="footer-container">
        <div className="footer-introduction">
          <h5>... \'an independent yo-yo brand founded by tony šec\ ...</h5>
        </div>
        {/* TOP ROW */}
        <div className="footer-brand-section">
          <h3 className="footer-brand-information">empathy, prague 2022</h3>
          <div className="footer-input-group">
            <input
              type="email"
              placeholder="Email"
              className="newsletter-input"
            />
            <button className="newsletter-submit">→</button>
          </div>
        </div>

        <div className="social-icons">
          <a href="#" className="social-link">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="#" className="social-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
            </svg>
          </a>
        </div>

        {/* MIDDLE ROW */}
        <div className="footer-middle">
          <div className="selectors-group">
            <div className="selector-item">
              <label>Country/region</label>
              <select>
                <option>Vietnam (VND ₫)</option>
              </select>
            </div>
            <div className="selector-item">
              <label>Language</label>
              <select>
                <option>English</option>
              </select>
            </div>
          </div>

          <div className="payment-icons">
            <div className="payment-card amex"></div>
            <div className="payment-card applepay"></div>
            <div className="payment-card mastercard"></div>
            <div className="payment-card visa"></div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="footer-bottom">
          <p className="copyright">© 2026, empathy Powered by Phan The Minh</p>
          <ul className="footer-links">
            <li>
              <a href="#">Refund policy</a>
            </li>
            <li>
              <a href="#">Privacy policy</a>
            </li>
            <li>
              <a href="#">Terms of service</a>
            </li>
            <li>
              <a href="#">Contact information</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
