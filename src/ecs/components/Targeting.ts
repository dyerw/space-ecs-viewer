import { addComponent, defineComponent, hasComponent, Types } from "bitecs";
import { World } from "..";
import { safeUpdateComponent } from "../util";

type TargetingT = {
  eid: number;
};
export const Targeting = defineComponent({ eid: Types.eid });
export const getTarget = (
  world: World,
  eid: number
): TargetingT | undefined => {
  if (hasComponent(world, Targeting, eid)) {
    return { eid: Targeting.eid[eid] };
  }
  return undefined;
};
export const setTarget = (world: World, eid: number, targetEid: number) => {
  safeUpdateComponent(world, eid, Targeting, (t) => {
    t.eid[eid] = targetEid;
  });
};
export const addTarget = (world: World, eid: number, targetEid: number) => {
  if (!hasComponent(world, Targeting, eid)) {
    addComponent(world, Targeting, eid);
  }
  setTarget(world, eid, targetEid);
};
