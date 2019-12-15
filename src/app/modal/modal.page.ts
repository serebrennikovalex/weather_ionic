import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss', '../home/home.page.scss'],
})
export class ModalPage implements OnInit {

  @Input() cities: string[];
  filteredCities: string[] = [];
  citySelected = '';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  async closeModal(data) {
    await this.modalCtrl.dismiss(data, 'cancel');
  }

  changeCity(event: CustomEvent) {
    const { value } = event.detail;

    if (!value) {
      this.filteredCities = [];
    } else {
      this.filteredCities = this.cities.filter(city => city.toLowerCase().includes(value.toLowerCase()));
    }
  }

  selectCity(city: string) {
    this.citySelected = city;
    this.closeModal(city).then(() => {
      console.log('close modal');
    });
  }
}
