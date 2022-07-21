// import { array } from "vectorious";

export type Vec2 = {
  x: number;
  y: number;
};

export type Circle = {
  center: Vec2;
  r: number;
};

export const circlesOverlap = (c1: Circle, c2: Circle): boolean =>
  distance(c1.center, c1.center) <= c1.r + c2.r;

export const normOfRotation = (radians: number): Vec2 => ({
  x: Math.cos(radians),
  y: Math.sin(radians),
});

export const vecFromAngleMag = (radians: number, magnitude: number): Vec2 =>
  scale(normOfRotation(radians), magnitude);

export const angleMagFromVec = (v: Vec2): { radians: number; mag: number } => ({
  mag: norm(v),
  radians: Math.atan2(v.y, v.x),
});

export const norm = (v: Vec2): number =>
  Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));

export const scale = (v: Vec2, scalar: number): Vec2 => {
  return {
    x: v.x * scalar,
    y: v.y * scalar,
  };
};

export const getUnitVec = (v: Vec2): Vec2 =>
  vecFromAngleMag(angleMagFromVec(v).radians, 1);

export const add = (v1: Vec2, v2: Vec2): Vec2 => {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  };
};

export const sum = (vs: Vec2[]): Vec2 =>
  vs.reduce((prev, curr) => add(prev, curr), { x: 0, y: 0 });

export const subtract = (v1: Vec2, v2: Vec2): Vec2 => {
  return {
    x: v1.x - v2.x,
    y: v1.y - v2.y,
  };
};

export const distance = (v1: Vec2, v2: Vec2): number =>
  Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const pointAt = (p1: Vec2, p2: Vec2): number => {
  const dist = subtract(p2, p1);
  let angle = Math.atan2(dist.y, dist.x);
  // if (dist.x < 0) {
  //   angle -= Math.PI;
  // }
  return angle;
};

export const projectVelocity = (start: Vec2, velocity: Vec2, time: number) =>
  add(start, scale(velocity, time));

// For 0 <= t <= 1
export const accelerationOfCubicBezierCurve = (
  p0: Vec2,
  p1: Vec2,
  p2: Vec2,
  p3: Vec2,
  t: number
): Vec2 =>
  sum([
    scale(p0, -6 * t + 6),
    scale(p1, 18 * t - 12),
    scale(p2, -18 * t + 6),
    scale(p3, 6 * t),
  ]);
