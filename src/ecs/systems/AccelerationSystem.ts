import { System } from "..";
import { add, scale } from "../../math";
import { Acceleration, getAcceleration } from "../components/Acceleration";
import { getVelocity, setVelocity, Velocity } from "../components/Velocity";
import { makeSystem } from "../util";

const accelerationSystem: System = makeSystem(
  [Velocity, Acceleration],
  (eid, world) => {
    const {
      time: { delta },
    } = world;
    const acc = getAcceleration(world, eid);
    const vel = getVelocity(world, eid);
    if (vel && acc) {
      setVelocity(world, eid, add(vel, scale(acc, delta)));
    }
  }
);

export default accelerationSystem;
