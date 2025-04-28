import { toast } from "sonner";
import { Company } from "@/components/CnpjExplorer";
import { CnpjFilters } from "@/types/cnpj";

export const fetchCnpjData = async (cnpj: string): Promise<Company | null> => {
  try {
    const cleanCnpj = cnpj.replace(/[^\d]/g, "");
    const response = await fetch(`https://minhareceita.org/${cleanCnpj}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        toast.error(`CNPJ ${cnpj} não encontrado`);
        return null;
      }
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Dados retornados por fetchCnpjData:", data);
    return data;
  } catch (error) {
    toast.error("Erro ao buscar dados do CNPJ");
    console.error("Error fetching CNPJ data:", error);
    return null;
  }
};

export const searchCompaniesByFilters = async (filters: CnpjFilters): Promise<Company[]> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.tipo.length > 0) {
      params.append("tipo", filters.tipo.join(","));
    }
    
    if (filters.dataAberturaMin) {
      params.append("data_abertura_inicial", filters.dataAberturaMin);
    }
    
    if (filters.dataAberturaMax) {
      params.append("data_abertura_final", filters.dataAberturaMax);
    }
    
    if (filters.situacaoCadastral.length > 0) {
      params.append("situacao_cadastral", filters.situacaoCadastral.join(","));
    }
    
    if (filters.uf.length > 0 && !filters.uf.includes("todos_estados")) {
      params.append("uf", filters.uf.join(","));
    }
    
    if (filters.municipio.length > 0) {
      params.append("municipio", filters.municipio.join(","));
    }
    
    if (filters.bairro.length > 0) {
      params.append("bairro", filters.bairro.join(","));
    }
    
    if (filters.cep) {
      params.append("cep", filters.cep);
    }
    
    if (filters.comTelefone) {
      params.append("com_telefone", "true");
      if (filters.tipoTelefone.length > 0) {
        params.append("tipo_telefone", filters.tipoTelefone.join(","));
      }
    }
    
    if (filters.comEmail) {
      params.append("com_email", "true");
      if (filters.tipoEmail.length > 0) {
        params.append("tipo_email", filters.tipoEmail.join(","));
      }
    }
    
    if (filters.cnaes.length > 0) {
      params.append("cnaes", filters.cnaes.join(","));
    }
    
    if (filters.simplesNacional && filters.simplesNacional !== "todos_simples") {
      params.append("simples_nacional", filters.simplesNacional);
    }
    
    if (filters.mei && filters.mei !== "todos_mei") {
      params.append("mei", filters.mei);
    }
    
    if (filters.razaoSocial) {
      params.append("razao_social", filters.razaoSocial);
    }
    
    if (filters.porte.length > 0) {
      params.append("porte", filters.porte.join(","));
    }
    
    if (filters.capitalSocialMin > 0) {
      params.append("capital_social_min", filters.capitalSocialMin.toString());
    }
    
    if (filters.capitalSocialMax > 0) {
      params.append("capital_social_max", filters.capitalSocialMax.toString());
    }
    
    if (filters.naturezaJuridica.length > 0) {
      params.append("natureza_juridica", filters.naturezaJuridica.join(","));
    }
    
    const baseUrl = "http://localhost:3001/empresas";
    const url = `${baseUrl}?${params.toString()}`;
    
    console.log("URL de busca:", url);
    toast.info("Buscando empresas com os filtros aplicados");
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error("Erro na requisição:", response.status, response.statusText);
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Dados brutos da API (searchCompaniesByFilters):", data);
    
    if (Array.isArray(data)) {
      return data;
    } else if (data.empresas && Array.isArray(data.empresas)) {
      return data.empresas;
    } else {
      console.log("Formato de resposta inesperado:", data);
      return [];
    }
  } catch (error) {
    toast.error("Erro ao buscar empresas");
    console.error("Error searching companies by filters:", error);
    return [];
  }
};

export const formatCnpj = (cnpj: string): string => {
  const cleaned = cnpj.replace(/[^\d]/g, "");
  return cleaned.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
};
