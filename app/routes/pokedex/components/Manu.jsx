import { useState, useEffect } from "react";

export default function () {
  // Declaro los dos estados que traeran los pokemons y los tipos de la api
  const [pokemon, setPokemon] = useState([]);
  const [pokeTypes, setPokeTypes] = useState([]);

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
  });
  // venasour,butterfree,charizard.
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
  });

  return <h1>Manu</h1>;
}
