import { useState, useEffect } from 'react';

export default function CidadeSelect({ value, onChange, name, id, className }) {
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome')
      .then(r => r.json())
      .then(data => setCidades(data.map(m => m.nome)))
      .catch(() => {});
  }, []);

  return (
    <>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        list={`cidades-list-${id}`}
        placeholder="Digite sua cidade..."
        className={className}
        autoComplete="off"
      />
      <datalist id={`cidades-list-${id}`}>
        {cidades.map(cidade => (
          <option key={cidade} value={cidade} />
        ))}
      </datalist>
    </>
  );
}
