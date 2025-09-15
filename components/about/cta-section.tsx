export function AboutCTASection() {
  return (
    <section className="bg-primary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-primary-foreground mb-6">
          Ready to Explore Salary Data?
        </h2>
        <p className="text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
          Start your journey to better compensation insights today. 
          Explore our comprehensive salary database and make informed career decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          <a href="/" className="border border-primary-foreground text-primary-foreground px-8 py-3 rounded-md font-medium hover:bg-primary-foreground hover:text-primary transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    </section>
  );
}
