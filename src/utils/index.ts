export function generateFilterOptions<T>(data: T[], key: keyof T) {
  const values = new Set<string>();

  for (const item of data) {
    const v = item[key];
    if (v !== undefined && v !== null) {
      values.add(String(v));
    }
  }

  return Array.from(values);
}

export function getFormatedData<T, K extends keyof T>(
  data: T[],
  keys: K[],
): Pick<T, K>[] {
  return data.map((item) => {
    const formatedData = {} as Pick<T, K>;

    keys.forEach((k) => {
      formatedData[k] = item[k];
    });
    return formatedData;
  });
}

export const floors = [
  { label: "Floor 1", value: "1" },
  { label: "Floor 2", value: "2" },
  { label: "Floor 3", value: "3" },
  { label: "Floor 4", value: "4" },
  { label: "Floor 5", value: "5" },
  { label: "Floor 6", value: "6" },
  { label: "Floor 7", value: "7" },
  { label: "Floor 8", value: "8" },
];
