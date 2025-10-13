import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for RollThePay salary search engine and services.",
  alternates: { canonical: "/terms-of-use" },
};

export const revalidate = 31536000; // 1 year
export const dynamicParams = false;

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Use</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            The Terms of Use set forth below govern the use of the Website RollthePay and regulate the services provided by RollthePay to its Users/Visitors.
          </p>
          
          <p className="text-muted-foreground mb-6">
            This document was written in English. To the extent any translated version of this agreement conflicts with the English version, the English version controls.
          </p>
          
          <p className="text-muted-foreground mb-6">
            These Terms are legally binding on all Users/Visitors of this Website.<br />
            By using the Site, you agree to these Terms of Service and the Privacy Policy that is available at https://rollthepay.com/privacy-policy/
          </p>
          
          <p className="text-muted-foreground mb-8">
            If you do not agree with any of these Terms or privacy policies, do not use the Site and/or its services, and do not use or otherwise access any information on the Site.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Definitions</h2>
          <p className="text-muted-foreground mb-4">
            For the purpose of this document, the following definitions should apply:
          </p>
          
          <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
            <li><strong>Terms of Use or Terms</strong> – The Terms and Conditions of Use.</li>
            <li><strong>Website or Site</strong> – RollthePay, a search engine for salaries for thousands of employers and employees to refer for knowledge purposes only. We try to provide salaries to most countries of the world, when possible.</li>
            <li><strong>Public Area</strong> – The publicly accessible area of the Site, which can be accessed by both Users and Visitors without the need to login.</li>
            <li><strong>Administrator Area</strong> – The area of the Site that can only be accessed by Registered Users.</li>
            <li><strong>Company</strong> – Akvitek, owner of the RollthePay website, located at the URL https://rollthepay.com</li>
            <li><strong>Service</strong> – The service provided by RollthePay, consisting in the following: the retrieval and indexing of varied salaries; the publication of the Postings on the Website; email services provided to those Users who voluntarily activate the designated service.</li>
            <li><strong>Advertisers</strong> – The companies and organisations who publish Salaries through RollthePay by paying us a fee.</li>
            <li><strong>Visitor</strong> – A person who visits the Public Area, but does not have access to the Administrator Area of the Site.</li>
            <li><strong>User</strong> – Individual who completed the registration process on the Site and therefore has an account, with which, upon login, can access the Administrator Area of the Site and the additional features the Site offers.</li>
            <li><strong>Interested Party</strong> – The entity or natural person to whom the Personal Data pertain.</li>
            <li><strong>Personal Data</strong> – Any information relating to an identified or identifiable natural person (data subject).</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. Services</h2>
          <p className="text-muted-foreground mb-4">
            <strong>Salary Search Engine</strong> – RollthePay allows Users/Visitors to view salaries and its related information. The Website and the Services are intended for use by individuals looking for employment and by recruiters and employers seeking candidates for employment specifically considering the Salary as the vital information they are searching for. The Salaries published on RollthePay are retrieved from our database, or may come directly from RollthePay Advertisers.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. Limitations of Warranty</h2>
          <p className="text-muted-foreground mb-4">
            Users/Visitors acknowledge and accept that the Site and/or the Service are provided on an "as is" basis, without any warranty, express or implied, about the accuracy, reliability, currency, correctness, timeliness, completeness or availability of the information provided.
          </p>
          <p className="text-muted-foreground mb-4">
            Users/Visitors acknowledge and accept that the content of the Salary information are not verified or authenticated by the Company in any way, and are not subject to any kind of moderation. The Company does not verify the quality or legality of the salary information.
          </p>
          <p className="text-muted-foreground mb-4">
            The Company does not verify the information uploaded by Users/Visitors or transmitted to Advertisers by Users/Visitors, and is not involved in the negotiations between Users/Visitors and Advertisers.
          </p>
          <p className="text-muted-foreground mb-4">
            The Company does not guarantee uninterrupted access to this Website, and cannot be held responsible for Site and/or Service malfunction caused by third parties upon which the Site and/or Service relies.
          </p>
          <p className="text-muted-foreground mb-6">
            Users/Visitors acknowledge and accept that the Service may be temporarily or permanently interrupted at any time and for any reason, including for example any technical problem or malfunction, any external problem or event over which the Company has no control, or the violation of any of the User/Visitor's obligations and use restrictions as set in these Terms.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. User/Visitor's Obligations and Use Restrictions</h2>
          <p className="text-muted-foreground mb-4">
            Users/Visitors who visit the Website and use the Service specifically agree to abide by these rules and be bound by the following use restrictions.
          </p>
          <p className="text-muted-foreground mb-4">
            Users/Visitors agree not to:
          </p>
          
          <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
            <li>Use the Site and/or the Service to intentionally or unintentionally violate any applicable local, state, national or international law or regulation.</li>
            <li>Transmit, upload, publish, post, send or otherwise make available any content that is defamatory, libelous, slanderous, offensive, illegal, illicit, threatening, pornographic, racist, obscene, sexually oriented, discriminatory, vulgar, insulting, invasive of another's privacy, hateful, or racially, ethnically or otherwise objectionable.</li>
            <li>Transmit, upload, publish, post, send or otherwise make available any content that is in the name of other people or organizations, in cases when the User/Visitor posting the content does not have the necessary rights to do so.</li>
            <li>Transmit, upload, publish, post, send or otherwise make available content and/or messages encouraging others to act in a way that is defamatory, offensive, illegal, illicit, threatening, racist, obscene, discriminatory, vulgar, insulting, invasive of another's privacy, hateful, or racially, ethnically or otherwise objectionable.</li>
            <li>Transmit, upload, publish, post, send or otherwise make available any content that Users/Visitors do not have a right to make available under any law or under contractual or fiduciary relationships.</li>
            <li>Transmit, upload, publish, post, send or otherwise make available any content that infringes any trademark, patent, trade secret, copyright or other proprietary rights of any party, or that violates the publicity rights or privacy of any other person.</li>
            <li>Impersonate any person or entity, or falsely state or otherwise misrepresent affiliation with a person or entity.</li>
            <li>Provide false personal information on any registration form on the Site, including email addresses which Users/Visitors do not have the right to use.</li>
            <li>Transmit, upload, publish, post, send or otherwise make available any unauthorized or unsolicited advertising, promotional materials, "spam", "junk mail," "chain letters", "pyramid schemes" or any other form of solicitation, by directly posting such materials within the Site and/or the Service or by making unsolicited contact with any User/Visitor via email, postal mail, phone, or any other method of communication.</li>
            <li>Impair in any way the use of the Site and/or the Service by other Users/Visitors.</li>
            <li>Take any action that might compromise or circumvent the security of the Site or any information available through it, including, but not limited to, any attempt to (1) disable, crash, delay, damage, disrupt or otherwise interfere with the Site and/or the Service, or disobey any procedures, requirements, policies or regulations of networks connected to the Site and/or the Service; (2) manually or automatically test the security measures of the Website; (3) decipher, disassemble, decompile or modify any of the software, coding or information comprised in the Site and/or the Service; (4) overload the Site via spamming or flooding; (5) access, alter or delete any information to which Users/Visitors do not have authorised access.</li>
            <li>Transmit, upload, publish, post, send or otherwise make available any material that contains software viruses or any other files, programs, computer code designed to destroy, damage, interrupt or limit the data and functionality of the Website and/or the Service, or any computer hardware, software or telecommunications equipment.</li>
            <li>Impair the functioning of the Company's equipment, or damage the Company's equipment or data.</li>
            <li>Use any manual or automatic procedure, spider, robot or other automatic device, software, program, algorithm or methodology having similar functionality, to monitor, copy, retrieve or index any portion of the Site, in any case without the prior written permission of the Company.</li>
            <li>Display any of the information or content available from the Site through the use of web frames, iframes or any other technique that makes it possible to replicate and display the Site or any portion of the Site on any other website, unless the Company expressly consents to such framing.</li>
            <li>Use the Site and/or the Service for any purpose other than to search for salary information.</li>
          </ul>
          
          <p className="text-muted-foreground mb-4">
            This list of prohibitions and restrictions is illustrative and is not intended to be exhaustive or complete. The continued use of the Site and the Service is expressly conditioned on Users/Visitors' compliance with the foregoing restrictions, prohibitions and obligations.
          </p>
          <p className="text-muted-foreground mb-4">
            If the Company becomes aware of a breach of the preceding restrictions, prohibitions and obligations, it may investigate and work with law enforcement authorities for the purpose of prosecuting offenders.
          </p>
          <p className="text-muted-foreground mb-6">
            Users/Visitors acknowledge and agree that the Company may preserve information and may disclose information if required to do so by law, or in the good faith belief that such preservation or disclosure is reasonably necessary to: (1) enforce these Terms; (2) comply with legal process; (3) protect the property, rights, or personal safety of the Company, its Users/Visitors and the public; (4) respond to claims that any information violates the rights of third parties.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">5. Limitations of Liability</h2>
          <p className="text-muted-foreground mb-4">
            Users/Visitors acknowledge and agree that the Company will not be be held responsible or liable in respect of any damages or claims arising from information posted on the Site, sent to Users/Visitors via email or made available in any other way to third parties and recruiters.
          </p>
          <p className="text-muted-foreground mb-4">
            Neither the Company nor any of its agents, partners, third party providers shall be liable for any form of damages arising from the use or attempted use of the Site and/or the Service, or the content and information on the Site, or any external website linked from this Site, or for any other damage however arising, even if the Company was informed of the possibility of such damages.
          </p>
          <p className="text-muted-foreground mb-4">
            Users/Visitors agree to use the Site at their own risk.
          </p>
          <p className="text-muted-foreground mb-4">
            Users/Visitors acknowledge and accept that the information provided may include certain omissions, errors or outdated information. Users/Visitors agree that the Company does not guarantee the accuracy or timeliness of the information, and that the Company is not liable for any omissions and errors.
          </p>
          <p className="text-muted-foreground mb-4">
            The Advertisers who originally published the Posting bears sole responsibility for its content.
          </p>
          <p className="text-muted-foreground mb-4">
            Users/Visitors acknowledge and accept that the Company does not monitor or pre-screen content, but the Company shall have the right (but not the obligation) in its sole discretion to move or refuse any content that is available on the Site.
          </p>
          <p className="text-muted-foreground mb-4">
            The Company does not assume any obligation to monitor or remove any content or other information posted or submitted by any User. Users acknowledge and agree that the Company will not be held responsible for or liable for any information and content of any nature that may be submitted or posted by any User or by any third party.
          </p>
          <p className="text-muted-foreground mb-4">
            Users acknowledge and agree that they are fully responsible for the information that they submit to the Site, including, but not limited to, the legality, originality, reliability and copyright of the information submitted.
          </p>
          <p className="text-muted-foreground mb-4">
            Users/Visitors agree that they must evaluate, and bear all risks associated with, the use of any information, including any reliance on the completeness, accuracy, or usefulness of such information. Users/Visitors acknowledge that they may not rely on any information available on or submitted to any part of the Site.
          </p>
          <p className="text-muted-foreground mb-4">
            Without limiting the foregoing, the Company shall have the right to edit or remove any content for any reason, including, without limitation, content that violates these Terms or is otherwise objectionable.
          </p>
          <p className="text-muted-foreground mb-4">
            The Company shall have the right to prohibit User/Visitor's access to the Site and/or the Service for any reason, including, without limitation, any conduct and/or action that the Company, in its sole discretion, determines to be disruptive, inappropriate or otherwise objectionable.
          </p>
          <p className="text-muted-foreground mb-4">
            Users/Visitors acknowledge and agree that the Site may contain links to external websites that belong to third parties. The company has no control over such websites and resources, and such links do not constitute an endorsement of those external websites. Users/Visitors acknowledge and agree that the Company is not responsible for the accessibility or content of these external websites, as well as any consequences related to the use of such websites. Use of external websites is subject to the terms and conditions of use and privacy policies located on those websites.
          </p>
          <p className="text-muted-foreground mb-6">
            Users/Visitors acknowledge and accept that the Service may be temporarily or permanently interrupted at any time and for any reason without prior notice, and that the Company cannot be held responsible for any malfunction or interruption of Service.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. Copyrights and Trademarks</h2>
          <p className="text-muted-foreground mb-4">
            All trademarks, logos, brand names, trade names, service marks, graphics, icons, illustrations and designs of RollthePay or others used on the Website and/or in the Service are the exclusive property of the Company or their respective owners, and are protected by trademark laws.
          </p>
          <p className="text-muted-foreground mb-4">
            Users/Visitors acknowledge and agree that they have no title, right or interest in or to the materials appearing on the Site on any legal basis.
          </p>
          <p className="text-muted-foreground mb-4">
            Any reproduction, modification, frame copy, retransmission, publication or distribution of any copyrighted material is strictly prohibited without the express written permission of the copyright owner, except as otherwise required by applicable laws.
          </p>
          <p className="text-muted-foreground mb-4">
            Users/Visitors agree that any information and/or material they submit to this Site is provided on a non-proprietary and non-confidential basis. Subject to compliance with the Privacy Policy, Users/Visitors who submit information to the Site grant the Company a royalty free, non exclusive, worldwide license to use, copy, link to, utilize, disseminate the information submitted.
          </p>
          <p className="text-muted-foreground mb-6">
            Users/Visitors acknowledge and agree that the Company may use information submitted by them in any manner, including, but not limited to, developing new products, features, services, functionalities. Users/Visitors grant the Company all title, right and interest in and to any new product, feature, service, functionality that they may submit or suggest to the Company.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">7. Indemnification</h2>
          <p className="text-muted-foreground mb-6">
            The User/Visitor agrees to indemnify and hold the Company and its representatives, employees, partners, agents harmless from any and all claims, demands, damages, liabilities and costs directly or indirectly arising out of the breach of these Terms or the use of the Site and/or the Service by the User/Visitor.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">8. Jurisdiction</h2>
          <p className="text-muted-foreground mb-6">
            These Terms are subject to English law and the exclusive jurisdiction of the Magistrate Court of Melbourne, except as otherwise required by applicable consumer protection laws.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes and updates to these Terms</h2>
          <p className="text-muted-foreground mb-6">
            You agree that we may change, alter or modify these Terms at any time without notice, and can make changes to the Website and/or the Service at any time. Accordingly, any changes, alterations or modifications will be notified to you by posting an updated version of these Terms on the Site. You will not need to expressly accept these changes as you hereby agree that any use by you of the Website after any such changes, alterations or modifications have been posted shall be deemed to indicate your agreement to them. If you do not agree to the modified Terms, you should cease use of the Website.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contacts</h2>
          <p className="text-muted-foreground mb-4">
            For any further information please contact:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-muted-foreground">
              7 Gnarwyn Road, Carnegie 3163<br />
              VIC Melbourne, Australia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
