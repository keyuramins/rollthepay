import type { PuterAIGeneratedContent } from "@/lib/ai/puter-ai";

interface ContentSectionProps {
  title: string;
  content: string;
  type: 'overview' | 'insights' | 'analysis' | 'breakdown';
}

function ContentSection({ title, content, type }: ContentSectionProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'overview':
        return (
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'insights':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        );
      case 'analysis':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        );
      case 'breakdown':
        return (
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        {getIcon(type)}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
          <p className="text-foreground leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
}

interface ContentSectionsProps {
  content: PuterAIGeneratedContent;
}

export function ContentSections({ content }: ContentSectionsProps) {
  const sections = [
    {
      title: "Role Overview",
      content: content.overview,
      type: 'overview' as const
    },
    {
      title: "Salary Insights",
      content: content.salaryInsights,
      type: 'insights' as const
    },
    {
      title: "Experience Analysis",
      content: content.experienceAnalysis,
      type: 'analysis' as const
    },
    {
      title: "Skills Breakdown",
      content: content.skillsBreakdown,
      type: 'breakdown' as const
    },
    {
      title: "Career Progression",
      content: content.careerProgression,
      type: 'overview' as const
    },
    {
      title: "Market Trends",
      content: content.marketTrends,
      type: 'insights' as const
    },
    {
      title: "Location Insights",
      content: content.locationInsights,
      type: 'analysis' as const
    },
    {
      title: "Related Opportunities",
      content: content.relatedOpportunities,
      type: 'breakdown' as const
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Comprehensive Analysis
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            AI-powered insights and analysis to help you understand this role, its requirements, and career opportunities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <ContentSection
              key={index}
              title={section.title}
              content={section.content}
              type={section.type}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
