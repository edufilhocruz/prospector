
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Company } from "./CnpjExplorer";
import { formatCNPJ, formatDate, formatCapitalSocial } from "@/lib/utils";

interface CompanyDetailsProps {
  company: Company;
  onClose: () => void;
}

export const CompanyDetails = ({ company, onClose }: CompanyDetailsProps) => {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{company.razao_social}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto p-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">CNPJ</h3>
              <p className="text-lg">{formatCNPJ(company.cnpj)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nome Fantasia</h3>
              <p className="text-lg">{company.nome_fantasia || '-'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
              <p className="text-lg">{company.descricao_identificador_matriz_filial}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Situação Cadastral</h3>
              <div className="flex items-center">
                <span className={`h-2 w-2 rounded-full ${company.descricao_situacao_cadastral === 'ATIVA' ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                <span className="text-lg">{company.descricao_situacao_cadastral}</span>
              </div>
              <p className="text-sm text-gray-500">Desde {formatDate(company.data_situacao_cadastral)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Data de Abertura</h3>
              <p className="text-lg">{formatDate(company.data_inicio_atividade)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Atividade Principal</h3>
              <p className="text-lg">{company.cnae_fiscal_descricao}</p>
              <p className="text-sm text-gray-500">{company.cnae_fiscal}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Natureza Jurídica</h3>
              <p className="text-lg">{company.natureza_juridica}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Endereço</h3>
              <p className="text-lg">
                {company.logradouro}, {company.numero} {company.complemento && `- ${company.complemento}`}
              </p>
              <p className="text-lg">
                {company.bairro}, {company.municipio} - {company.uf}, {company.cep}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Contato</h3>
              <p className="text-lg">
                {company.ddd_telefone_1 ? `Telefone: (${company.ddd_telefone_1.substring(0, 2)}) ${company.ddd_telefone_1.substring(2)}` : 'Telefone não informado'}
              </p>
              {company.ddd_telefone_2 && (
                <p className="text-lg">
                  Telefone 2: (${company.ddd_telefone_2.substring(0, 2)}) ${company.ddd_telefone_2.substring(2)}
                </p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Capital Social</h3>
              <p className="text-lg">{formatCapitalSocial(company.capital_social)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Porte</h3>
              <p className="text-lg">{company.porte}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Opção pelo Simples Nacional</h3>
              <p className="text-lg">{company.opcao_pelo_simples === null ? 'Não optante' : company.opcao_pelo_simples ? 'Optante' : 'Não optante'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Opção pelo MEI</h3>
              <p className="text-lg">{company.opcao_pelo_mei === null ? 'Não enquadrado' : company.opcao_pelo_mei ? 'Enquadrado' : 'Não enquadrado'}</p>
            </div>
          </div>
          
          {company.qsa && company.qsa.length > 0 && (
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Quadro Societário</h3>
              <div className="border rounded overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qualificação</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Entrada</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {company.qsa.map((socio, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap">{socio.nome_socio}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{socio.qualificacao_socio}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{formatDate(socio.data_entrada_sociedade)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
