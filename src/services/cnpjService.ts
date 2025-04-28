import axios from 'axios';

interface Company {
  cnpj: string;
  razao_social: string;
  uf: string;
  descricao_identificador_matriz_filial: string;
  data_inicio_atividade: string;
  descricao_situacao_cadastral: string;
  [key: string]: any;
}

interface SearchResponse {
  companies: Company[];
  total: number;
  page: number;
  pages: number;
}

interface Filters {
  cnpj?: string;
  tipo?: string;
  situacao_cadastral?: string;
  uf?: string;
  data_inicio_atividade?: string;
  municipio?: string;
  bairro?: string;
  cep?: string;
  cnae_fiscal?: string;
  razao_social?: string;
  page?: number;
  limit?: number;
}

const API_URL = 'http://localhost:3001/empresas';

// Função para buscar dados de um CNPJ específico
export const fetchCnpjData = async (cnpj: string): Promise<Company> => {
  try {
    console.log(`Buscando dados do CNPJ ${cnpj}`);
    const response = await axios.post(API_URL, { cnpj });
    console.log('Resposta recebida:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar dados do CNPJ ${cnpj}:`, error);
    throw error;
  }
};

// Função para buscar empresas com filtros (renomeada para searchCompaniesByFilters)
export const searchCompaniesByFilters = async (filters: Filters): Promise<SearchResponse> => {
  try {
    console.log('Enviando requisição com filtros:', filters);
    const response = await axios.get(API_URL, {
      params: {
        cnpj: filters.cnpj,
        tipo: filters.tipo,
        situacao_cadastral: filters.situacao_cadastral,
        uf: filters.uf,
        data_inicio_atividade: filters.data_inicio_atividade,
        municipio: filters.municipio,
        bairro: filters.bairro,
        cep: filters.cep,
        cnae_fiscal: filters.cnae_fiscal,
        razao_social: filters.razao_social,
        page: filters.page || 1,
        limit: filters.limit || 10,
      },
    });
    console.log('Resposta recebida:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    throw error;
  }
};

// Mantemos a função searchCompanies como alias para compatibilidade com MainContent.tsx
export const searchCompanies = searchCompaniesByFilters;
