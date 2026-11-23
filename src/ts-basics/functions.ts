function calculateTax(income: number, taxYear?: number): number {
  if ((taxYear || 2022) < 2023) return income * 1.2;
  return income * 1.3;
}

let tax1 = calculateTax(10000, 2022); // returns 12000

console.log(tax1);
