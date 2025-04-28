import React, { useState, Dispatch, SetStateAction } from 'react';
import { searchCompaniesByFilters, fetchCnpjData, Filters as SearchFilters } from '../services/cnpjService';

interface Company {
  cnpj: string;
  razao_social: string;
  uf: string;
  descricao_identificador_matriz_filial: string;
  data_inicio_atividade: string;
  descricao_situacao_cadastral: string;
  [key: string]: any;
}

// Interface para as props do componente CnpjExplorer
interface CnpjExplorerProps {
  companies: Company[];
  filters: SearchFilters;
  onFilterChange: (newFilters: Partial<SearchFilters>) => void;
  onExport: () => void;
  isLoading: boolean;
  totalResults: number;
  onSelectCompany: Dispatch<SetStateAction<Company | null>>;
}

const CnpjExplorer: React.FC<CnpjExplorerProps> = ({
  companies,
  filters,
  onFilterChange,
  onExport,
  isLoading,
  totalResults,
  onSelectCompany,
}) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const handleSelectCompany = (company: Company) => {
    onSelectCompany(company);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Pesquisa Avançada</h1>
      <p className="mb-6">
        A pesquisa avançada de empresas permite que você encontre estabelecimentos para análise ou prospecção,
        utilizando múltiplos critérios de filtro e exportando os resultados para uma lista em Excel.
      </p>

      {/* Filtros */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Buscar por CNPJ</label>
            <input
              type="text"
              name="cnpj"
              value={filters.cnpj || ''}
              onChange={handleFilterChange}
              placeholder="Digite o CNPJ"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Tipo</label>
            <select
              name="tipo"
              value={filters.tipo || ''}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione</option>
              <option value="MATRIZ">Matriz</option>
              <option value="FILIAL">Filial</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Situação Cadastral</label>
            <select
              name="situacao_cadastral"
              value={filters.situacao_cadastral || ''}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione</option>
              <option value="ATIVA">Ativa</option>
              <option value="INATIVA">Inativa</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">UF</label>
            <select
              name="uf"
              value={filters.uf || ''}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione</option>
              <option value="SP">SP</option>
              <option value="RJ">RJ</option>
              <option value="DF">DF</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Data de Abertura</label>
            <input
              type="date"
              name="data_inicio_atividade"
              value={filters.data_inicio_atividade || ''}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          {totalResults} estabelecimentos encontrados
        </h2>
        {isLoading ? (
          <p>Carregando...</p>
        ) : companies.length > 0 ? (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">CNPJ</th>
                <th className="border p-2">Razão Social</th>
                <th className="border p-2">UF</th>
                <th className="border p-2">Tipo</th>
                <th className="border p-2">Data de Abertura</th>
                <th className="border p-2">Situação Cadastral</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr
                  key={company.cnpj}
                  onClick={() => handleSelectCompany(company)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="border p-2">{company.cnpj}</td>
                  <td className="border p-2">{company.razao_social}</td>
                  <td className="border p-2">{company.uf}</td>
                  <td className="border p-2">{company.descricao_identificador_matriz_filial}</td>
                  <td className="border p-2">{company.data_inicio_atividade}</td>
                  <td className="border p-2">{company.descricao_situacao_cadastral}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhuma empresa encontrada.</p>
        )}
        <button
          onClick={onExport}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={companies.length === 0}
        >
          Exportar para Excel
        </button>
      </div>
    </div>
  );
};

export default CnpjExplorer;
