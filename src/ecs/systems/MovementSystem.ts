import { System } from "..";
import { add, scale } from "../../math";
import { getPosition, Position, setPosition } from "../components/Position";
import { getVelocity, Velocity } from "../components/Velocity";
import { makeSystem } from "../util";

const movementSystem: System = makeSystem(
  [Position, Velocity],
  (eid, world) => {
    const {
      time: { delta },
    } = world;
    const pos = getPosition(world, eid);
    const vel = getVelocity(world, eid);
    if (pos && vel) {
      setPosition(eid, add(pos, scale(vel, delta)));
    }
  }
);

export default movementSystem;
