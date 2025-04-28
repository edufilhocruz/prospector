
export interface CnpjFilters {
  tipo: string[];
  dataAberturaMin: string;
  dataAberturaMax: string;
  situacaoCadastral: string[];
  uf: string[];
  municipio: string[];
  bairro: string[];
  cep: string;
  comTelefone: boolean;
  tipoTelefone: string[];
  comEmail: boolean;
  tipoEmail: string[];
  cnaes: string[];
  simplesNacional: string;
  mei: string;
  razaoSocial: string;
  porte: string[];
  capitalSocialMin: number;
  capitalSocialMax: number;
  naturezaJuridica: string[];
}
