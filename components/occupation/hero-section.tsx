"use client";
import { formatCurrency } from "@/lib/format/currency";
import type { OccupationRecord } from "@/lib/data/types";
import { removeAveragePrefix } from "@/lib/utils/remove-average-cleaner";
import { getJobCategoryInfo, getJobCategory } from "./job-category-detector";

interface OccupationHeroSectionProps {
  record: OccupationRecord;
  country: string;
  locationText: string;
}

export function OccupationHeroSection({ record, country, locationText }: OccupationHeroSectionProps) {
  // Remove "Average" prefix but keep location information
  const occupationName = removeAveragePrefix(record.title || record.h1Title || record.occupation || '');
  
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

  const jobDescription = getJobDescription();
  const primaryMetrics = getPrimaryMetrics();

  // Format salary data
  const avgSalary = record.avgAnnualSalary ? formatCurrency(record.avgAnnualSalary, country, record) : null;
  const medianSalary = record["50P"] ? formatCurrency(record["50P"], country, record) : null;
  const lowSalary = record.totalPayMin ? formatCurrency(Number(record.totalPayMin), country, record) : null;
  const highSalary = record.totalPayMax ? formatCurrency(Number(record.totalPayMax), country, record) : null;

  return (
    <section 
      className="occupation-hero-section" 
      aria-labelledby="hero-heading"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          {/* Left Section - Job Details (75% width) */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
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
            <h1 id="hero-heading" itemProp="title">{occupationName}</h1>
            <p itemProp="description">{jobDescription}</p>

            {/* Primary Metrics Row */}
            {primaryMetrics.length > 0 && (
              <div className="metrics-grid" role="list" aria-label="Key salary metrics">
                {primaryMetrics.map((metric, index) => (
                  <div key={index} role="listitem" className="text-center sm:text-left">
                    <p className="metric-label">{metric.label}</p>
                    <p className="metric-value" aria-label={`${metric.label}: ${metric.value}`}>{metric.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Section - Salary Card (25% width) */}
          <div className="lg:col-span-1">
            <aside className="salary-card" aria-labelledby="salary-card-heading">
              <div className="salary-card__header">
                <div className="salary-value" itemProp="baseSalary" content={record.avgAnnualSalary?.toString()}>
                  {avgSalary || 'N/A'}
                </div>
                <p className="metric-label" id="salary-card-heading">Average Annual Salary</p>
              </div>

              <div className="salary-meta" role="list" aria-label="Salary details">
                {medianSalary && (
                  <div className="salary-meta__row" role="listitem">
                    <span className="metric-label">Median:</span>
                    <span className="metric-value" aria-label={`Median salary: ${medianSalary}`}>{medianSalary}</span>
                  </div>
                )}
                {lowSalary && highSalary && (
                  <div className="salary-meta__row" role="listitem">
                    <span className="metric-label">Range:</span>
                    <span className="metric-value" aria-label={`Salary range: ${lowSalary} to ${highSalary}`}>{lowSalary} - {highSalary}</span>
                  </div>
                )}
              </div>

              <div className="salary-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    const compensationSection = document.querySelector('[aria-labelledby="compensation-heading"]');
                    compensationSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  aria-describedby="salary-card-heading"
                >
                  View Salary Details
                </button>
                <button 
                  className="btn-icon" 
                  type="button" 
                  aria-label="Share this salary information page" 
                  title="Share this page"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `${occupationName} Salary Information`,
                        text: `Check out salary data for ${occupationName} in ${locationText}`,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span className="sr-only">Share this page</span>
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
