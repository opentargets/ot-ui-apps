import { ReactElement } from "react";
import { decimalPlaces } from "@ot/constants";

type ScientificNotationProps = {
  number: number | number[];
  dp?: number;
};

function ScientificNotation({
  number,
  dp = decimalPlaces,
}: ScientificNotationProps): ReactElement | null {
  if (!number) return null;

  let mantissa: number | string;
  let exponent: number | string;

  if (Array.isArray(number)) {
    [mantissa, exponent] = number;
  } else {
    [mantissa, exponent] = number.toExponential().split("e");
    exponent = exponent.charAt(0) === "+" ? exponent.slice(1) : exponent;
  }

  mantissa = Number(mantissa).toFixed(dp);

  return (
    <>
      {mantissa}
      {exponent && <>&times;10</>}
      {exponent && <sup>{exponent}</sup>}
    </>
  );
}

export default ScientificNotation;
