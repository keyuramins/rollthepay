//components/occupation/hero-section.tsx
import { formatCurrency } from "@/lib/format/currency";
import { formatCurrencyWithMillion } from "@/lib/format/million-currency";
import type { OccupationRecord } from "@/lib/data/types";
import { getJobCategoryInfo } from "./job-category-detector";
import { ShareOccupation } from "@/components/share/ShareOccupation";
import { AdSenseAd } from "../ui/adsense-ad";

interface OccupationHeroSectionProps {
  record: OccupationRecord;
  country: string;
  locationText: string;
}

export function OccupationHeroSection({ record, country, locationText }: OccupationHeroSectionProps) {
  const baseTitle =
          record.title || '';
        const atCompany = record.company_name ? ` at ${record.company_name}` : "";
        const place =
          record.location ||
          record.state ||
          (country
            ? country
                .split("-")
                .map((w: string) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
                .join(" ")
            : "");
        const inPlace = place ? ` in ${place}` : "";
  const occupationName = `${baseTitle} Salary${atCompany}${inPlace}`;
  
  // Get detailed job category information
  const jobCategoryInfo = getJobCategoryInfo(occupationName);
  const jobCategory = jobCategoryInfo.category;

  // Generate job description based on available data
  const getJobDescription = (): string => {
    const skills = [
      record.skillsNameOne,
      record.skillsNameTwo,
      record.skillsNameThree,
      record.skillsNameFour,
      record.skillsNameFive
    ].filter((skill): skill is string => Boolean(skill)).slice(0, 3);
    
    // Use the detailed category description from the new system
    if (skills.length > 0) {
      // Handle different skill count scenarios for better readability
      let skillText = '';
      if (skills.length === 1) {
        skillText = ` using ${skills[0]}`;
      } else if (skills.length === 2) {
        skillText = ` using ${skills[0]} and ${skills[1]}`;
      } else {
        // 3 or more skills
        const lastSkill = skills[skills.length - 1];
        const otherSkills = skills.slice(0, -1);
        skillText = ` using ${otherSkills.join(', ')}, and ${lastSkill}`;
      }
      
      // Ensure proper sentence structure
      const baseDescription = jobCategoryInfo.description;
      if (baseDescription.endsWith('.')) {
        return `${baseDescription.slice(0, -1)}${skillText}.`;
      } else {
        return `${baseDescription}${skillText}.`;
      }
    }
    
    // Fallback to the detailed category description
    return jobCategoryInfo.description;
  };

  // Get primary metrics (first row)
  const getPrimaryMetrics = () => {
    const metrics = [];
    
    // Hourly rate (if available)
    if (record.avgHourlySalary && record.avgHourlySalary > 0) {
      metrics.push({
        label: 'Hourly Salary',
        value: (
          <span className="metric-value">
            {formatCurrency(record.avgHourlySalary, country, record)}/hr
          </span>
        ) as unknown as string
      });
    }
        
    // Fortnightly salary (if available)
    if (record.fortnightlySalary && record.fortnightlySalary > 0) {
      metrics.push({
        label: 'Biweekly Wage',
        value: formatCurrency(record.fortnightlySalary, country, record)
      });
    }

    // Monthly salary (if available)
    if (record.monthlySalary && record.monthlySalary > 0) {
      metrics.push({
        label: 'Monthly Salary',
        value: formatCurrency(record.monthlySalary, country, record)
      });
    }
    
    // Gender distribution (if available) - show actual split
    if (record.genderMale || record.genderFemale) {
      const male = Number(record.genderMale || 0);
      const female = Number(record.genderFemale || 0);
      const total = male + female;
      
      if (total > 0) {
        metrics.push({
          label: 'Gender Distribution',
          value: `${male}% M / ${female}% F`
        });
      }
    }
    
    // Bonus potential (if any bound available)
    {
      const minRaw = record.bonusRangeMin;
      const maxRaw = record.bonusRangeMax;
//       const minBonus = typeof minRaw === 'number' ? minRaw : null;
//       const maxBonus = typeof maxRaw === 'number' ? maxRaw : null;
// console.log(minBonus, maxBonus);
//       const hasMin = minBonus != null && minBonus > 0;
//       const hasMax = maxBonus != null && maxBonus > 0;
      const minBonus = minRaw != null ? Number(minRaw) : null;
      const maxBonus = maxRaw != null ? Number(maxRaw) : null;

      const hasMin = minBonus != null && Number.isFinite(minBonus) && minBonus >= 0;
      const hasMax = maxBonus != null && Number.isFinite(maxBonus) && maxBonus >= 0;

      if (hasMin || hasMax) {
        let value: string;
        if (hasMin && hasMax) {
          value = `${formatCurrencyWithMillion(minBonus as number, country, record)} - ${formatCurrencyWithMillion(maxBonus as number, country, record)}`;
        } else if (hasMax) {
          value = `Up to ${formatCurrencyWithMillion(maxBonus as number, country, record)}`;
        } else {
          value = `From ${formatCurrencyWithMillion(minBonus as number, country, record)}`;
        }
        metrics.push({ label: 'Bonus Potential', value });
      }
    }
    
    return metrics;
  };

  const jobDescription = getJobDescription();
  const primaryMetrics = getPrimaryMetrics();

  // Format salary data with million denotation for amounts > 6 digits
  const avgSalary = record.avgAnnualSalary ? formatCurrencyWithMillion(record.avgAnnualSalary, country, record) : null;
  const medianSalary = record["50P"] ? formatCurrencyWithMillion(record["50P"], country, record) : null;
  const lowSalary = record.totalPayMin ? formatCurrencyWithMillion(Number(record.totalPayMin), country, record) : null;
  const highSalary = record.totalPayMax ? formatCurrencyWithMillion(Number(record.totalPayMax), country, record) : null;

  return (
    <section 
      className="occupation-hero-section" 
      aria-labelledby="hero-heading"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-8 items-start">
          {/* Left Section - Job Details (75% width) */}
          <div className="lg:col-span-9 space-y-4 sm:space-y-6">
            {/* Category Tags */}
            <div className="hero-badges" role="list" aria-label="Job categories and location">
              <span className="hero-badge" role="listitem">
                {jobCategory}
              </span>
              {record.location && (
                <span className="hero-badge hero-badge--location" role="listitem">
                  {record.location.split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  ).join(' ')}
                </span>
              )}
            </div>
            <h1 id="hero-heading">{occupationName}</h1>
            <p>{jobDescription}</p>

            {/* Primary Metrics Row */}
            {primaryMetrics.length > 0 && (
              <div className="grid grid-cols-12 lg:grid-cols-9 gap-2 sm:gap-2" role="list" aria-label="Key salary metrics">
                <div className="col-span-12 lg:col-span-9">
                  <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                  {primaryMetrics.map((metric, index) => {
                    const base = "text-center sm:text-left";
                    const span = metric.label === 'Bonus Potential' ? 'col-span-6 lg:col-span-3' : metric.label === 'Gender Distribution' ? 'col-span-3 sm:col-span-4 lg:col-span-3' : 'col-span-3 sm:col-span-4 lg:col-span-2';
                    return (
                      <div key={index} role="listitem" className={`${base} ${span}`}>
                        <p className="metric-label">{metric.label}</p>
                        <p className="metric-value" aria-label={`${metric.label}: ${metric.value}`}>{metric.value}</p>
                      </div>
                    );
                  })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Section - Salary Card (25% width) */}
          <div className="lg:col-span-3">
            <aside className="salary-card" aria-labelledby="salary-card-heading">
              <div className="salary-card__header">
                <div className="salary-value">
                  {avgSalary || 'N/A'}
                </div>
                <p className="metric-label" id="salary-card-heading">Average Annual Salary</p>
              </div>

              <div className="salary-meta" role="list" aria-label="Salary details">
                {medianSalary && (
                  <div className="salary-meta__row" role="listitem">
                    <span className="metric-label">Median:</span>
                    <span className="text-lg lg:text-sm xl:text-lg font-semibold text-primary" aria-label={`Median salary: ${medianSalary}`}>{medianSalary}</span>
                  </div>
                )}
                {lowSalary && highSalary && (
                  <div className="salary-meta__row" role="listitem">
                    <span className="metric-label">Range:</span>
                    <span className="text-lg lg:text-sm xl:text-lg font-semibold text-primary" aria-label={`Salary range: ${lowSalary} to ${highSalary}`}>{lowSalary} - {highSalary}</span>
                  </div>
                )}
              </div>

              <div className="salary-actions">
                <a 
                  href="#compensation-heading"
                  className="btn-secondary align-middle"
                  title="View Salary Details"
                  aria-describedby="salary-card-heading"
                >
                  View Salary Details
                </a>
                {/* <Link 
                  href="#"
                  className="btn-icon" 
                  aria-label="Share this salary information page" 
                  title="Share this page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span className="sr-only">Share this page</span>
                </Link> */}
                <ShareOccupation />
              </div>
            </aside>
          </div>
        </div>
      </div>
      {/* rtp-below-hero */}
      <AdSenseAd 
        adSlot="6512250643" 
        format="autorelaxed"
        style={{ textAlign: "center", display: "block" }}
        className="my-8 sm:my-12"
        aria-label="Advertisement"
      />
    </section>
  );
}
