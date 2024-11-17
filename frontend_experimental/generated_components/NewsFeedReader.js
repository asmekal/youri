import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NewsFeedReader() {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      const response = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://www.cnn.com/services/rss');
      setNews(response.data.items);
    };
    fetchNews();
  }, []);

  const filteredNews = news.filter((article) => {
    return article.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>News Feed Reader</h1>
      <input
        type="search"
        placeholder="Search news"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="news-container">
        {filteredNews.map((article) => (
          <div key={article.link} className="news-card">
            <img src={article.thumbnail} alt={article.title} />
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <p>{new Date(article.pubDate).toLocaleDateString()}</p>
            <button>
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsFeedReader;