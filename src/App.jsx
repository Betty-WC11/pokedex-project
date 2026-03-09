import { useState, useEffect } from "react";
import "./App.css";
import { FaSearch } from "react-icons/fa";
import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { HiSpeakerWave } from "react-icons/hi2";

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pokemonSearch, setPokemonSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pokemonStats, setPokemonStats] = useState(false);
  const [pokemonDescription, setPokemonDescription] = useState("");

  // reusable function for search pokemon render
  const fetchAllPokemonData = async (searchValue) => {
    // Only show loading page if request takes >300ms
    // const loadingTimer = setTimeout(() => {
    //   setLoading(true);
    // }, 300);

    try {
      // fetch pokemon data - code pauses here until it completes fetch
      const pokemonResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchValue}`,
      );

      // check if response is okay first before parsing as json
      if (!pokemonResponse.ok) {
        throw new Error(`Pokemon not found: ${searchValue}`);
      }

      const pokemonData = await pokemonResponse.json();
      // console.log(pokemonData);
      setPokemon(pokemonData); // fetched pokemon data first

      // now fetch the species data using same ID
      const speciesResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`,
      );

      if (!speciesResponse.ok) {
        throw new Error(`Species data not found for ID: ${pokemonData.id}`);
      }

      const speciesData = await speciesResponse.json();
      const englishEntry = speciesData.flavor_text_entries.find((entry) => {
        return entry.language.name === "en";
      });

      setPokemonDescription(
        englishEntry?.flavor_text?.replace(/\f/g, " ") ||
          "No description available",
      );

      setPokemonSearch("");
      // clearTimeout(loadingTimer);
      setLoading(false);
      setErrorMessage("");
      // setPokemonStats(false);
    } catch (error) {
      console.error("Error:", error.message);
      setErrorMessage("Not a Pokemon");
      // clearTimeout(loadingTimer);
      setLoading(false);
      setPokemon(null);
      setPokemonSearch("");
      setPokemonDescription("No description available");
    }
  };

  // first render when app loads
  // loads only once , []
  useEffect(() => {
    fetchAllPokemonData(1);
  }, []);

  if (loading) {
    return <h3>Loading Pokemon...</h3>;
  }

  // const fetchPokemonData = (searchValue) => {
  //   fetchAllPokemonData(searchValue);
  // };

  // handle submit - search pokemon
  const handleSubmit = (e) => {
    e.preventDefault(); // prevents page refresh;

    // setLoading(true);

    const searchValue = pokemonSearch.toLowerCase().trim();

    if (searchValue === "") {
      setErrorMessage("Enter a Pokemon Name or ID");
      setLoading(false);
      setPokemon(null);
      setPokemonDescription("No description available");
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
    fetchAllPokemonData(1);
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

  // console.log("pokename", pokemon);

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
        {/* {errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : (
          <> */}
        {/* {pokemon ? (
          <> */}
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
            {errorMessage ? (
              <p className="error-message">{errorMessage}</p>
            ) : (
              <>
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
                {/* conditional rendering - stats */}

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
                <button className="play-sound-button" onClick={handleCry}>
                  <HiSpeakerWave />
                </button>
              </>
            )}
          </div>
          <button
            className="nav-button right"
            type="button"
            name="right-nav-toggle"
            onClick={handleNext}
            disabled={loading}
          >
            <MdArrowForwardIos />
          </button>
        </div>
        {/* </>
        ) : (
          <p>Loading Pokemon...</p>
        )} */}
        {/* loading pokemon message */}

        {/* </>
        )} */}
        <button
          className="reset-button"
          name="reset"
          type="button"
          onClick={handleReset}
        >
          Reset
        </button>

        <p className="pokemon-description">{pokemonDescription}</p>
      </div>
    </>
  );
}

export default App;
