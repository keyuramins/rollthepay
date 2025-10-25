// lib/utils/similarity.ts
import type { OccupationRecord } from "@/lib/data/types";

/**
 * Calculate similarity between two occupation titles using string similarity
 */
export function calculateTitleSimilarity(title1: string, title2: string): number {
  if (!title1 || !title2) return 0;
  
  const normalized1 = title1.toLowerCase().trim();
  const normalized2 = title2.toLowerCase().trim();
  
  // Exact match
  if (normalized1 === normalized2) return 1.0;
  
  // Check for common words
  const words1 = normalized1.split(/\s+/);
  const words2 = normalized2.split(/\s+/);
  
  const commonWords = words1.filter(word => words2.includes(word));
  const totalWords = new Set([...words1, ...words2]).size;
  
  if (totalWords === 0) return 0;
  
  return commonWords.length / totalWords;
}

/**
 * Calculate skill overlap between two occupation records
 */
export function calculateSkillOverlap(skills1: string[], skills2: string[]): number {
  if (!skills1.length || !skills2.length) return 0;
  
  const normalized1 = skills1.map(s => s.toLowerCase().trim());
  const normalized2 = skills2.map(s => s.toLowerCase().trim());
  
  const commonSkills = normalized1.filter(skill => normalized2.includes(skill));
  const totalSkills = new Set([...normalized1, ...normalized2]).size;
  
  if (totalSkills === 0) return 0;
  
  return commonSkills.length / totalSkills;
}

/**
 * Calculate overall relevance score for an occupation
 */
export function calculateRelevanceScore(currentRecord: OccupationRecord, candidateRecord: OccupationRecord): number {
  const currentTitle = currentRecord.title?.toLowerCase() || '';
  const candidateTitle = candidateRecord.title?.toLowerCase() || '';
  
  const currentSkills = [
    currentRecord.skillsNameOne?.toLowerCase(),
    currentRecord.skillsNameTwo?.toLowerCase(),
    currentRecord.skillsNameThree?.toLowerCase()
  ].filter(Boolean) as string[];
  
  const candidateSkills = [
    candidateRecord.skillsNameOne?.toLowerCase(),
    candidateRecord.skillsNameTwo?.toLowerCase(),
    candidateRecord.skillsNameThree?.toLowerCase()
  ].filter(Boolean) as string[];
  
  // Calculate similarity scores
  const titleSimilarity = calculateTitleSimilarity(currentTitle, candidateTitle);
  const skillOverlap = calculateSkillOverlap(currentSkills, candidateSkills);
  
  // Geographic bonus (same location gets higher score)
  let geographicBonus = 0;
  if (currentRecord.country === candidateRecord.country) {
    geographicBonus += 0.1;
    if (currentRecord.state === candidateRecord.state) {
      geographicBonus += 0.1;
      if (currentRecord.location === candidateRecord.location) {
        geographicBonus += 0.1;
      }
    }
  }
  
  // Salary proximity bonus (similar salary ranges get higher score)
  let salaryBonus = 0;
  if (currentRecord.avgAnnualSalary && candidateRecord.avgAnnualSalary) {
    const salaryDiff = Math.abs(currentRecord.avgAnnualSalary - candidateRecord.avgAnnualSalary);
    const avgSalary = (currentRecord.avgAnnualSalary + candidateRecord.avgAnnualSalary) / 2;
    const salarySimilarity = 1 - (salaryDiff / avgSalary);
    salaryBonus = Math.max(0, salarySimilarity * 0.2);
  }
  
  // Weighted combination
  return (titleSimilarity * 0.4) + (skillOverlap * 0.4) + geographicBonus + salaryBonus;
}

/**
 * Get common skills between two occupation records
 */
export function getCommonSkills(record1: OccupationRecord, record2: OccupationRecord): string[] {
  const skills1 = [
    record1.skillsNameOne,
    record1.skillsNameTwo,
    record1.skillsNameThree
  ].filter(Boolean) as string[];
  
  const skills2 = [
    record2.skillsNameOne,
    record2.skillsNameTwo,
    record2.skillsNameThree
  ].filter(Boolean) as string[];
  
  return skills1.filter(skill => 
    skills2.some(skill2 => skill.toLowerCase() === skill2.toLowerCase())
  );
}

/**
 * Calculate salary difference percentage
 */
export function calculateSalaryDifference(currentSalary: number | null, relatedSalary: number | null): string {
  if (!currentSalary || !relatedSalary) return 'N/A';
  
  const difference = relatedSalary - currentSalary;
  const percentage = (difference / currentSalary) * 100;
  
  if (percentage > 0) {
    return `+${percentage.toFixed(1)}%`;
  } else if (percentage < 0) {
    return `${percentage.toFixed(1)}%`;
  } else {
    return 'Same';
  }
}

/**
 * Industry classification based on occupation title
 */
export function getIndustryCategory(title: string): string {
  const normalizedTitle = title.toLowerCase();
  
  // Technology
  if (normalizedTitle.includes('software') || normalizedTitle.includes('developer') || 
      normalizedTitle.includes('engineer') || normalizedTitle.includes('programmer') ||
      normalizedTitle.includes('analyst') || normalizedTitle.includes('data')) {
    return 'Technology';
  }
  
  // Finance
  if (normalizedTitle.includes('accountant') || normalizedTitle.includes('finance') ||
      normalizedTitle.includes('banking') || normalizedTitle.includes('financial') ||
      normalizedTitle.includes('bookkeeper') || normalizedTitle.includes('auditor')) {
    return 'Finance';
  }
  
  // Healthcare
  if (normalizedTitle.includes('nurse') || normalizedTitle.includes('doctor') ||
      normalizedTitle.includes('medical') || normalizedTitle.includes('healthcare') ||
      normalizedTitle.includes('therapist') || normalizedTitle.includes('physician')) {
    return 'Healthcare';
  }
  
  // Education
  if (normalizedTitle.includes('teacher') || normalizedTitle.includes('professor') ||
      normalizedTitle.includes('educator') || normalizedTitle.includes('instructor')) {
    return 'Education';
  }
  
  // Sales & Marketing
  if (normalizedTitle.includes('sales') || normalizedTitle.includes('marketing') ||
      normalizedTitle.includes('manager') || normalizedTitle.includes('director')) {
    return 'Sales & Marketing';
  }
  
  return 'Other';
}
