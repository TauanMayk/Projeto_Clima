import type { ClimaAtual } from "./InterfaceClima";

const chaveDeApi = import.meta.env.VITE_CHAVE_API_WEATHER;

export async function buscarDadosDeClima(
  cidade: string
): Promise<ClimaAtual | null> {
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${chaveDeApi}&q=${cidade}&aqi=no&lang=pt`;

  const resposta = await fetch(apiUrl);

  if (!resposta.ok) return null;

  const dados = await resposta.json();
  return dados;
}

export async function buscarClimaPorCoordenadas(lat: number, lon: number) {
  const chaveDeApi = import.meta.env.VITE_CHAVE_API_WEATHER;

  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${chaveDeApi}&q=${lat},${lon}&aqi=no&lang=pt`;

  const respostaCoordenadas = await fetch(apiUrl);
  if (!respostaCoordenadas.ok) return null;
  return await respostaCoordenadas.json();
}

const ChaveDeAPIUnplash = import.meta.env.VITE_CHAVE_API_UNSPLASH;

export async function buscarImagemDeFundo(
  condicao: string
): Promise<string | null> {
  
  const mapaCondicoes: Record<string, string> = {
    Sol: "sunny",
    Ensolarado: "sun",
    Chuva: "rain",
    Chuvoso: "rainy",
    Nublado: "cloudy",
    "Parcialmente nublado": "partly cloudy",
    Neve: "snow",
    Tempestade: "storm",
    Nevoeiro: "fog",
    default: "weather",
  };

  const termoBusca = mapaCondicoes[condicao] || mapaCondicoes["default"];

  const apiUrl = `https://api.unsplash.com/search/photos?query=${termoBusca}&orientation=landscape&client_id=${ChaveDeAPIUnplash}&orientation=landscape&per_page=1`;

  const resposta = await fetch(apiUrl);

  const dados = await resposta.json();

  if (dados.results && dados.results.length > 0) {
    return dados.results[0].urls.regular;
  }

  return null;
}
