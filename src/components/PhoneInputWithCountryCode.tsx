"use client";

import React from "react";
import { useFormContext, ControllerRenderProps, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Simplified list of African countries with flags and dial codes
const africanCountries = [
  { code: "TG", name: "Togo", dialCode: "+228", flag: "🇹🇬", enabled: true },
  { code: "BJ", name: "Bénin", dialCode: "+229", flag: "🇧🇯", enabled: true },
  { code: "GH", name: "Ghana", dialCode: "+233", flag: "🇬🇭", enabled: true },
  { code: "CI", name: "Côte d'Ivoire", dialCode: "+225", flag: "🇨🇮", enabled: false },
  { code: "SN", name: "Sénégal", dialCode: "+221", flag: "🇸🇳", enabled: false },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬", enabled: false },
  { code: "CM", name: "Cameroun", dialCode: "+237", flag: "🇨🇲", enabled: false },
  { code: "ML", name: "Mali", dialCode: "+223", flag: "🇲🇱", enabled: false },
  { code: "BF", name: "Burkina Faso", dialCode: "+226", flag: "🇧🇫", enabled: false },
  { code: "NE", name: "Niger", dialCode: "+227", flag: "🇳🇪", enabled: false },
  { code: "GA", name: "Gabon", dialCode: "+241", flag: "🇬🇦", enabled: false },
  { code: "CD", name: "RDC", dialCode: "+243", flag: "🇨🇩", enabled: false },
  { code: "CG", name: "Congo", dialCode: "+242", flag: "🇨🇬", enabled: false },
  { code: "GN", name: "Guinée", dialCode: "+224", flag: "🇬🇳", enabled: false },
  { code: "MR", name: "Mauritanie", dialCode: "+222", flag: "🇲🇷", enabled: false },
  { code: "SL", name: "Sierra Leone", dialCode: "+232", flag: "🇸🇱", enabled: false },
  { code: "LR", name: "Liberia", dialCode: "+231", flag: "🇱🇷", enabled: false },
  { code: "GM", name: "Gambie", dialCode: "+220", flag: "🇬🇲", enabled: false },
  { code: "GW", name: "Guinée-Bissau", dialCode: "+245", flag: "🇬🇼", enabled: false },
  { code: "CV", name: "Cap-Vert", dialCode: "+238", flag: "🇨🇻", enabled: false },
  { code: "SC", name: "Seychelles", dialCode: "+248", flag: "🇸🇨", enabled: false },
  { code: "KM", name: "Comores", dialCode: "+269", flag: "🇰🇲", enabled: false },
  { code: "MG", name: "Madagascar", dialCode: "+261", flag: "🇲🇬", enabled: false },
  { code: "MU", name: "Maurice", dialCode: "+230", flag: "🇲🇺", enabled: false },
  { code: "RW", name: "Rwanda", dialCode: "+250", flag: "🇷🇼", enabled: false },
  { code: "BI", name: "Burundi", dialCode: "+257", flag: "🇧🇮", enabled: false },
  { code: "UG", name: "Ouganda", dialCode: "+256", flag: "🇺🇬", enabled: false },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪", enabled: false },
  { code: "TZ", name: "Tanzanie", dialCode: "+255", flag: "🇹🇿", enabled: false },
  { code: "ET", name: "Éthiopie", dialCode: "+251", flag: "🇪🇹", enabled: false },
  { code: "SO", name: "Somalie", dialCode: "+252", flag: "🇸🇴", enabled: false },
  { code: "DJ", name: "Djibouti", dialCode: "+253", flag: "🇩🇯", enabled: false },
  { code: "ER", name: "Érythrée", dialCode: "+291", flag: "🇪🇷", enabled: false },
  { code: "SD", name: "Soudan", dialCode: "+249", flag: "🇸🇩", enabled: false },
  { code: "SS", name: "Soudan du Sud", dialCode: "+211", flag: "🇸🇸", enabled: false },
  { code: "EG", name: "Égypte", dialCode: "+20", flag: "🇪🇬", enabled: false },
  { code: "LY", name: "Libye", dialCode: "+218", flag: "🇱🇾", enabled: false },
  { code: "TN", name: "Tunisie", dialCode: "+216", flag: "🇹🇳", enabled: false },
  { code: "DZ", name: "Algérie", dialCode: "+213", flag: "🇩🇿", enabled: false },
  { code: "MA", name: "Maroc", dialCode: "+212", flag: "🇲🇦", enabled: false },
  { code: "EH", name: "Sahara Occidental", dialCode: "+212", flag: "🇪🇭", enabled: false },
  { code: "AO", name: "Angola", dialCode: "+244", flag: "🇦🇴", enabled: false },
  { code: "ZM", name: "Zambie", dialCode: "+260", flag: "🇿🇲", enabled: false },
  { code: "ZW", name: "Zimbabwe", dialCode: "+263", flag: "🇿🇼", enabled: false },
  { code: "MW", name: "Malawi", dialCode: "+265", flag: "🇲🇼", enabled: false },
  { code: "MZ", name: "Mozambique", dialCode: "+258", flag: "🇲🇿", enabled: false },
  { code: "BW", name: "Botswana", dialCode: "+267", flag: "🇧🇼", enabled: false },
  { code: "NA", name: "Namibie", dialCode: "+264", flag: "🇳🇦", enabled: false },
  { code: "ZA", name: "Afrique du Sud", dialCode: "+27", flag: "🇿🇦", enabled: false },
  { code: "LS", name: "Lesotho", dialCode: "+266", flag: "🇱🇸", enabled: false },
  { code: "SZ", name: "Eswatini", dialCode: "+268", flag: "🇸🇿", enabled: false },
  { code: "ST", name: "Sao Tomé-et-Principe", dialCode: "+239", flag: "🇸🇹", enabled: false },
  { code: "GQ", name: "Guinée équatoriale", dialCode: "+240", flag: "🇬🇶", enabled: false },
  { code: "CF", name: "Centrafrique", dialCode: "+236", flag: "🇨🇫", enabled: false },
  { code: "TD", name: "Tchad", dialCode: "+235", flag: "🇹🇩", enabled: false },
  { code: "SO", name: "Somalie", dialCode: "+252", flag: "🇸🇴", enabled: false },
  { code: "MR", name: "Mauritanie", dialCode: "+222", flag: "🇲🇷", enabled: false },
  { code: "AO", name: "Angola", dialCode: "+244", flag: "🇦🇴", enabled: false },
  { code: "ZM", name: "Zambie", dialCode: "+260", flag: "🇿🇲", enabled: false },
  { code: "ZW", name: "Zimbabwe", dialCode: "+263", flag: "🇿🇼", enabled: false },
  { code: "MW", name: "Malawi", dialCode: "+265", flag: "🇲🇼", enabled: false },
  { code: "MZ", name: "Mozambique", dialCode: "+258", flag: "🇲🇿", enabled: false },
  { code: "BW", name: "Botswana", dialCode: "+267", flag: "🇧🇼", enabled: false },
  { code: "NA", name: "Namibie", dialCode: "+264", flag: "🇳🇦", enabled: false },
  { code: "ZA", name: "Afrique du Sud", dialCode: "+27", flag: "🇿🇦", enabled: false },
  { code: "LS", name: "Lesotho", dialCode: "+266", flag: "🇱🇸", enabled: false },
  { code: "SZ", name: "Eswatini", dialCode: "+268", flag: "🇸🇿", enabled: false },
  { code: "ST", name: "Sao Tomé-et-Principe", dialCode: "+239", flag: "🇸🇹", enabled: false },
  { code: "GQ", name: "Guinée équatoriale", dialCode: "+240", flag: "🇬🇶", enabled: false },
  { code: "CF", name: "Centrafrique", dialCode: "+236", flag: "🇨🇫", enabled: false },
  { code: "TD", name: "Tchad", dialCode: "+235", flag: "🇹🇩", enabled: false },
];

interface PhoneInputWithCountryCodeProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export function PhoneInputWithCountryCode({
  name,
  label,
  placeholder = "Ex: 07 00 00 00 00",
  disabled = false,
  required = false,
}: PhoneInputWithCountryCodeProps) {
  const { control, setValue, watch } = useFormContext();

  // Watch the full phone number field (e.g., "whatsappNumber")
  const fullPhoneNumber = watch(name);

  // Derive country code and local number from the full phone number
  const [selectedCountryCode, setSelectedCountryCode] = React.useState<string | undefined>(() => {
    if (fullPhoneNumber) {
      for (const country of africanCountries) {
        if (fullPhoneNumber.startsWith(country.dialCode)) {
          return country.code;
        }
      }
    }
    return "TG"; // Default to Togo
  });

  const [localPhoneNumber, setLocalPhoneNumber] = React.useState<string>("");

  React.useEffect(() => {
    if (fullPhoneNumber) {
      const country = africanCountries.find(c => c.code === selectedCountryCode);
      if (country && fullPhoneNumber.startsWith(country.dialCode)) {
        setLocalPhoneNumber(fullPhoneNumber.substring(country.dialCode.length));
      } else {
        // If the full number doesn't match the selected country's dial code,
        // try to find a matching country or just display the full number as local
        const matchedCountry = africanCountries.find(c => fullPhoneNumber.startsWith(c.dialCode));
        if (matchedCountry) {
          setSelectedCountryCode(matchedCountry.code);
          setLocalPhoneNumber(fullPhoneNumber.substring(matchedCountry.dialCode.length));
        } else {
          setLocalPhoneNumber(fullPhoneNumber); // Fallback
        }
      }
    } else {
      setLocalPhoneNumber("");
    }
  }, [fullPhoneNumber, selectedCountryCode]);


  const handleCountryChange = (newCountryCode: string) => {
    setSelectedCountryCode(newCountryCode);
    const country = africanCountries.find(c => c.code === newCountryCode);
    if (country && !country.enabled) {
      toast.warning(`Les numéros de ${country.name} ne sont pas encore pris en charge. Veuillez choisir Togo, Bénin ou Ghana.`);
      // Optionally reset to a supported country or clear the number
      // setSelectedCountryCode("TG");
      // setValue(name, "");
      return;
    }
    // Update the full form value
    const newDialCode = country ? country.dialCode : "";
    setValue(name, `${newDialCode}${localPhoneNumber}`, { shouldValidate: true });
  };

  const handleLocalNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocalNumber = e.target.value.replace(/\D/g, ''); // Only digits
    setLocalPhoneNumber(newLocalNumber);

    const country = africanCountries.find(c => c.code === selectedCountryCode);
    const newFullNumber = country ? `${country.dialCode}${newLocalNumber}` : newLocalNumber;
    setValue(name, newFullNumber, { shouldValidate: true });
  };

  const currentCountry = africanCountries.find(c => c.code === selectedCountryCode);

  return (
    <FormItem>
      <FormLabel>{label} {required && <span className="text-destructive">*</span>}</FormLabel>
      <div className="flex space-x-2">
        <Select
          value={selectedCountryCode}
          onValueChange={handleCountryChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-[120px] flex-shrink-0">
            <SelectValue placeholder="Pays">
              {currentCountry ? `${currentCountry.flag} ${currentCountry.dialCode}` : "Sélectionner"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {africanCountries.map((country) => (
              <SelectItem key={country.code} value={country.code} disabled={!country.enabled}>
                <span className="flex items-center">
                  {country.flag} <span className="ml-2">{country.name} ({country.dialCode})</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormControl>
          <Input
            type="tel"
            placeholder={placeholder}
            value={localPhoneNumber}
            onChange={handleLocalNumberChange}
            disabled={disabled}
            className="flex-1"
          />
        </FormControl>
      </div>
      <FormMessage />
    </FormItem>
  );
}