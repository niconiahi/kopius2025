import { useState, useEffect } from "react";

export default function () {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [query, setQuery] = useState("");
  const [chosenType, setChosenType] = useState();
  const [chosenPokeIds, setChosenPokeIds] = useState([]);

  useEffect(() => {
    async function run() {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=20",
      );
      const data = await response.json();
      const nextPokemons = [];
      await Promise.all(
        data.results.map(async (poke) => {
          const response = await fetch(poke.url);
          const data = await response.json();
          const types = [];
          for (const type of data.types) {
            types.push(type.type.name);
          }
          nextPokemons.push({
            id: data.id,
            name: data.name,
            types,
            img: data.sprites.front_shiny,
          });
        }),
      );
      setPokemons(nextPokemons);
    }
    run();
  }, []);

  useEffect(() => {
    async function run() {
      const response = await fetch("https://pokeapi.co/api/v2/type");
      const data = await response.json();
      const nextTypes = [];
      data.results.map(async (type) => {
        nextTypes.push(type.name);
      });
      setTypes(nextTypes);
    }
    run();
  }, []);

  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    const expires = date.toUTCString();
    const serialized = JSON.stringify(chosenPokeIds);
    document.cookie = `pokedex=${serialized}; expires=${expires}; path=/pokedex`;
  }, [chosenPokeIds]);

  const showingPokemons = pokemons
    .filter((pokemon) => {
      if (query) {
        return pokemon.name.startsWith(query);
      }
      return true;
    })
    .filter((pokemon) => {
      if (!chosenType) {
        return true;
      }
      return pokemon.type.includes(chosenType);
    });

  return (
    <div className="pokemon-app">
      <div className="filters">
        <ListFilter types={types} setChosenType={setChosenType} />
        <TextInput
          placeHolder="Search Pokémon"
          setText={setQuery}
          text={query}
        />
      </div>
      <div className="pokemon-list">
        <ul>
          {showingPokemons.map((pokemon) => {
            if (chosenPokeIds.includes(pokemon.id)) {
              return null;
            }
            return (
              <li key={pokemon.id}>
                <Card
                  pokemon={pokemon}
                  setChosenPoke={setChosenPokeIds}
                  chosenPoke={chosenPokeIds}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="pokedex-list">
        <ul>
          {showingPokemons.map((pokemon) => {
            if (chosenPokeIds.includes(pokemon.id)) {
              return (
                <li key={pokemon.id}>
                  <Card
                    pokemon={pokemon}
                    setChosenPoke={setChosenPokeIds}
                    chosenPoke={chosenPokeIds}
                  />
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    </div>
  );
}

const ListFilter = ({ types, setChosenType }) => {
  return (
    <select
      onChange={(event) => {
        setChosenType(event.target.value);
      }}
    >
      {types.map((type) => {
        return (
          <option key={`type-${type}`} value={type}>
            {type}
          </option>
        );
      })}
    </select>
  );
};

const Card = ({ pokemon, setChosenPokeIds, chosenPokeIds }) => {
  const handleOnClick = () => {
    if (chosenPokeIds.includes(pokemon.id)) {
      setChosenPokeIds((prevChosenPokeIds) => {
        return prevChosenPokeIds.filter((id) => {
          if (pokemon.id === id) {
            return false;
          }
          return true;
        });
      });
    } else {
      setChosenPokeIds((prevChosenPokeIds) => {
        return [...prevChosenPokeIds, pokemon.id];
      });
    }
  };
  return (
    <div key={pokemon.id} className="card">
      <img src={pokemon.img} alt={`sprite of ${pokemon.name}`} />
      <p>{pokemon.name}</p>
      <p>Type: {pokemon.types}</p>
      <button type="button" onClick={handleOnClick}>
        {chosenPokeIds.includes(pokemon.id) ? "-" : "+"}
      </button>
    </div>
  );
};

const TextInput = ({ placeHolder, text, setText }) => {
  return (
    <input
      type="text"
      value={text}
      placeholder={placeHolder}
      onChange={(event) => {
        setText(event.target.value);
      }}
    />
  );
};
