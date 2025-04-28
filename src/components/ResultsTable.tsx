
import { Company } from "./CnpjExplorer";
import { formatCNPJ, formatDate, formatCapitalSocial } from "@/lib/utils";

interface ResultsTableProps {
  companies: Company[];
  isLoading: boolean;
}

export const ResultsTable = ({ companies, isLoading }: ResultsTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-16 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-16 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-16 bg-gray-200 rounded w-full mb-3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estabelecimento
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Situação
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company) => (
            <tr key={company.cnpj} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                  {company.identificador_matriz_filial === 1 ? "M" : "F"}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-col">
                  <a href="#" className="font-medium text-[#0fb5ae] hover:underline">
                    {company.razao_social}
                  </a>
                  <span className="text-gray-500 text-sm">
                    {formatCNPJ(company.cnpj)}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="font-medium">
                      {company.descricao_situacao_cadastral}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    Desde {formatDate(company.data_situacao_cadastral)}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
