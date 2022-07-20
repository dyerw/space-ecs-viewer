import { addComponent, defineComponent, hasComponent, Types } from "bitecs";
import { World } from "..";
import { safeUpdateComponent } from "../util";

type RotationT = { radians: number };

export const Rotation = defineComponent({ radians: Types.f32 });
export const getRotation = (
  world: World,
  eid: number
): RotationT | undefined => {
  if (hasComponent(world, Rotation, eid)) {
    return {
      radians: Rotation.radians[eid],
    };
  }
  return undefined;
};
export const setRotation = (world: World, eid: number, radians: number) => {
  safeUpdateComponent(world, eid, Rotation, (r) => {
    r.radians[eid] = radians;
  });
};
export const addRotation = (world: World, eid: number, radians: number) => {
  addComponent(world, Rotation, eid);
  setRotation(world, eid, radians);
};
