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

export const decodeName = (text: string) => {
  return text.replace("&amp;", "&");
};

export const getInitials = (name?: string) => {
  if (!name) return "";

  const palabras = name.split(" ");

  if (palabras.length > 1) {
    const inicial1 = palabras[0][0].toUpperCase();
    const inicial2 = palabras[1][0].toUpperCase();

    return inicial1 + inicial2;
  } else {
    return name.slice(0, 2).toUpperCase();
  }
};
