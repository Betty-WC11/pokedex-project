import { useState, useEffect } from "react";
import "./App.css";
import { FaSearch } from "react-icons/fa";
import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pokemonSearch, setPokemonSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pokemonStats, setPokemonStats] = useState(false);
  const [pokemonDescription, setPokemonDescription] = useState("");

  // reusable function for default pokemon render
  // const fetchDefaultPokemon = () => {
  //   fetch("https://pokeapi.co/api/v2/pokemon/1")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       // console.log("default Pokemon:", data);
  //       setPokemon(data);
  //       setLoading(false);
  //       setPokemonStats(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error loading default Pokemon:", error);
  //       setLoading(false);
  //       setErrorMessage("Failed to load default Pokemon");
  //     });
  // };

  // reusable function for search pokemon render
  const fetchAllPokemonData = (searchValue) => {
    // setLoading(true);

    return fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`)
      .then((res) => res.json())
      .then((pokemonData) => {
        // console.log("data:", data);
        setPokemon(pokemonData); // fetched pokemon data first

        // now fetch the species data using same ID
        return fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`,
        ).then((res) => res.json());
      })
      .then((speciesData) => {
        // console.log(speciesData);
        const englishEntry = speciesData.flavor_text_entries.find((entry) => {
          return entry.language.name === "en";
        });

        setPokemonDescription(
          englishEntry?.flavor_text || "No description available",
        );

        setPokemonSearch("");
        setLoading(false);
        setErrorMessage("");
        // setPokemonStats(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("Not a Pokemon");
        setLoading(false);
        setPokemon(null);
        setPokemonSearch("");
      });
  };

  const fetchDefaultPokemon = () => {
    fetchAllPokemonData(1);
  };

  // const fetchPokemonData = (searchValue) => {
  //   fetchAllPokemonData(searchValue);
  // };

  // defualt pokemon rendered
  useEffect(() => {
    // fetchDefaultPokemon();
    fetchAllPokemonData(1);
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

    fetchAllPokemonData(searchValue);
  };

  const handlePrevious = (e) => {
    const newID = Math.max(1, pokemon.id - 1); // doesn't go below 1 (always return the bigger number)
    fetchAllPokemonData(newID);
  };

  const handleNext = (e) => {
    const newID = pokemon.id + 1;
    fetchAllPokemonData(newID);
  };

  const handleStats = (e) => {
    setPokemonStats(!pokemonStats);
  };

  // Reset function
  const handleReset = (e) => {
    setLoading(true);
    setPokemonSearch("");
    setErrorMessage("");
    fetchDefaultPokemon();
  };

  // cry button
  const handleCry = (e) => {
    if (pokemon?.cries?.latest) {
      // new Audio creates a new Audio object in JS
      const audio = new Audio(pokemon.cries.latest);
      audio.volume = 0.5;
      audio.play().catch((error) => {
        console.log("Cannot play audio", error);
      });
    }
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

        {/* conditional rendering #1 - error message*/}
        {errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : (
          <>
            {/* diplay area with arrows*/}
            <div className="pokemon-display-area">
              <button
                className="nav-button left"
                type="button"
                name="left-nav-toggle"
                onClick={handlePrevious}
              >
                <MdArrowBackIos />
              </button>

              {/* screen only */}
              <div className="pokedex-screen">
                <h2 className="pokemon-name">{pokemon.name}</h2>

                {/* conditional rendering #2 - stats details */}
                {pokemonStats ? (
                  <div className="pokeStats">
                    {/* <p className="stats-label">Stats:</p> */}
                    {pokemon.stats.map((base, index) => {
                      return (
                        <p className="stat-element" key={index}>
                          {base.stat.name.replace(/[^a-zA-Z]/g, " ")}:{" "}
                          {base.base_stat}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <img
                    className="pokemon-pic"
                    src={
                      pokemon.sprites.other["official-artwork"].front_default
                    }
                    alt={pokemon.name}
                  />
                )}

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
                  {pokemonStats ? "Back" : "Stats"}
                </button>
              </div>
              <button
                className="nav-button right"
                type="button"
                name="right-nav-toggle"
                onClick={handleNext}
              >
                <MdArrowForwardIos />
              </button>
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

        <button className="play-sound" onClick={handleCry}>
          play sound
        </button>

        <p>{pokemonDescription}</p>
      </div>
    </>
  );
}

export default App;
