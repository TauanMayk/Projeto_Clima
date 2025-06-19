import "./botaolocalizacao.css";

type Props = {
  onClick: () => void;
};

export default function BotaoLocalizacao({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 mt-4 bg-blue-800 hover:bg-blue-700 hover:shadow-2xl duration-300 hover:scale-105 text-white rounded-lg transition-all"
    >
      <span className="text-lg">📍</span>
      <span>Usar minha localização</span>
    </button>
  );
}