const getWidgetLink = (id: string) => {
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3002/?id=${id}`;
  }

  const origin =
    (typeof window !== 'undefined' && window.location.origin) || '';

  return `${origin}/widgets?id=${id}`;
};

export default getWidgetLink;
