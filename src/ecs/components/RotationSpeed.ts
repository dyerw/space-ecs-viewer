import { addComponent, defineComponent, hasComponent, Types } from "bitecs";
import { World } from "..";
import { safeUpdateComponent } from "../util";

export const RotationSpeed = defineComponent({ radiansPerTick: Types.f32 });
export const getRotationSpeed = (
  world: World,
  eid: number
): { radiansPerTick: number } | undefined => {
  if (hasComponent(world, RotationSpeed, eid)) {
    return {
      radiansPerTick: RotationSpeed.radiansPerTick[eid],
    };
  }
  return undefined;
};
export const setRotationSpeed = (
  world: World,
  eid: number,
  radiansPerTick: number
) => {
  safeUpdateComponent(world, eid, RotationSpeed, (rs) => {
    rs.radiansPerTick[eid] = radiansPerTick;
  });
};
export const addRotationSpeed = (
  world: World,
  eid: number,
  radiansPerTick: number
) => {
  addComponent(world, RotationSpeed, eid);
  setRotationSpeed(world, eid, radiansPerTick);
};
