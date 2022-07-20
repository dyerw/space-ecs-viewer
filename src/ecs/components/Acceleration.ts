import { addComponent, defineComponent, hasComponent } from "bitecs";
import { World } from "..";
import { Vec2 } from "../../math";
import { Vector2 } from "../types";
import { safeUpdateComponent } from "../util";

export const Acceleration = defineComponent(Vector2);
export const getAcceleration = (
  world: World,
  eid: number
): Vec2 | undefined => {
  if (hasComponent(world, Acceleration, eid)) {
    return {
      x: Acceleration.x[eid],
      y: Acceleration.y[eid],
    };
  }
  return undefined;
};
export const setAcceleration = (world: World, eid: number, acc: Vec2) => {
  safeUpdateComponent(world, eid, Acceleration, (a) => {
    a.x[eid] = acc.x;
    a.y[eid] = acc.y;
  });
};
export const addAcceleration = (world: World, eid: number, acc: Vec2) => {
  addComponent(world, Acceleration, eid);
  setAcceleration(world, eid, acc);
};
