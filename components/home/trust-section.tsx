// components/home/trust-section.tsx
import { Shield, CheckCircle, Award, Lock } from "lucide-react";

const trustItems = [
  { icon: Shield, title: "Data Integrity", description: "All salary data is verified through multiple sources and regularly updated to ensure accuracy and reliability." },
  { icon: CheckCircle, title: "Transparent Process", description: "Our methodology is open and transparent. We show you exactly how we collect, verify, and present salary information." },
  { icon: Award, title: "Industry Recognition", description: "Trusted by HR professionals, recruiters, and job seekers worldwide for reliable compensation insights and market intelligence." },
  { icon: Lock, title: "Privacy Protected", description: "Your privacy is our priority. All data is anonymized and aggregated to protect individual confidentiality while providing valuable insights." },
];

export function TrustSection() {
  return (
    <section role="region" aria-labelledby="trust-heading" className="bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-12 sm:mb-16">
        <h2 id="trust-heading" className="text-3xl sm:text-4xl font-bold text-foreground">Why Professionals Trust RollThePay</h2>
        <p className="max-w-3xl mx-auto text-muted-foreground pt-4">
          We're committed to providing the most accurate and up-to-date salary information 
          to help you make informed career decisions.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div key={idx} className="text-center p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/20 hover:-translate-y-1">
              <div className="w-16 h-16 sm:w-18 sm:h-18 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconComponent className="w-8 h-8 sm:w-9 sm:h-9 text-primary" />
              </div>
              <h3 className="text-foreground mb-4">{item.title}</h3>
              <p className="max-w-3xl mx-auto text-muted-foreground">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
