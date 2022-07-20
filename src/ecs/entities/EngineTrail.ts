import { addComponent, addEntity, defineComponent } from "bitecs";
import { World } from "..";
import { Vec2 } from "../../math";
import { addPosition } from "../components/Position";
import { addRender, Shape } from "../components/Render";

export const EngineTrail = defineComponent();
type EngineTrailCreateParams = {
  position: Vec2;
  size: number;
};
export const createEngineTrail = (
  world: World,
  params: EngineTrailCreateParams
): number => {
  const eid = addEntity(world);
  addComponent(world, EngineTrail, eid);
  const { position, size } = params;
  addPosition(world, eid, position);
  addRender(world, eid, Shape.Circle, 0x0011ff, size);
  return eid;
};
