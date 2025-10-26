import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer for RollThePay salary data and information accuracy.",
  alternates: { canonical: "/disclaimer" },
};

// Next.js 16: Using cacheComponents in next.config.ts instead of individual page configs

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">Disclaimer</h1>
        
        <div className="prose prose-lg max-w-none">
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">Data Accuracy</h2>
          <p className="text-muted-foreground mb-6">
            While we strive to provide accurate and up-to-date salary information, RollThePay makes no 
            warranties or representations about the accuracy, reliability, or completeness of the salary 
            data presented on this website. Salary data may vary based on numerous factors including 
            experience, education, location, company size, and market conditions.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">Use of Information</h2>
          <p className="text-muted-foreground mb-6">
            The salary information provided on RollThePay is for informational purposes only and should 
            not be considered as professional advice. Users should conduct their own research and 
            consult with relevant professionals before making career or salary-related decisions.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
          <p className="text-muted-foreground mb-6">
            RollThePay shall not be liable for any direct, indirect, incidental, special, or consequential 
            damages arising from the use of or inability to use the salary data provided on this website.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Sources</h2>
          <p className="text-muted-foreground mb-6">
            Our salary data is compiled from various third-party sources. We do not guarantee the 
            accuracy or reliability of information from these sources and are not responsible for 
            any errors or omissions in the data.
          </p>
        </div>
      </div>
    </div>
  );
}
