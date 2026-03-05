import { useState, useEffect } from "react";
import "./App.css";
import { FaSearch } from "react-icons/fa";

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pokemonSearch, setPokemonSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pokemonStats, setPokemonStats] = useState(false);

  // reusable function for default pokemon render
  const fetchDefaultPokemon = () => {
    fetch("https://pokeapi.co/api/v2/pokemon/1")
      .then((res) => res.json())
      .then((data) => {
        // console.log("default Pokemon:", data);
        setPokemon(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading default Pokemon:", error);
        setLoading(false);
        setErrorMessage("Failed to load default Pokemon");
      });
  };

  // defualt pokemon rendered
  useEffect(() => {
    fetchDefaultPokemon();
  }, []);

  if (loading) {
    return <h3>Loading Pokemon...</h3>;
  }

  // handle submit - search pokemon
  const handleSubmit = (e) => {
    e.preventDefault(); // prevents page refresh;

    setLoading(true);

    const searchValue = pokemonSearch.toLowerCase().trim();

    if (searchValue === "") {
      setErrorMessage("Enter a Pokemon Name or ID");
      setLoading(false);
      setPokemon(null);
      return;
    }

    fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("data:", data);
        setPokemon(data);
        setPokemonSearch("");
        setLoading(false);
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("Not a Pokemon");
        setLoading(false);
        setPokemon(null);
        setPokemonSearch("");
      });
  };

  const handleStats = (e) => {};

  // Reset function
  const handleReset = (e) => {
    setLoading(true);
    setPokemonSearch("");
    setErrorMessage("");
    fetchDefaultPokemon();
  };

  return (
    <>
      <div className="app-container">
        <h1>Pokedex</h1>

        <form className="search-bar-container" onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              name="searchPokemon"
              placeholder="Search name or ID..."
              value={pokemonSearch}
              onChange={(e) => setPokemonSearch(e.target.value)}
            />
          </label>
          <button type="submit" className="submit-button">
            <FaSearch />
          </button>
        </form>

        {errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : (
          <>
            <div className="pokedex-screen">
              <h2 className="pokemon-name">{pokemon.name}</h2>

              <img
                className="pokemon-pic"
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
              />
              <p className="pokemon-id">No: {pokemon.id}</p>

              <div className="pokeType">
                {/* <p className="type-label">Type: </p> */}
                {pokemon.types.map((slot, index) => {
                  return (
                    <p className="type-element" key={index}>
                      {slot.type.name}
                    </p>
                  );
                })}
              </div>

              <button
                className="stats-button"
                type="button"
                name="stats-button"
                onClick={handleStats}
              >
                Pokemon Stats
              </button>
            </div>

            <div className="pokeStats">
              <p className="stats-label">Stats:</p>
              {pokemon.stats.map((base, index) => {
                return (
                  <p className="stat-element" key={index}>
                    {base.stat.name}: {base.base_stat}
                  </p>
                );
              })}
            </div>
          </>
        )}
        <button
          className="reset-button"
          name="reset"
          type="button"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </>
  );
}

export default App;
