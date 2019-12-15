import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface responseWeatherByCoordinate {
    'coord': {
        'lon': number
        'lat': number
    };
    'weather': {
        'id': number
        'main': string
        'description': string
        'icon': string
    };
    'base': string;
    'main': {
        'temp': number
        'pressure': number
        'humidity': number
        'temp_min': number
        'temp_max': number
    };
    'wind': {
        'speed': number
        'deg': number
    };
    'rain'?: {
        '1h': number
        '3h': number
    };
    'clouds': {
        'all': number
    };
    'dt': number;
    'sys': {
        'type': number
        'id': number
        'message': number
        'country': string
        'sunrise': number
        'sunset': number
    };
    'timezone': number;
    'id': number;
    'name': string;
    'cod': number;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  apiKey = '325a535b8582db558a1f2489e29489ee';
  baseUrl = `http://api.openweathermap.org/data/2.5/weather?APPID=${this.apiKey}`;

  getWeatherByCityName(city: string) {
    return this.http.get(`${this.baseUrl}&q=${city}`);
  }

  getWeatherByCoordinates(lat: number, lon: number) {
    return this.http.get(`${this.baseUrl}&lat=${lat}&lon=${lon}`);
  }

  getAllCities() {
      return this.http.get('/assets/russian-cities.json');
  }
}
