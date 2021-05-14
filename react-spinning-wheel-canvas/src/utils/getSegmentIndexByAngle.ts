const getSegmentIndexByAngle = (
  /** Angle from 0 to Math.PI * 2 */
  rotationAngle: number,
  segmentAngle: number
) => {
  // TODO:
  const normalizedAngle =
    Math.abs((rotationAngle % (Math.PI * 2)) - Math.PI * 2) + Math.PI;

  return Math.floor((normalizedAngle % (Math.PI * 2)) / segmentAngle);
};

export default getSegmentIndexByAngle;
