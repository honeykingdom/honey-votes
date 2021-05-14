const getDevicePixelRatio = () =>
  typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;

export default getDevicePixelRatio;
