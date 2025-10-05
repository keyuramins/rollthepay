// src/constants/continents.ts

export type Continent = {
    name: string;
    code: string;
    countries: Array<{ name: string; slug: string; code: string; continent: string }>;
  };

  export const continents: Continent[] = [
    {
      name: "Africa",
      code: "africa",
      countries: [
        { name: "Angola", slug: "angola", code: "AO", continent: "africa" },
        { name: "Algeria", slug: "algeria", code: "DZ", continent: "africa" },
        { name: "Botswana", slug: "botswana", code: "BW", continent: "africa" },
        { name: "Cameroon", slug: "cameroon", code: "CM", continent: "africa" },
        { name: "Egypt", slug: "egypt", code: "EG", continent: "africa" },
        { name: "Ghana", slug: "ghana", code: "GH", continent: "africa" },
        { name: "Kenya", slug: "kenya", code: "KE", continent: "africa" },
        { name: "Mauritius", slug: "mauritius", code: "MU", continent: "africa" },
        { name: "Morocco", slug: "morocco", code: "MA", continent: "africa" },
        { name: "Mozambique", slug: "mozambique", code: "MZ", continent: "africa" },
        { name: "Namibia", slug: "namibia", code: "NA", continent: "africa" },
        { name: "Nigeria", slug: "nigeria", code: "NG", continent: "africa" },
        { name: "Swaziland", slug: "swaziland", code: "SZ", continent: "africa" },
        { name: "Tunisia", slug: "tunisia", code: "TN", continent: "africa" },
        { name: "Tanzania", slug: "tanzania", code: "TZ", continent: "africa" },
        { name: "Uganda", slug: "uganda", code: "UG", continent: "africa" },
        { name: "Zambia", slug: "zambia", code: "ZM", continent: "africa" },
        { name: "Zimbabwe", slug: "zimbabwe", code: "ZW", continent: "africa" }
      ]
    },
    {
      name: "Asia",
      code: "asia",
      countries: [
        { name: "Afghanistan", slug: "afghanistan", code: "AF", continent: "asia" },
        { name: "Azerbaijan", slug: "azerbaijan", code: "AZ", continent: "asia" },
        { name: "Bahrain", slug: "bahrain", code: "BH", continent: "asia" },
        { name: "Bangladesh", slug: "bangladesh", code: "BD", continent: "asia" },
        { name: "British Indian Ocean Territory", slug: "british-indian-ocean-territory", code: "IO", continent: "asia" },
        { name: "Cambodia", slug: "cambodia", code: "KH", continent: "asia" },
        { name: "China", slug: "china", code: "CN", continent: "asia" },
        { name: "Hong Kong", slug: "hong-kong", code: "HK", continent: "asia" },
        { name: "India", slug: "india", code: "IN", continent: "asia" },
        { name: "Iran", slug: "iran", code: "IR", continent: "asia" },
        { name: "Iraq", slug: "iraq", code: "IQ", continent: "asia" },
        { name: "Israel", slug: "israel", code: "IL", continent: "asia" },
        { name: "Japan", slug: "japan", code: "JP", continent: "asia" },
        { name: "Jordan", slug: "jordan", code: "JO", continent: "asia" },
        { name: "Kazakhstan", slug: "kazakhstan", code: "KZ", continent: "asia" },
        { name: "Korea", slug: "korea", code: "KR", continent: "asia" },
        { name: "Kuwait", slug: "kuwait", code: "KW", continent: "asia" },
        { name: "Lebanon", slug: "lebanon", code: "LB", continent: "asia" },
        { name: "Malaysia", slug: "malaysia", code: "MY", continent: "asia" },
        { name: "Myanmar", slug: "myanmar", code: "MM", continent: "asia" },
        { name: "Nepal", slug: "nepal", code: "NP", continent: "asia" },
        { name: "Oman", slug: "oman", code: "OM", continent: "asia" },
        { name: "Pakistan", slug: "pakistan", code: "PK", continent: "asia" },
        { name: "Qatar", slug: "qatar", code: "QA", continent: "asia" },
        { name: "Philippines", slug: "philippines", code: "PH", continent: "asia" },
        { name: "Saudi Arabia", slug: "saudi-arabia", code: "SA", continent: "asia" },
        { name: "Sri Lanka", slug: "sri-lanka", code: "LK", continent: "asia" },
        { name: "Singapore", slug: "singapore", code: "SG", continent: "asia" },
        { name: "Brunei Darussalam", slug: "brunei-darussalam", code: "BN", continent: "asia" },
        { name: "Thailand", slug: "thailand", code: "TH", continent: "asia" },
        { name: "Turkey", slug: "turkey", code: "TR", continent: "asia" },
        { name: "Taiwan", slug: "taiwan", code: "TW", continent: "asia" },
        { name: "Vietnam", slug: "vietnam", code: "VN", continent: "asia" }
      ]
    },
    {
      name: "Europe",
      code: "europe",
      countries: [
        { name: "Albania", slug: "albania", code: "AL", continent: "europe" },
        { name: "Austria", slug: "austria", code: "AT", continent: "europe" },
        { name: "Belarus", slug: "belarus", code: "BY", continent: "europe" },
        { name: "Belgium", slug: "belgium", code: "BE", continent: "europe" },
        { name: "Bulgaria", slug: "bulgaria", code: "BG", continent: "europe" },
        { name: "Cyprus", slug: "cyprus", code: "CY", continent: "europe" },
        { name: "Czech Republic", slug: "czech-republic", code: "CZ", continent: "europe" },
        { name: "Denmark", slug: "denmark", code: "DK", continent: "europe" },
        { name: "Estonia", slug: "estonia", code: "EE", continent: "europe" },
        { name: "Finland", slug: "finland", code: "FI", continent: "europe" },
        { name: "France", slug: "france", code: "FR", continent: "europe" },
        { name: "Germany", slug: "germany", code: "DE", continent: "europe" },
        { name: "Gibraltar", slug: "gibraltar", code: "GI", continent: "europe" },
        { name: "Greece", slug: "greece", code: "GR", continent: "europe" },
        { name: "Hungary", slug: "hungary", code: "HU", continent: "europe" },
        { name: "Italy", slug: "italy", code: "IT", continent: "europe" },
        { name: "Latvia", slug: "latvia", code: "LV", continent: "europe" },
        { name: "Lithuania", slug: "lithuania", code: "LT", continent: "europe" },
        { name: "Luxembourg", slug: "luxembourg", code: "LU", continent: "europe" },
        { name: "Malta", slug: "malta", code: "MT", continent: "europe" },
        { name: "Netherlands", slug: "netherlands", code: "NL", continent: "europe" },
        { name: "Norway", slug: "norway", code: "NO", continent: "europe"  },
        { name: "Poland", slug: "poland", code: "PL", continent: "europe" },
        { name: "Portugal", slug: "portugal", code: "PT", continent: "europe" },
        { name: "Romania", slug: "romania", code: "RO", continent: "europe" },
        { name: "Russia", slug: "russia", code: "RU", continent: "europe" },
        { name: "Slovakia", slug: "slovakia", code: "SK", continent: "europe" },
        { name: "Slovenia", slug: "slovenia", code: "SI", continent: "europe" },
        { name: "Sweden", slug: "sweden", code: "SE", continent: "europe" },
        { name: "Switzerland", slug: "switzerland", code: "CH", continent: "europe" },
        { name: "Ukraine", slug: "ukraine", code: "UA", continent: "europe" }
      ]
    },
    {
      name: "Middle East",
      code: "middle_east",
      countries: [
        { name: "United Arab Emirates", slug: "united-arab-emirates", code: "AE", continent: "middle_east" }
      ]
    },
    {
      name: "North America",
      code: "north_america",
      countries: [
        { name: "Barbados", slug: "barbados", code: "BB", continent: "north_america" },
        { name: "Belize", slug: "belize", code: "BZ", continent: "north_america" },
        { name: "Bermuda", slug: "bermuda", code: "BM", continent: "north_america" },
        { name: "Costa Rica", slug: "costa-rica", code: "CR", continent: "north_america" },
        { name: "Jamaica", slug: "jamaica", code: "JM", continent: "north_america" },
        { name: "Guatemala", slug: "guatemala", code: "GT", continent: "north_america" },
        { name: "Dominican Republic", slug: "dominican-republic", code: "DO", continent: "north_america" },
        { name: "Puerto Rico", slug: "puerto-rico", code: "PR", continent: "north_america" },
        { name: "Canada", slug: "canada", code: "CA", continent: "north_america" },
        { name: "Mexico", slug: "mexico", code: "MX", continent: "north_america" }
      ]
    },
    {
      name: "Oceania",
      code: "oceania",
      countries: [
        { name: "Australia", slug: "australia", code: "AU", continent: "oceania" },
        { name: "Fiji", slug: "fiji", code: "FJ", continent: "oceania" },
        { name: "Guam", slug: "guam", code: "GU", continent: "oceania" },
        { name: "Papua New Guinea", slug: "papua-new-guinea", code: "PG", continent: "oceania" },
        { name: "New Zealand", slug: "new-zealand", code: "NZ", continent: "oceania" }
      ]
    },
    {
      name: "South America",
      code: "south_america",
      countries: [
        { name: "Brazil", slug: "brazil", code: "BR", continent: "south_america" },
        { name: "Argentina", slug: "argentina", code: "AR", continent: "south_america" },
        { name: "Chile", slug: "chile", code: "CL", continent: "south_america" },
        { name: "Colombia", slug: "colombia", code: "CO", continent: "south_america" },
        { name: "Peru", slug: "peru", code: "PE", continent: "south_america" },
        { name: "Venezuela", slug: "venezuela", code: "VE", continent: "south_america" },
        { name: "Ecuador", slug: "ecuador", code: "EC", continent: "south_america" },
        { name: "Bolivia", slug: "bolivia", code: "BO", continent: "south_america" },
        { name: "Paraguay", slug: "paraguay", code: "PY", continent: "south_america" },
        { name: "Uruguay", slug: "uruguay", code: "UY", continent: "south_america" }
      ]
    }
  ];
  
  export const CONTINENTS = continents.map(({ name, code }) => ({ name, code }));