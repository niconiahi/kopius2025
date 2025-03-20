import { useState, useEffect } from "react";

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

export default function () {
  // Declaro los dos estados que traeran los pokemons y los tipos de la api
  const [pokemon, setPokemon] = useState([]);
  const [pokeTypes, setPokeTypes] = useState([]);
  const [text, setText] = useState("");
  const [chosenType, setChosenType] = useState();

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
      setPokemon(pokeArray);
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

  console.log("chosenType", chosenType);
  // console.log(pokemon);
  // console.log(pokeTypes);
  // console.log(text);
  return (
    <>
      <div>
        <ListFilter pokeTypes={pokeTypes} setChosenType={setChosenType} />
        <TextInput
          placeHolder="Pokemon Search Bar"
          setText={setText}
          text={text}
        />
      </div>
      <ul>
        {pokemon.map((pokeObj) => (
          <li key={pokeObj.id}>{pokeObj.name}</li>
        ))}
      </ul>
    </>
  );
}
