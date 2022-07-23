import { addComponent, defineComponent, hasComponent, Types } from "bitecs";
import { World } from "..";
import { safeUpdateComponent } from "../util";

type DesiredRotationT = { radians: number };

export const DesiredRotation = defineComponent({ radians: Types.f32 });
export const getDesiredRotation = (
  world: World,
  eid: number
): DesiredRotationT | undefined => {
  if (hasComponent(world, DesiredRotation, eid)) {
    return {
      radians: DesiredRotation.radians[eid],
    };
  }
  return undefined;
};
export const setDesiredRotation = (
  world: World,
  eid: number,
  radians: number
) => {
  safeUpdateComponent(world, eid, DesiredRotation, (r) => {
    r.radians[eid] = radians;
  });
};
export const addDesiredRotation = (
  world: World,
  eid: number,
  radians: number
) => {
  if (!hasComponent(world, DesiredRotation, eid)) {
    addComponent(world, DesiredRotation, eid);
  }
  setDesiredRotation(world, eid, radians);
};
