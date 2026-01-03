import { useState, useEffect } from 'react';
import './App.css';

const API_KEY = "b97243daebf4472c81022ca91fa93fde"; 

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch News Function
  const fetchNews = async (query = 'general', isCategory = true) => {
    setLoading(true);
    let url;
    
    if (isCategory) {
      url = `https://newsapi.org/v2/top-headlines?country=us&category=${query}&apiKey=${API_KEY}`;
    } else {
      url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&apiKey=${API_KEY}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.status === "ok") {
        setArticles(data.articles);
      } else {
        console.error("API Error:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial Load & Category Change
  useEffect(() => {
    // If we have a search query, don't trigger the category fetch
    if (!searchQuery) {
      fetchNews(category, true);
    }
  }, [category]);

  // Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCategory(''); // Clear active category highlight
      fetchNews(searchQuery, false);
    }
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="brand" onClick={() => { setCategory('general'); setSearchQuery(''); }}>
          NewsWebb 🪩
        </div>
        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search news..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </nav>

      {/* Category Buttons */}
      <div className="category-bar">
        {['general', 'business', 'technology', 'sports', 'entertainment', 'health'].map((cat) => (
          <button 
            key={cat}
            className={`cat-btn ${category === cat ? 'active' : ''}`}
            onClick={() => {
              setSearchQuery(''); // Clear search when category clicked
              setCategory(cat);
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main>
        {loading ? (
          <div className="loading">Loading latest news...</div>
        ) : (
          <div className="news-grid">
            {articles.map((article, index) => {
              // Skip articles with no images or removed content
              if (!article.urlToImage || article.title === "[Removed]") return null;
              
              return (
                <div key={index} className="news-card">
                  <img src={article.urlToImage} alt="news" className="news-img" />
                  <div className="news-content">
                    <span className="source">{article.source.name}</span>
                    <h3 className="news-title">{article.title.slice(0, 60)}...</h3>
                    <p className="news-desc">
                      {article.description 
                        ? article.description.slice(0, 90) + "..." 
                        : "Click below to read the full details of this report."}
                    </p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-btn">
                      Read More
                    </a>
                  </div>
                </div>
              );
            })}
            
            {!loading && articles.length === 0 && (
              <div className="loading">No news found for this search.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;