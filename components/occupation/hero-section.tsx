import { formatCurrency } from "@/lib/format/currency";
import type { OccupationRecord } from "@/lib/data/types";

interface OccupationHeroSectionProps {
  record: OccupationRecord;
  country: string;
  locationText: string;
}

export function OccupationHeroSection({ record, country, locationText }: OccupationHeroSectionProps) {
  // Use original title as-is (e.g., starting with 'Average...')
  const occupationName = record.title || record.h1Title || record.occupation || '';
  
  // Determine job category based on occupation name
  const getJobCategory = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('software') || lowerName.includes('developer') || lowerName.includes('programmer')) {
      return 'Technology';
    } else if (lowerName.includes('engineer')) {
      return 'Engineering';
    } else if (lowerName.includes('manager') || lowerName.includes('director')) {
      return 'Management';
    } else if (lowerName.includes('analyst')) {
      return 'Analytics';
    } else if (lowerName.includes('designer')) {
      return 'Design';
    } else if (lowerName.includes('sales') || lowerName.includes('marketing')) {
      return 'Sales & Marketing';
    } else if (lowerName.includes('finance') || lowerName.includes('accounting')) {
      return 'Finance';
    } else if (lowerName.includes('health') || lowerName.includes('medical') || lowerName.includes('nurse')) {
      return 'Healthcare';
    } else if (lowerName.includes('teacher') || lowerName.includes('education')) {
      return 'Education';
    }
    return 'Professional';
  };

  // Generate job description based on available data
  const getJobDescription = (): string => {
    const skills = [
      record.skillsNameOne,
      record.skillsNameTwo,
      record.skillsNameThree,
      record.skillsNameFour,
      record.skillsNameFive
    ].filter(Boolean).slice(0, 3);

    if (skills.length > 0) {
      return `Design, develop, and maintain software applications and systems using ${skills.join(', ')} and related technologies.`;
    }
    
    return `Professional role in ${occupationName.toLowerCase()} with opportunities for career growth and competitive compensation.`;
  };

  // Get primary metrics (first row)
  const getPrimaryMetrics = () => {
    const metrics = [];
    
    // Hourly rate (if available)
    if (record.avgHourlySalary && record.avgHourlySalary > 0) {
      metrics.push({
        label: 'Hourly Rate',
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
        label: 'Fortnightly Salary',
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
          label: 'Gender Split',
          value: `${male}% M / ${female}% F`
        });
      }
    }
    
    // Bonus potential (if any bound available)
    {
      const minRaw = record.bonusRangeMin;
      const maxRaw = record.bonusRangeMax;
      const minBonus = typeof minRaw === 'number' ? minRaw : null;
      const maxBonus = typeof maxRaw === 'number' ? maxRaw : null;

      const hasMin = minBonus != null && minBonus > 0;
      const hasMax = maxBonus != null && maxBonus > 0;

      if (hasMin || hasMax) {
        let value: string;
        if (hasMin && hasMax) {
          value = `${formatCurrency(minBonus as number, country, record)} - ${formatCurrency(maxBonus as number, country, record)}`;
        } else if (hasMax) {
          value = `Up to ${formatCurrency(maxBonus as number, country, record)}`;
        } else {
          value = `From ${formatCurrency(minBonus as number, country, record)}`;
        }
        metrics.push({ label: 'Bonus Potential', value });
      }
    }
    
    return metrics;
  };

  const jobCategory = getJobCategory(occupationName);
  const jobDescription = getJobDescription();
  const primaryMetrics = getPrimaryMetrics();

  // Format salary data
  const avgSalary = record.avgAnnualSalary ? formatCurrency(record.avgAnnualSalary, country, record) : null;
  const medianSalary = record["50P"] ? formatCurrency(record["50P"], country, record) : null;
  const lowSalary = record.totalPayMin ? formatCurrency(Number(record.totalPayMin), country, record) : null;
  const highSalary = record.totalPayMax ? formatCurrency(Number(record.totalPayMax), country, record) : null;

  return (
    <section className="occupation-hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Section - Job Details (75% width) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Category Tags */}
            <div className="hero-badges">
              <span className="hero-badge">
                {jobCategory}
              </span>
              {record.location && (
                <span className="hero-badge hero-badge--location">
                  {record.location}
                </span>
              )}
            </div>
            <h1>{occupationName}</h1>
            <p>{jobDescription}</p>

            {/* Primary Metrics Row */}
            {primaryMetrics.length > 0 && (
              <div className="metrics-grid">
                {primaryMetrics.map((metric, index) => (
                  <div key={index}>
                    <p className="metric-label">{metric.label}</p>
                    <p className="metric-value">{metric.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Section - Salary Card (25% width) */}
          <div className="lg:col-span-1">
            <div className="salary-card">
              <div className="salary-card__header">
                <div className="salary-value">
                  {avgSalary || 'N/A'}
                </div>
                <p className="metric-label">Average Annual Salary</p>
              </div>

              <div className="salary-meta">
                {medianSalary && (
                  <div className="salary-meta__row">
                    <span className="metric-label">Median:</span>
                    <span className="metric-value">{medianSalary}</span>
                  </div>
                )}
                {lowSalary && highSalary && (
                  <div className="salary-meta__row">
                    <span className="metric-label">Range:</span>
                    <span className="metric-value">{lowSalary} - {highSalary}</span>
                  </div>
                )}
              </div>

              <div className="salary-actions">
                <button className="btn-secondary">
                  View Salary Details
                </button>
                <button className="btn-icon" type="button" aria-label="Share this page" title="Share this page">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span className="sr-only">Share this page</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
