import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import "./SearchBar.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8080";

const SearchBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ products: [], players: [] });
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], players: [] });
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const [productsRes, playersRes] = await Promise.all([
          fetch(`${API_BASE}/api/products`),
          fetch(`${API_BASE}/api/players`),
        ]);
        const products = await productsRes.json();
        const players = await playersRes.json();
        const q = query.toLowerCase();

        setResults({
          products: products.filter((p) => p.name?.toLowerCase().includes(q)),
          players: players.filter(
            (p) =>
              p.name?.toLowerCase().includes(q) ||
              p.translator_name?.toLowerCase().includes(q),
          ),
        });
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setResults({ products: [], players: [] });
  };

  const handleProductClick = (id) => {
    handleClose();
    navigate(`/products/${id}`);
  };

  const hasResults = results.products.length > 0 || results.players.length > 0;
  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      {/* ICON BUTTON — replaces your existing <a> */}
      <a className="search-toggle" onClick={() => setIsOpen((prev) => !prev)}>
        <IoSearchOutline size={25} />
      </a>

      {/* INPUT — slides in when isOpen */}
      <div className={`search-input-row ${isOpen ? "visible" : ""}`}>
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder="Search products, players..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery("")}>
            ✕
          </button>
        )}
      </div>

      {/* DROPDOWN */}
      {showDropdown && (
        <div className="search-dropdown">
          {loading && <div className="search-state">Searching...</div>}

          {!loading && !hasResults && (
            <div className="search-state">No results for "{query}"</div>
          )}

          {!loading && results.products.length > 0 && (
            <div className="search-section">
              <p className="search-section-label">Products</p>
              {results.products.map((product) => (
                <div
                  key={product.id}
                  className="search-item"
                  onClick={() => handleProductClick(product.id)}
                >
                  <img
                    src={`${API_BASE}${product.image_main}`}
                    alt={product.name}
                    className="search-item-img"
                  />
                  <div className="search-item-info">
                    <p className="search-item-name">{product.name}</p>
                    <p className="search-item-sub">
                      {product.price?.toLocaleString()} VND
                      {product.stock === 0 && (
                        <span className="search-sold-out"> · Sold out</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && results.players.length > 0 && (
            <div className="search-section">
              <p className="search-section-label">Players</p>
              {results.players.map((player) => (
                <div
                  key={player.id}
                  className="search-item search-item--no-link"
                >
                  <img
                    src={`${API_BASE}${player.image}`}
                    alt={player.name}
                    className="search-item-img"
                  />
                  <div className="search-item-info">
                    <p className="search-item-name">{player.name}</p>
                    {player.translator_name && (
                      <p className="search-item-sub">
                        {player.translator_name}
                      </p>
                    )}
                    {player.signature_model && (
                      <p className="search-item-sub">
                        Signature: {player.signature_model}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
