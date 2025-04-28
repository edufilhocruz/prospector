
import { useState } from "react";
import { FilterPanel } from "./FilterPanel";
import { CnpjFilters } from "@/types/cnpj";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Calendar,
  Shield,
  MapPin,
  Phone,
  Mail,
  Activity,
  Calculator,
  User,
  FileText,
  Scale,
  Coins,
  ScrollText,
  Search,
} from "lucide-react";

interface SidebarProps {
  filters: CnpjFilters;
  onFilterChange: (filters: Partial<CnpjFilters>) => void;
  onSearch: () => void;
}

export const Sidebar = ({ filters, onFilterChange, onSearch }: SidebarProps) => {
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
    setOpenFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  return (
    <div className="w-80 min-h-screen bg-[#14252e] text-white p-4 overflow-y-auto flex-shrink-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Filtros</h2>
      </div>

      <Button
        onClick={onSearch}
        className="w-full bg-[#0fb5ae] hover:bg-[#0ca39c] text-white mb-6"
      >
        <Search className="h-4 w-4 mr-2" />
        Buscar Empresas
      </Button>

      <div className="space-y-3">
        <FilterPanel
          title="Tipo"
          icon={<Building2 className="h-5 w-5" />}
          isOpen={openFilters['tipo'] || false}
          onToggle={() => toggleFilter('tipo')}
        >
          <div className="space-y-2 text-white">
            <div className="flex items-center">
              <Checkbox 
                id="matriz" 
                className="mr-2 data-[state=checked]:bg-[#0fb5ae] data-[state=checked]:border-[#0fb5ae]"
                checked={filters.tipo.includes("MATRIZ")}
                onCheckedChange={(checked) => {
                  const newTipo = checked 
                    ? [...filters.tipo, "MATRIZ"] 
                    : filters.tipo.filter(t => t !== "MATRIZ");
                  onFilterChange({ tipo: newTipo });
                }}
              />
              <label htmlFor="matriz" className="text-sm">
                Matriz
                <p className="text-xs text-gray-400">Responsável legal por todas as unidades.</p>
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="filial" 
                className="mr-2 data-[state=checked]:bg-[#0fb5ae] data-[state=checked]:border-[#0fb5ae]"
                checked={filters.tipo.includes("FILIAL")}
                onCheckedChange={(checked) => {
                  const newTipo = checked 
                    ? [...filters.tipo, "FILIAL"] 
                    : filters.tipo.filter(t => t !== "FILIAL");
                  onFilterChange({ tipo: newTipo });
                }}
              />
              <label htmlFor="filial" className="text-sm">
                Filial
                <p className="text-xs text-gray-400">Extensão de uma empresa existente.</p>
              </label>
            </div>
          </div>
        </FilterPanel>

        <FilterPanel
          title="Data de Abertura"
          icon={<Calendar className="h-5 w-5" />}
          isOpen={openFilters['dataAbertura'] || false}
          onToggle={() => toggleFilter('dataAbertura')}
        >
          <div className="space-y-3 text-white">
            <div>
              <label htmlFor="data-min" className="block text-sm mb-1">Intervalo de Data Mínima</label>
              <Input
                type="date"
                id="data-min"
                className="w-full p-2 border border-gray-700 rounded text-sm bg-[#1a2631] text-white"
                value={filters.dataAberturaMin}
                onChange={(e) => onFilterChange({ dataAberturaMin: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="data-max" className="block text-sm mb-1">Intervalo de Data Máxima</label>
              <Input
                type="date"
                id="data-max"
                className="w-full p-2 border border-gray-700 rounded text-sm bg-[#1a2631] text-white"
                value={filters.dataAberturaMax}
                onChange={(e) => onFilterChange({ dataAberturaMax: e.target.value })}
              />
            </div>
          </div>
        </FilterPanel>

        <FilterPanel
          title="Situação Cadastral"
          icon={<Shield className="h-5 w-5" />}
          isOpen={openFilters['situacaoCadastral'] || false}
          onToggle={() => toggleFilter('situacaoCadastral')}
        >
          <div className="space-y-2 text-white">
            {["ATIVA", "BAIXADA", "INAPTA", "SUSPENSA", "NULA"].map((situacao) => (
              <div key={situacao} className="flex items-center">
                <Checkbox 
                  id={situacao.toLowerCase()}
                  className="mr-2 data-[state=checked]:bg-[#0fb5ae] data-[state=checked]:border-[#0fb5ae]"
                  checked={filters.situacaoCadastral.includes(situacao)}
                  onCheckedChange={(checked) => {
                    const newSituacao = checked
                      ? [...filters.situacaoCadastral, situacao]
                      : filters.situacaoCadastral.filter(s => s !== situacao);
                    onFilterChange({ situacaoCadastral: newSituacao });
                  }}
                />
                <label htmlFor={situacao.toLowerCase()} className="text-sm">{situacao}</label>
              </div>
            ))}
          </div>
        </FilterPanel>

        <FilterPanel
          title="Endereço"
          icon={<MapPin className="h-5 w-5" />}
          isOpen={openFilters['endereco'] || false}
          onToggle={() => toggleFilter('endereco')}
        >
          <div className="space-y-3 text-white">
            <div>
              <label htmlFor="uf" className="block text-sm mb-1">Estados</label>
              <Select
                value={filters.uf[0] || "todos_estados"}
                onValueChange={(value) => onFilterChange({ uf: value !== "todos_estados" ? [value] : [] })}
              >
                <SelectTrigger className="w-full bg-[#1a2631] border-gray-700 text-white">
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2631] text-white">
                  <SelectItem value="todos_estados">Todos os estados</SelectItem>
                  {["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"].map((uf) => (
                    <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="municipio" className="block text-sm mb-1">Município</label>
              <Input
                type="text"
                id="municipio"
                className="w-full p-2 border border-gray-700 rounded text-sm bg-[#1a2631] text-white"
                value={filters.municipio.join(", ")}
                onChange={(e) => {
                  const values = e.target.value.split(",").map(v => v.trim()).filter(Boolean);
                  onFilterChange({ municipio: values });
                }}
              />
            </div>
            <div>
              <label htmlFor="bairro" className="block text-sm mb-1">Bairro</label>
              <Input
                type="text"
                id="bairro"
                className="w-full p-2 border border-gray-700 rounded text-sm bg-[#1a2631] text-white"
                value={filters.bairro.join(", ")}
                onChange={(e) => {
                  const values = e.target.value.split(",").map(v => v.trim()).filter(Boolean);
                  onFilterChange({ bairro: values });
                }}
              />
            </div>
            <div>
              <label htmlFor="cep" className="block text-sm mb-1">CEP</label>
              <Input
                type="text"
                id="cep"
                className="w-full p-2 border border-gray-700 rounded text-sm bg-[#1a2631] text-white"
                placeholder="00000-000"
                value={filters.cep}
                onChange={(e) => onFilterChange({ cep: e.target.value })}
              />
            </div>
          </div>
        </FilterPanel>

        <FilterPanel
          title="Telefone"
          icon={<Phone className="h-5 w-5" />}
          isOpen={openFilters['telefone'] || false}
          onToggle={() => toggleFilter('telefone')}
        >
          <div className="space-y-3 text-white">
            <div className="flex items-center">
              <Checkbox 
                id="with-phone" 
                className="mr-2 data-[state=checked]:bg-[#0fb5ae] data-[state=checked]:border-[#0fb5ae]"
                checked={filters.comTelefone}
                onCheckedChange={(checked) => {
                  onFilterChange({ comTelefone: !!checked });
                }}
              />
              <label htmlFor="with-phone" className="text-sm">Com Telefone</label>
            </div>
            <div>
              <label className="block text-sm mb-1">Tipo de Telefone</label>
              <div className="space-y-2">
                {["FIXO", "CELULAR"].map((tipoTel) => (
                  <div key={tipoTel} className="flex items-center">
                    <Checkbox 
                      id={tipoTel.toLowerCase()}
                      className="mr-2 data-[state=checked]:bg-[#0fb5ae] data-[state=checked]:border-[#0fb5ae]"
                      checked={filters.tipoTelefone.includes(tipoTel)}
                      onCheckedChange={(checked) => {
                        const newTipoTel = checked
                          ? [...filters.tipoTelefone, tipoTel]
                          : filters.tipoTelefone.filter(t => t !== tipoTel);
                        onFilterChange({ tipoTelefone: newTipoTel });
                      }}
                    />
                    <label htmlFor={tipoTel.toLowerCase()} className="text-sm">{tipoTel}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FilterPanel>

        <FilterPanel
          title="E-mail"
          icon={<Mail className="h-5 w-5" />}
          isOpen={openFilters['email'] || false}
          onToggle={() => toggleFilter('email')}
        >
          <div className="space-y-3 text-white">
            <div className="flex items-center">
              <Checkbox 
                id="with-email" 
                className="mr-2 data-[state=checked]:bg-[#0fb5ae] data-[state=checked]:border-[#0fb5ae]"
                checked={filters.comEmail}
                onCheckedChange={(checked) => {
                  onFilterChange({ comEmail: !!checked });
                }}
              />
              <label htmlFor="with-email" className="text-sm">Com E-mail</label>
            </div>
            <div>
              <label className="block text-sm mb-1">Tipo de E-mail</label>
              <div className="space-y-2">
                {["PESSOAL", "EMPRESARIAL", "CONTABILIDADE"].map((tipoEmail) => (
                  <div key={tipoEmail} className="flex items-center">
                    <Checkbox 
                      id={tipoEmail.toLowerCase()}
                      className="mr-2 data-[state=checked]:bg-[#0fb5ae] data-[state=checked]:border-[#0fb5ae]"
                      checked={filters.tipoEmail.includes(tipoEmail)}
                      onCheckedChange={(checked) => {
                        const newTipoEmail = checked
                          ? [...filters.tipoEmail, tipoEmail]
                          : filters.tipoEmail.filter(t => t !== tipoEmail);
                        onFilterChange({ tipoEmail: newTipoEmail });
                      }}
                    />
                    <label htmlFor={tipoEmail.toLowerCase()} className="text-sm">{tipoEmail}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FilterPanel>

        <FilterPanel
          title="Atividade Econômica"
          icon={<Activity className="h-5 w-5" />}
          isOpen={openFilters['atividadeEconomica'] || false}
          onToggle={() => toggleFilter('atividadeEconomica')}
        >
          <div className="space-y-3 text-white">
            <div>
              <label htmlFor="cnaes" className="block text-sm mb-1">CNAEs</label>
              <Input
                type="text"
                id="cnaes"
                className="w-full p-2 border border-gray-700 rounded text-sm bg-[#1a2631] text-white"
                placeholder="Adicione CNAEs separados por vírgula"
                value={filters.cnaes.join(", ")}
                onChange={(e) => {
                  const values = e.target.value.split(",").map(v => v.trim()).filter(Boolean);
                  onFilterChange({ cnaes: values });
                }}
              />
            </div>
          </div>
        </FilterPanel>

        <FilterPanel
          title="Simples Nacional"
          icon={<Calculator className="h-5 w-5" />}
          isOpen={openFilters['simplesNacional'] || false}
          onToggle={() => toggleFilter('simplesNacional')}
        >
          <div className="space-y-3 text-white">
            <div>
              <Select
                value={filters.simplesNacional || "todos_simples"}
                onValueChange={(value) => onFilterChange({ simplesNacional: value !== "todos_simples" ? value : "" })}
              >
                <SelectTrigger className="w-full bg-[#1a2631] border-gray-700 text-white">
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2631] text-white">
                  <SelectItem value="todos_simples">Todos</SelectItem>
                  <SelectItem value="SIM">Optante</SelectItem>
                  <SelectItem value="NAO">Não Optante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FilterPanel>

        <FilterPanel
          title="MEI"
          icon={<User className="h-5 w-5" />}
          isOpen={openFilters['mei'] || false}
          onToggle={() => toggleFilter('mei')}
        >
          <div className="space-y-3 text-white">
            <div>
              <Select
                value={filters.mei || "todos_mei"}
                onValueChange={(value) => onFilterChange({ mei: value !== "todos_mei" ? value : "" })}
              >
                <SelectTrigger className="w-full bg-[#1a2631] border-gray-700 text-white">
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2631] text-white">
                  <SelectItem value="todos_mei">Todos</SelectItem>
                  <SelectItem value="SIM">Qualificado</SelectItem>
                  <SelectItem value="NAO">Não Qualificado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FilterPanel>

        <FilterPanel
          title="Razão Social"
          icon={<FileText className="h-5 w-5" />}
          isOpen={openFilters['razaoSocial'] || false}
          onToggle={() => toggleFilter('razaoSocial')}
        >
          <div className="space-y-3 text-white">
            <div>
              <label htmlFor="razao-social" className="block text-sm mb-1">Razão Social</label>
              <Input
                type="text"
                id="razao-social"
                className="w-full p-2 border border-gray-700 rounded text-sm bg-[#1a2631] text-white"
                placeholder="Pesquisar por razão social"
                value={filters.razaoSocial}
                onChange={(e) => onFilterChange({ razaoSocial: e.target.value })}
              />
            </div>
          </div>
        </FilterPanel>

        <FilterPanel
          title="Porte"
          icon={<Scale className="h-5 w-5" />}
          isOpen={openFilters['porte'] || false}
          onToggle={() => toggleFilter('porte')}
        >
          <div className="space-y-2 text-white">
            {["MICRO EMPRESA", "EMPRESA DE PEQUENO PORTE", "DEMAIS"].map((porte) => (
              <div key={porte} className="flex items-center">
                <Checkbox 
                  id={porte.toLowerCase().replace(/\s/g, '-')}
                  className="mr-2 data-[state=checked]:bg-[#0fb5ae] data-[state=checked]:border-[#0fb5ae]"
                  checked={filters.porte.includes(porte)}
                  onCheckedChange={(checked) => {
                    const newPorte = checked
                      ? [...filters.porte, porte]
                      : filters.porte.filter(p => p !== porte);
                    onFilterChange({ porte: newPorte });
                  }}
                />
                <label htmlFor={porte.toLowerCase().replace(/\s/g, '-')} className="text-sm">
                  {porte}
                  {porte === "MICRO EMPRESA" && (
                    <p className="text-xs text-gray-400">Faturamento anual até R$ 360 mil.</p>
                  )}
                  {porte === "EMPRESA DE PEQUENO PORTE" && (
                    <p className="text-xs text-gray-400">Faturamento anual até R$ 4.8 milhões.</p>
                  )}
                  {porte === "DEMAIS" && (
                    <p className="text-xs text-gray-400">Não incluídos nos portes permitidos.</p>
                  )}
                </label>
              </div>
            ))}
          </div>
        </FilterPanel>

        <FilterPanel
          title="Capital Social"
          icon={<Coins className="h-5 w-5" />}
          isOpen={openFilters['capitalSocial'] || false}
          onToggle={() => toggleFilter('capitalSocial')}
        >
          <div className="space-y-3 text-white">
            <div>
              <label htmlFor="capital-min" className="block text-sm mb-1">Intervalo Mínimo</label>
              <Input
                type="number"
                id="capital-min"
                className="w-full p-2 border border-gray-700 rounded text-sm bg-[#1a2631] text-white"
                value={filters.capitalSocialMin || ""}
                onChange={(e) => onFilterChange({ capitalSocialMin: Number(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label htmlFor="capital-max" className="block text-sm mb-1">Intervalo Máximo</label>
              <Input
                type="number"
                id="capital-max"
                className="w-full p-2 border border-gray-700 rounded text-sm bg-[#1a2631] text-white"
                value={filters.capitalSocialMax || ""}
                onChange={(e) => onFilterChange({ capitalSocialMax: Number(e.target.value) || 0 })}
              />
            </div>
          </div>
        </FilterPanel>

        <FilterPanel
          title="Natureza Jurídica"
          icon={<ScrollText className="h-5 w-5" />}
          isOpen={openFilters['naturezaJuridica'] || false}
          onToggle={() => toggleFilter('naturezaJuridica')}
        >
          <div className="space-y-3 text-white">
            <div>
              <label htmlFor="natureza-juridica" className="block text-sm mb-1">Naturezas Jurídicas</label>
              <Input
                type="text"
                id="natureza-juridica"
                className="w-full p-2 border border-gray-700 rounded text-sm bg-[#1a2631] text-white"
                placeholder="Adicione naturezas separadas por vírgula"
                value={filters.naturezaJuridica.join(", ")}
                onChange={(e) => {
                  const values = e.target.value.split(",").map(v => v.trim()).filter(Boolean);
                  onFilterChange({ naturezaJuridica: values });
                }}
              />
            </div>
          </div>
        </FilterPanel>
      </div>
    </div>
  );
};
