const parseSearchParams = (search: string) =>
  search
    .split('&')
    .map((x) => x.split('='))
    .reduce<Record<string, string>>((acc, [k, v]) => ({ ...acc, [k]: v }), {});

export default parseSearchParams;
