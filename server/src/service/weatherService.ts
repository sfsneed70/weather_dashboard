import dotenv from "dotenv";
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  private cityName?: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || "";
    this.apiKey = process.env.API_KEY || "";
  }
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    return await response.json();
  }
  private destructureLocationData(locationData: Coordinates[]) {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon,
    };
  }
  private buildGeocodeQuery() {
    return `${this.baseURL}/geo/1.0/direct?apikey=${this.apiKey}&q=${this.cityName}`;
  }
  private buildWeatherQuery(coordinates: Coordinates) {
    return `${this.baseURL}/data/2.5/weather?apikey=${this.apiKey}&lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial`;
  }
  private buildForcastQuery(coordinates: Coordinates) {
    return `${this.baseURL}/data/2.5/forecast?apikey=${this.apiKey}&lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial`;
  }
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return await response.json();
  }
  private async fetchForcastData(coordinates: Coordinates) {
    const response = await fetch(this.buildForcastQuery(coordinates));
    return await response.json();
  }
  private parseCurrentWeather(response: any) {
    return new Weather(
      this.cityName || "",
      new Date().toLocaleDateString(
      //   "en-US", {
      //   year: "numeric",
      //   month: "2-digit",
      //   day: "2-digit",
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   second: "2-digit",
      // }
    ),
      response.weather[0].icon,
      response.weather[0].description,
      response.main.temp,
      response.wind.speed,
      response.main.humidity
    );
  }
  private buildForecastArray(currentWeather: Weather, forcastData: any[]) {
    let weatherData: Weather[] = [];
    weatherData.push(currentWeather);
    for (let i = 0; i < forcastData.length; i++) {
      if ((i + 1) % 8 === 0) {
        const data = forcastData[i];
        const date = new Date(data.dt_txt + " UTC").toLocaleDateString(
          // "en-US",
          // {
          //   year: "numeric",
          //   month: "2-digit",
          //   day: "2-digit",
          //   hour: "2-digit",
          //   minute: "2-digit",
          //   second: "2-digit",
          // }
        );
        weatherData.push(
          new Weather(
            currentWeather.city,
            date,
            data.weather[0].icon,
            data.weather[0].description,
            data.main.temp,
            data.wind.speed,
            data.main.humidity
          )
        );
      }
    }
    return weatherData;
  }

  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const forcastData = await this.fetchForcastData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return this.buildForecastArray(currentWeather, forcastData.list);
  }
  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
