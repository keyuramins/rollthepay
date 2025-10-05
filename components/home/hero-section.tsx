import { SearchableDropdown } from "@/components/navigation/searchable-dropdown";
import { TrendingUp } from "lucide-react";
import { getDataset } from "@/lib/data/parse";

export async function HeroSection() {
  const { all } = await getDataset();
  const occupations = all.map(rec => ({
    country: rec.country.toLowerCase(),
    title: rec.title,
    slug: rec.slug_url,
    state: rec.state ? rec.state : null,
    location: rec.location ? rec.location : null,
  }));
  return (
    <section className="hero-section">
      <div className="hero-section__background"></div>
      <div className="hero-section__content">
        <div className="hero-section__inner">
          {/* Logo and Brand */}
          <div className="hero-section__logo">
            <TrendingUp className="hero-section__logo-icon" />
          </div>
          
          <h1 className="hero-section__title">
            RollThePay
          </h1>
          
          <p className="hero-section__subtitle">
            Get accurate salary insights from thousands of employers worldwide 
          </p>
        
          {/* Search Section - Prominent and Centered */}
          <div className="hero-section__search">
            <div className="hero-section__search-wrapper">
              <SearchableDropdown 
                variant="light" 
                placeholder="Search countries..." 
                fullWidth={true}
                centered={true}
                className="hero-section__search-input"
                allOccupations={occupations}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}