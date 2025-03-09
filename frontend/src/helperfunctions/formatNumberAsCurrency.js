// turn a number into a currency format
export const formatNumberAsCurrency = (number) => {
    // add , or . based on the locale
    // ex: turn 1000 into 1,000.00
    // remove the currency symbol

    const locale = navigator.language;
    const currency = locale.includes('en') ? 'USD' : 'EUR';
    const formattedNumber = number.toLocaleString(locale, { style: 'currency', currency: currency });
    
    // Remove the currency symbol by matching any non-digit character at the start
    // and any whitespace that might follow it
    return formattedNumber.replace(/^[^\d]+\s?/, '');
}