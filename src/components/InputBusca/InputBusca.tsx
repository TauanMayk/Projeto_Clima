import "./inputbusca.css"

type Props = {
  value: string;
  onChange: (valor: string) => void;
};

export const InputBusca = ({value, onChange}: Props) => {
  return (
    <>
        <input
          type="text"
          id="input-busca"
          className="bg-[#0a1435] px-4 py-2 border-none outline-none text-white text-[16px] opacity-0.8 rounded-sm"
          placeholder="Digite uma cidade"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
    </>
  );
};
