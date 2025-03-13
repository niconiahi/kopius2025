import { useEffect, useState } from "react";
import * as v from "valibot";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

// type Pokemon = {
//   base_experience: number;
// };
const PokemonSchema = v.object({
  base_experience: v.number(),
});

export default function Home() {
  const [name, setName] = useState<string>("Jose");
  const [surname, setSurname] = useState<string>("Alvarez");
  const [fullName, setFullName] = useState<string>("Jose Alvarez");

  useEffect(() => {
    async function run() {
      const data = await fetch("https://pokeapi.co/api/v2/pokemon/ditto")
        .then((response) => {
          return response.json();
        })
        .catch((error) => {
          console.error("there was an error while fetching ditto", error);
        });
      const pokemon = v.parse(PokemonSchema, data);
      console.log("pokemon", pokemon);
      // handle fetch error
      // const response = await fetch(
      //   "https://pokeapi.co/api/v2/pokemon/ditto",
      // ).catch((error) => {
      //   throw new Error("there was an error while fetching ditto", error);
      // });
      //
      // // handle deserialization error
      // const data = await response.json().catch((error) => {
      //   console.error(
      //     "there was an error while deserializing ditto information",
      //     error,
      //   );
      // });
      //
      // // handle valibot error
      // const pokemonParser = v.safeParser(PokemonSchema);
      // const result = pokemonParser(data);
      // if (!result.success) {
      //   result.issues;
      //   console.error("there was an error while parsing the pokemon");
      //   throw new Error("there was an error while parsing the pokemon");
      // }
      // const pokemon = result.output;
      // const data = response;
      // try {
      //   const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
      //   const data = await response.json();
      //   const pokemon = v.parse(PokemonSchema, data);
      //   console.log("pokemon", pokemon);
      //   // const data: Pokemon = await response.json();
      //   // console.log("data", data);
      //   // data.base_experience;
      // } catch (error) {
      //   console.log("error", error);
      // }
    }
    run();
  }, []);

  useEffect(() => {
    setFullName(`${name} ${surname}`);
  }, [name, surname]);

  return (
    <form>
      <button
        type="button"
        onClick={() => {
          setName("Faustino");
        }}
      >
        change name
      </button>
      <button
        type="button"
        onClick={() => {
          setSurname("Rodriguez");
        }}
      >
        change surname
      </button>
      <h1>{name}</h1>
      <h1>{surname}</h1>
      <h1>{fullName}</h1>
    </form>
  );
}
