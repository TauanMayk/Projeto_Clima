export interface ClimaAtual {
  location: {
    name: string;
    region: string;
    tocaltime: string;
    country: string;
  };
  current: {
    temp_c: number;
    last_updated: string;
    humidity: number;
    wind_kph: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}