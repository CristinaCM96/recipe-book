import { useEffect, useState } from "react";
import "./App.css";

const STORAGE_KEY = "recipe-book";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [category, setCategory] = useState("Dessert");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setRecipes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  }, [recipes]);

  function saveRecipe() {
    if (!title.trim()) return;

    if (editingId) {
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === editingId
            ? { ...recipe, title, ingredients, category }
            : recipe
        )
      );

      setEditingId(null);
    } else {
      const newRecipe = {
        id: Date.now(),
        title,
        ingredients,
        category,
        favorite: false,
      };

      setRecipes([newRecipe, ...recipes]);
    }

    setTitle("");
    setIngredients("");
    setCategory("Dessert");
  }

  function editRecipe(recipe) {
    setTitle(recipe.title);
    setIngredients(recipe.ingredients);
    setCategory(recipe.category || "Dessert");
    setEditingId(recipe.id);
  }

  function cancelEdit() {
    setTitle("");
    setIngredients("");
    setCategory("Dessert");
    setEditingId(null);
  }
function handleShortcut(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    saveRecipe();
  }

  if (e.key === "Escape") {
    cancelEdit();
  }
}
  function deleteRecipe(id) {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  }

  function toggleFavorite(id) {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === id
          ? { ...recipe, favorite: !recipe.favorite }
          : recipe
      )
    );
  }

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFavorite = !showFavorites || recipe.favorite;

    const matchesCategory =
      categoryFilter === "All" || recipe.category === categoryFilter;

    return matchesSearch && matchesFavorite && matchesCategory;
  });

  return (
    <main className="app">
      <section className="hero">
        <h1>Crispy's Cozy Recipes 🍰</h1>
        <p className="subtitle">Operation Comfort Food</p>
      </section>

      <div className="container">
        <section className="recipe-form">
          <input
  placeholder="Recipe name..."
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
  e.preventDefault();
  document.querySelector("textarea")?.focus();
}

    handleShortcut(e);
  }}
/>

          <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  onKeyDown={handleShortcut}
>
            <option>Dessert</option>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
            <option>Drink</option>
          </select>

          <textarea
  placeholder="Ingredients or notes..."
  value={ingredients}
  onChange={(e) => setIngredients(e.target.value)}
  onKeyDown={handleShortcut}
/>

          <button onClick={saveRecipe}>
            {editingId ? "Save Changes ✨" : "Add Recipe ✨"}
          </button>

          {editingId && (
  <>
    <button className="cancel" onClick={cancelEdit}>
      Cancel Edit
    </button>

    <p className="shortcut-hint">
      Ctrl/Cmd + Enter to save · Esc to cancel
    </p>
  </>
)}
        </section>

        <input
          className="search"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="category-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option>All</option>
          <option>Dessert</option>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
          <option>Drink</option>
        </select>

        <button
          className="favorite-filter"
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? "Show All Recipes" : "Show Favorites ❤️"}
        </button>

        <section className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <article className="recipe-card" key={recipe.id}>
              <div className="card-header">
                <h2>{recipe.title}</h2>

                <button
                  className={`favorite-btn ${recipe.favorite ? "active" : ""}`}
                  onClick={() => toggleFavorite(recipe.id)}
                >
                  {recipe.favorite ? "❤️" : "🤍"}
                </button>
              </div>

              <span className="category-tag">
                {recipe.category || "Uncategorized"}
              </span>

              <p>{recipe.ingredients || "No ingredients yet."}</p>

              <div className="card-buttons">
                <button className="edit" onClick={() => editRecipe(recipe)}>
                  Edit
                </button>

                <button
                  className="delete"
                  onClick={() => deleteRecipe(recipe.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>

        {filteredRecipes.length === 0 && (
          <p className="empty">No recipes yet. Add something delicious 🍓</p>
        )}
      </div>
    </main>
  );
}