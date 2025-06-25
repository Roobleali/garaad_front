export interface LocationData {
  country: string;
  countryCode: string;
  region?: string;
  city?: string;
}

export type PaymentMethod = "stripe" | "waafipay";

export class LocationService {
  private static instance: LocationService;
  private locationData: LocationData | null = null;

  private constructor() {}

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async getUserLocation(): Promise<LocationData | null> {
    if (this.locationData) {
      return this.locationData;
    }

    try {
      // Use a free geolocation API
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      this.locationData = {
        country: data.country_name,
        countryCode: data.country_code,
        region: data.region,
        city: data.city,
      };

      console.log("User location detected:", this.locationData);
      return this.locationData;
    } catch (error) {
      console.error("Error detecting user location:", error);

      // Fallback: Try to detect from browser language/timezone
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Simple fallback based on timezone
        if (timezone.includes("America")) {
          this.locationData = {
            country: "🇺🇸 Maraykan",
            countryCode: "US",
          };
        } else if (timezone.includes("Europe")) {
          this.locationData = {
            country: "🇬🇧 Ingiriiska",
            countryCode: "GB",
          };
        } else if (timezone.includes("Asia")) {
          this.locationData = {
            country: "🇮🇳 Hindiya",
            countryCode: "IN",
          };
        } else {
          // Default to Somalia for other regions
          this.locationData = {
            country: "🇸🇴 Soomaaliya",
            countryCode: "SO",
          };
        }

        console.log("Fallback location detected:", this.locationData);
        return this.locationData;
      } catch (fallbackError) {
        console.error("Fallback location detection failed:", fallbackError);
        return null;
      }
    }
  }

  getRecommendedPaymentMethod(countryCode: string): PaymentMethod {
    const upperCountryCode = countryCode.toUpperCase();

    // Somalia - use WaafiPay
    if (upperCountryCode === "SO") {
      return "waafipay";
    }

    // EU countries - use Stripe
    const euCountries = [
      "AT",
      "BE",
      "BG",
      "HR",
      "CY",
      "CZ",
      "DK",
      "EE",
      "FI",
      "FR",
      "DE",
      "GR",
      "HU",
      "IE",
      "IT",
      "LV",
      "LT",
      "LU",
      "MT",
      "NL",
      "PL",
      "PT",
      "RO",
      "SK",
      "SI",
      "ES",
      "SE",
    ];
    if (euCountries.includes(upperCountryCode)) {
      return "stripe";
    }

    // US and Canada - use Stripe
    if (["US", "CA"].includes(upperCountryCode)) {
      return "stripe";
    }

    // Asia Pacific countries - use Stripe
    const asiaPacificCountries = [
      "AU",
      "NZ",
      "JP",
      "KR",
      "SG",
      "MY",
      "TH",
      "VN",
      "ID",
      "PH",
      "IN",
      "HK",
      "TW",
    ];
    if (asiaPacificCountries.includes(upperCountryCode)) {
      return "stripe";
    }

    // UK - use Stripe
    if (upperCountryCode === "GB") {
      return "stripe";
    }

    // Default to WaafiPay for other countries (mainly Africa)
    return "waafipay";
  }

  getCountryDisplayName(countryCode: string): string {
    const countryNames: Record<string, string> = {
      SO: "🇸🇴 Soomaaliya",
      US: "🇺🇸 Maraykan",
      CA: "🇨🇦 Kanada",
      GB: "🇬🇧 Ingiriiska",
      AU: "🇦🇺 Australia",
      NZ: "🇳🇿 New Zealand",
      JP: "🇯🇵 Japan",
      KR: "🇰🇷 Koonfurta Kuuriya",
      SG: "🇸🇬 Singapore",
      MY: "🇲🇾 Malaysia",
      TH: "🇹🇭 Thailand",
      VN: "🇻🇳 Vietnam",
      ID: "🇮🇩 Indonesia",
      PH: "🇵🇭 Philippines",
      IN: "🇮🇳 Hindiya",
      HK: "🇭🇰 Hong Kong",
      TW: "🇹🇼 Taiwan",
      DE: "🇩🇪 Jarmalka",
      FR: "🇫🇷 Faransiiska",
      IT: "🇮🇹 Talyaaniga",
      ES: "🇪🇸 Isbeyn",
      NL: "🇳🇱 Holland",
      BE: "🇧🇪 Belgium",
      AT: "🇦🇹 Austria",
      CH: "🇨🇭 Switzerland",
      SE: "🇸🇪 Sweden",
      NO: "🇳🇴 Norway",
      DK: "🇩🇰 Denmark",
      FI: "🇫🇮 Finland",
      PL: "🇵🇱 Poland",
      CZ: "🇨🇿 Czech Republic",
      HU: "🇭🇺 Hungary",
      RO: "🇷🇴 Romania",
      BG: "🇧🇬 Bulgaria",
      HR: "🇭🇷 Croatia",
      SI: "🇸🇮 Slovenia",
      SK: "🇸🇰 Slovakia",
      LT: "🇱🇹 Lithuania",
      LV: "🇱🇻 Latvia",
      EE: "🇪🇪 Estonia",
      IE: "🇮🇪 Ireland",
      PT: "🇵🇹 Portugal",
      GR: "🇬🇷 Greece",
      CY: "🇨🇾 Cyprus",
      MT: "🇲🇹 Malta",
      LU: "🇱🇺 Luxembourg",
      KE: "🇰🇪 Kenya",
      NG: "🇳🇬 Nigeria",
      ZA: "🇿🇦 Koonfurta Afrika",
      EG: "🇪🇬 Masar",
      MA: "🇲🇦 Morocco",
      TN: "🇹🇳 Tunisia",
      DZ: "🇩🇿 Algeria",
      ET: "🇪🇹 Itoobiya",
      UG: "🇺🇬 Uganda",
      TZ: "🇹🇿 Tanzania",
      GH: "🇬🇭 Ghana",
      CI: "🇨🇮 Ivory Coast",
      SN: "🇸🇳 Senegal",
      ML: "🇲🇱 Mali",
      BF: "🇧🇫 Burkina Faso",
      NE: "🇳🇪 Niger",
      TD: "🇹🇩 Chad",
      SD: "🇸🇩 Sudan",
      LY: "🇱🇾 Libya",
      CM: "🇨🇲 Cameroon",
      CF: "🇨🇫 Central African Republic",
      CG: "🇨🇬 Republic of the Congo",
      CD: "🇨🇩 Democratic Republic of the Congo",
      AO: "🇦🇴 Angola",
      ZM: "🇿🇲 Zambia",
      ZW: "🇿🇼 Zimbabwe",
      BW: "🇧🇼 Botswana",
      NA: "🇳🇦 Namibia",
      SZ: "🇸🇿 Eswatini",
      LS: "🇱🇸 Lesotho",
      MG: "🇲🇬 Madagascar",
      MU: "🇲🇺 Mauritius",
      SC: "🇸🇨 Seychelles",
      DJ: "🇩🇯 Djibouti",
      ER: "🇪🇷 Eritrea",
      SS: "🇸🇸 Koonfurta Sudan",
      RW: "🇷🇼 Rwanda",
      BI: "🇧🇮 Burundi",
      MW: "🇲🇼 Malawi",
      MZ: "🇲🇿 Mozambique",
    };

    return (
      countryNames[countryCode.toUpperCase()] || `${countryCode.toUpperCase()}`
    );
  }

  getPaymentMethodDescription(
    method: PaymentMethod,
    countryName: string
  ): string {
    switch (method) {
      case "stripe":
        return `KU Bixi Credit card / Bank `;
      case "waafipay":
        return `Ku Bix EVC / ZAAD / SAHAL`;
      default:
        return "Dooro habka bixinta aad rabto";
    }
  }
}

export default LocationService;
