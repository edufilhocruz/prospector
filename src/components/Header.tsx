
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HeaderProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: () => void;
}

export const Header = ({ searchTerm = "", onSearchChange = () => {}, onSearch = () => {} }: HeaderProps) => {
  return (
    <header className="bg-[#14252e] text-white py-3 px-4 border-b border-gray-800 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">
          Consulta CNPJ
        </h1>
      </div>
      <div className="flex items-center space-x-3">
        <div className="relative w-72">
          <Input
            type="text"
            placeholder="Digite um CNPJ..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-[#1a2631] border-gray-700 text-white pr-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch();
              }
            }}
          />
          <Search 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
            onClick={onSearch}
          />
        </div>
        <Button 
          variant="outline" 
          className="bg-[#0fb5ae] hover:bg-[#0ca39c] text-white"
          onClick={() => {}}
        >
          Exportar CSV
        </Button>
      </div>
    </header>
  );
};
