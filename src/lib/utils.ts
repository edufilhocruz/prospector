
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCNPJ(cnpj: string): string {
  if (!cnpj) return "";
  
  // Clean the CNPJ string
  const cleaned = cnpj.replace(/\D/g, "");
  
  // Apply CNPJ format: XX.XXX.XXX/XXXX-XX
  return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

export function cnpjMask(value: string): string {
  if (!value) return "";
  
  // Remove non-digits
  value = value.replace(/\D/g, "");
  
  // Apply CNPJ mask
  value = value.replace(/^(\d{2})(\d)/, "$1.$2");
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
  value = value.replace(/(\d{4})(\d)/, "$1-$2");
  
  return value;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  
  try {
    // Parse the date string (YYYY-MM-DD format)
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  } catch (error) {
    return dateString;
  }
}

export function formatCapitalSocial(value: number): string {
  if (!value && value !== 0) return "-";
  
  // Format as currency
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
