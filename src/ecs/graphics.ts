import { addComponent, defineComponent } from "bitecs";
import { World } from ".";

export const Render = defineComponent();
export const addRender = (world: World, eid: number) => {
  addComponent(world, Render, eid);
};
