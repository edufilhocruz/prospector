import React, { useState, useEffect } from 'react';
import { searchCompanies } from './cnpjService';

interface Company {
  cnpj: string;
  razao_social: string;
  uf: string;
  descricao_identificador_matriz_filial: string;
  data_inicio_atividade: string;
  descricao_situacao_cadastral: string;
  [key: string]: any;
}

const MainContent: React.FC = () => {
  const [filters, setFilters] = useState({
    cnpj: '',
    tipo: '',
    situacao_cadastral: '',
    uf: '',
    data_inicio_atividade: '',
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchCompanies({
        ...filters,
        page,
        limit,
      });
      setCompanies(response.companies);
      setTotal(response.total);
      setPages(response.pages);
    } catch (err) {
      setError('Erro ao buscar empresas. Verifique se o backend está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages) {
      setPage(newPage);
      handleSearch();
    }
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
              value={filters.cnpj}
              onChange={handleFilterChange}
              placeholder="Digite o CNPJ"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Tipo</label>
            <select
              name="tipo"
              value={filters.tipo}
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
              value={filters.situacao_cadastral}
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
              value={filters.uf}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione</option>
              <option value="SP">SP</option>
              <option value="RJ">RJ</option>
              <option value="DF">DF</option>
              {/* Adicione mais estados conforme necessário */}
            </select>
          </div>
          <div>
            <label className="block mb-1">Data de Abertura</label>
            <input
              type="date"
              name="data_inicio_atividade"
              value={filters.data_inicio_atividade}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
        >
          Buscar Empresas
        </button>
      </div>

      {/* Resultados */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          {total} estabelecimentos encontrados
        </h2>
        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {companies.length > 0 ? (
          <>
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
                  <tr key={company.cnpj}>
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
            <div className="mt-4 flex justify-center items-center gap-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {page} de {pages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </>
        ) : (
          !loading && <p>Nenhuma empresa encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default MainContent;
