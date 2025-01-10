import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatFormFieldModule,
  ],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  restaurants: string[] = ['Loading restaurants...'];
  selectedRestaurantId: string | null = null;
  statsDaily: any[] = [];
  statsTotal: any[] = [];
  statsReserv: any[] = [];
  loading: boolean = false;
  error: string = '';
  loadingRestaurants: boolean = true;
  chart: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.statsReserv.length > 0) {
        this.createChart();
      }
    }, 100);
  }

  loadRestaurants(): void {
    this.apiService.getRestaurants().subscribe({
      next: (data: string[]) => {
        this.restaurants = data.length ? data : ['No restaurants available'];
        this.loadingRestaurants = false;
      },
      error: (error) => {
        this.error = 'Error loading restaurants';
        console.error(error);
        this.restaurants = ['Error loading restaurants'];
        this.loadingRestaurants = false;
      }
    });
  }

  onSelectRestaurant(event: any): void {
    this.selectedRestaurantId = event.value;
    this.loadStatsDaily();
    this.loadStatsTotal();
    this.loadStatsReservation();
  }

  createChart(): void {
    const reservationData = this.statsReserv[0];
    const chartData = {
      labels: ['Confirmed', 'Canceled', 'Finished', 'No Show'],
      datasets: [{
        data: [reservationData.confirmed, reservationData.canceled, reservationData.finished, reservationData.noShow],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0']
      }]
    };
    this.chart = new Chart('myChart', {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                label += context.raw + ' reservations';
                return label;
              }
            }
          }
        }
      }
    });
  }

  loadStatsDaily(): void {
    if (!this.selectedRestaurantId) return;
    this.loading = true;
    this.apiService.getStatsDaily(this.selectedRestaurantId).subscribe({
      next: (data) => {
        this.statsDaily = data.length ? data : [{ day_of_week: 'Not available', total_people: 0, total_reservations: 0, average_stay_time: 0 }];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading statistics';
        console.error(error);
        this.statsDaily = [{ day_of_week: 'Error', total_people: 0, total_reservations: 0, average_stay_time: 0 }];
        this.loading = false;
      }
    });
  }

  loadStatsTotal(): void {
    if (!this.selectedRestaurantId) return;
    this.loading = true;
    this.apiService.getStatsTotal(this.selectedRestaurantId).subscribe({
      next: (data) => {
        this.statsTotal = data.length ? data : [{ average_stay_time: '0', total_online: 0, total_manual: 0 }];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading statistics';
        console.error(error);
        this.statsTotal = [{ average_stay_time: '0', total_online: 0, total_manual: 0 }];
        this.loading = false;
      }
    });
  }

  loadStatsReservation(): void {
    this.statsReserv = [
      { canceled: 0, confirmed: 5, finished: 3, noShow: 1 }
    ];
    if (!this.selectedRestaurantId) return;
    this.loading = true;
    this.apiService.getStatsReservation(this.selectedRestaurantId).subscribe({
      next: (data) => {
        this.statsReserv = data.length ? data : [{ canceled: '0', confirmed: 0, finished: 0, noShow: 0 }];
        this.loading = false;

        const reservationData = this.statsReserv[0];
        const chartData = {
          labels: ['Confirmed', 'Canceled', 'Finished', 'No Show'],
          datasets: [{
            data: [reservationData.confirmed, reservationData.canceled, reservationData.finished, reservationData.noShow],
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0']
          }]
        };

        this.chart = new Chart('myChart', {
          type: 'doughnut',
          data: chartData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    let label = context.label || '';
                    if (label) {
                      label += ': ';
                    }
                    label += context.raw + ' reservations';
                    return label;
                  }
                }
              }
            }
          }
        });
      },
      error: (error) => {
        this.error = 'Error loading statistics';
        console.error(error);
        this.statsReserv = [{ canceled: '0', confirmed: 0, finished: 0, noShow: 0 }];
        this.loading = false;
      }
    });
  }
}
