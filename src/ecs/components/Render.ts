import { addComponent, defineComponent, hasComponent, Types } from "bitecs";
import { World } from "../";

export enum Shape {
  Circle,
  Triangle,
}

export type RenderT = {
  shape: Shape;
  color: number;
  size: number;
  originalSize: number;
};

export const Render = defineComponent({
  shape: Types.i8,
  color: Types.i32,
  size: Types.f32,
  originalSize: Types.f32,
});
export const setRender = (eid: number, render: Partial<RenderT>): void => {
  const { shape, color, size, originalSize } = render;
  if (shape) {
    Render.shape[eid] = shape;
  }
  if (color) {
    Render.color[eid] = color;
  }
  if (size) {
    Render.size[eid] = size;
  }
  if (originalSize) {
    Render.originalSize[eid] = originalSize;
  }
};
export const getRender = (world: World, eid: number): RenderT | undefined => {
  if (hasComponent(world, Render, eid)) {
    return {
      shape: Render.shape[eid],
      color: Render.color[eid],
      size: Render.size[eid],
      originalSize: Render.originalSize[eid],
    };
  }
  return undefined;
};
export const addRender = (
  world: World,
  eid: number,
  shape: Shape,
  color: number,
  size: number
) => {
  addComponent(world, Render, eid);
  setRender(eid, { shape, color, size, originalSize: size });
};
