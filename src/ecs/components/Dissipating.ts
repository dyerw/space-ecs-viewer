import { addComponent, defineComponent, hasComponent, Types } from "bitecs";
import { World } from "../";
import { safeUpdateComponent } from "../util";

/**
 * Render objects that are shrinking in size and eventually disappearing.
 */
export type DissipatingT = { rate: number };

export const Dissipating = defineComponent({
  rate: Types.f32,
});
export const setDissipating = (
  world: World,
  eid: number,
  rate: DissipatingT["rate"]
): void => {
  safeUpdateComponent(world, eid, Dissipating, (d) => {
    d.rate[eid] = rate;
  });
};
export const getDissipating = (
  world: World,
  eid: number
): DissipatingT | undefined => {
  if (hasComponent(world, Dissipating, eid)) {
    return {
      rate: Dissipating.rate[eid],
    };
  }
  return undefined;
};
export const addDissipating = (world: World, eid: number, rate: number) => {
  if (!hasComponent(world, Dissipating, eid)) {
    addComponent(world, Dissipating, eid);
  }
  setDissipating(world, eid, rate);
};
