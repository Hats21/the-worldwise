/* eslint-disable react-refresh/only-export-components */
// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { useCities } from "../../contexts/CitiesContext";
import { useUrlPosition } from "../../hooks/useUrlPosition";

import Spinner from "../../components/Spinner/Spinner";
import Message from "../../components/Message/Message";

function setTimeOut(s) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      reject(
        new Error(`Request took too long (${s}) seconds.\n Please try again!`)
      );
    }, s * 1000);
  });
}

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [error, setError] = useState(null);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const formatedDate = date.toDateString();

  const { lat, lng } = useUrlPosition();

  const { createCity, isLoading } = useCities();

  async function handleAddCity() {
    const newCity = {
      cityName: cityName,
      country: country,
      emoji,
      date: formatedDate,
      notes,
      position: {
        lat,
        lng,
      },
    };

    await createCity(newCity);
  }

  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  useEffect(
    function () {
      (async function () {
        if (!lat && !lng) return;
        try {
          setIsGeoLoading(true);
          setError(null);
          console.log("Waiting...");
          const res = await Promise.race([
            fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`),
            setTimeOut(40),
          ]);
          console.log(res);
          const data = await res.json();
          console.log("Done.");

          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city. Please click another one! 😃"
            );
          console.log(data);
          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          console.log(err);
          setError(err.message);
        } finally {
          setIsGeoLoading(false);
        }
      })();
    },
    [lat, lng]
  );

  if (!lat && !lng)
    return <Message message="Start by clicking somewere  on the map." />;

  if (isGeoLoading) return <Spinner />;

  if (error) return <Message message={error} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={async (e) => {
        e.preventDefault();
        await handleAddCity();
        {
          !isLoading ? navigate("/app") : "";
        }
      }}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={formatedDate}
        /> */}
        <DatePicker selected={date} onChange={(date) => setDate(date)} />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
