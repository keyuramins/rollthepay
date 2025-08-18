interface ExperienceLevel {
  label: string;
  value: string;
  color: string;
}

interface ExperienceLevelsSectionProps {
  experienceLevels: ExperienceLevel[];
}

export function ExperienceLevelsSection({ experienceLevels }: ExperienceLevelsSectionProps) {
  if (experienceLevels.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Salary by Experience Level
        </h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experienceLevels.map((level) => (
            <div key={level.label} className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{level.label}</h3>
              <div className="text-2xl font-bold text-blue-600">
                {level.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
