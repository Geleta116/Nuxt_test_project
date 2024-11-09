<template>
    <div class="bg-zinc-900 text-white p-10">
     
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <TopSkillsCategory 
          title="Certifications by Issuer" 
          :skills="['Amazon Web Services (AWS) Certifications', 'Six Sigma Certifications',
          'Microsoft Certifications', 'Cisco Certifications', 'Tableau Certifications', 'See all Certifications']" 
        />
        <TopSkillsCategory 
          title="Web Development" 
          :skills="['Web Development', 'JavaScript', 'React JS', 'Angular', 'Java']" 
        />
        <TopSkillsCategory 
          title="IT Certifications" 
          :skills="['Amazon AWS', 'AWS Certified Cloud Practitioner', 'AZ-900: Microsoft Azure Fundamentals',
          'AWS Certified Solutions Architect - Associate', 'Kubernetes']" 
        />
        <TopSkillsCategory 
          title="Leadership" 
          :skills="['Leadership', 'Management Skills', 'Project Management', 'Personal Productivity', 'Emotional Intelligence']" 
        />
        <TopSkillsCategory 
          title="Certifications by Skill" 
          :skills="['Cybersecurity Certification', 'Project Management Certification', 'Cloud Certification',
          'Data Analytics Certification', 'HR Management Certification', 'See all Certification']" 
        />
        <TopSkillsCategory 
          title="Data Science" 
          :skills="['Data Science', 'Python', 'Machine Learning', 'ChatGPT', 'Deep Learning']" 
        />
        <TopSkillsCategory 
          title="Communication" 
          :skills="['Communication Skills', 'Presentation Skills', 'Public Speaking', 'Writing', 'PowerPoint']" 
        />
        <TopSkillsCategory 
          title="Business Analytics & Intelligence" 
          :skills="['Microsoft Excel', 'SQL', 'Microsoft Power BI', 'Data Analysis', 'Business Analysis']" 
        />
      </div>
    </div>
  </template>
  