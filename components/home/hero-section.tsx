import { SearchableDropdown } from "@/components/navigation/searchable-dropdown";
import { TrendingUp, Users, Globe, Shield, ArrowRight } from "lucide-react";
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
          {/* Trust Indicators */}
          <div className="hero-section__trust-indicators">
            <div className="hero-section__trust-item">
              <Shield className="hero-section__trust-icon" />
              <span>Trusted Data</span>
            </div>
            <div className="hero-section__trust-item">
              <Globe className="hero-section__trust-icon" />
              <span>Global Coverage</span>
            </div>
            <div className="hero-section__trust-item">
              <Users className="hero-section__trust-icon" />
              <span>Real Salaries</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="hero-section__title">
            Discover What Jobs Really Pay
            <span className="hero-section__title-accent"> Worldwide</span>
          </h1>
          
          <p className="hero-section__subtitle">
            Get accurate, up-to-date salary data from thousands of employers. 
            Find your worth, negotiate better, and make informed career decisions.
          </p>
        
          {/* Enhanced Search Section */}
          <div className="hero-section__search">
            <div className="hero-section__search-wrapper">
              <div className="hero-section__search-label">
                Select a country, then search by job title or a location
              </div>
              <SearchableDropdown 
                variant="light" 
                placeholder="Select a country..." 
                fullWidth={true}
                centered={true}
                className="hero-section__search-input"
                allOccupations={occupations}
              />
              <div className="hero-section__search-hint">
                <span>Start your salary research in seconds</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hero-section__quick-stats">
            <div className="hero-section__stat">
              <span className="hero-section__stat-number">1M+</span>
              <span className="hero-section__stat-label">Salary Records</span>
            </div>
            <div className="hero-section__stat">
              <span className="hero-section__stat-number">100+</span>
              <span className="hero-section__stat-label">Countries</span>
            </div>
            <div className="hero-section__stat">
              <span className="hero-section__stat-number">100%</span>
              <span className="hero-section__stat-label">Free Access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}