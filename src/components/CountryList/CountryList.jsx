/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import styles from "./CountryList.module.css";
import CountryItem from "../CountryItem/CountryItem";
import Spinner from "../Spinner/Spinner";
import Message from "../Message/Message";
import { useCities } from "../../contexts/CitiesContext";
function CountryList() {
  const { cities: countries, isLoading } = useCities();

  const countriesArr = countries.reduce((acc, cur) => {
    if (!acc.map((el) => el.country).includes(cur.country))
      return [...acc, { country: cur.country, emoji: cur.emoji, id: cur.id }];
    else return acc;
  }, []);
  if (isLoading) return <Spinner />;

  if (!countries.length)
    return (
      <Message message="Add your first Country by clicking a city on a map" />
    );

  return (
    <ul className={styles.countryList}>
      {countriesArr.map((el) => (
        <CountryItem country={el} key={el.id} />
      ))}
    </ul>
  );
}

export default CountryList;
