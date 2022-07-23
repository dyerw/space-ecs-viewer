import { addComponent, addEntity, defineComponent } from "bitecs";
import { World } from "..";
import { Vec2 } from "../../math";
import { addDissipating } from "../components/Dissipating";
import { addPosition } from "../components/Position";
import { addRender, Shape } from "../components/Render";

export const EngineTrail = defineComponent();
type EngineTrailCreateParams = {
  position: Vec2;
  size: number;
  color: number;
};
export const createEngineTrail = (
  world: World,
  params: EngineTrailCreateParams
): number => {
  const eid = addEntity(world);
  addComponent(world, EngineTrail, eid);
  const { position, size, color } = params;
  addPosition(world, eid, position);
  addRender(world, eid, Shape.Circle, color, size);
  addDissipating(world, eid, 0.01);
  return eid;
};
