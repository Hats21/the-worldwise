/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        error: null,
        currentCity: action.payload,
      };
    case "cities/created":
      return {
        ...state,
        isLoading: false,
        error: null,
        cities: [...state.cities, action.payload],
      };
    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        error: null,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unkown action type");
  }
}
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  async function getCity(id) {
    console.log(id, currentCity.id);
    if (Number(id) === Number(currentCity.id)) return;
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`http://127.0.0.1:8000/cities/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
      // console.log(data);
      // setCurrentCity(data);
    } catch (err) {
      dispatch({ type: "rejected", action: err.message });
      console.log(err);
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`http://127.0.0.1:8000/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "content-type": "application/json",
        },
      });
      console.log(res);
      const data = await res.json();
      console.log(data);
      dispatch({ type: "cities/created", payload: data });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });

      await fetch(`http://127.0.0.1:8000/cities/${id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      });

      dispatch({ type: "cities/deleted", payload: id });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  async function getFormDetail(pos) {
    try {
      dispatch({ type: "loading" });

      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.lat}&longitude=${pos.lng}`
      );
      const data = await res.json();
      console.log(data);
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  useEffect(function () {
    async function getCountries() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch("http://localhost:8000/cities");
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        console.log(err);
        dispatch({ type: "rejected", payload: err.message });
      }
    }

    getCountries();
  }, []);
  return (
    <CitiesContext.Provider
      value={{
        getFormDetail,
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Context was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
