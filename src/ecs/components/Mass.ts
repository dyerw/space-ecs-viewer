import { addComponent, defineComponent, hasComponent, Types } from "bitecs";
import { World } from "..";

export const Mass = defineComponent({ value: Types.f32 });
export const getMass = (world: World, eid: number): number | undefined => {
  if (hasComponent(world, Mass, eid)) {
    return Mass.value[eid];
  }
  return undefined;
};
export const setMass = (world: World, eid: number, mass: number) => {
  if (hasComponent(world, Mass, eid)) {
    Mass.value[eid] = mass;
  } else {
    console.warn(`Attempted to set mass on eid ${eid} without Mass component`);
  }
};
export const addMass = (world: World, eid: number, mass: number) => {
  addComponent(world, Mass, eid);
  setMass(world, eid, mass);
};
