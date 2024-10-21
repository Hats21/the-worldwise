/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../../contexts/CitiesContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const { position } = city;
  const { lat, lng } = position;
  const date = formatDate(city.date);
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          city.id === currentCity.id ? styles.cityItemActive : ""
        }`}
        to={`${city.id}?lat=${lat}&lng=${lng}`}
      >
        <span className={styles.emoji}>{city.emoji}</span>
        <h3 className={styles.name}>{city.cityName}</h3>
        <time className={styles.date}>({date})</time>
        <button
          className={styles.deleteBtn}
          onClick={(e) => {
            e.preventDefault();

            deleteCity(city.id);
          }}
        >
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
