export function DataQualitySection() {
  return (
    <section className="bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Our Commitment to Data Quality
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We take data accuracy seriously and have implemented rigorous processes to ensure the information we provide is reliable.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Verified Sources</h3>
            <p className="text-sm text-muted-foreground">
              Data comes from verified employers and employees
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Regular Updates</h3>
            <p className="text-sm text-muted-foreground">
              Information is updated regularly to reflect current market conditions
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Accurate Aggregation</h3>
            <p className="text-sm text-muted-foreground">
              Statistical methods ensure reliable averages and ranges
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Global Coverage</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive data from multiple countries and regions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
