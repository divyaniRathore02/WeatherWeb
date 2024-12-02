import axios from "axios";
import React, { useEffect, useState } from "react";

const Weather = () => {
  const [weather, setWeather] = useState([]);
  const [searchedCity, setSearchedCity] = useState("");
  const [debouncing, setDebouncing] = useState(null);
  let TopFiveCities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"];

  //api calling 
  const fetchData = async (city) => {
    const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
    try {
      const response = await axios.get(
        `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  const fetchFiveData = async () => {
    // Used Promise.all to wait for all city data to be fetched
    const allCitiesWeather = await Promise.all(
      TopFiveCities.map((city) => fetchData(city)) 
    );

     // Set the state with the weather data
    setWeather(allCitiesWeather);
   
  };

  useEffect(() => {
    fetchFiveData();
  }, []);

  //delete button functionality
  const handleDelete = (city) => {
    const newData = weather.filter((e) => e.city !== city);
    setWeather(newData);
  };

  //search button functionality
  const fetchNewData = async (city) => {
    const newSearchedCity = await fetchData(city);
    if (newSearchedCity && newSearchedCity.city) {
      if (newSearchedCity.city.toLowerCase() === city.toLowerCase()) {
        setWeather((prevWeather) => [newSearchedCity, ...prevWeather]); 
      }
    }
  };

  const handleChange = (e) => {
    let city = e.target.value;
    setSearchedCity(city);

    if (debouncing) {
      clearTimeout(debouncing);
    }

    const timer = setTimeout(() => {
      if (city) {
        fetchNewData(city);
      }
    }, 300);

    setDebouncing(timer); //debouncing for delaying the api calls
  };
  return (
    <>
      <div className="container-bg p-10">
        <div className="max-w-[1200px] flex flex-col align-center justify-center mx-auto">
          <input
            onChange={handleChange}
            className="w-[70%] border-[2px] border-white rounded-[60px] py-2 mx-auto"
            placeholder="search the city"
          ></input>
          {weather.map((e, index) => (
            <div key={index}>
              <div className="flex justify-between mb-5 mt-10 border-top border-white">
                <h2 className="text-xl sm:text-2xl text-white font-bold">{`City : ${e.city}`}</h2>
                <button
                  onClick={() => handleDelete(e.city)}
                  className="bg-white text-[#00FFFF] px-3 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>

              <div className="flex justify-center xl:justify-between align-center gap-5 flex-wrap">
              {e.daily.slice(0, 3).map((e, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-5 text-white text-sm sm:text-xl font-medium mt-5 text-center border-white border-[2px] rounded-xl p-3"
                >
                  <h4>{`Day : ${index + 1}`}</h4>
                  <div className="flex gap-5 align-center justify-center">
                    <h4>{e.condition.description}</h4>
                    <img
                      src={e.condition.icon_url}
                      alt="icon"
                      className="w-[20px] h-[20px] sm:w-[30px] sm:h-[30px] pt-[2px]"
                    />
                  </div>

                  <h4>{`temprature of the day : ${e.temperature.day}`}</h4>
                  <h4>{`Minimum temprature : ${e.temperature.minimum}`}</h4>
                  <h4>{`maximum temprature : ${e.temperature.maximum}`}</h4>
                </div>
              ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Weather;
