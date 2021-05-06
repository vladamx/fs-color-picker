import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
// NOTE: in order to remove dependency on react-native in core,
// we could pass color picker radius as a prop
export const COLOR_PICKER_RADIUS = windowWidth / 3.5;

export const cartesianToPolar = (x: number, y: number) => {
  "worklet";
  const radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return {
    radius,
    theta: (Math.atan2(y, x) * 180) / Math.PI,
  };
};

export const polarToCartesian = (theta: number, radius: number) => {
  "worklet";
  return {
    x: COLOR_PICKER_RADIUS + radius * Math.cos((theta * Math.PI) / 180),
    y: COLOR_PICKER_RADIUS + radius * Math.sin((theta * Math.PI) / 180),
  };
};

export const radius = (
  xOffset: number,
  yOffset: number,
  circleRadius = COLOR_PICKER_RADIUS
) => {
  "worklet";
  const radius = Math.sqrt(
    Math.pow(xOffset - circleRadius, 2) + Math.pow(yOffset - circleRadius, 2)
  );
  const polar = cartesianToPolar(
    xOffset - COLOR_PICKER_RADIUS,
    yOffset - COLOR_PICKER_RADIUS
  );
  const coordinates = polarToCartesian(
    polar.theta,
    radius >= circleRadius ? circleRadius : radius
  );
  return {
    x: coordinates.x,
    y: coordinates.y,
  };
};

export const offsetToPolar = (xOffset: number, yOffset: number) => {
  "worklet";
  const coordinates = radius(xOffset, yOffset);
  const polar = cartesianToPolar(
    coordinates.x - COLOR_PICKER_RADIUS,
    coordinates.y - COLOR_PICKER_RADIUS
  );
  return {
    radius: polar.radius,
    theta: polar.theta < 0 ? 360 + polar.theta : polar.theta,
  };
};

export const polarToColor = (
  xOffset: number,
  yOffset: number,
  { hueOffset = 0, light = 1 } = { hueOffset: 0, light: 1 }
) => {
  "worklet";
  const polar = offsetToPolar(xOffset, yOffset);
  return `hsla(${Math.round((polar.theta + hueOffset) % 360)}, ${Math.round(
    polar.radius
  )}%, 60%, ${Math.round((light + Number.EPSILON) * 100) / 100})`;
};
