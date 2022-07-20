import { addComponent, defineComponent, hasComponent } from "bitecs";
import { World } from "..";
import { Vec2 } from "../../math";
import { Vector2 } from "../types";
import { safeUpdateComponent } from "../util";

export const Velocity = defineComponent(Vector2);
export const setVelocity = (world: World, eid: number, vel: Vec2) => {
  safeUpdateComponent(world, eid, Velocity, (v) => {
    v.x[eid] = vel.x;
    v.y[eid] = vel.y;
  });
};
export const addVelocity = (world: World, eid: number, vel: Vec2) => {
  addComponent(world, Velocity, eid);
  setVelocity(world, eid, vel);
};
export const getVelocity = (world: World, eid: number): Vec2 | undefined => {
  if (hasComponent(world, Velocity, eid)) {
    return { x: Velocity.x[eid], y: Velocity.y[eid] };
  }
  return undefined;
};
