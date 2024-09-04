import { ReactElement } from "react";
import { decimalPlaces } from "../constants";

type ScientificNotationProps = {
  number: number | number[];
};

function ScientificNotation({ number }: ScientificNotationProps): ReactElement | null {
  if (!number) return null;

  let mantissa: number | string;
  let exponent: number | string;

  if (Array.isArray(number)) {
    [mantissa, exponent] = number;
  } else {
    [mantissa, exponent] = number.toExponential().split("e");
    exponent = exponent.charAt(0) === "+" ? exponent.slice(1) : exponent;
  }

  mantissa = parseFloat(parseFloat(String(mantissa)).toFixed(decimalPlaces));

  return (
    <>
      {mantissa}
      {exponent && <>&times;10</>}
      {exponent && <sup>{exponent}</sup>}
    </>
  );
}

export default ScientificNotation;
