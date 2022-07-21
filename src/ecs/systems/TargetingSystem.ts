import { removeComponent } from "bitecs";
import { addCourse } from "../components/Course";
import { getPosition } from "../components/Position";
import { getTarget, Targeting } from "../components/Targeting";
import { getVelocity } from "../components/Velocity";
import { Ship } from "../entities/Ship";
import { makeSystem } from "../util";

const targetingSystem = makeSystem([Targeting, Ship], (eid, world) => {
  const target = getTarget(world, eid);
  if (target) {
    const targetVel = getVelocity(world, target.eid);
    const targetPos = getPosition(world, target.eid);
    if (targetVel && targetPos) {
      addCourse(world, eid, targetPos, targetVel);
    } else {
      removeComponent(world, Targeting, eid);
    }
  }
});

export default targetingSystem;
