import React from 'react';

// Sample book data
const books = [
  { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: 'https://example.com/book1.jpg' },
  { id: 2, title: '1984', author: 'George Orwell', cover: 'https://example.com/book2.jpg' },
  { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen', cover: 'https://example.com/book3.jpg' },
  { id: 4, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: 'https://example.com/book4.jpg' },
  { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', cover: 'https://example.com/book5.jpg' },
];

const BookRecommendationApp = () => {
  return (
    <div className="book-recommendation-app">
      <h1>Recommended Books</h1>
      <div className="book-grid">
        {books.map((book) => (
          <div key={book.id} className="book">
            <img src={book.cover} alt={book.title} />
            <div className="book-info">
              <h2>{book.title}</h2>
              <p>{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles for the component
const styles = `
  .book-recommendation-app {
    max-width: 1200px;
    margin: 40px auto;
    padding: 20px;
    background-color: #f7f7f7;
    border: 1px solid #ddd;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .book-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .book {
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .book img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px 10px 0 0;
  }

  .book-info {
    padding: 20px;
  }

  .book-info h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .book-info p {
    font-size: 14px;
    color: #666;
  }
`;

// Render the styles
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default BookRecommendationApp;