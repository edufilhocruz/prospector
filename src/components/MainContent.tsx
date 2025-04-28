import { Button } from "@/components/ui/button";
import { Company, SearchFilters } from "./CnpjExplorer";
import { ResultsTable } from "./ResultsTable";
import { useState } from "react";

interface MainContentProps {
  companies: Company[];
  filters: SearchFilters;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onExport: () => void;
  isLoading: boolean;
  totalResults: number;
}

export const MainContent = ({
  companies,
  filters,
  onFilterChange,
  onExport,
  isLoading,
  totalResults,
}: MainContentProps) => {
  // Manter o useState para evitar erros de referência
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({
    tipo: false,
    dataAbertura: false,
    situacaoCadastral: false,
    endereco: false,
    telefone: false,
    email: false,
    atividadeEconomica: false,
    simplesNacional: false,
    mei: false,
    razaoSocial: false,
    porte: false,
    capitalSocial: false,
    naturezaJuridica: false,
  });

  // Manter a função usada nos componentes
  const toggleFilter = (filterName: string) => {
    setOpenFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  return (
    <div className="flex-1 overflow-auto bg-white p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Empresas</h1>
      <p className="text-gray-600 mb-6">
        A pesquisa avançada de empresas permite que você encontre estabelecimentos para análise ou
        prospecção, utilizando múltiplos critérios de filtro e exportando os resultados para uma lista em Excel.
      </p>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center text-green-600">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          <span className="font-medium">{totalResults.toLocaleString('pt-BR')} estabelecimentos encontrados</span>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={() => {}}
          >
            <span className="mr-2">Amostra em Excel</span>
          </Button>
          <Button 
            className="bg-[#0fb5ae] hover:bg-[#0ca39c] text-white"
            onClick={onExport}
          >
            <span className="mr-2">Exportar</span>
          </Button>
        </div>
      </div>

      <div className="w-full">
        <ResultsTable companies={companies} isLoading={isLoading} />
      </div>
    </div>
  );
};
