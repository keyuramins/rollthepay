export function AboutMissionSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              RollThePay was created with a simple yet powerful goal: to provide accurate salary information 
              that helps people make informed career decisions. We believe that transparency in compensation 
              leads to better career outcomes and a more equitable workplace.
            </p>
            <p className="text-lg text-muted-foreground">
              By compiling data from thousands of employers and employees worldwide, we're building the most 
              comprehensive salary database available, organized by country, state, and job title.
            </p>
          </div>
          <div className="bg-primary/10 rounded-lg p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Transparency First</h3>
              <p className="text-muted-foreground">
                We believe everyone deserves access to accurate salary information to make informed career decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
