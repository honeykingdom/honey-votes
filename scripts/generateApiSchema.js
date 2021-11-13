const fs = require("fs/promises");
const axios = require("axios");
const R = require("ramda");

const main = async () => {
  const [, , url, path] = process.argv;

  if (!url || !path) return;

  const response = await axios.get(url);

  const rawSchema = response.data.components.schemas;

  const schema = Object.entries(rawSchema).reduce(
    (acc, [key, { properties: rawProperties }]) => {
      if (!rawProperties) return acc;

      const properties = Object.entries(rawProperties).reduce((acc, [k, v]) => {
        const property = R.omit(
          [
            "type",
            "description",
            "format",
            "nullable",
            "$ref",
            "allOf",
            "items",
          ],
          v
        );

        if (Object.keys(property).length === 0) return acc;

        return { ...acc, [k]: property };
      }, {});

      if (Object.keys(properties).length === 0) return acc;

      return { ...acc, [key]: properties };
    },
    {}
  );

  await fs.writeFile(path, JSON.stringify(schema, null, 2));
};

main();
