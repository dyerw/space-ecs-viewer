import { addComponent, defineComponent, hasComponent } from "bitecs";
import { World } from "..";
import { Vec2 } from "../../math";
import { Vector2 } from "../types";

export const Position = defineComponent(Vector2);
export const setPosition = (eid: number, pos: Vec2) => {
  Position.x[eid] = pos.x;
  Position.y[eid] = pos.y;
};
export const addPosition = (world: World, eid: number, pos: Vec2) => {
  addComponent(world, Position, eid);
  setPosition(eid, pos);
};
export const getPosition = (world: World, eid: number): Vec2 | undefined => {
  if (hasComponent(world, Position, eid)) {
    return {
      x: Position.x[eid],
      y: Position.y[eid],
    };
  }
  return undefined;
};
