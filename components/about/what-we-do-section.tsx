export function WhatWeDoSection() {
  return (
    <section className="bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            What We Do
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We collect, organize, and present salary data in an easy-to-understand format, 
            helping you navigate the complex world of compensation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Data Collection</h3>
            <p className="text-muted-foreground">
              We gather salary information from thousands of employers and employees across different industries and locations.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Data Analysis</h3>
            <p className="text-muted-foreground">
              Our team analyzes and validates the data to ensure accuracy and provide meaningful insights.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Global Access</h3>
            <p className="text-muted-foreground">
              We make this information freely available through our easy-to-use website, accessible to anyone, anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
