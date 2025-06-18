export interface ClimaAtual {
  location: {
    name: string;
    region: string;
    tocaltime: string;
    country: string;
  };
  current: {
    temp_c: number;
    last_update: string;
    humidity: number;
    wind_kph: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}