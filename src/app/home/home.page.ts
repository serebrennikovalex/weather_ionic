import { Component, AfterViewInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { WeatherService, responseWeatherByCoordinate } from '../services/weather.service';
import { ModalPage} from '../modal/modal.page';

const tempCelsiusInKelvin = 273.15;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  weather: {
      city: string
      temp: number
      wind: number
      pressure: number
      humidity: number
      rain: number
      description: string
  } = {
      city: '',
      temp: 0,
      wind: 0,
      pressure: 0,
      humidity: 0,
      rain: 0,
      description: ''
  };

  cities: any = [];

  tempType: 'celsius' | 'fahrenheit' = 'celsius';

  constructor(
      private geolocation: Geolocation,
      private weatherService: WeatherService,
      private modalCtrl: ModalController,
      private navCtrl: NavController
  ) {}

  async openModal() {
    const modal = await this.modalCtrl.create({
        component: ModalPage,
        componentProps: {
            cities: this.cities.map(obj => obj.name)
        }
    });
    modal.onWillDismiss().then(d => this.handleModalDismiss(d));

    return await modal.present();
  }

  ngAfterViewInit() {
    this.getCurrentGeoLocation();

    this.getAllCities().subscribe(data => {
        this.cities = data;
    });
  }

  getCurrentGeoLocation() {
      this.geolocation.getCurrentPosition({timeout: 5000, enableHighAccuracy: true, maximumAge: 0}).then(res => {
          const { coords } = res;

          this.weatherService
              .getWeatherByCoordinates(coords.latitude, coords.longitude)
              .subscribe((data: responseWeatherByCoordinate) => {
                  this.updateWeather(data);
              }, error => {
                  this.navCtrl.navigateForward('/error', {queryParams: {error: JSON.stringify(error)}}).then();
              });
      }).catch(error => {
          this.navCtrl.navigateForward('/error', {queryParams: {error: JSON.stringify(error)}}).then();
      });
  }

  getAllCities() {
      return this.weatherService.getAllCities();
  }

  tempTypeChanged(event: CustomEvent) {
      const currentTemp = this.weather.temp;

      this.weather = {
          ...this.weather,
          temp: event.detail.value === 'celsius' ? currentTemp - 32 : currentTemp + 32
      };
  }

  getWeatherByCity(city) {
      this.weatherService
          .getWeatherByCityName(city)
          .subscribe((data: responseWeatherByCoordinate) => this.updateWeather(data));
  }

  updateWeather(data: responseWeatherByCoordinate) {
      this.weather = {
          city: data.name,
          temp: Math.floor(data.main.temp - tempCelsiusInKelvin),
          wind: data.wind.speed,
          pressure: data.main.pressure,
          humidity: data.main.humidity,
          rain: data.rain && data.rain['1h'] || 0,
          description: data.weather.description
      };
  }

  handleModalDismiss(d) {
      this.getWeatherByCity(d.data);
  }
}
