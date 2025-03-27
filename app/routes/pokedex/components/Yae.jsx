import { useState, useEffect } from "react";
import "../styles/trying.css";

export default function pokedex() {
  const [pokemon, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPokemonIds, setSelectedPokemonIds] = useState([]);

  useEffect(() => {
    const prevSelectedPokemonIds = getCookieValue("pokedex");
    setSelectedPokemonIds(prevSelectedPokemonIds);
  }, []);

  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const expires = date.toUTCString();
    document.cookie = `pokedex=${JSON.stringify(selectedPokemonIds)}; expires=${expires}; path=/;`;
  }, [selectedPokemonIds]);

  useEffect(() => {
    async function fetchPokemons() {
      return fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
        .then((response) => {
          return response.json();
        })
        .then(async (data) => {
          const pokemons = [];
          await Promise.all(
            data.results.map(async (pokemon) => {
              const response = await fetch(pokemon.url);
              const data = await response.json();
              const types = data.types.map((typesName) => typesName.type.name);
              pokemons.push({
                id: data.id,
                name: data.name,
                types: types,
                img: data.sprites.front_shiny,
              });
            }),
          );
          pokemons.sort();
          setPokemons(pokemons);
        });
    }
    fetchPokemons();
  }, []);

  useEffect(() => {
    async function fetchTypes() {
      const pokemonTypes = await fetch("https://pokeapi.co/api/v2/type").then(
        (response) => response.json(),
      );
      const typeNames = pokemonTypes.results.map((type) => type.name);
      setTypes(typeNames);
    }
    fetchTypes();
  }, []);

  const showingPokemons = pokemon
    .filter((pokemon) => {
      if (!search) {
        return true;
      }
      return pokemon.name.toLowerCase().startsWith(search.toLowerCase());
    })
    .filter((byTypes) => {
      if (!selectedType) {
        return true;
      }
      return byTypes.types.includes(selectedType);
    });

  const handleClick = (pokemon) => {
    const doesExist = selectedPokemonIds.find(
      (pokemonId) => pokemonId === pokemon.id,
    );
    if (doesExist) {
      setSelectedPokemonIds(
        selectedPokemonIds.filter((pokemonId) => pokemonId !== pokemon.id),
      );
    } else {
      setSelectedPokemonIds([...selectedPokemonIds, pokemon.id]);
    }
  };

  return (
    <>
      <h1>Pokedex Project</h1>
      <div>
        <div className="filterTypes">
          <label className="selector">
            Types
            <select
              value={selectedType}
              id="typeId"
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value={""}> ALL </option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="filterPokemons">
          <input
            type="text"
            placeholder="Search pokemon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="user-input"
            className="searchbar"
          />
          <ul>
            {showingPokemons.length > 0 ? (
              showingPokemons.map((pokemon) => {
                const isSelected = selectedPokemonIds.find((pokemonId) => {
                  return pokemonId === pokemon.id;
                });
                return (
                  <li key={`pokemon-${pokemon.id}`}>
                    {pokemon.name}
                    <img src={pokemon.img} alt={"Front of ${pokemon.name}"} />
                    <button
                      type="button"
                      onClick={() => handleClick(pokemon)}
                      className={isSelected ? "delete-button" : "add-button"}
                    >
                      {isSelected ? "DELETE" : "ADD"}
                    </button>
                  </li>
                );
              })
            ) : (
              <p>No Pokémon found</p>
            )}
          </ul>
        </div>
        <div className="output">
          <h2>Pokedex</h2>
          <ul>
            {pokemon
              .filter((pokemon) => {
                return selectedPokemonIds.includes(pokemon.id);
              })
              .map((pokemon) => {
                return (
                  <li key={`selected-pokemon-${pokemon.id}`}>
                    {pokemon.name}
                    <img src={pokemon.img} alt={pokemon.name} />
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
}

function getCookieValue(cookieName) {
  console.log("document.cookie", document.cookie);
  const cookies = document.cookie
    .split(";")
    .map((cookie) => {
      return cookie.trim();
    })
    .map((cookie) => {
      return cookie.split("=");
    });
  const cookie = cookies.find(([name]) => {
    return name === cookieName;
  });
  if (!cookie) {
    return null;
  }
  const serialized = cookie[1];
  if (serialized.startsWith("[")) {
    return JSON.parse(serialized);
  }
  throw new Error("not handled");
}
