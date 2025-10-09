import { Target, Users, Globe } from "lucide-react";

const missionItems = [
  {
    icon: Target,
    title: "Know Your Worth",
    description: "Stop guessing what you should earn. Get precise salary data for your role, experience level, and location. Make confident decisions about your career and compensation."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join millions of professionals sharing real salary data. Together, we're building a more transparent job market where everyone has access to the information they need to succeed."
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description: "Compare salaries across countries and understand how location impacts compensation. Whether you're planning a move or exploring remote opportunities, we've got the data you need."
  }
];

export function MissionSection() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-12 sm:mb-16">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
          Empowering Career Decisions Through Transparency
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          We believe everyone deserves access to accurate salary information to make informed career decisions. 
          Our mission is to break down barriers and create a more transparent job market.
        </p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12 pt-12 sm:pt-16">
          {missionItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="text-center space-y-4 sm:space-y-6">
                <IconComponent className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 p-4 text-primary" />
                <h3 className="text-foreground mb-4">{item.title}</h3>
                <p className="max-w-3xl mx-auto text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
