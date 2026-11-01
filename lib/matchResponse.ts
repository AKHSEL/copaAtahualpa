export function matchResponse<T extends { venue: string }>(record: T): Omit<T, "venue"> {
  const response = { ...record };
  Reflect.deleteProperty(response, "venue");
  return response;
}
