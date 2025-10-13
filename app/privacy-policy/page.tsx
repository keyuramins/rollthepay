import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for RollThePay - how we collect, use, and protect your data.",
  alternates: { canonical: "/privacy-policy" },
};

export const revalidate = 31536000; // 1 year
export const dynamicParams = false;

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            The original version of this document is in English. In the event of any discrepancy between a translated version of this Policy and the version in English, the English version shall prevail.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
          <p className="text-muted-foreground mb-6">
            This Privacy Policy ("Policy") for https://rollthepay.com ("Site") describes who we are, what Personal Data we collect on or through the Site, how we obtain and use such information, what are the legal grounds for processing your Personal Data, who has access to Personal Data, and what your rights are. Read this Policy carefully.
          </p>
          <p className="text-muted-foreground mb-6">
            By visiting the Site, or by using the Service, you accept the privacy practices described in this Policy.
          </p>
          <p className="text-muted-foreground mb-6">
            You have the right to object to the processing of your Personal Data carried out for our legitimate interests or for marketing purposes. Please refer to the section "Your rights" for more information about your rights and how you can exercise them.
          </p>
          <p className="text-muted-foreground mb-6">
            This Policy is incorporated into and is subject to, the Terms of Use of the Site. Capitalized terms used but not defined in this Policy have the meaning given to them in the Terms of Use.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. What personal data we collect and why</h2>
          <p className="text-muted-foreground mb-6">
            When you use the Service, as a User or as a Visitor, you may provide, and we may collect Personal Data. Personal data is any information which identifies a person, whether directly (for example an email address) or indirectly (for example, information about your use of our Services). You may provide us with Personal Data in various ways on the Service.
          </p>
          <p className="text-muted-foreground mb-6">
            We collect the following Personal Data:
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Information provided by Users and Visitors</h3>
          <p className="text-muted-foreground mb-4">
            <strong>Contact details provided by the User:</strong> Email address and (optionally, only if the User chooses to register for an account to access additional services and functionalities, name, surname, postal address and telephone number. We may use this information to send you Emails if you requested us to or to contact you about the content that you got posted on the Site, and any other products and services that we may have agreed to provide to you;
          </p>
          <p className="text-muted-foreground mb-6">
            <strong>Correspondence:</strong> We collect any Personal Data that you may provide if you contact us by email, letter or telephone, in order to provide the best customer support.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">2.2 "Automatically Collected" Information</h3>
          <p className="text-muted-foreground mb-4">
            We track your use of the Site through cookies and other similar technologies so that we can provide important features and functionality of the Service, monitor the use of the Site and provide a more personalized experience.
          </p>
          <p className="text-muted-foreground mb-4">
            This "automatically collected" information may include IP address or other device address or ID, web browser and/or device type, the web pages or sites visited just before or just after using the Service, the pages or other content the Visitor or User views or interacts with on the Service, and the dates and times of the visit, access, or use of the Service. Please refer to our Cookie Policy for more information.
          </p>
          <p className="text-muted-foreground mb-6">
            We also may use these technologies to collect information regarding a Visitor or User's interaction with email messages, such as whether the Visitor or User opens, clicks on, or forwards a message. This information is collected on an aggregate level from all Users and Visitors.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">2.3 Information provided by Integrated Services</h3>
          <p className="text-muted-foreground mb-4">
            You may be given the option to access or register for the Service through the use of your username and passwords for certain services provided by third parties (each, an "Integrated Service"), such as through the use of your Microsoft or Google account, or otherwise have the option to authorize an Integrated Service to provide Personal Data or other information to us.
          </p>
          <p className="text-muted-foreground mb-4">
            By authorizing us to connect with an Integrated Service, you authorize us to access and store your name, email address, age range, gender, country, profile picture URL, and other information that the Integrated Service makes available to us, and to use and disclose it in accordance with this Policy.
          </p>
          <p className="text-muted-foreground mb-4">
            You should check your privacy settings on each Integrated Service to understand what information that Integrated Service makes available to us, and make changes as appropriate.
          </p>
          <p className="text-muted-foreground mb-6">
            Please review each Integrated Service's terms of use and privacy policies carefully before using their services and connecting to our Service.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">2.4 Information from Other Sources</h3>
          <p className="text-muted-foreground mb-4">
            We may obtain information, including Personal Data, from third parties and sources other than the Service, such as our partners, advertisers, and Integrated Services.
          </p>
          <p className="text-muted-foreground mb-6">
            If we combine or associate information from other sources with Personal Data that we collect through the Service, we will treat the combined information as Personal Data in accordance with this Policy.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. How we use the Personal Data we collect</h2>
          <p className="text-muted-foreground mb-6">
            We use the information that we collect in a variety of ways in providing the Service and operating our business, including the following:
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">3.1 Operations</h3>
          <p className="text-muted-foreground mb-4">
            We use your Personal Data to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
            <li>operate, maintain, enhance and provide all features of the Service, and to provide the services and information that you request;</li>
            <li>provide the Email service to you, if you have requested it;</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">3.2 Improvements to the Service</h3>
          <p className="text-muted-foreground mb-4">
            We use the information to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
            <li>understand and analyze the usage trends and preferences of our Visitors and Users;</li>
            <li>improve the Service, and develop new products, services, features, and functionality.</li>
            <li>Should this purpose require us to process Personal Data, then the data will only be used in anonymized or aggregated form.</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">3.3 Cookies and tracking technologies</h3>
          <p className="text-muted-foreground mb-4">
            We use automatically-collected information and other information collected on the Service through cookies and similar technologies to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>personalize our Service, such as remembering a User's or Visitor's information so that the User or Visitor will not have to re-enter it during a visit or on subsequent visits;</li>
            <li>provide personalized advertisements, content, and information;</li>
            <li>monitor and analyze the effectiveness of our marketing activities;</li>
            <li>monitor aggregate site usage metrics such as a total number of visitors and pages viewed.</li>
          </ul>
          <p className="text-muted-foreground mb-6">
            We also may use tracking technologies to collect information regarding how Visitors or Users interact with the email messages we send, to get information like the time and day you opened our emails and the type of device you used to open them. We use this information to analyze the effectiveness of our email communication in order to improve it and to provide you with a better and more personalized service.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">3.4 Analytics</h3>
          <p className="text-muted-foreground mb-6">
            We use Google Analytics to measure and evaluate access to and traffic on the Public Area of the Site and create user navigation reports for our Site administrators.
          </p>
          <p className="text-muted-foreground mb-6">
            Google operates independently from us and has its own privacy policy, which we strongly suggest you review. Google may use the information collected through Google Analytics to evaluate Users' and Visitors' activity on our Site. For more information, see <a href="https://support.google.com/analytics/answer/6004245" target="_blank" rel="noopener noreferrer">Google Analytics Privacy and Data Sharing</a>.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. Legal basis for processing</h2>
          <p className="text-muted-foreground mb-6">
            We process your Personal Data on the basis of:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
            <li><strong>Consent:</strong> when you have given us your consent to process your Personal Data for one or more specific purposes;</li>
            <li><strong>Contract:</strong> when the processing is necessary for the performance of a contract to which you are a party or in order to take steps at your request prior to entering into a contract;</li>
            <li><strong>Legal obligation:</strong> when the processing is necessary for compliance with a legal obligation to which we are subject;</li>
            <li><strong>Legitimate interests:</strong> when the processing is necessary for the purposes of the legitimate interests pursued by us or by a third party, except where such interests are overridden by your interests or fundamental rights and freedoms which require protection of personal data.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">5. Who has access to your Personal Data</h2>
          <p className="text-muted-foreground mb-6">
            We will comply with GDPR requirements providing adequate protection for the transfer of personal information outside of the European Economic Area (EEA).
          </p>
          <p className="text-muted-foreground mb-6">
            The table below lists the third parties to whom we currently disclose your Personal Data. The table also explains how these organizations use your Personal Data if they are our "processors" (they process the data on our behalf, and only in line with our instructions), or if they are "controllers" (they use your Personal Data for their own purposes, after receiving them). The table indicates if the treatment is performed outside the EEA and the safeguards that are used to protect your Personal Data if this is the case.
          </p>
          <p className="text-muted-foreground mb-6">
            This information may be updated periodically.
          </p>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Recipient</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Why your personal information is shared</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Processing location</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Safeguard protections of your personal data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Google</td>
                  <td className="border border-gray-300 px-4 py-2">Monitoring the visitors and their statistics of website visitor information through Google Analytics.</td>
                  <td className="border border-gray-300 px-4 py-2">USA, EEA</td>
                  <td className="border border-gray-300 px-4 py-2">Please refer to <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Partner Sites</a> for more information on how Google uses information from sites or apps that use its services. Google is certified under the EU-U.S. and Swiss-U.S. Privacy Shield Frameworks, and is committed to <a href="https://cloud.google.com/privacy/gdpr?hl=en" target="_blank" rel="noopener noreferrer">GDPR</a> compliance across its services.</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Google</td>
                  <td className="border border-gray-300 px-4 py-2">Monetizing the website traffic through Google Adsense</td>
                  <td className="border border-gray-300 px-4 py-2">USA, EEA</td>
                  <td className="border border-gray-300 px-4 py-2">Please refer to Partner Sites for more information on how Google uses information from sites or apps that use its services. Google is certified under the EU-U.S. and Swiss-U.S. Privacy Shield Frameworks, and is committed to GDPR compliance across its services.</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-muted-foreground mb-6">
            As a consequence of our use of Google products, some of the ad technology providers listed below may receive your Personal Data. Ad technology providers (including Google and other ad networks and vendors) use data about users, for example, for the purposes of ads personalization and measurement. These ad technology providers have provided Google with information about their compliance with the GDPR.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. Data Retention</h2>
          <p className="text-muted-foreground mb-4">
            We only retain the Personal Data for a limited period of time as long as we need it to fulfil the purposes for which we have initially collected it unless otherwise required by law.
          </p>
          <p className="text-muted-foreground mb-4">
            The retention period may vary depending on the type of data. To determine retention periods, we consider a variety of factors, such as:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
            <li>legal obligations to retain data for a certain period of time, in accordance with the law;</li>
            <li>statute of limitations under applicable law;</li>
            <li>guidelines issued by relevant data protection authorities;</li>
            <li>the presence of actual or potential disputes.</li>
          </ul>
          <p className="text-muted-foreground mb-6">
            We securely delete Personal Data from our systems when they are no longer needed.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">7. Your Rights and Obligations</h2>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">7.1 What rights do I have over my account information and preferences?</h3>
          <p className="text-muted-foreground mb-6">
            You can edit your RollthePay account information and preferences at any time. If your information changes, you may delete, correct, or update it by making the change in your RollthePay account settings on your own. We retain the personal data you provide while your RollthePay account is in existence or as required to provide, operate, and maintain the Website and Services.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">7.2 How is my information protected?</h3>
          <p className="text-muted-foreground mb-6">
            We implement security safeguards designed to protect your data and we monitor our systems for possible vulnerabilities and attacks. However, there is no guarantee that your data will not be accessed, disclosed, altered, or destroyed by breach of any of our physical, technical, or managerial safeguards.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">Have additional privacy questions?</h2>
          <p className="text-muted-foreground mb-4">
            If you have a privacy question or concern, you can contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-muted-foreground">
              <strong>RollthePay</strong><br />
              7 Gnarwyn Rd, Carnegie 3163<br />
              VIC Melbourne, AU<br />
              Attention: Legal Department - Privacy Policy<br />
              Email: info at rollthepay dot com
            </p>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Thank you for reading our Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
