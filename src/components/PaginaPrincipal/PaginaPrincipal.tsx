import { InputBusca } from "../InputBusca/InputBusca";
import type { ClimaAtual } from "../FuncaoDados/InterfaceClima";
import {
  buscarDadosDeClima,
  buscarImagemDeFundo,
  buscarClimaPorCoordenadas,
} from "../FuncaoDados/FuncaoDados";
import BotaoBusca from "../BotaoBusca/BotaoBusca";
import BotaoLocalizacao from "../BotaoLocalizacao/BotaoLocalizacao";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WiHumidity, WiStrongWind, WiTime1 } from "react-icons/wi";
import "./paginaprincipal.css";

export const PaginaPrincipal = () => {
  const [cidadeInput, setCidadeInput] = useState("São Paulo");
  const [cidadeFinal, setCidadeFinal] = useState("São Paulo");
  const [dadosClima, setDadosClima] = useState<ClimaAtual | null>(null);
  const [imagemDeCondicao, setImagemDeCondicao] = useState<string | null>(null);
  const [localizacaoAtual, setLocalizacaoAtual] = useState(false);

  useEffect(() => {
    const buscar = async () => {
      if (!cidadeFinal) return;
      const dados = await buscarDadosDeClima(cidadeFinal);

      if (!dados) {
        alert("Cidade não encontrada.");
        return;
      }

      setDadosClima(dados);

      const condicao = dados.current.condition.text;
      const imagem = await buscarImagemDeFundo(condicao);
      setImagemDeCondicao(imagem);
    };

    buscar();
  }, [cidadeFinal]);

  useEffect(() => {
      navigator.geolocation.getCurrentPosition(async (posicao) => {
        const { latitude, longitude } = posicao.coords;
        const dados = await buscarClimaPorCoordenadas(latitude, longitude);
        try {
          if (dados) {
            setDadosClima(dados);
            setLocalizacaoAtual(true);
          }
        } catch (error) {
          console.warn("Erro ao obter a localização do usuario:" + error);
          setLocalizacaoAtual(false);
        }
      });
  }, []);

  const handleBuscarLocalizacao = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não permitida pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (posicao) => {
        const { latitude, longitude } = posicao.coords;
        const dados = await buscarClimaPorCoordenadas(latitude, longitude);
        if (dados) {
          setDadosClima(dados);
          setLocalizacaoAtual(true);
        } else {
          alert("Erro ao buscar o clima e a sua localizacao.");
        }
      },
      () => {
        alert("Erro ao obter a localização do usuario.");
      }
    );
  };

  const handleBuscarClima = async () => {
    setCidadeFinal(cidadeInput);
  };

  return (
    <>
      <main
        className="container bg-cover bg-center w-full max-w-[370px] text-center border-14px backdrop-blur-md rounded-lg justify-center items-center"
        style={{
          backgroundImage: imagemDeCondicao
            ? `url(${imagemDeCondicao})`
            : undefined,
        }}
      >
        <div className="p-6 flex flex-col items-center justify-center gap-2">
          <BotaoLocalizacao onClick={handleBuscarLocalizacao} />
          <div className="p-2 flex items-center justify-between gap-4">
            <InputBusca value={cidadeInput} onChange={setCidadeInput} />
            <BotaoBusca onClick={handleBuscarClima} />
          </div>
          {!localizacaoAtual && (
            <p className="text-red-500 mt-2">
              Localização não encontrada. Digite uma cidade manualmente.
            </p>
          )}
          {dadosClima && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="informacao-principal flex flex-col m-[20px] text-center items-center"
              >
                <h2 className="text-white text-3xl font-semibold" id="cidade">
                  {dadosClima.location.country.split("-")[0]}
                </h2>
                <h3 className="text-white text-2xl font-semibold" id="cidade">
                  {dadosClima.location.region.split("-")[0]}
                </h3>
                <p
                  id="temperatura"
                  className="temperatura text-6xl font-semibold mx-6 my-0 text-black"
                >
                  {dadosClima.current.temp_c} °C
                </p>
                <motion.img
                  srcSet={dadosClima.current.condition.icon}
                  alt="icone condição do clima"
                  id="icone-condicao"
                  className="self-center transition-all duration-300 hover:shadow-2xl"
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 1.0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <p className="condicao text-[20px] text-white" id="condicao">
                  {dadosClima.current.condition.text}
                </p>
              </motion.div>
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-[#FFFFFF] backdrop-blur-md w-full text-black px-10 py-6 rounded-2xl shadow-lg"
              >
                <div className="flex flex-row justify-center items-center">
                  <WiHumidity className="text-2xl capitalize" />
                  <p>Umidade: {dadosClima.current.humidity} %</p>
                </div>
                <div className="flex flex-row justify-center items-center">
                  <WiStrongWind className="text-2xl capitalize" />
                  <p>Velocidade do Vento: {dadosClima.current.wind_kph}km/h</p>
                </div>
                <div className="flex flex-row justify-center items-center">
                  <WiTime1 className="text-2xl capitalize" />
                  <p>Ultima Atualização: {dadosClima.current.last_updated}</p>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </>
  );
};
