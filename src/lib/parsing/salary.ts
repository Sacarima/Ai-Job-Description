import type { SkillMatrix } from "@/lib/schema/skillMatrixSchema";

type Salary = NonNullable<SkillMatrix["salary"]>;
type Currency = Salary["currency"];

export function extractSalary(text: string): Salary | undefined {
  const lower = text.toLowerCase();


  let currency: Currency | undefined;
  if (/\bpln\b|\bzł\b|zloty/.test(lower)) {
    currency = "PLN";
  } else if (/\beur\b|\beuro\b|€/.test(lower)) {
    currency = "EUR";
  } else if (/\bgbp\b|\bpounds?\b|£/.test(lower)) {
    currency = "GBP";
  } else if (/\busd\b|\bdollars?\b|\$/i.test(lower)) {
    currency = "USD";
  }

  
  const rangeRe =
    /(\d{2,3})(?:\s?k|\s?000)?\s*[-–]\s*(\d{2,3})(?:\s?k|\s?000)?/i;
  const rangeMatch = lower.match(rangeRe);

  let min: number | undefined;
  let max: number | undefined;

  if (rangeMatch) {
    min = Number(rangeMatch[1]);
    max = Number(rangeMatch[2]);
   
    if (min < 1000) {
      min *= 1000;
      max *= 1000;
    }
  } else {

    const singleRe = /(\d{2,3})(?:\s?k|\s?000)?/i;
    const singleMatch = lower.match(singleRe);
    if (singleMatch) {
      min = max = Number(singleMatch[1]);
      if (min < 1000) {
        min *= 1000;
        max *= 1000;
      }
    }
  }

  if (!currency || min === undefined || max === undefined) {
    return undefined;
  }

  return {
    currency,
    min,
    max,
  };
}
