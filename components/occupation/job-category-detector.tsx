/**
 * Job Category Detector Component
 * Provides detailed job categorization and related content for occupations + The order of categories is important
 */

export interface JobCategoryInfo {
  category: string;
  description: string;
  keySkills: string[];
  typicalResponsibilities: string[];
  careerPath: string[];
}

export function getJobCategoryInfo(occupationName: string): JobCategoryInfo {
  const lowerName = occupationName.toLowerCase();
  
  // 1. Healthcare & Medical (Most specific, least ambiguous)
  if (
    lowerName.includes('health') || lowerName.includes('medical') || lowerName.includes('nurse') ||
    lowerName.includes('doctor') || lowerName.includes('physician') || lowerName.includes('therapist') ||
    lowerName.includes('pharmacist') || lowerName.includes('dentist') || lowerName.includes('clinician') ||
    lowerName.includes('surgeon') || lowerName.includes('caregiver') ||
    lowerName.includes('paramedic') || lowerName.includes('radiologist') || lowerName.includes('psychologist') ||
    lowerName.includes('psychiatrist') || lowerName.includes('laboratory') || lowerName.includes('lab') ||
    lowerName.includes('veterinarian')
  ) {
    return {
      category: 'Healthcare',
      description: 'Provide healthcare services. Specialized knowledge and commitment to patient care and safety.',
      keySkills: ['Medical Knowledge', 'Patient Care', 'Communication', 'Critical Thinking', 'Compassion'],
      typicalResponsibilities: [
        'Provide patient care and treatment',
        'Maintain medical records',
        'Collaborate with healthcare teams',
        'Ensure patient safety',
        'Stay updated with medical advances'
      ],
      careerPath: ['Junior Practitioner', 'Practitioner', 'Senior Practitioner', 'Specialist', 'Department Head']
    };
  }
  
  // 2. Legal & Compliance (Very specific)
  if (
    lowerName.includes('lawyer') || lowerName.includes('attorney') || lowerName.includes('legal') ||
    lowerName.includes('paralegal') || lowerName.includes('compliance') || lowerName.includes('counsel') ||
    lowerName.includes('law') || lowerName.includes('legal counsel') || lowerName.includes('legal assistant') ||
    lowerName.includes('judge') || lowerName.includes('solicitor') || lowerName.includes('barrister') ||
    lowerName.includes('legal advisor') || lowerName.includes('litigation') || lowerName.includes('contract') ||
    lowerName.includes('notary') || lowerName.includes('regulatory')
  ) {
    return {
      category: 'Legal',
      description: 'Provide legal expertise and ensure compliance. Strong analytical skills and attention to detail required.',
      keySkills: ['Legal Research', 'Analytical Thinking', 'Communication', 'Compliance', 'Problem Solving'],
      typicalResponsibilities: [
        'Provide legal advice and counsel',
        'Research legal precedents',
        'Draft legal documents',
        'Ensure regulatory compliance',
        'Represent clients in legal matters'
      ],
      careerPath: ['Junior Associate', 'Associate', 'Senior Associate', 'Partner', 'Managing Partner']
    };
  }
  
  // 3. Culinary & Food Service (Very specific)
  if (
    lowerName.includes('chef') || lowerName.includes('cook') || lowerName.includes('culinary') ||
    lowerName.includes('kitchen') || lowerName.includes('food service') || lowerName.includes('restaurant') ||
    lowerName.includes('baker') || lowerName.includes('pastry') || lowerName.includes('catering') ||
    lowerName.includes('sous chef') || lowerName.includes('head chef') || lowerName.includes('executive chef') ||
    lowerName.includes('line cook') || lowerName.includes('prep cook') || lowerName.includes('food preparation') ||
    lowerName.includes('food safety') || lowerName.includes('menu') || lowerName.includes('cuisine') ||
    lowerName.includes('food and beverage') || lowerName.includes('f&b') || lowerName.includes('hospitality') ||
    lowerName.includes('barista') || lowerName.includes('server') || lowerName.includes('waiter') ||
    lowerName.includes('waitress') || lowerName.includes('food runner') || lowerName.includes('host') ||
    lowerName.includes('hostess') || lowerName.includes('bartender') || lowerName.includes('mixologist')
  ) {
    return {
      category: 'Culinary',
      description: 'Create exceptional dining experiences. Combine culinary skills with creativity to deliver memorable meals and service.',
      keySkills: ['Culinary Techniques', 'Food Safety', 'Creativity', 'Time Management', 'Customer Service'],
      typicalResponsibilities: [
        'Prepare and cook food items',
        'Maintain food safety standards',
        'Create and develop menus',
        'Manage kitchen operations',
        'Ensure quality and presentation'
      ],
      careerPath: ['Kitchen Assistant', 'Line Cook', 'Sous Chef', 'Head Chef', 'Executive Chef']
    };
  }
  
  // 4. Education & Training (Specific, but can overlap with other categories)
  if (
    lowerName.includes('teacher') || lowerName.includes('education') || lowerName.includes('instructor') ||
    lowerName.includes('professor') || lowerName.includes('trainer') || lowerName.includes('curriculum') ||
    lowerName.includes('tutor') || lowerName.includes('coach') || lowerName.includes('lecturer') ||
    lowerName.includes('mentor') || lowerName.includes('faculty') || lowerName.includes('academic') ||
    lowerName.includes('school') || lowerName.includes('teaching') || lowerName.includes('training')
  ) {
    return {
      category: 'Education',
      description: 'Facilitate learning. Develop curriculum, engage students, and foster academic excellence.',
      keySkills: ['Teaching', 'Curriculum Development', 'Communication', 'Assessment', 'Mentoring'],
      typicalResponsibilities: [
        'Develop and deliver curriculum',
        'Engage and motivate students',
        'Assess student progress',
        'Maintain learning environment',
        'Support student development'
      ],
      careerPath: ['Assistant Teacher', 'Teacher', 'Senior Teacher', 'Department Head', 'Principal']
    };
  }
  
  // 5. Technology & Software Development (Specific technical roles)
  if (
    lowerName.includes('software') || 
    lowerName.includes('developer') || 
    lowerName.includes('programmer') || 
    (lowerName.includes('engineer') && 
      (lowerName.includes('software') || lowerName.includes('web') || lowerName.includes('mobile') || 
       lowerName.includes('frontend') || lowerName.includes('backend') || lowerName.includes('fullstack') || 
       lowerName.includes('devops') || lowerName.includes('qa') || lowerName.includes('tester') || 
       lowerName.includes('cloud') || lowerName.includes('architect') || lowerName.includes('ios') || 
       lowerName.includes('android') || lowerName.includes('systems'))
    )
  ) {
    return {
      category: 'Technology',
      description: 'Build and maintain software applications and systems. Create innovative solutions and stay current with emerging technologies.',
      keySkills: ['Programming', 'System Design', 'Problem Solving', 'Version Control', 'Testing'],
      typicalResponsibilities: [
        'Design and develop software applications',
        'Write clean, maintainable code',
        'Collaborate with cross-functional teams',
        'Debug and troubleshoot issues',
        'Stay updated with technology trends'
      ],
      careerPath: ['Junior Developer', 'Mid-Level Developer', 'Senior Developer', 'Tech Lead', 'Engineering Manager']
    };
  }
  
  // 6. Engineering (Non-Software) (Specific technical roles)
  if (
    lowerName.includes('engineer') && 
    !lowerName.includes('software') && 
    !lowerName.includes('web') && 
    !lowerName.includes('mobile') &&
    (
      lowerName.includes('mechanical') || lowerName.includes('electrical') || lowerName.includes('civil') ||
      lowerName.includes('chemical') || lowerName.includes('structural') || lowerName.includes('industrial') ||
      lowerName.includes('hardware') || lowerName.includes('process')
    )
  ) {
    return {
      category: 'Engineering',
      description: 'Apply technical expertise to design and implement solutions. Strong problem-solving skills required.',
      keySkills: ['Technical Analysis', 'Design Principles', 'Project Management', 'Quality Assurance', 'Safety Standards'],
      typicalResponsibilities: [
        'Design technical solutions',
        'Analyze system requirements',
        'Oversee project implementation',
        'Ensure compliance with standards',
        'Collaborate with stakeholders'
      ],
      careerPath: ['Junior Engineer', 'Engineer', 'Senior Engineer', 'Principal Engineer', 'Engineering Director']
    };
  }
  
  // 7. Banking & Financial Services (Very specific financial domain)
  if (
    lowerName.includes('bank') || lowerName.includes('banking') || lowerName.includes('banker') ||
    lowerName.includes('loan') || lowerName.includes('lending') || lowerName.includes('credit') ||
    lowerName.includes('mortgage') || lowerName.includes('investment banking') || lowerName.includes('wealth management') ||
    lowerName.includes('private banking') || lowerName.includes('corporate banking') || lowerName.includes('retail banking') ||
    lowerName.includes('commercial banking') || lowerName.includes('teller') || lowerName.includes('branch manager') ||
    lowerName.includes('relationship manager') || lowerName.includes('portfolio manager') || lowerName.includes('financial advisor') ||
    lowerName.includes('broker') || lowerName.includes('trader') || lowerName.includes('underwriter') ||
    lowerName.includes('compliance officer') || lowerName.includes('risk analyst') || lowerName.includes('credit analyst')
  ) {
    return {
      category: 'Banking',
      description: 'Provide banking and financial services. Focus on client relationships, risk management, and regulatory compliance.',
      keySkills: ['Financial Analysis', 'Risk Assessment', 'Client Relations', 'Regulatory Compliance', 'Market Knowledge'],
      typicalResponsibilities: [
        'Manage client relationships and portfolios',
        'Assess credit and investment risks',
        'Ensure regulatory compliance',
        'Process loans and financial transactions',
        'Provide financial advice and solutions'
      ],
      careerPath: ['Banking Associate', 'Banking Officer', 'Senior Banker', 'Banking Manager', 'Banking Director']
    };
  }
  
  // 8. Finance & Accounting (Specific domain)
  if (
    lowerName.includes('finance') || lowerName.includes('accounting') || lowerName.includes('financial') ||
    lowerName.includes('audit') || lowerName.includes('treasury') || lowerName.includes('controller') ||
    lowerName.includes('accountant') || lowerName.includes('bookkeeper') || lowerName.includes('tax') ||
    lowerName.includes('ledger') || lowerName.includes('balance') || lowerName.includes('budget') ||
    lowerName.includes('payroll') || lowerName.includes('investment') || lowerName.includes('funds') ||
    lowerName.includes('risk') || lowerName.includes('compliance') || lowerName.includes('credit') ||
    lowerName.includes('reconciliation') || lowerName.includes('financial planning') || lowerName.includes('fp&a')
  ) {
    return {
      category: 'Finance',
      description: 'Manage financial operations. Handle analysis, budgeting, and ensure regulatory compliance.',
      keySkills: ['Financial Analysis', 'Budgeting', 'Risk Management', 'Compliance', 'Reporting'],
      typicalResponsibilities: [
        'Prepare financial reports',
        'Manage budgets and forecasts',
        'Ensure regulatory compliance',
        'Analyze financial performance',
        'Support strategic planning'
      ],
      careerPath: ['Junior Accountant', 'Accountant', 'Senior Accountant', 'Finance Manager', 'CFO']
    };
  }
  
  // 9. Telecommunications (Specific technical domain)
  if (
    lowerName.includes('telecom') || lowerName.includes('telecommunications') || lowerName.includes('network') ||
    lowerName.includes('wireless') || lowerName.includes('cellular') || lowerName.includes('broadband') ||
    lowerName.includes('fiber') || lowerName.includes('cable') || lowerName.includes('satellite') ||
    lowerName.includes('voip') || lowerName.includes('telephony') || lowerName.includes('radio') ||
    lowerName.includes('microwave') || lowerName.includes('transmission') || lowerName.includes('infrastructure') ||
    lowerName.includes('tower') || lowerName.includes('antenna') || lowerName.includes('base station') ||
    lowerName.includes('network engineer') || lowerName.includes('network technician') || lowerName.includes('field engineer') ||
    lowerName.includes('installation') || lowerName.includes('maintenance') || lowerName.includes('troubleshooting') ||
    lowerName.includes('5g') || lowerName.includes('4g') || lowerName.includes('lte') || lowerName.includes('gsm') ||
    lowerName.includes('cdma') || lowerName.includes('wimax') || lowerName.includes('bluetooth') ||
    lowerName.includes('wifi') || lowerName.includes('ethernet') || lowerName.includes('routing') ||
    lowerName.includes('switching') || lowerName.includes('protocol') || lowerName.includes('connectivity')
  ) {
    return {
      category: 'Telecommunications',
      description: 'Design, install, and maintain telecommunications systems. Ensure reliable connectivity and network performance.',
      keySkills: ['Network Engineering', 'System Installation', 'Troubleshooting', 'Technical Analysis', 'Project Management'],
      typicalResponsibilities: [
        'Design and implement network infrastructure',
        'Install and configure telecommunications equipment',
        'Monitor network performance and reliability',
        'Troubleshoot connectivity issues',
        'Maintain and upgrade systems'
      ],
      careerPath: ['Field Technician', 'Network Technician', 'Network Engineer', 'Senior Engineer', 'Network Manager']
    };
  }
  
  // 10. Manufacturing & Skilled Trades (Specific technical trades)
  if (
    lowerName.includes('welder') || lowerName.includes('welding') || lowerName.includes('fabricator') ||
    lowerName.includes('machinist') || lowerName.includes('machining') || lowerName.includes('toolmaker') ||
    lowerName.includes('electrician') || lowerName.includes('plumber') || lowerName.includes('carpenter') ||
    lowerName.includes('mechanic') || lowerName.includes('assembler') ||
    lowerName.includes('operator') || lowerName.includes('production worker') || lowerName.includes('maintenance') ||
    lowerName.includes('repair') || lowerName.includes('installation') ||
    lowerName.includes('mason') || lowerName.includes('roofer') || lowerName.includes('painter') ||
    lowerName.includes('ironworker') || lowerName.includes('steelworker') || lowerName.includes('sheet metal') ||
    lowerName.includes('pipefitter') || lowerName.includes('hvac') || lowerName.includes('refrigeration') ||
    lowerName.includes('millwright') || lowerName.includes('boilermaker') || lowerName.includes('insulator') ||
    lowerName.includes('glazier') || lowerName.includes('flooring') || lowerName.includes('drywall') ||
    lowerName.includes('concrete') || lowerName.includes('heavy equipment') || lowerName.includes('crane operator') ||
    lowerName.includes('forklift') || lowerName.includes('inspector') ||
    lowerName.includes('foreman')
  ) {
    return {
      category: 'Trades',
      description: 'Apply specialized skills in manufacturing and construction. Focus on precision, safety, and quality craftsmanship.',
      keySkills: ['Technical Skills', 'Safety Protocols', 'Quality Control', 'Problem Solving', 'Equipment Operation'],
      typicalResponsibilities: [
        'Perform skilled trade work',
        'Maintain safety standards',
        'Ensure quality and precision',
        'Operate specialized equipment',
        'Follow technical specifications'
      ],
      careerPath: ['Apprentice', 'Journeyman', 'Senior Craftsman', 'Foreman', 'Supervisor']
    };
  }
  
  // 11. Design & Creative (Specific creative roles)
  if (
    lowerName.includes('designer') || lowerName.includes('design') || lowerName.includes('creative') ||
    lowerName.includes('art') || lowerName.includes('graphic') || lowerName.includes('ui') ||
    lowerName.includes('ux') || lowerName.includes('visual') || lowerName.includes('illustrator') ||
    lowerName.includes('motion') || lowerName.includes('animation') || lowerName.includes('video') ||
    lowerName.includes('web') || lowerName.includes('layout') || lowerName.includes('branding') ||
    lowerName.includes('multimedia') || lowerName.includes('interface')
  ) {
    return {
      category: 'Design',
      description: 'Create functional designs that meet user needs. Combine creativity with technical skills for exceptional experiences.',
      keySkills: ['Creative Design', 'User Experience', 'Visual Communication', 'Design Tools', 'Prototyping'],
      typicalResponsibilities: [
        'Create visual designs and layouts',
        'Develop user experience solutions',
        'Collaborate with development teams',
        'Conduct user research',
        'Maintain design consistency'
      ],
      careerPath: ['Junior Designer', 'Designer', 'Senior Designer', 'Lead Designer', 'Design Director']
    };
  }
  
  // 12. Analytics & Data (Specific analytical roles)
  if (
    lowerName.includes('analyst') || lowerName.includes('analytics') || lowerName.includes('data') ||
    lowerName.includes('research') || lowerName.includes('statistics') || lowerName.includes('insight') ||
    lowerName.includes('intelligence') || lowerName.includes('reporting') || lowerName.includes('measurement') ||
    lowerName.includes('bi') || lowerName.includes('quantitative') || lowerName.includes('modeling') ||
    lowerName.includes('forecast')
  ) {
    return {
      category: 'Analytics',
      description: 'Analyze data and provide insights for business decisions. Transform complex data into clear recommendations.',
      keySkills: ['Data Analysis', 'Statistical Modeling', 'Critical Thinking', 'Visualization', 'Business Acumen'],
      typicalResponsibilities: [
        'Collect and analyze data',
        'Create reports and dashboards',
        'Identify trends and patterns',
        'Provide actionable insights',
        'Support decision-making processes'
      ],
      careerPath: ['Junior Analyst', 'Analyst', 'Senior Analyst', 'Lead Analyst']
    };
  }
  
  // 13. Human Resources (Specific HR domain)
  if (
    lowerName.includes('hr') || lowerName.includes('human resources') || lowerName.includes('recruiter') ||
    lowerName.includes('talent') || lowerName.includes('people operations') || lowerName.includes('hr manager') ||
    lowerName.includes('hr director') || lowerName.includes('hr specialist') || lowerName.includes('hr coordinator') ||
    lowerName.includes('hr business partner') || lowerName.includes('hr generalist') || lowerName.includes('hr associate') ||
    lowerName.includes('hr advisor') || lowerName.includes('hr consultant') || lowerName.includes('payroll') ||
    lowerName.includes('learning & development') || lowerName.includes('l&d') || lowerName.includes('benefits')
  ) {
    return {
      category: 'Human Resources',
      description: 'Manage people operations and talent development. Focus on employee engagement and organizational culture.',
      keySkills: ['People Management', 'Communication', 'Conflict Resolution', 'Talent Development', 'Policy Development'],
      typicalResponsibilities: [
        'Recruit and onboard talent',
        'Manage employee relations',
        'Develop HR policies',
        'Support performance management',
        'Foster positive workplace culture'
      ],
      careerPath: ['HR Coordinator', 'HR Specialist', 'HR Manager', 'HR Director', 'CHRO']
    };
  }
  
  // 14. Operations & Supply Chain (Specific operational roles)
  if (
    lowerName.includes('operations') || lowerName.includes('supply chain') || lowerName.includes('logistics') ||
    lowerName.includes('procurement') || lowerName.includes('warehouse') || lowerName.includes('inventory') ||
    lowerName.includes('operations manager') || lowerName.includes('operations director') || lowerName.includes('operations specialist') ||
    lowerName.includes('distribution') || lowerName.includes('planning') || lowerName.includes('fulfillment') ||
    lowerName.includes('manufacturing') || lowerName.includes('production') || lowerName.includes('coordinator') ||
    lowerName.includes('analyst') || lowerName.includes('process improvement') || lowerName.includes('quality control')
  ) {
    return {
      category: 'Operations',
      description: 'Optimize business operations and supply chain efficiency. Focus on process improvement and cost reduction.',
      keySkills: ['Process Optimization', 'Supply Chain Management', 'Project Management', 'Data Analysis', 'Cost Control'],
      typicalResponsibilities: [
        'Optimize operational processes',
        'Manage supply chain activities',
        'Monitor performance metrics',
        'Implement cost-saving initiatives',
        'Ensure quality standards'
      ],
      careerPath: ['Operations Coordinator', 'Operations Specialist', 'Operations Manager', 'Operations Director', 'COO']
    };
  }
  
  // 15. Customer Service & Support (Specific service roles)
  if (
    lowerName.includes('customer service') || lowerName.includes('support') || lowerName.includes('help desk') ||
    lowerName.includes('client service') || lowerName.includes('customer care') || lowerName.includes('call center') ||
    lowerName.includes('technical support') || lowerName.includes('tech support') || lowerName.includes('service desk') ||
    lowerName.includes('client support') || lowerName.includes('after-sales') ||
    lowerName.includes('retention')
  ) {
    return {
      category: 'Customer Service',
      description: 'Provide exceptional customer support and service. Focus on customer satisfaction and problem resolution.',
      keySkills: ['Communication', 'Problem Solving', 'Patience', 'Product Knowledge', 'Customer Focus'],
      typicalResponsibilities: [
        'Respond to customer inquiries',
        'Resolve customer issues',
        'Maintain customer relationships',
        'Document customer interactions',
        'Ensure customer satisfaction'
      ],
      careerPath: ['Customer Service Rep', 'Senior Rep', 'Team Lead', 'Customer Service Manager', 'Customer Experience Director']
    };
  }
  
  // 16. Sales & Marketing (Broader category, comes after more specific ones)
  if (
    lowerName.includes('sales') || lowerName.includes('marketing') || lowerName.includes('business development') ||
    lowerName.includes('relationship manager') ||
    lowerName.includes('advertising') || lowerName.includes('seo') || lowerName.includes('brand') ||
    lowerName.includes('social media') || lowerName.includes('territory') ||
    lowerName.includes('channel') ||
    lowerName.includes('inside sales') || lowerName.includes('field sales') || lowerName.includes('retail') ||
    lowerName.includes('promotion') || lowerName.includes('campaign') || lowerName.includes('partnership') ||
    lowerName.includes('growth') || lowerName.includes('outreach') || lowerName.includes('ecommerce')
  ) {
    return {
      category: 'Sales & Marketing',
      description: 'Drive business growth. Build relationships, develop strategies, and execute campaigns for revenue targets.',
      keySkills: ['Relationship Building', 'Communication', 'Negotiation', 'Strategy Development', 'Market Analysis'],
      typicalResponsibilities: [
        'Build and maintain client relationships',
        'Develop sales and marketing strategies',
        'Execute campaigns and initiatives',
        'Meet revenue targets',
        'Analyze market trends'
      ],
      careerPath: ['Sales Rep', 'Account Manager', 'Senior Sales', 'Sales Manager', 'Sales Director']
    };
  }
  
  // 17. Management & Leadership (Broadest category, comes last)
  if (
    lowerName.includes('manager') || lowerName.includes('director') || lowerName.includes('supervisor') ||
    lowerName.includes('head') || lowerName.includes('chief') ||
    lowerName.includes('principal') || lowerName.includes('executive') || lowerName.includes('controller')
  ) {
    return {
      category: 'Management',
      description: 'Lead teams and drive success. Strategic planning and operational excellence across departments.',
      keySkills: ['Leadership', 'Strategic Planning', 'Team Management', 'Communication', 'Decision Making'],
      typicalResponsibilities: [
        'Lead and motivate teams',
        'Develop strategic plans',
        'Manage budgets and resources',
        'Ensure operational excellence',
        'Drive organizational goals'
      ],
      careerPath: ['Team Lead', 'Manager', 'Senior Manager', 'Director', 'VP/Executive']
    };
  }
  
  // Default fallback for unclassified roles
  return {
    category: 'Professional',
    description: 'Execute professional responsibilities. Requires field expertise, communication skills, and quality results.',
    keySkills: ['Professional Expertise', 'Communication', 'Problem Solving', 'Adaptability', 'Continuous Learning'],
    typicalResponsibilities: [
      'Execute core job responsibilities',
      'Maintain professional standards',
      'Collaborate with colleagues',
      'Contribute to team success',
      'Pursue professional development'
    ],
    careerPath: ['Junior Professional', 'Professional', 'Senior Professional', 'Lead Professional', 'Department Head']
  };
}

export function getJobCategory(occupationName: string): string {
  return getJobCategoryInfo(occupationName).category;
}
