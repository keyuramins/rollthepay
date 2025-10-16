import { Metadata } from "next";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import Link from "next/link";
























export const revalidate = 31536000;
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "About RollThePay - Salary Transparency & Career Insights",
  description: "Learn about RollThePay's mission to provide accurate salary information and increase transparency in the labor market. Discover how we help job seekers and employers make informed decisions.",
  keywords: ["salary data", "career insights", "compensation transparency", "job market", "salary information", "career planning"],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About RollThePay - Salary Transparency & Career Insights",
    description: "Learn about RollThePay's mission to provide accurate salary information and increase transparency in the labor market.",
    type: "website",
    url: "/about",
    siteName: "RollThePay",
  },
  twitter: {
    card: "summary_large_image",
    title: "About RollThePay - Salary Transparency & Career Insights",
    description: "Learn about RollThePay's mission to provide accurate salary information and increase transparency in the labor market.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function AboutPage() {
  return (
    <>
      <main className="bg-background" role="main">
        <Breadcrumbs breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "#", current: true },
        ]} />
        <section className="shadow-md" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 text-center">
            <h1 id="hero-heading" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              About RollThePay
            </h1>
            <p className="mt-4 text-lg leading-7 text-muted-foreground max-w-3xl mx-auto sm:mt-6 sm:text-xl sm:leading-8">
              We're on a mission to make salary information accessible, transparent, and accurate for everyone.
            </p>
          </div>
        </section>
        <section className="py-12 sm:py-16" aria-labelledby="mission-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
              <div className="space-y-6">
                <h2 id="mission-heading" className="text-2xl font-bold text-foreground sm:text-3xl">Our Mission</h2>
                <div className="space-y-4">
                  <p className="text-base text-muted-foreground sm:text-lg">
                    RollThePay was created with a simple yet powerful goal: to provide accurate salary information 
                    that helps people make informed career decisions. We believe that transparency in compensation 
                    leads to better career outcomes and a more equitable workplace.
                  </p>
                  <p className="text-base text-muted-foreground sm:text-lg">
                    By compiling data from thousands of employers and employees worldwide, we're building the most 
                    comprehensive salary database available, organized by country, state, and job title.
                  </p>
                </div>
              </div>

              <figure className="bg-green-100 rounded-lg p-6 text-center sm:p-8">
                <div className="text-4xl mb-3 sm:text-6xl sm:mb-4" aria-hidden="true">🎯</div>
                <h3 className="text-lg font-semibold text-foreground mb-2 sm:text-xl">Transparency First</h3>
                <figcaption>
                  <p className="text-base text-muted-foreground sm:text-lg">
                    We believe everyone deserves access to accurate salary information to make informed career decisions.
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
        <section className="bg-background py-12 sm:py-16 text-center" aria-labelledby="what-we-do-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="what-we-do-heading" className="text-2xl font-bold text-foreground mb-4 sm:text-3xl">
              What We Do
            </h2>
            <p className="text-base text-muted-foreground sm:text-lg mb-12">
              We collect, organize, and present salary data in an easy-to-understand format, 
              helping you navigate the complex world of compensation.
            </p>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              <article className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:w-16 sm:h-16 sm:mb-4">
                  <span className="text-xl sm:text-2xl" aria-hidden="true">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 sm:text-xl">Data Collection</h3>
                <p className="text-base text-muted-foreground sm:text-lg">
                  We gather salary information from thousands of employers and employees across different industries and locations.
                </p>
              </article>

              <article className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:w-16 sm:h-16 sm:mb-4">
                  <span className="text-xl sm:text-2xl" aria-hidden="true">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 sm:text-xl">Data Analysis</h3>
                <p className="text-base text-muted-foreground sm:text-lg">
                  Our team analyzes and validates the data to ensure accuracy and provide meaningful insights.
                </p>
              </article>

              <article className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:w-16 sm:h-16 sm:mb-4">
                  <span className="text-xl sm:text-2xl" aria-hidden="true">🌐</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 sm:text-xl">Global Access</h3>
                <p className="text-base text-muted-foreground sm:text-lg">
                  We make this information freely available through our easy-to-use website, accessible to anyone, anywhere.
                </p>
              </article>
            </div>
          </div>
        </section>
        <section className="py-12 sm:py-16 text-center" aria-labelledby="why-it-matters-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="why-it-matters-heading" className="text-2xl font-bold text-foreground mb-4 sm:text-3xl">
              Why Salary Transparency Matters
            </h2>
            <p className="text-base text-muted-foreground sm:text-lg mb-12">
              Access to accurate salary information benefits everyone in the workforce ecosystem.
            </p>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
              <article className="space-y-4 sm:space-y-6">
                <h3 className="text-lg font-semibold text-foreground mb-2 sm:text-xl">
                  For Job Seekers
                </h3>
                <ul className="space-y-3 text-muted-foreground text-left sm:text-lg">
                  <li className="flex items-start">
                    <span className="mr-3 text-primary flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                    <span className="text-sm sm:text-base">Negotiate better compensation packages</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-primary flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                    <span className="text-sm sm:text-base">Make informed career decisions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-primary flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                    <span className="text-sm sm:text-base">Understand market value for skills</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-primary flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                    <span className="text-sm sm:text-base">Plan career transitions effectively</span>
                  </li>
                </ul>
              </article>

              <article className="space-y-4 sm:space-y-6">
                <h3 className="text-lg font-semibold text-foreground mb-2 sm:text-xl">
                  For Employers
                </h3>
                <ul className="space-y-3 text-muted-foreground text-left sm:text-lg">
                  <li className="flex items-start">
                    <span className="mr-3 text-primary flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                    <span className="text-sm sm:text-base">Set competitive compensation rates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-primary flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                    <span className="text-sm sm:text-base">Attract and retain top talent</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-primary flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                    <span className="text-sm sm:text-base">Ensure pay equity and fairness</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-primary flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                    <span className="text-sm sm:text-base">Make informed hiring decisions</span>
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>
        <section className="bg-background py-12 sm:py-16 text-center" aria-labelledby="data-quality-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="data-quality-heading" className="text-2xl font-bold text-foreground mb-4 sm:text-3xl">
              Our Commitment to Data Quality
            </h2>
            <p className="text-base text-muted-foreground sm:text-lg mb-12">
              We take data accuracy seriously and have implemented rigorous processes to ensure the information we provide is reliable.
            </p>

            <ul className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "🔒", title: "Verified Sources", description: "Data comes from verified employers and employees", bg: "bg-green-100" },
                { icon: "📈", title: "Regular Updates", description: "Information is updated regularly to reflect current market conditions", bg: "bg-green-100" },
                { icon: "🎯", title: "Accurate Aggregation", description: "Statistical methods ensure reliable averages and ranges", bg: "bg-green-100" },
                { icon: "🌍", title: "Global Coverage", description: "Comprehensive data from multiple countries and regions", bg: "bg-green-100" },
              ].map((feature) => (
                <li key={feature.title} className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:w-16 sm:h-16 sm:mb-4 ${feature.bg}`} aria-hidden="true">
                    <span className="text-xl sm:text-2xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 sm:text-xl">{feature.title}</h3>
                  <p className="text-base text-muted-foreground sm:text-lg">{feature.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="bg-primary py-12 sm:py-16" aria-labelledby="cta-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-2xl font-bold text-white mb-4 sm:text-3xl sm:mb-6">
              Ready to Explore Salary Data?
            </h2>
            <p className="text-base text-white mb-6 max-w-3xl mx-auto sm:text-lg lg:text-xl sm:mb-12">
              Start your journey to better compensation insights today. Explore our
              comprehensive salary database and make informed career decisions.
            </p>
            <Link
              prefetch
              href="/"
              className="inline-flex items-center justify-center text-sm bg-secondary text-primary px-6 py-3 rounded-md font-semibold hover:bg-card transition-colors cursor-pointer min-h-[44px] min-w-[44px] sm:px-8 sm:py-4 sm:text-lg"
              aria-label="Return to RollThePay homepage to explore salary data"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
