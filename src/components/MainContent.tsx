import { ResultsTable } from "./ResultsTable";
import { CnpjFilters, SearchFilters } from "@/types/cnpj";
import { Company } from "./CnpjExplorer";

interface MainContentProps {
  companies: Company[];
  filters: SearchFilters;
  onFilterChange: (filters: Partial<CnpjFilters>) => void;
  onExport: () => void;
  isLoading: boolean;
  totalResults: number;
  onSelectCompany?: (company: Company) => void;
}

export const MainContent = ({
  companies,
  filters,
  onFilterChange,
  onExport,
  isLoading,
  totalResults,
  onSelectCompany,
}: MainContentProps) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Pesquisa Avançada
          </h1>
          <p className="text-gray-600 mb-6">
            A pesquisa avançada de empresas permite que você encontre
            estabelecimentos para análise ou prospecção, utilizando múltiplos
            critérios de filtro e exportando os resultados para uma lista em
            Excel.
          </p>
        </div>
      </div>
      <div className="mb-6">
        <div className="text-sm text-gray-600">
          <span className="font-medium text-[#0fb5ae]">{totalResults}</span>{" "}
          {totalResults === 1 ? "estabelecimento encontrado" : "estabelecimentos encontrados"}
        </div>
      </div>
      <ResultsTable
        companies={companies}
        isLoading={isLoading}
        onSelectCompany={onSelectCompany}
      />
    </div>
  );
};
