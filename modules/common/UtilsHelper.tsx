export const formatCurrency = (
  number: any,
  excludeDollarSign: boolean = false
) => {
  if (isNaN(number)) return number;

  // Create our number formatter.
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  let numberFormatted = formatter.format(number);

  if (excludeDollarSign) numberFormatted = numberFormatted.replace("$", "");

  return numberFormatted;
};
