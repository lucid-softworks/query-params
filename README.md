# `@lucid-softworks/query-params`

Deterministic query-parameter parsing and serialization built on the platform
`URLSearchParams`.

```ts
stringifyQueryParameters({ tag: ["js", "ts"], page: 2 });
// "page=2&tag=js&tag=ts"
```

Arrays use repeated keys. Parsing preserves repetitions as arrays; single
values remain strings. Null, sorting, and leading-`?` policies are explicit.
