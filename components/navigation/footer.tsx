import Link from "next/link";
import { Search, Users, ArrowRight, Globe, Shield, FileText, Scale } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">RollThePay</h3>
            <p className="text-white/90 mb-6 leading-relaxed">
              Making salary information accessible and transparent for everyone. 
              Discover your market value with accurate, up-to-date salary data.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                <Users className="w-4 h-4 text-white/80" />
                <span>Free forever</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Global Coverage */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Global Coverage</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/australia" className="text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Australia
                </Link>
              </li>
              <li>
                <Link href="/switzerland" className="text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Switzerland
                </Link>
              </li>
              <li>
                <Link href="/singapore" className="text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Singapore
                </Link>
              </li>
              <li>
                <Link href="/india" className="text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  India
                </Link>
              </li>
              <li>
                <Link href="/canada" className="text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Canada
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
            <ul className="space-y-3">
              <li className="text-white/90 flex items-center gap-2">
                <Search className="w-4 h-4 text-white/80" />
                <span>Salary Search</span>
              </li>
              <li className="text-white/90 flex items-center gap-2">
                <Users className="w-4 h-4 text-white/80" />
                <span>Market Analysis</span>
              </li>
              <li className="text-white/90 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-white/80" />
                <span>Career Insights</span>
              </li>
              <li className="text-white/90 flex items-center gap-2">
                <Globe className="w-4 h-4 text-white/80" />
                <span>Global Data</span>
              </li>
              <li className="text-white/90 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-white/80" />
                <span>No registration</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="border-t border-white/20 pt-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Discover Your Market Value?
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Join millions of professionals who use our platform to research salaries, 
              negotiate better offers, and advance their careers.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 bg-secondary text-primary px-8 py-3 rounded-md font-semibold hover:bg-card transition-colors duration-200">
              <Search className="w-5 h-5" />
              Start Your Salary Research
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 bg-primary/95">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-white/80">
              © 2025 RollThePay. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-white/80">
              <span>Making salary transparency a reality</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Data Updated Daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
