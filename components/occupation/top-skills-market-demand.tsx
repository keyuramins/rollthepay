"use client";

import { useMemo } from "react";
import {
  AwardIcon,
  MessageCircleIcon,
  CodeIcon,
  UserIcon,
  CalculatorIcon,
  ChartAreaIcon,
  FlowerIcon
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";

interface TopSkillsMarketDemandProps {
  record: any;
}


export function TopSkillsMarketDemand({ record }: TopSkillsMarketDemandProps) {

  // Helper function to check if value exists and is not #REF! or invalid
  const isValidValue = (value: any) => {
    if (!value || value === '#REF!' || value === '' || value === '0' || value === '00') return false;
    const numValue = Number(value);
    return !isNaN(numValue) && numValue > 0;
  };

  // Skills data (include percentage with proper key)
  const skills = [
    { name: record.skillsNameOne, value: record.skillsNamePercOne || 0, percentage: record.skillsNamePercOne, color: '#0088FE' },
    { name: record.skillsNameTwo, value: record.skillsNamePercTwo || 0, percentage: record.skillsNamePercTwo, color: '#00C49F' },
    { name: record.skillsNameThree, value: record.skillsNamePercThree || 0, percentage: record.skillsNamePercThree, color: '#FFBB28' },
    { name: record.skillsNameFour, value: record.skillsNamePercFour || 0, percentage: record.skillsNamePercFour, color: '#FF8042' },
    { name: record.skillsNameFive, value: record.skillsNamePercFive || 0, percentage: record.skillsNamePercFive, color: '#8884D8' },
    { name: record.skillsNameSix, value: record.skillsNamePercSix || 0, percentage: record.skillsNamePercSix, color: '#FFC300' },
    { name: record.skillsNameSeven, value: record.skillsNamePercSeven || 0, percentage: record.skillsNamePercSeven, color: '#FF5733' },
    { name: record.skillsNameEight, value: record.skillsNamePercEight || 0, percentage: record.skillsNamePercEight, color: '#33FF57' },
    { name: record.skillsNameNine, value: record.skillsNamePercNine || 0, percentage: record.skillsNamePercNine, color: '#3357FF' },
    { name: record.skillsNameTen, value: record.skillsNamePercTen || 0, percentage: record.skillsNamePercTen, color: '#FF33A1' },
    { name: record.skillsNameEleven, value: record.skillsNamePercEleven || 0, percentage: record.skillsNamePercEleven, color: '#FF33A1' },
    { name: record.skillsNameTwelve, value: record.skillsNamePercTwelve || 0, percentage: record.skillsNamePercTwelve, color: '#FF33A1' },
    { name: record.skillsNameThirteen, value: record.skillsNamePercThirteen || 0, percentage: record.skillsNamePercThirteen, color: '#FF33A1' },
    { name: record.skillsNameFourteen, value: record.skillsNamePercFourteen || 0, percentage: record.skillsNamePercFourteen, color: '#FF33A1' },
    { name: record.skillsNameFifteen, value: record.skillsNamePercFifteen || 0, percentage: record.skillsNamePercFifteen, color: '#FF33A1' },
    { name: record.skillsNameSixteen, value: record.skillsNamePercSixteen || 0, percentage: record.skillsNamePercSixteen, color: '#FF33A1' },
    { name: record.skillsNameSeventeen, value: record.skillsNamePercSeventeen || 0, percentage: record.skillsNamePercSeventeen, color: '#FF33A1' },
  ]
    .filter(skill => skill.name && skill.name !== '#REF!' && skill.value > 0)
    .map(skill => ({
      name: skill.name!,
      value: skill.value,
      percentage: skill.percentage,
      color: skill.color
    }));

  if (skills.length === 0) {
    return null;
  }

  // Enhanced skills data with market demand analysis
  const enhancedSkills = skills.map((skill, index) => {
    // Derive market share from proficiency percentage
    const marketShare = Math.min(skill.percentage * 1.2, 30); // Cap at 30%

    // Derive salary impact based on skill importance
    const salaryImpact = Math.min(skill.percentage * 0.6, 20); // Cap at 20%

    // Determine demand level based on market share
    let demandLevel = 'Low Demand';
    let demandColor = 'blue';
    if (marketShare >= 20) {
      demandLevel = 'High Demand';
      demandColor = 'green';
    } else if (marketShare >= 10) {
      demandLevel = 'Medium Demand';
      demandColor = 'orange';
    }

    // Determine skill category based on skill name - more comprehensive detection
    let category = 'Technical';
    const skillName = skill.name.toLowerCase();

    // Software & Programming
    if (skillName.includes('programming') || skillName.includes('software') || skillName.includes('development') ||
      skillName.includes('coding') || skillName.includes('api') || skillName.includes('framework') ||
      skillName.includes('javascript') || skillName.includes('python') || skillName.includes('java') ||
      skillName.includes('c#') || skillName.includes('c++') || skillName.includes('php') ||
      skillName.includes('react') || skillName.includes('angular') || skillName.includes('vue') ||
      skillName.includes('node') || skillName.includes('sql') || skillName.includes('database') ||
      skillName.includes('mvc') || skillName.includes('microsoft') || skillName.includes('server')) {
      category = 'Software';
    }
    // Management & Leadership
    else if (skillName.includes('management') || skillName.includes('leadership') || skillName.includes('supervision') ||
      skillName.includes('team') || skillName.includes('project') || skillName.includes('budget') ||
      skillName.includes('planning') || skillName.includes('strategy') || skillName.includes('coordination')) {
      category = 'Management';
    }
    // Accounting & Finance
    else if (skillName.includes('accounting') || skillName.includes('financial') || skillName.includes('finance') ||
      skillName.includes('ledger') || skillName.includes('bookkeeping') || skillName.includes('audit') ||
      skillName.includes('tax') || skillName.includes('payroll') || skillName.includes('billing') ||
      skillName.includes('invoice') || skillName.includes('revenue') || skillName.includes('expense')) {
      category = 'Accounting';
    }
    // Analysis & Data
    else if (skillName.includes('analysis') || skillName.includes('analytics') || skillName.includes('modeling') ||
      skillName.includes('data') || skillName.includes('reporting') || skillName.includes('forecasting') ||
      skillName.includes('statistics') || skillName.includes('metrics') || skillName.includes('kpi') ||
      skillName.includes('dashboard') || skillName.includes('visualization') || skillName.includes('research')) {
      category = 'Analysis';
    }
    // Process & Operations
    else if (skillName.includes('process') || skillName.includes('operations') || skillName.includes('workflow') ||
      skillName.includes('procedure') || skillName.includes('close') || skillName.includes('month') ||
      skillName.includes('quarterly') || skillName.includes('compliance') || skillName.includes('quality') ||
      skillName.includes('efficiency') || skillName.includes('optimization') || skillName.includes('automation')) {
      category = 'Process';
    }
    // Communication & Customer Service
    else if (skillName.includes('communication') || skillName.includes('customer') || skillName.includes('service') ||
      skillName.includes('support') || skillName.includes('presentation') || skillName.includes('training') ||
      skillName.includes('documentation') || skillName.includes('writing') || skillName.includes('verbal')) {
      category = 'Communication';
    }

    return {
      ...skill,
      marketShare: Math.round(marketShare),
      salaryImpact: Math.round(salaryImpact),
      demandLevel,
      demandColor,
      category
    };
  });

  // Sort skills by proficiency (highest first)
  const sortedSkills = useMemo(() => {
    return [...enhancedSkills].sort((a, b) => b.percentage - a.percentage);
  }, [enhancedSkills]);

  return (
    <section className="card-section">
      <Card>
        <CardHeader>
          <h3>Top Skills & Market Demand</h3>
          <p>Most in-demand skills with proficiency levels and salary impact analysis</p>
        </CardHeader>
        <CardContent>
          {/* Skills Analysis Section */}
          <div className="top-skills-market-demand__header">
            <AwardIcon className="top-skills-market-demand__header-icon" />
            <h4>Skills Analysis ({sortedSkills.length} skills)</h4>
          </div>
          <div className="top-skills-market-demand__skills-list">
            {sortedSkills.map((skill, index) => (
              <div key={index} className="top-skills-market-demand__skill-item">
                <div className="top-skills-market-demand__skill-icon">
                  {
                    /* Show icons based on the skill */
                    skill.category === 'Software' ? <CodeIcon className="top-skills-market-demand__skill-icon-svg" /> :
                      skill.category === 'Management' ? <UserIcon className="top-skills-market-demand__skill-icon-svg" /> :
                        skill.category === 'Accounting' ? <CalculatorIcon className="top-skills-market-demand__skill-icon-svg" /> :
                          skill.category === 'Analysis' ? <ChartAreaIcon className="top-skills-market-demand__skill-icon-svg" /> :
                            skill.category === 'Technical' ? <CodeIcon className="top-skills-market-demand__skill-icon-svg" /> :
                              skill.category === 'Process' ? <FlowerIcon className="top-skills-market-demand__skill-icon-svg" /> :
                                skill.category === 'Communication' ? <MessageCircleIcon className="top-skills-market-demand__skill-icon-svg" /> : <CodeIcon className="top-skills-market-demand__skill-icon-svg" />
                  }
                </div>
                <div className="top-skills-market-demand__skill-content">
                  <div className="top-skills-market-demand__skill-header">
                    <h5 className="top-skills-market-demand__skill-name">{skill.name}</h5>
                    <span className="top-skills-market-demand__skill-category">
                      {skill.category}
                    </span>
                  </div>

                  <div className="top-skills-market-demand__skill-meta">
                    <div className="top-skills-market-demand__skill-demand">
                      <div className={`top-skills-market-demand__skill-demand-dot ${skill.demandColor === 'green' ? 'top-skills-market-demand__skill-demand-dot--green' :
                        skill.demandColor === 'orange' ? 'top-skills-market-demand__skill-demand-dot--orange' : 'top-skills-market-demand__skill-demand-dot--blue'
                        }`}></div>
                      <span className="top-skills-market-demand__skill-demand-text">{skill.demandLevel}</span>
                    </div>

                    <span className="top-skills-market-demand__skill-impact">
                      +{skill.salaryImpact}% salary impact
                    </span>
                  </div>
                  <div className="top-skills-market-demand__skill-progress">
                    <div
                      className="top-skills-market-demand__skill-progress-bar"
                      style={{ width: `${(skill.marketShare / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="top-skills-market-demand__skill-metrics">
                  <div className="top-skills-market-demand__skill-metrics-content">
                    <div className="top-skills-market-demand__skill-metrics-value">
                      {skill.marketShare}%
                    </div>
                    <div className="top-skills-market-demand__skill-metrics-label">
                      Market Share
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
