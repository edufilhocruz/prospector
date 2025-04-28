import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Company, SearchFilters } from "./CnpjExplorer";
import { FilterPanel } from "./FilterPanel";
import { ResultsTable } from "./ResultsTable";
import { formatCNPJ } from "@/lib/utils";

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="space-y-3">
            <FilterPanel
              title="Tipo"
              isOpen={openFilters.tipo}
              onToggle={() => toggleFilter("tipo")}
              icon={openFilters.tipo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            >
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="matriz"
                    className="mr-2"
                    checked={filters.tipo.includes("MATRIZ")}
                    onChange={(e) => {
                      const newTipo = e.target.checked
                        ? [...filters.tipo, "MATRIZ"]
                        : filters.tipo.filter((t) => t !== "MATRIZ");
                      onFilterChange({ tipo: newTipo });
                    }}
                  />
                  <label htmlFor="matriz" className="text-sm text-gray-700">Matriz</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="filial"
                    className="mr-2"
                    checked={filters.tipo.includes("FILIAL")}
                    onChange={(e) => {
                      const newTipo = e.target.checked
                        ? [...filters.tipo, "FILIAL"]
                        : filters.tipo.filter((t) => t !== "FILIAL");
                      onFilterChange({ tipo: newTipo });
                    }}
                  />
                  <label htmlFor="filial" className="text-sm text-gray-700">Filial</label>
                </div>
              </div>
            </FilterPanel>

            <FilterPanel
              title="Data de Abertura"
              isOpen={openFilters.dataAbertura}
              onToggle={() => toggleFilter("dataAbertura")}
              icon={openFilters.dataAbertura ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            >
              <div className="space-y-3">
                <div>
                  <label htmlFor="data-min" className="block text-sm text-gray-700 mb-1">Intervalo de Data Mínima</label>
                  <input
                    type="date"
                    id="data-min"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={filters.dataAberturaMin}
                    onChange={(e) => onFilterChange({ dataAberturaMin: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="data-max" className="block text-sm text-gray-700 mb-1">Intervalo de Data Máxima</label>
                  <input
                    type="date"
                    id="data-max"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={filters.dataAberturaMax}
                    onChange={(e) => onFilterChange({ dataAberturaMax: e.target.value })}
                  />
                </div>
              </div>
            </FilterPanel>

            {/* Other filters would be implemented similarly */}
            <FilterPanel
              title="Situação Cadastral"
              isOpen={openFilters.situacaoCadastral}
              onToggle={() => toggleFilter("situacaoCadastral")}
              icon={openFilters.situacaoCadastral ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            >
              <div className="space-y-2">
                {["ATIVA", "BAIXADA", "INAPTA", "SUSPENSA", "NULA"].map((situacao) => (
                  <div key={situacao} className="flex items-center">
                    <input
                      type="checkbox"
                      id={situacao.toLowerCase()}
                      className="mr-2"
                      checked={filters.situacaoCadastral.includes(situacao)}
                      onChange={(e) => {
                        const newSituacao = e.target.checked
                          ? [...filters.situacaoCadastral, situacao]
                          : filters.situacaoCadastral.filter((s) => s !== situacao);
                        onFilterChange({ situacaoCadastral: newSituacao });
                      }}
                    />
                    <label htmlFor={situacao.toLowerCase()} className="text-sm text-gray-700">{situacao}</label>
                  </div>
                ))}
              </div>
            </FilterPanel>

            <FilterPanel
              title="Endereço"
              isOpen={openFilters.endereco}
              onToggle={() => toggleFilter("endereco")}
              icon={openFilters.endereco ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            >
              <div className="space-y-3">
                <div>
                  <label htmlFor="uf" className="block text-sm text-gray-700 mb-1">Estados</label>
                  <select
                    id="uf"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={filters.uf[0] || ""}
                    onChange={(e) => onFilterChange({ uf: e.target.value ? [e.target.value] : [] })}
                  >
                    <option value="">Selecione</option>
                    {["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"].map((uf) => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="cep" className="block text-sm text-gray-700 mb-1">CEP</label>
                  <input
                    type="text"
                    id="cep"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    placeholder="00000-000"
                    value={filters.cep}
                    onChange={(e) => onFilterChange({ cep: e.target.value })}
                  />
                </div>
              </div>
            </FilterPanel>
          </div>
        </div>

        <div className="col-span-2">
          <ResultsTable companies={companies} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
