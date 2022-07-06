export const calculatePower = (
  multiplier: string,
  mass: string = "",
  height: string = ""
): string => {
  if (
    multiplier &&
    height &&
    mass &&
    ![multiplier, height, mass].includes("unknown")
  ) {
    return `${
      +multiplier.replace(/,/g, "") * +height * +mass.replace(/,/g, "")
    }`;
  }
  return "-";
};

export const debounce = (
  func: (e: React.ChangeEvent<HTMLInputElement>) => void,
  ms = 300
) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), ms);
  };
};
