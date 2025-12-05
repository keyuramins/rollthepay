// app/constants/continents.ts
export type Continent = {
    name: string;
    code: string;
    countries: Array<{ name: string; slug: string; code: string; continent: string; currencySymbol: string }>;
  };

  export const continents: Continent[] = [
    {
      name: "Africa",
      code: "africa",
      countries: [
        { name: "Angola", slug: "angola", code: "AO", continent: "africa", currencySymbol: "Kz" },
        { name: "Algeria", slug: "algeria", code: "DZ", continent: "africa", currencySymbol: "دج" },
        { name: "Botswana", slug: "botswana", code: "BW", continent: "africa", currencySymbol: "P" },
        { name: "Cameroon", slug: "cameroon", code: "CM", continent: "africa", currencySymbol: "XAF" },
        { name: "Ethiopia", slug: "ethiopia", code: "ET", continent: "africa", currencySymbol: "Br" },
        { name: "Ghana", slug: "ghana", code: "GH", continent: "africa", currencySymbol: "₵" },
        { name: "Kenya", slug: "kenya", code: "KE", continent: "africa", currencySymbol: "KSh" },
        { name: "Lesotho", slug: "lesotho", code: "LS", continent: "africa", currencySymbol: "L" },
        { name: "Mauritius", slug: "mauritius", code: "MU", continent: "africa", currencySymbol: "₨" },
        { name: "Morocco", slug: "morocco", code: "MA", continent: "africa", currencySymbol: "د.م." },
        { name: "Mozambique", slug: "mozambique", code: "MZ", continent: "africa", currencySymbol: "MT" },
        { name: "Namibia", slug: "namibia", code: "NA", continent: "africa", currencySymbol: "$" },
        { name: "Nigeria", slug: "nigeria", code: "NG", continent: "africa", currencySymbol: "₦" },
        { name: "Rwanda", slug: "rwanda", code: "RW", continent: "africa", currencySymbol: "RF" },
        { name: "South Africa", slug: "south-africa", code: "ZA", continent: "africa", currencySymbol: "R" },
        { name: "Swaziland", slug: "swaziland", code: "SZ", continent: "africa", currencySymbol: "E" },
        { name: "Tunisia", slug: "tunisia", code: "TN", continent: "africa", currencySymbol: "د.ت" },
        { name: "Tanzania", slug: "tanzania", code: "TZ", continent: "africa", currencySymbol: "TSh" },
        { name: "Uganda", slug: "uganda", code: "UG", continent: "africa", currencySymbol: "USh" },
        { name: "Zambia", slug: "zambia", code: "ZM", continent: "africa", currencySymbol: "ZK" },
        { name: "Zimbabwe", slug: "zimbabwe", code: "ZW", continent: "africa", currencySymbol: "$" }
      ]
    },
    {
      name: "Asia",
      code: "asia",
      countries: [
        { name: "Afghanistan", slug: "afghanistan", code: "AF", continent: "asia", currencySymbol: "؋" },
        { name: "Azerbaijan", slug: "azerbaijan", code: "AZ", continent: "asia", currencySymbol: "₼" },
        { name: "Bangladesh", slug: "bangladesh", code: "BD", continent: "asia", currencySymbol: "৳" },
        { name: "British Indian Ocean Territory", slug: "british-indian-ocean-territory", code: "IO", continent: "asia", currencySymbol: "$" },
        { name: "Brunei Darussalam", slug: "brunei-darussalam", code: "BN", continent: "asia", currencySymbol: "$" },
        { name: "Cambodia", slug: "cambodia", code: "KH", continent: "asia", currencySymbol: "៛" },
        { name: "China", slug: "china", code: "CN", continent: "asia", currencySymbol: "¥" },
        { name: "Hong Kong", slug: "hong-kong", code: "HK", continent: "asia", currencySymbol: "$" },
        { name: "India", slug: "india", code: "IN", continent: "asia", currencySymbol: "₹" },
        { name: "Indonesia", slug: "indonesia", code: "ID", continent: "asia", currencySymbol: "Rp" },
        { name: "Japan", slug: "japan", code: "JP", continent: "asia", currencySymbol: "¥" },
        { name: "Kazakhstan", slug: "kazakhstan", code: "KZ", continent: "asia", currencySymbol: "₸" },
        { name: "Korea", slug: "korea", code: "KR", continent: "asia", currencySymbol: "₩" },
        { name: "Malaysia", slug: "malaysia", code: "MY", continent: "asia", currencySymbol: "RM" },
        { name: "Myanmar", slug: "myanmar", code: "MM", continent: "asia", currencySymbol: "K" },
        { name: "Nepal", slug: "nepal", code: "NP", continent: "asia", currencySymbol: "रु" },
        { name: "Pakistan", slug: "pakistan", code: "PK", continent: "asia", currencySymbol: "₨" },
        { name: "Philippines", slug: "philippines", code: "PH", continent: "asia", currencySymbol: "₱" },
        { name: "Sri Lanka", slug: "sri-lanka", code: "LK", continent: "asia", currencySymbol: "₨" },
        { name: "Singapore", slug: "singapore", code: "SG", continent: "asia", currencySymbol: "$" },
        { name: "Thailand", slug: "thailand", code: "TH", continent: "asia", currencySymbol: "฿" },
        { name: "Taiwan", slug: "taiwan", code: "TW", continent: "asia", currencySymbol: "NT$" },
        { name: "Vietnam", slug: "vietnam", code: "VN", continent: "asia", currencySymbol: "₫" }
      ]
    },
    {
      name: "Europe",
      code: "europe",
      countries: [
        { name: "Albania", slug: "albania", code: "AL", continent: "europe", currencySymbol: "L" },
        { name: "Austria", slug: "austria", code: "AT", continent: "europe", currencySymbol: "€" },
        { name: "Belarus", slug: "belarus", code: "BY", continent: "europe", currencySymbol: "Br" },
        { name: "Belgium", slug: "belgium", code: "BE", continent: "europe", currencySymbol: "€" },
        { name: "Bulgaria", slug: "bulgaria", code: "BG", continent: "europe", currencySymbol: "лв" },
        { name: "Czech Republic", slug: "czech-republic", code: "CZ", continent: "europe", currencySymbol: "Kč" },
        { name: "Denmark", slug: "denmark", code: "DK", continent: "europe", currencySymbol: "kr" },
        { name: "Estonia", slug: "estonia", code: "EE", continent: "europe", currencySymbol: "€" },
        { name: "Finland", slug: "finland", code: "FI", continent: "europe", currencySymbol: "€" },
        { name: "France", slug: "france", code: "FR", continent: "europe", currencySymbol: "€" },
        { name: "Germany", slug: "germany", code: "DE", continent: "europe", currencySymbol: "€" },
        { name: "Gibraltar", slug: "gibraltar", code: "GI", continent: "europe", currencySymbol: "£" },
        { name: "Greece", slug: "greece", code: "GR", continent: "europe", currencySymbol: "€" },
        { name: "Hungary", slug: "hungary", code: "HU", continent: "europe", currencySymbol: "Ft" },
        { name: "Iceland", slug: "iceland", code: "IS", continent: "europe", currencySymbol: "kr" },
        { name: "Ireland", slug: "ireland", code: "IE", continent: "europe", currencySymbol: "€" },
        { name: "Italy", slug: "italy", code: "IT", continent: "europe", currencySymbol: "€" },
        { name: "Latvia", slug: "latvia", code: "LV", continent: "europe", currencySymbol: "€" },
        { name: "Lithuania", slug: "lithuania", code: "LT", continent: "europe", currencySymbol: "€" },
        { name: "Luxembourg", slug: "luxembourg", code: "LU", continent: "europe", currencySymbol: "€" },
        { name: "Malta", slug: "malta", code: "MT", continent: "europe", currencySymbol: "€" },
        { name: "Netherlands", slug: "netherlands", code: "NL", continent: "europe", currencySymbol: "€" },
        { name: "Norway", slug: "norway", code: "NO", continent: "europe", currencySymbol: "kr" },
        { name: "Poland", slug: "poland", code: "PL", continent: "europe", currencySymbol: "zł" },
        { name: "Portugal", slug: "portugal", code: "PT", continent: "europe", currencySymbol: "€" },
        { name: "Romania", slug: "romania", code: "RO", continent: "europe", currencySymbol: "lei" },
        { name: "Russia", slug: "russia", code: "RU", continent: "europe", currencySymbol: "₽" },
        { name: "Slovakia", slug: "slovakia", code: "SK", continent: "europe", currencySymbol: "€" },
        { name: "Slovenia", slug: "slovenia", code: "SI", continent: "europe", currencySymbol: "€" },
        { name: "Spain", slug: "spain", code: "ES", continent: "europe", currencySymbol: "€" },
        { name: "Sweden", slug: "sweden", code: "SE", continent: "europe", currencySymbol: "kr" },
        { name: "Switzerland", slug: "switzerland", code: "CH", continent: "europe", currencySymbol: "CHF" },
        { name: "Ukraine", slug: "ukraine", code: "UA", continent: "europe", currencySymbol: "₴" }
      ]
    },
    {
      name: "Middle East",
      code: "middle_east",
      countries: [
        { name: "Bahrain", slug: "bahrain", code: "BH", continent: "middle_east", currencySymbol: ".د.ب" },
        { name: "Cyprus", slug: "cyprus", code: "CY", continent: "middle_east", currencySymbol: "€" },
        { name: "Egypt", slug: "egypt", code: "EG", continent: "middle_east", currencySymbol: "£" },
        { name: "Iran", slug: "iran", code: "IR", continent: "middle_east", currencySymbol: "﷼" },
        { name: "Iraq", slug: "iraq", code: "IQ", continent: "middle_east", currencySymbol: "ع.د" },
        { name: "Israel", slug: "israel", code: "IL", continent: "middle_east", currencySymbol: "₪" },
        { name: "Jordan", slug: "jordan", code: "JO", continent: "middle_east", currencySymbol: "د.ا" },
        { name: "Kuwait", slug: "kuwait", code: "KW", continent: "middle_east", currencySymbol: "د.ك" },
        { name: "Lebanon", slug: "lebanon", code: "LB", continent: "middle_east", currencySymbol: "ل.ل" },
        { name: "Oman", slug: "oman", code: "OM", continent: "middle_east", currencySymbol: "ر.ع." },
        { name: "Qatar", slug: "qatar", code: "QA", continent: "middle_east", currencySymbol: "ر.ق" },
        { name: "Saudi Arabia", slug: "saudi-arabia", code: "SA", continent: "middle_east", currencySymbol: "ر.س" },
        { name: "Turkey", slug: "turkey", code: "TR", continent: "middle_east", currencySymbol: "₺" },
        { name: "United Arab Emirates", slug: "united-arab-emirates", code: "AE", continent: "middle_east", currencySymbol: "د.إ" }
      ] 
    },
    {
      name: "North America",
      code: "north_america",
      countries: [
        { name: "Bahamas", slug: "bahamas", code: "BS", continent: "north_america", currencySymbol: "$" },
        { name: "Barbados", slug: "barbados", code: "BB", continent: "north_america", currencySymbol: "$" },
        { name: "Belize", slug: "belize", code: "BZ", continent: "north_america", currencySymbol: "$" },
        { name: "Bermuda", slug: "bermuda", code: "BM", continent: "north_america", currencySymbol: "$" },
        { name: "Canada", slug: "canada", code: "CA", continent: "north_america", currencySymbol: "$" },
        { name: "Dominican Republic", slug: "dominican-republic", code: "DO", continent: "north_america", currencySymbol: "$" },
        { name: "Guatemala", slug: "guatemala", code: "GT", continent: "north_america", currencySymbol: "Q" },
        { name: "Guyana", slug: "guyana", code: "GY", continent: "north_america", currencySymbol: "$" },
        { name: "Honduras", slug: "honduras", code: "HN", continent: "north_america", currencySymbol: "L" },
        { name: "Jamaica", slug: "jamaica", code: "JM", continent: "north_america", currencySymbol: "J$" },
        { name: "Mexico", slug: "mexico", code: "MX", continent: "north_america", currencySymbol: "$" },
        { name: "Puerto Rico", slug: "puerto-rico", code: "PR", continent: "north_america", currencySymbol: "$" },
        { name: "Saint Lucia", slug: "saint-lucia", code: "LC", continent: "north_america", currencySymbol: "$" },
        { name: "Trinidad and Tobago", slug: "trinidad-and-tobago", code: "TT", continent: "north_america", currencySymbol: "TT$" }
      ]
    },
    {
      name: "Oceania",
      code: "oceania",
      countries: [
        { name: "Australia", slug: "australia", code: "AU", continent: "oceania", currencySymbol: "$" },
        { name: "Fiji", slug: "fiji", code: "FJ", continent: "oceania", currencySymbol: "$" },
        { name: "Guam", slug: "guam", code: "GU", continent: "oceania", currencySymbol: "$" },
        { name: "New Zealand", slug: "new-zealand", code: "NZ", continent: "oceania", currencySymbol: "$" },
        { name: "Papua New Guinea", slug: "papua-new-guinea", code: "PG", continent: "oceania", currencySymbol: "K" }
      ]
    },
    {
      name: "South America",
      code: "south_america",
      countries: [
        { name: "Argentina", slug: "argentina", code: "AR", continent: "south_america", currencySymbol: "$" },
        { name: "Bolivia", slug: "bolivia", code: "BO", continent: "south_america", currencySymbol: "Bs." },
        { name: "Brazil", slug: "brazil", code: "BR", continent: "south_america", currencySymbol: "R$" },
        { name: "Chile", slug: "chile", code: "CL", continent: "south_america", currencySymbol: "$" },
        { name: "Colombia", slug: "colombia", code: "CO", continent: "south_america", currencySymbol: "$" },
        { name: "Ecuador", slug: "ecuador", code: "EC", continent: "south_america", currencySymbol: "$" },
        { name: "Peru", slug: "peru", code: "PE", continent: "south_america", currencySymbol: "S/." },
        { name: "Uruguay", slug: "uruguay", code: "UY", continent: "south_america", currencySymbol: "$" },
        { name: "Venezuela", slug: "venezuela", code: "VE", continent: "south_america", currencySymbol: "Bs.S" } 
      ]
    }
  ];
  
  export const CONTINENTS = continents.map(({ name, code }) => ({ name, code }));