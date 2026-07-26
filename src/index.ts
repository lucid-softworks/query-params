export type QueryParameter = string | number | boolean | null | undefined;
export type QueryParameterValue = QueryParameter | readonly QueryParameter[];
export type QueryParameters = Readonly<Record<string, QueryParameterValue>>;

export interface StringifyQueryParametersOptions {
  readonly sort?: boolean;
  readonly nullValue?: "empty" | "string" | "omit";
  readonly prefix?: boolean;
}

/** Serializes records with repeat-key array semantics. */
export function stringifyQueryParameters(
  parameters: QueryParameters,
  options: StringifyQueryParametersOptions = {},
): string {
  const search = new URLSearchParams();
  const keys = Object.keys(parameters);
  if (options.sort ?? true)
    keys.sort((left, right) => left.localeCompare(right));
  for (const key of keys) {
    const raw = parameters[key];
    const values = Array.isArray(raw) ? raw : [raw];
    for (const value of values) {
      if (
        value === undefined ||
        (value === null && options.nullValue === "omit")
      )
        continue;
      search.append(
        key,
        value === null
          ? options.nullValue === "string"
            ? "null"
            : ""
          : String(value),
      );
    }
  }
  const output = search.toString();
  return options.prefix && output ? `?${output}` : output;
}

/** Parses repeated keys into arrays while leaving single values as strings. */
export function parseQueryParameters(
  input: string | URLSearchParams,
): Record<string, string | string[]> {
  const search =
    typeof input === "string"
      ? new URLSearchParams(input.startsWith("?") ? input.slice(1) : input)
      : input;
  const output: Record<string, string | string[]> = {};
  for (const [key, value] of search) {
    const existing = output[key];
    if (existing === undefined) output[key] = value;
    else if (Array.isArray(existing)) existing.push(value);
    else output[key] = [existing, value];
  }
  return output;
}
