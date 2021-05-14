import { useEffect, useState } from "react";
import getDevicePixelRatio from "../utils/getDevicePixelRatio";

const useDevicePixelRatio = () => {
  const [scale, setScale] = useState(getDevicePixelRatio);

  useEffect(() => {
    const handleResize = () => setScale(getDevicePixelRatio());

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return scale;
};

export default useDevicePixelRatio;
