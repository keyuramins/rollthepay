// components/occupation/job-category-detector.ts
/**
 * Job Category Detector Component
 * Provides detailed job categorization and related content for occupations + The order of categories is important
 */

// Define categories as const to prevent drift and enable reuse
const JOB_CATEGORIES = [
  'Healthcare', 'Legal', 'Culinary', 'Education', 'Technology',
  'Engineering', 'Banking', 'Finance', 'Telecommunications', 'Trades',
  'Design', 'Analytics', 'Human Resources', 'Operations',
  'Customer Service', 'Sales & Marketing', 'Management', 'Professional'
] as const;

export type JobCategory = typeof JOB_CATEGORIES[number];

export type JobCategoryInfo = {
  readonly category: JobCategory;
  readonly description: string;
  readonly keySkills: readonly string[];
  readonly typicalResponsibilities: readonly string[];
  readonly careerPath: readonly string[];
};

type Rule = {
  readonly category: JobCategory;
  readonly test: (name: string) => boolean;
  readonly info: Omit<JobCategoryInfo, 'category'>;
};

// helper to build a word-boundary regex that handles hyphens, slashes, and word boundaries
// \b matches word boundaries, but we also want to match after hyphens and slashes
const w = (list: string[]) => {
  const esc = list.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  // match start, word-boundary, hyphen, or slash before; and word-boundary, hyphen, slash, or end after
  return new RegExp(`(?:^|\\b|[-/])(?:${esc})(?=$|\\b|[-/])`, 'i');
};

// helper to create rules with bound test methods
const rule = (category: JobCategory, keywords: string[], info: Omit<JobCategoryInfo,'category'>): Rule => {
  const rx = w(keywords);
  return { category, test: (name) => rx.test(name), info };
};

// helper for complex rules with custom test logic
const complexRule = (category: JobCategory, testFn: (name: string) => boolean, info: Omit<JobCategoryInfo,'category'>): Rule => {
  return { category, test: testFn, info };
};

// Simple cache for repeated calls
const categoryCache = new Map<string, JobCategoryInfo>();

const rules: readonly Rule[] = [
  rule('Healthcare', ['health','medical','nurse','doctor','physician','therapist','pharmacist','dentist','clinician','surgeon','caregiver','paramedic','radiologist','psychologist','psychiatrist','laboratory','lab','veterinarian'], {
    description: 'Provide healthcare services. Specialized knowledge and commitment to patient care and safety.',
    keySkills: ['Medical Knowledge','Patient Care','Communication','Critical Thinking','Compassion'],
    typicalResponsibilities: ['Provide patient care and treatment','Maintain medical records','Collaborate with healthcare teams','Ensure patient safety','Stay updated with medical advances'],
    careerPath: ['Junior Practitioner','Practitioner','Senior Practitioner','Specialist','Department Head']
  }),
  rule('Legal', ['lawyer','attorney','legal','paralegal','compliance','counsel','law','legal counsel','legal assistant','judge','solicitor','barrister','legal advisor','litigation','contract','notary','regulatory'], {
    description: 'Provide legal expertise and ensure compliance. Strong analytical skills and attention to detail required.',
    keySkills: ['Legal Research','Analytical Thinking','Communication','Compliance','Problem Solving'],
    typicalResponsibilities: ['Provide legal advice and counsel','Research legal precedents','Draft legal documents','Ensure regulatory compliance','Represent clients in legal matters'],
    careerPath: ['Junior Associate','Associate','Senior Associate','Partner','Managing Partner']
  }),
  rule('Culinary', ['chef','cook','culinary','kitchen','food service','restaurant','baker','pastry','catering','sous chef','head chef','executive chef','line cook','prep cook','food preparation','food safety','menu','cuisine','food and beverage','f&b','hospitality','barista','server','waiter','waitress','food runner','host','hostess','bartender','mixologist'], {
    description: 'Create exceptional dining experiences. Combine culinary skills with creativity to deliver memorable meals and service.',
    keySkills: ['Culinary Techniques','Food Safety','Creativity','Time Management','Customer Service'],
    typicalResponsibilities: ['Prepare and cook food items','Maintain food safety standards','Create and develop menus','Manage kitchen operations','Ensure quality and presentation'],
    careerPath: ['Kitchen Assistant','Line Cook','Sous Chef','Head Chef','Executive Chef']
  }),
  rule('Education', ['teacher','education','instructor','professor','trainer','curriculum','tutor','coach','lecturer','mentor','faculty','academic','school','teaching','training'], {
    description: 'Facilitate learning. Develop curriculum, engage students, and foster academic excellence.',
    keySkills: ['Teaching','Curriculum Development','Communication','Assessment','Mentoring'],
    typicalResponsibilities: ['Develop and deliver curriculum','Engage and motivate students','Assess student progress','Maintain learning environment','Support student development'],
    careerPath: ['Assistant Teacher','Teacher','Senior Teacher','Department Head','Principal']
  }),
  complexRule('Technology', (() => {
    const techRx = w(['software','developer','programmer']);
    const engRx = w(['software','web','mobile','frontend','backend','fullstack','devops','qa','tester','cloud','architect','ios','android','systems']);
    const engineerRx = /\bengineer\b/i;
    return (name: string) => {
      const tech = techRx.test(name);
      const eng = engineerRx.test(name) && engRx.test(name);
      return tech || eng;
    };
  })(), {
    description: 'Build and maintain software applications and systems. Create innovative solutions and stay current with emerging technologies.',
    keySkills: ['Programming','System Design','Problem Solving','Version Control','Testing'],
    typicalResponsibilities: ['Design and develop software applications','Write clean, maintainable code','Collaborate with cross-functional teams','Debug and troubleshoot issues','Stay updated with technology trends'],
    careerPath: ['Junior Developer','Mid-Level Developer','Senior Developer','Tech Lead','Engineering Manager']
  }),
  complexRule('Engineering', (() => {
    const engRx = /\bengineer\b/i;
    const techRx = w(['software','web','mobile']);
    const specificRx = w(['mechanical','electrical','civil','chemical','structural','industrial','hardware','process']);
    return (name: string) => {
      const eng = engRx.test(name);
      const tech = techRx.test(name);
      const specific = specificRx.test(name);
      return eng && !tech && specific;
    };
  })(), {
    description: 'Apply technical expertise to design and implement solutions. Strong problem-solving skills required.',
    keySkills: ['Technical Analysis','Design Principles','Project Management','Quality Assurance','Safety Standards'],
    typicalResponsibilities: ['Design technical solutions','Analyze system requirements','Oversee project implementation','Ensure compliance with standards','Collaborate with stakeholders'],
    careerPath: ['Junior Engineer','Engineer','Senior Engineer','Principal Engineer','Engineering Director']
  }),
  rule('Banking', ['bank','banking','banker','loan','lending','credit','mortgage','investment banking','wealth management','private banking','corporate banking','retail banking','commercial banking','teller','branch manager','relationship manager','portfolio manager','financial advisor','broker','trader','underwriter','compliance officer','risk analyst','credit analyst'], {
    description: 'Provide banking and financial services. Focus on client relationships, risk management, and regulatory compliance.',
    keySkills: ['Financial Analysis','Risk Assessment','Client Relations','Regulatory Compliance','Market Knowledge'],
    typicalResponsibilities: ['Manage client relationships and portfolios','Assess credit and investment risks','Ensure regulatory compliance','Process loans and financial transactions','Provide financial advice and solutions'],
    careerPath: ['Banking Associate','Banking Officer','Senior Banker','Banking Manager','Banking Director']
  }),
  rule('Finance', ['finance','accounting','financial','audit','treasury','controller','accountant','bookkeeper','tax','ledger','balance','budget','payroll','investment','funds','risk','compliance','credit','reconciliation','financial','fp&a','payable'], {
    description: 'Manage financial operations. Handle analysis, budgeting, and ensure regulatory compliance.',
    keySkills: ['Financial Analysis','Budgeting','Risk Management','Compliance','Reporting'],
    typicalResponsibilities: ['Prepare financial reports','Manage budgets and forecasts','Ensure regulatory compliance','Analyze financial performance','Support strategic planning'],
    careerPath: ['Junior Accountant','Accountant','Senior Accountant','Finance Manager','CFO']
  }),
  rule('Telecommunications', ['telecom','telecommunications','network','wireless','cellular','broadband','fiber','cable','satellite','voip','telephony','radio','microwave','transmission','infrastructure','tower','antenna','base station','network engineer','network technician','field engineer','installation','maintenance','troubleshooting','5g','4g','lte','gsm','cdma','wimax','bluetooth','wifi','ethernet','routing','switching','protocol','connectivity'], {
    description: 'Design, install, and maintain telecommunications systems. Ensure reliable connectivity and network performance.',
    keySkills: ['Network Engineering','System Installation','Troubleshooting','Technical Analysis','Project Management'],
    typicalResponsibilities: ['Design and implement network infrastructure','Install and configure telecommunications equipment','Monitor network performance and reliability','Troubleshoot connectivity issues','Maintain and upgrade systems'],
    careerPath: ['Field Technician','Network Technician','Network Engineer','Senior Engineer','Network Manager']
  }),
  rule('Trades', ['welder','welding','fabricator','machinist','machining','toolmaker','electrician','plumber','carpenter','mechanic','assembler','operator','production worker','maintenance','repair','installation','mason','roofer','painter','ironworker','steelworker','sheet metal','pipefitter','hvac','refrigeration','millwright','boilermaker','insulator','glazier','flooring','drywall','concrete','heavy equipment','crane operator','forklift','inspector','foreman'], {
    description: 'Apply specialized skills in manufacturing and construction. Focus on precision, safety, and quality craftsmanship.',
    keySkills: ['Technical Skills','Safety Protocols','Quality Control','Problem Solving','Equipment Operation'],
    typicalResponsibilities: ['Perform skilled trade work','Maintain safety standards','Ensure quality and precision','Operate specialized equipment','Follow technical specifications'],
    careerPath: ['Apprentice','Journeyman','Senior Craftsman','Foreman','Supervisor']
  }),
  rule('Design', ['designer','design','creative','art','graphic','ui','ux','visual','illustrator','motion','animation','video','web','layout','branding','multimedia','interface'], {
    description: 'Create functional designs that meet user needs. Combine creativity with technical skills for exceptional experiences.',
    keySkills: ['Creative Design','User Experience','Visual Communication','Design Tools','Prototyping'],
    typicalResponsibilities: ['Create visual designs and layouts','Develop user experience solutions','Collaborate with development teams','Conduct user research','Maintain design consistency'],
    careerPath: ['Junior Designer','Designer','Senior Designer','Lead Designer','Design Director']
  }),
  rule('Analytics', ['analyst','analytics','data','research','statistics','insight','intelligence','reporting','measurement','bi','quantitative','modeling','forecast'], {
    description: 'Analyze data and provide insights for business decisions. Transform complex data into clear recommendations.',
    keySkills: ['Data Analysis','Statistical Modeling','Critical Thinking','Visualization','Business Acumen'],
    typicalResponsibilities: ['Collect and analyze data','Create reports and dashboards','Identify trends and patterns','Provide actionable insights','Support decision-making processes'],
    careerPath: ['Junior Analyst','Analyst','Senior Analyst','Lead Analyst']
  }),
  rule('Human Resources', ['hr','human resources','recruiter','talent','people operations','hr manager','hr director','hr specialist','hr coordinator','hr business partner','hr generalist','hr associate','hr advisor','hr consultant','payroll','learning & development','l&d','benefits'], {
    description: 'Manage people operations and talent development. Focus on employee engagement and organizational culture.',
    keySkills: ['People Management','Communication','Conflict Resolution','Talent Development','Policy Development'],
    typicalResponsibilities: ['Recruit and onboard talent','Manage employee relations','Develop HR policies','Support performance management','Foster positive workplace culture'],
    careerPath: ['HR Coordinator','HR Specialist','HR Manager','HR Director','CHRO']
  }),
  rule('Operations', ['operations','supply chain','logistics','procurement','warehouse','inventory','operations manager','operations director','operations specialist','distribution','planning','fulfillment','manufacturing','production','coordinator','analyst','process improvement','quality control'], {
    description: 'Optimize business operations and supply chain efficiency. Focus on process improvement and cost reduction.',
    keySkills: ['Process Optimization','Supply Chain Management','Project Management','Data Analysis','Cost Control'],
    typicalResponsibilities: ['Optimize operational processes','Manage supply chain activities','Monitor performance metrics','Implement cost-saving initiatives','Ensure quality standards'],
    careerPath: ['Operations Coordinator','Operations Specialist','Operations Manager','Operations Director','COO']
  }),
  rule('Customer Service', ['customer service','support','help desk','client service','customer care','call center','technical support','tech support','service desk','client support','after-sales','retention'], {
    description: 'Provide exceptional customer support and service. Focus on customer satisfaction and problem resolution.',
    keySkills: ['Communication','Problem Solving','Patience','Product Knowledge','Customer Focus'],
    typicalResponsibilities: ['Respond to customer inquiries','Resolve customer issues','Maintain customer relationships','Document customer interactions','Ensure customer satisfaction'],
    careerPath: ['Customer Service Rep','Senior Rep','Team Lead','Customer Service Manager','Customer Experience Director']
  }),
  rule('Sales & Marketing', ['sales','marketing','business development','relationship manager','advertising','seo','brand','social media','territory','channel','inside sales','field sales','retail','promotion','campaign','partnership','growth','outreach','ecommerce'], {
    description: 'Drive business growth. Build relationships, develop strategies, and execute campaigns for revenue targets.',
    keySkills: ['Relationship Building','Communication','Negotiation','Strategy Development','Market Analysis'],
    typicalResponsibilities: ['Build and maintain client relationships','Develop sales and marketing strategies','Execute campaigns and initiatives','Meet revenue targets','Analyze market trends'],
    careerPath: ['Sales Rep','Account Manager','Senior Sales','Sales Manager','Sales Director']
  }),
  complexRule('Management', (() => {
    const posRx = w(['manager','director','supervisor','head','chief','principal','executive','controller']);
    const excludeRx = w(['account','finance','financial','hr','human resources','legal','engineer','teacher','sales','marketing','business development','relationship manager','advertising','seo','brand','social media']);
    return (name: string) => {
      const pos = posRx.test(name);
      const exclude = excludeRx.test(name);
      return pos && !exclude;
    };
  })(), {
    description: 'Lead teams and drive success. Strategic planning and operational excellence across departments.',
    keySkills: ['Leadership','Strategic Planning','Team Management','Communication','Decision Making'],
    typicalResponsibilities: ['Lead and motivate teams','Develop strategic plans','Manage budgets and resources','Ensure operational excellence','Drive organizational goals'],
    careerPath: ['Team Lead','Manager','Senior Manager','Director','VP/Executive']
  })
];

const fallback: JobCategoryInfo = {
  category: 'Professional',
  description: 'Execute professional responsibilities. Requires field expertise, communication skills, and quality results.',
  keySkills: ['Professional Expertise','Communication','Problem Solving','Adaptability','Continuous Learning'],
  typicalResponsibilities: ['Execute core job responsibilities','Maintain professional standards','Collaborate with colleagues','Contribute to team success','Pursue professional development'],
  careerPath: ['Junior Professional','Professional','Senior Professional','Lead Professional','Department Head']
} as const;

export function getJobCategoryInfo(occupationName: string): JobCategoryInfo {
  const name = (occupationName ?? '').trim();
  if (!name) return fallback;
  
  const lower = name
  .toLowerCase()
  .normalize('NFKD')
  .replace(/\p{Diacritic}/gu, '');
  
  // Check cache first using lowercase key
  const cached = categoryCache.get(lower);
  if (cached) return cached;

  for (const r of rules) {
    if (r.test(lower)) {
      const result = { category: r.category, ...r.info } as const;
      categoryCache.set(lower, result);
      return result;
    }
  }
  
  categoryCache.set(lower, fallback);
  return fallback;
}

export function getJobCategory(occupationName: string): JobCategory {
  return getJobCategoryInfo(occupationName).category;
}

// Export the categories array for reuse if the whole list is needed elsewhere.
export { JOB_CATEGORIES };
