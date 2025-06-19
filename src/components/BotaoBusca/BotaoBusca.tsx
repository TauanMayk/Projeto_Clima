import "./botaobusca.css"

type Props = {
  onClick: () => void;
};

export default function BotaoBusca({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-900 hover:bg-blue-800 text-xl text-white p-4 rounded-full w-12 h-12 flex items-center justify-center hover:shadow-2xl transition-transform duration-300 hover:scale-105 ease-in-out"
      aria-label="Buscar clima"
    >
      🔍
    </button>
  );
}