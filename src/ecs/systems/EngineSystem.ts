import { normOfRotation, scale } from "../../math";
import { Acceleration, setAcceleration } from "../components/Acceleration";
import { Engine, getEngine } from "../components/Engine";
import { getMass, Mass } from "../components/Mass";
import { getPosition, Position } from "../components/Position";
import { getRotation, Rotation } from "../components/Rotation";
import { createEngineTrail } from "../entities/EngineTrail";
import { makeSystem } from "../util";

const engineSystem = makeSystem(
  [Engine, Acceleration, Rotation, Mass, Position],
  (eid, world) => {
    const engine = getEngine(world, eid);
    const rotation = getRotation(world, eid);
    const mass = getMass(world, eid);
    const position = getPosition(world, eid);
    if (engine && rotation && mass && position) {
      const force = engine.percent * engine.maxForce;
      const acceleration = force / mass;

      const accVec = scale(normOfRotation(rotation.radians), acceleration);
      setAcceleration(world, eid, accVec);

      const colors = [0x00ff00, 0xff0000, 0x0000fff];
      createEngineTrail(world, { position, size: 1, color: colors[eid] });
    }
  }
);

export default engineSystem;
