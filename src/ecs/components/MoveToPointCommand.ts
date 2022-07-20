import { addComponent, defineComponent, hasComponent } from "bitecs";
import { World } from "..";
import { Vec2 } from "../../math";
import { Vector2 } from "../types";
import { safeUpdateComponent } from "../util";

export const MoveToPointCommand = defineComponent({ destination: Vector2 });
export const setMoveToPointCommand = (
  world: World,
  eid: number,
  destination: Vec2
) => {
  safeUpdateComponent(world, eid, MoveToPointCommand, (mtpc) => {
    mtpc.destination.x[eid] = destination.x;
    mtpc.destination.y[eid] = destination.y;
  });
};
export const getMoveToPointCommand = (
  world: World,
  eid: number
): { destination: Vec2 } | undefined => {
  if (hasComponent(world, MoveToPointCommand, eid)) {
    return {
      destination: {
        x: MoveToPointCommand.destination.x[eid],
        y: MoveToPointCommand.destination.y[eid],
      },
    };
  }
  return undefined;
};
export const addMoveToPointCommand = (
  world: World,
  eid: number,
  destination: Vec2
) => {
  addComponent(world, MoveToPointCommand, eid);
  setMoveToPointCommand(world, eid, destination);
};
