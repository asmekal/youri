import React, { useState } from 'react';

const RecipeSearchTool = () => {
  const [ingredients, setIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleIngredientChange = (event) => {
    setIngredients(event.target.value.split(','));
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleIngredientSelect = (ingredient) => {
    setSelectedIngredients([...selectedIngredients, ingredient]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Fetch relevant recipes with selected ingredients and search query
    console.log('Fetching recipes with:', searchQuery, selectedIngredients);
  };

  return (
    <div className="recipe-search-tool">
      <h2>Search for food recipes with ingredient filtering</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search query"
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
        <input
          type="text"
          placeholder="Enter ingredients (comma separated)"
          value={ingredients.join(',')}
          onChange={handleIngredientChange}
        />
        <select multiple>
          {ingredients.map((ingredient) => (
            <option key={ingredient} value={ingredient}>
              {ingredient}
            </option>
          ))}
        </select>
        <button type="submit">Search Recipes</button>
      </form>
      <div className="selected-ingredients">
        <h3>Selected Ingredients:</h3>
        <ul>
          {selectedIngredients.map((ingredient) => (
            <li key={ingredient}>{ingredient}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeSearchTool;