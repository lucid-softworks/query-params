import { describe, expect, it } from "vitest";

import {
  parseQueryParameters,
  stringifyQueryParameters,
} from "../src/index.js";

describe("query parameters", () => {
  it("serializes sorted keys, arrays, scalars, and omissions", () => {
    expect(
      stringifyQueryParameters({
        z: true,
        a: [1, 2],
        empty: null,
        omitted: undefined,
      }),
    ).toBe("a=1&a=2&empty=&z=true");
  });

  it("supports null and output policies", () => {
    expect(
      stringifyQueryParameters(
        { b: null, a: null },
        { sort: false, nullValue: "string", prefix: true },
      ),
    ).toBe("?b=null&a=null");
    expect(
      stringifyQueryParameters(
        { value: null },
        { nullValue: "omit", prefix: true },
      ),
    ).toBe("");
  });

  it("parses single and repeated keys with standard decoding", () => {
    expect(parseQueryParameters("?a=1&a=2&message=hello+world")).toEqual({
      a: ["1", "2"],
      message: "hello world",
    });
    expect(parseQueryParameters("single=value")).toEqual({ single: "value" });
    const search = new URLSearchParams("a=1&a=2&a=3");
    expect(parseQueryParameters(search)).toEqual({ a: ["1", "2", "3"] });
  });
});
