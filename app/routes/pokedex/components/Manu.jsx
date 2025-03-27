import { useState, useEffect } from "react";

export default function () {
  // Declaro los dos estados que traeran los pokemons y los tipos de la api
  const [pokemons, setpokemons] = useState([]);
  const [pokeTypes, setPokeTypes] = useState([]);
  const [text, setText] = useState("");
  const [chosenType, setChosenType] = useState();
  const [chosenPoke, setChosenPoke] = useState([]);

  // Fetcheo y asigno al estado los nombres, id y img al estado correspondiente
  useEffect(() => {
    async function runPokemons() {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=20",
      );
      const data = await response.json();
      const _pokemons = data.results;
      const pokeArray = [];
      await Promise.all(
        _pokemons.map(async (poke) => {
          const detailsNoJson = await fetch(poke.url);
          const detail = await detailsNoJson.json();
          const detailTypes = [];
          detail.types.forEach((type) => {
            detailTypes.push(type.type.name);
          });
          pokeArray.push({
            id: detail.id,
            name: detail.name,
            type: detailTypes,
            img: detail.sprites.front_shiny,
          });
        }),
      );
      setpokemons(pokeArray);
    }
    runPokemons();
  }, []);
  // Fetcheo y asigno al estado los types al estado correspondiente
  useEffect(() => {
    async function runTypes() {
      const typesNojason = await fetch("https://pokeapi.co/api/v2/type");
      const types = await typesNojason.json();
      const data = types.results;
      const typesArray = [];
      await Promise.all(
        data.map(async (response) => {
          typesArray.push(response.name);
        }),
      );
      setPokeTypes(typesArray);
    }
    runTypes();
  }, []);
  //UseEffect de la date y el cookie
  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    const expires = date.toUTCString();
    const stringChosens = JSON.stringify(chosenPoke);
    document.cookie = `pokedex=${stringChosens}; expires=${expires}; path=/pokedex`;
  }, [chosenPoke]);
  // console.log("", chosenType);
  // console.log(pokemons);
  // console.log(pokeTypes);
  // console.log(text);
  const filteredPoke = pokemons.filter((pokeObj) => {
    if (text) {
      return pokeObj.name.startsWith(text);
    }
    return true;
  });

  const filteredByType = filteredPoke.filter((pokeObj) => {
    if (!chosenType) {
      return true;
    }
    return pokeObj.type.includes(chosenType);
  });
  // console.log("filteredPoke", filteredPoke);
  // console.log("filteredBytype", filteredByType);
  console.log(chosenPoke);
  // RETURN DE COMPONENTE PRINCIPAL
  return (
    <div className="pokemon-app">
      <div className="filters">
        <ListFilter pokeTypes={pokeTypes} setChosenType={setChosenType} />
        <TextInput placeHolder="Search Pokémon" setText={setText} text={text} />
      </div>
      <div className="pokemon-list">
        <ul>
          {" "}
          {filteredByType.map((pokeObj) => {
            if (chosenPoke.includes(pokeObj.id)) {
              return;
            }
            return (
              <li key={pokeObj.id}>
                {" "}
                <Card
                  pokemon={pokeObj}
                  setChosenPoke={setChosenPoke}
                  chosenPoke={chosenPoke}
                />{" "}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="pokedex-list">
        <ul>
          {filteredByType.map((pokeObj) => {
            if (chosenPoke.includes(pokeObj.id)) {
              return (
                <li key={pokeObj.id}>
                  {" "}
                  <Card
                    pokemon={pokeObj}
                    setChosenPoke={setChosenPoke}
                    chosenPoke={chosenPoke}
                  />{" "}
                </li>
              );
            }
            return;
          })}
        </ul>
      </div>
    </div>
  );
}

const ListFilter = ({ pokeTypes, setChosenType }) => {
  const handleOnChange = (e) => {
    setChosenType(e.target.value);
  };

  return (
    <select onChange={handleOnChange}>
      {pokeTypes.map((type) => {
        return (
          <option key={`type-${type}`} value={type}>
            {type}
          </option>
        );
      })}
    </select>
  );
};
const Card = ({ pokemon, setChosenPoke, chosenPoke }) => {
  const handleOnClick = (e) => {
    if (chosenPoke.includes(pokemon.id)) {
      setChosenPoke(
        chosenPoke.filter((id) => {
          if (pokemon.id === id) {
            return false;
          }
          return true;
        }),
      );
      return;
    }
    setChosenPoke(() => {
      return [...chosenPoke, pokemon.id];
    });
  };
  return (
    <div key={pokemon.id} className="card">
      <img src={pokemon.img} alt={`sprite of ${pokemon.name}`} />
      <p>{pokemon.name}</p>
      <p>Type: {pokemon.type}</p>
      <button type="button" onClick={handleOnClick}>
        {chosenPoke.includes(pokemon.id) ? "-" : "+"}
      </button>
    </div>
  );
};

const TextInput = ({ placeHolder, text, setText }) => {
  const handleOnChange = (e) => {
    setText(e.target.value);
  };
  return (
    <input
      type="text"
      value={text}
      placeholder={placeHolder}
      onChange={handleOnChange}
    />
  );
};
