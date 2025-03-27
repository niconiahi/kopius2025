import { useState, useEffect } from "react";
import "../styles/trying.css";

export default function pokedex() {
  const [pokemons, setPokemons] = useState([]); //array of pokemons
  const [types, setTypes] = useState([]); //array of types of pokemon
  const [search, setSearch] = useState(""); //to dynamic filter while writting
  const [selectedType, setSelectedType] = useState(""); // to catch the type selected in the dropdown list

  const [output, setOutput] = useState([]);

  //-------------------- COOKIES---------------------------
  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const expires = date.toUTCString();
    document.cookie = `pokedex=${JSON.stringify(output)}; expires=${expires}; path=/pokede;`;
    console.log("Pokédex:", document.cookie);
  }, [output]);

  //--------------- FETCHING DATA -----------------------
  useEffect(() => {
    async function fetchPokemons() {
      const data = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
        .then((response) => {
          return response.json();
        })
        .then(async (data) => {
          // console.log("data", data);
          const pokemons = [];
          await Promise.all(
            data.results.map(async (pokemon) => {
              // console.log("pokemon", pokemon);
              const pokeData = await fetch(pokemon.url);
              const pokeDetails = await pokeData.json();
              // console.log("pokedetails", pokeDetails);

              // llamar endpoint de dtealle de pokemon
              //construir el objeto
              // sacar solamente la info que necesito (name, type,url)
              //types es un array de tipos
              const types = pokeDetails.types.map(
                (typesName) => typesName.type.name,
              );
              pokemons.push({
                id: pokeDetails.id,
                name: pokeDetails.name,
                types: types, //variable para traer todos los tipos del pokemon
                img: pokeDetails.sprites.front_shiny,
              });
              pokemons.sort();
            }),
          );
          // console.log("pokemons", pokemons);
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

  // ----------------- FILTER LOGIC ------------------
  const filteredPokemons = pokemons
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

  // -----------------------LOGIC OF OUTPUT----------------
  const handleClick = (pokemons) => {
    const exists = output.find((character) => character === pokemons.id);

    if (exists) {
      setOutput(output.filter((character) => character !== pokemons.id));
      // console.log(`REMOVED: ${pokemons.name}`);
    } else {
      setOutput([...output, pokemons.id]);
      // console.log(`ADDED: ${pokemons.name}`);
    }
  };
  // -----------------------OUTPUT----------------
  const pokemonList = (filteredPokemons, output, handleClick) => {
    return filteredPokemons.map((pokemons) => {
      const isSelected = output.find((character) => {
        // console.log("CHARACTER", character);
        // console.log("POKEMONS", pokemons);
        return character === pokemons.id;
      });
      return (
        <li key={`pokemon-${pokemons.id}`}>
          {pokemons.name}
          <img src={pokemons.img} alt={"Front of ${pokemon.name}"} />
          <button
            type="button"
            onClick={() => handleClick(pokemons)}
            className={isSelected ? "delete-button" : "add-button"}
          >
            {isSelected ? "DELETE" : "ADD"}
          </button>
        </li>
      );
    });
  };

  //--------------------CONTROL CENTER------------

  // console.log("Tipos de Pokémon cargados:", types);
  // console.log("Pokémon cargados:", pokemons);
  // console.log("SEARCH:", search);
  // console.log("FILTRO TYPES", selectedType);
  // console.log("IMAGEN", pokemons.img);
  // console.log("OUTPUT", output);
  //--------------------CONTROLING THE LOGS--------------

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
            {filteredPokemons.length > 0 ? (
              pokemonList(filteredPokemons, output, handleClick)
            ) : (
              <p>No Pokémon found</p>
            )}
          </ul>
        </div>
        <div className="output">
          <h2>Pokedex</h2>
          <ul>
            {pokemons
              .filter((pokemon) => {
                return output.includes(pokemon.id);
              })
              .map((pokemon) => {
                // console.log("POKEMON", pokemon);
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
