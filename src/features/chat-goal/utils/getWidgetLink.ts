const getWidgetLink = (id: string) => {
  const origin =
    (typeof window !== "undefined" && window.location.origin) || "";

  return `${origin}/chat-goal-widget?id=${id}`;
};

export default getWidgetLink;
