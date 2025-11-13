//components/occupation/top-skills-market-demand.tsx
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
    // Use actual proficiency percentage (0-100 range)
    // Ensure percentage is valid and capped at 100 for display
    const proficiency = Math.min(Math.max(skill.percentage || 0, 0), 100);

    // Derive salary impact based on actual proficiency percentage
    // Cap at 100% for display purposes
    const salaryImpact = Math.min(proficiency, 100);

    // Determine demand level based on actual proficiency (0-100 range)
    // High: >= 50%, Medium: >= 25%, Low: < 25%
    let demandLevel = 'Low Demand';
    let demandColor = 'blue';
    if (proficiency >= 50) {
      demandLevel = 'High Demand';
      demandColor = 'green';
    } else if (proficiency >= 25) {
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
      marketShare: Math.round(proficiency), // Keep marketShare name for compatibility, but use actual proficiency
      proficiency: Math.round(proficiency), // Add proficiency property for clarity
      salaryImpact: Math.round(salaryImpact),
      demandLevel,
      demandColor,
      category
    };
  });

  // Sort skills by proficiency (highest first)
  const sortedSkills = [...enhancedSkills].sort((a, b) => b.percentage - a.percentage);

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
          <div className="top-skills-market-demand__skills-list grid grid-cols-1 gap-4">
            {sortedSkills.map((skill, index) => (
              <div key={index} className="top-skills-market-demand__skill-item flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-card rounded-xl border">
                <div className="top-skills-market-demand__skill-icon flex-shrink-0">
                  {
                    /* Show icons based on the skill */
                    skill.category === 'Software' ? <CodeIcon className="top-skills-market-demand__skill-icon-svg w-5 h-5 sm:w-6 sm:h-6" /> :
                      skill.category === 'Management' ? <UserIcon className="top-skills-market-demand__skill-icon-svg w-5 h-5 sm:w-6 sm:h-6" /> :
                        skill.category === 'Accounting' ? <CalculatorIcon className="top-skills-market-demand__skill-icon-svg w-5 h-5 sm:w-6 sm:h-6" /> :
                          skill.category === 'Analysis' ? <ChartAreaIcon className="top-skills-market-demand__skill-icon-svg w-5 h-5 sm:w-6 sm:h-6" /> :
                            skill.category === 'Technical' ? <CodeIcon className="top-skills-market-demand__skill-icon-svg w-5 h-5 sm:w-6 sm:h-6" /> :
                              skill.category === 'Process' ? <FlowerIcon className="top-skills-market-demand__skill-icon-svg w-5 h-5 sm:w-6 sm:h-6" /> : <MessageCircleIcon className="top-skills-market-demand__skill-icon-svg w-5 h-5 sm:w-6 sm:h-6" />
                  }
                </div>
                <div className="top-skills-market-demand__skill-content flex-1 w-full">
                  <div className="top-skills-market-demand__skill-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h5 className="top-skills-market-demand__skill-name text-sm sm:text-base font-semibold">{skill.name}</h5>
                    <span className="top-skills-market-demand__skill-category text-xs sm:text-sm bg-secondary/30 text-black font-semibold rounded-md px-2 py-0.5">
                      {skill.category}
                    </span>
                  </div>

                  <div className="top-skills-market-demand__skill-meta flex items-center justify-between gap-2 flex-wrap mt-2">
                    <div className="top-skills-market-demand__skill-demand flex items-center gap-2">
                      <div className={`top-skills-market-demand__skill-demand-dot ${skill.demandColor === 'green' ? 'top-skills-market-demand__skill-demand-dot--green' :
                        skill.demandColor === 'orange' ? 'top-skills-market-demand__skill-demand-dot--orange' : 'top-skills-market-demand__skill-demand-dot--blue'
                        }`}></div>
                      <span className="top-skills-market-demand__skill-demand-text text-xs sm:text-sm">{skill.demandLevel}</span>
                    </div>

                    <span className="top-skills-market-demand__skill-impact text-xs sm:text-sm shrink-0">
                      +{skill.salaryImpact}% salary impact
                    </span>
                  </div>
                  <div className="top-skills-market-demand__skill-progress mt-2 h-2 sm:h-2.5 bg-muted rounded-full">
                    <div
                      className="top-skills-market-demand__skill-progress-bar h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(skill.proficiency || skill.marketShare || 0, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="top-skills-market-demand__skill-metrics mt-3 sm:mt-0 sm:self-center sm:ml-auto text-right flex-shrink-0">
                  <div className="top-skills-market-demand__skill-metrics-content">
                    <div className="metric-value text-sm sm:text-base">
                      {skill.proficiency || skill.marketShare || 0}%
                    </div>
                    <div className="metric-label text-xs sm:text-sm">
                      Proficiency
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
