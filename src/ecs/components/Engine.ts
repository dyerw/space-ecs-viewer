import { addComponent, defineComponent, hasComponent, Types } from "bitecs";
import { World } from "..";
import { safeUpdateComponent } from "../util";

type EngineT = { maxForce: number; percent: number };

export const Engine = defineComponent({
  maxForce: Types.f32,
  percent: Types.f32,
});
export const getEngine = (world: World, eid: number): EngineT | undefined => {
  if (hasComponent(world, Engine, eid)) {
    return {
      maxForce: Engine.maxForce[eid],
      percent: Engine.percent[eid],
    };
  }
  return undefined;
};
export const setEngine = (
  world: World,
  eid: number,
  engine: Partial<EngineT>
) => {
  safeUpdateComponent(world, eid, Engine, (e) => {
    if (engine.maxForce) {
      e.maxForce[eid] = engine.maxForce;
    }
    if (engine.percent) {
      e.percent[eid] = engine.percent;
    }
  });
};
export const addEngine = (world: World, eid: number, engine: EngineT) => {
  addComponent(world, Engine, eid);
  setEngine(world, eid, engine);
};
