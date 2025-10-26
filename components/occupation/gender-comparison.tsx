// Remove "use client" and recharts imports
// components/occupation/gender-comparison.tsx

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MaleIcon from '../../app/assets/male.svg';
import FemaleIcon from '../../app/assets/female.svg';
import { removeAveragePrefix } from "@/lib/utils/remove-average-cleaner";

interface GenderComparisonProps {
  record: any;
}

export function GenderComparison({ record }: GenderComparisonProps) {
  const m = Number(record.genderMale || 0);
  const f = Number(record.genderFemale || 0);
  const total = m + f;
  const malePercentage = total > 0 ? (m / total) * 100 : 0;
  const femalePercentage = total > 0 ? (f / total) * 100 : 0;
  const dominant = f > m ? 'female' : m > f ? 'male' : 'equal';
  const role = removeAveragePrefix(record.title || record.occupation || 'this role');

  if (total === 0) {
    return null;
  }

  return (
    <section className="card-section">
      <Card>
        <CardHeader>
          <h3>Gender Distribution</h3>
          <p>Examining gender representation to understand diversity within the workforce.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visual side */}
            <div className="grid grid-cols-3 gap-20 sm:gap-6 items-center">
              <div className="flex flex-col items-center gap-2">
                <MaleIcon className="fill-accent rounded-lg w-16 h-16" />
                <span className="metric-label">Male</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="gender-chart-wrapper">
                  <svg width="200" height="200" viewBox="0 0 200 200" className="w-48 h-48">
                    {/* Background circle */}
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="20"/>
                    
                    {/* Male segment */}
                    <circle 
                      cx="100" cy="100" r="80" 
                      fill="none" 
                      stroke="var(--accent)" 
                      strokeWidth="20" 
                      strokeDasharray={`${malePercentage * 5.02} 502`} 
                      strokeDashoffset="125.5"
                      transform="rotate(-90 100 100)"
                    />
                    
                    {/* Female segment */}
                    <circle 
                      cx="100" cy="100" r="80" 
                      fill="none" 
                      stroke="var(--primary)" 
                      strokeWidth="20" 
                      strokeDasharray={`${femalePercentage * 5.02} 502`} 
                      strokeDashoffset={`${125.5 - (malePercentage * 5.02)}`}
                      transform="rotate(-90 100 100)"
                    />
                    
                    {/* Center text */}
                    <text x="100" y="100" textAnchor="middle" dominantBaseline="central" 
                          fontSize="16" fontWeight="700" fill="var(--foreground)">
                      {Math.round(malePercentage)}% / {Math.round(femalePercentage)}%
                    </text>
                  </svg>
                </div>
                
                <div className="mt-4 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-3 rounded-sm bg-primary" />
                    <span className="metric-label">Female</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-3 rounded-sm bg-accent" />
                    <span className="metric-label">Male</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <FemaleIcon className="fill-primary rounded-lg w-16 h-16" />
                <span className="metric-label">Female</span>
              </div>
            </div>

            {/* Text side - same as before */}
            <div className="space-y-4">
              <p>
                This visualization shows the current gender distribution in {role}. The data reflects real workforce composition and highlights opportunities for greater diversity and inclusion.
              </p>
              <p>
                {total > 0 && dominant === 'female' && `Women represent ${Math.round(femalePercentage)}% of the workforce in this field, while men comprise ${Math.round(malePercentage)}%.`}
                {total > 0 && dominant === 'male' && `Men represent ${Math.round(malePercentage)}% of the workforce in this field, while women comprise ${Math.round(femalePercentage)}%.`}
                {total > 0 && dominant === 'equal' && 'The workforce shows balanced representation with equal participation from both genders.'}
              </p>
              <p className="text-sm text-muted-foreground">
                Understanding these patterns helps identify areas where diversity initiatives can create more inclusive workplaces.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}