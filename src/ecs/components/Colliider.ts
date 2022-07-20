import { addComponent, defineComponent, hasComponent, Types } from "bitecs";
import { World } from "..";
import { safeUpdateComponent } from "../util";

// For now everything is just circular collision
export const Collider = defineComponent({ radius: Types.f32 });
export const setCollider = (world: World, eid: number, radius: number) => {
  safeUpdateComponent(world, eid, Collider, (col) => {
    col.radius[eid] = radius;
  });
};
export const getCollider = (
  world: World,
  eid: number
): { radius: number } | undefined => {
  if (hasComponent(world, Collider, eid)) {
    return {
      radius: Collider.radius[eid],
    };
  }
  return undefined;
};
export const addCollider = (world: World, eid: number, radius: number) => {
  addComponent(world, Collider, eid);
  setCollider(world, eid, radius);
};
