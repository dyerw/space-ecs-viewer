import { defineQuery } from "bitecs";
import { World } from ".";
import { Vec2 } from "../math";
import { getPosition, Position } from "./components/Position";
import { getRender, Render, RenderT } from "./components/Render";
import { getRotation } from "./components/Rotation";

export type Renderable = RenderT & {
  position: Vec2;
  rotation: number;
  eid: number;
};

const renderQuery = defineQuery<World>([Render, Position]);
export const getRenderList = (world: World): Renderable[] => {
  const ents = renderQuery(world);
  let renderables: Renderable[] = [];
  for (let eid of ents) {
    const position = getPosition(world, eid);
    const render = getRender(world, eid);
    const rotation = getRotation(world, eid);
    if (position && render) {
      renderables.push({
        eid,
        position,
        rotation: rotation?.radians || 0,
        ...render,
      });
    }
  }
  return renderables;
};
