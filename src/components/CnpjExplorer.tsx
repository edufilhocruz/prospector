
import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MainContent } from "./MainContent";
import { CompanyDetails } from "./CompanyDetails";
import { toast } from "sonner";
import { fetchCnpjData } from "@/services/cnpjService";
import { CnpjFilters } from "@/types/cnpj";

export interface Company {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: number;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  uf: string;
  municipio: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cep: string;
  ddd_telefone_1: string;
  ddd_telefone_2: string;
  email: string;
  capital_social: number;
  porte: string;
  opcao_pelo_simples: boolean | null;
  opcao_pelo_mei: boolean | null;
  natureza_juridica: string;
  identificador_matriz_filial: number;
  descricao_identificador_matriz_filial: string;
  qsa?: Array<{
    nome_socio: string;
    cnpj_cpf_do_socio: string;
    qualificacao_socio: string;
    data_entrada_sociedade: string;
    faixa_etaria: string;
  }>;
  cnaes_secundarios?: Array<{
    codigo: number;
    descricao: string;
  }>;
}

export interface SearchFilters extends CnpjFilters {}

export const CnpjExplorer = () => {
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    tipo: [],
    dataAberturaMin: "",
    dataAberturaMax: "",
    situacaoCadastral: [],
    uf: [],
    municipio: [],
    bairro: [],
    cep: "",
    comTelefone: false,
    tipoTelefone: [],
    comEmail: false,
    tipoEmail: [],
    cnaes: [],
    simplesNacional: "",
    mei: "",
    razaoSocial: "",
    porte: [],
    capitalSocialMin: 0,
    capitalSocialMax: 0,
    naturezaJuridica: [],
  });

  const handleSearch = async () => {
    if (!searchTerm && filters.tipo.length === 0) {
      toast.error("Por favor, adicione filtros ou um CNPJ para buscar");
      return;
    }

    setIsLoading(true);
    setSelectedCompany(null);

    if (searchTerm) {
      const data = await fetchCnpjData(searchTerm);
      
      if (data) {
        setSearchResults([data]);
        toast.success(`CNPJ ${searchTerm} encontrado com sucesso`);
      } else {
        setSearchResults([]);
      }
    } else {
      toast.info("Aplicando filtros de busca");
      // In a real implementation, this would call a different API endpoint 
      // that supports searching by filters
      setSearchResults([]);
    }
    
    setIsLoading(false);
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handleExport = () => {
    toast.info("Exportação de dados não implementada nesta versão");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          filters={filters}
          onFilterChange={handleFilterChange} 
          onSearch={handleSearch} 
        />
        <MainContent 
          companies={searchResults}
          filters={filters}
          onFilterChange={handleFilterChange}
          onExport={handleExport}
          isLoading={isLoading}
          totalResults={searchResults.length}
        />
      </div>
      {selectedCompany && (
        <CompanyDetails 
          company={selectedCompany} 
          onClose={() => setSelectedCompany(null)} 
        />
      )}
    </div>
  );
};
