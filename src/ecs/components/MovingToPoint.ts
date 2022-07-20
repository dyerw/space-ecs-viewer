import { addComponent, defineComponent, hasComponent } from "bitecs";
import { World } from "..";
import { Vec2 } from "../../math";
import { Vector2 } from "../types";
import { safeUpdateComponent } from "../util";

export const MovingTo = defineComponent(Vector2);
export const setMovingTo = (world: World, eid: number, destination: Vec2) => {
  safeUpdateComponent(world, eid, MovingTo, (mt) => {
    mt.x[eid] = destination.x;
    mt.y[eid] = destination.y;
  });
};
export const getMovingTo = (world: World, eid: number): Vec2 | undefined => {
  if (hasComponent(world, MovingTo, eid)) {
    return {
      x: MovingTo.x[eid],
      y: MovingTo.y[eid],
    };
  }
  return undefined;
};
export const addMovingTo = (world: World, eid: number, destination: Vec2) => {
  addComponent(world, MovingTo, eid);
  setMovingTo(world, eid, destination);
};
