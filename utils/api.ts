export const toObject = (doc: unknown) => {
  return JSON.parse(
    JSON.stringify(
      doc,
      (_key, value) =>
        typeof value === 'bigint' ? Number(value.toString()) : value, // return everything else unchanged
    ),
  );
};
