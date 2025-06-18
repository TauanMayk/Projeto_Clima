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
      alert("Geolocalização não suportada pelo seu navegador.");
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
        className="container bg-cover bg-center w-full max-w-sm text-center border-15px drop-shadow-[20px_23px_15px_-3px_#0000] rounded-lg justify-center items-center"
        style={{
          backgroundImage: imagemDeCondicao
            ? `url(${imagemDeCondicao})`
            : undefined,
        }}
      >
        <div className="p-6 flex flex-col items-center justify-center gap-4">
          <BotaoLocalizacao onClick={handleBuscarLocalizacao} />
          <div className="p-2 flex items-center justify-between gap-4">
            <InputBusca value={cidadeInput} onChange={setCidadeInput} />
            <BotaoBusca onClick={handleBuscarClima} />
          </div>
          {!localizacaoAtual && (
            <p>Localização não encontrada. Digite uma cidade manualmente.</p>
          )}
          {dadosClima && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="informacao-principal flex flex-col m-[30px] text-center items-center"
              >
                <h2 className="text-white" id="cidade">
                  {dadosClima.location.country.split("-")[0]}
                </h2>
                <h3 className="text-white" id="cidade">
                  {dadosClima.location.region.split("-")[0]}
                </h3>
                <p
                  id="temperatura"
                  className="temperatura text-[40px] mx-6 my-0 text-white"
                >
                  {dadosClima.current.temp_c} °C
                </p>
                <motion.img
                  srcSet={dadosClima.current.condition.icon}
                  alt="icone condição do clima"
                  id="icone-condicao"
                  className="self-center transition-all duration-300 hover:shadow-2xl"
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.98 }}
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
                className="bg-[#FFFFFF] w-full text-black px-12 py-10 gap-6 rounded-lg"
              >
                <div className="flex justify-around items-center">
                  <span>Umidade</span>
                  <span id="umidade">{dadosClima.current.humidity}%</span>
                </div>
                <div className="flex justify-around items-center">
                  <span>Velocidade do Vento</span>
                  <span id="velocidade-do-vento">
                    {dadosClima.current.wind_kph} km/h
                  </span>
                </div>
                <br />
              </motion.div>
            </>
          )}
        </div>
      </main>
    </>
  );
};
