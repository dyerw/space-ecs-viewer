// import { array } from "vectorious";

export type Vec2 = {
  x: number;
  y: number;
};

export const normOfRotation = (radians: number): Vec2 => ({
  x: Math.cos(radians),
  y: Math.sin(radians),
});

export const norm = (v: Vec2): number =>
  Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));

export const scale = (v: Vec2, scalar: number): Vec2 => {
  return {
    x: v.x * scalar,
    y: v.y * scalar,
  };
};

export const add = (v1: Vec2, v2: Vec2): Vec2 => {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  };
};

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
  const dist = subtract(p1, p2);
  let angle = Math.atan2(dist.y, dist.x);
  if (dist.x < 0) {
    angle += Math.PI;
  }
  return angle;
};
