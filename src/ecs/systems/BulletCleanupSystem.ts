import { removeEntity } from "bitecs";
import { getPosition, Position } from "../components/Position";
import { Bullet } from "../entities/Bullet";
import { makeSystem } from "../util";

const bulletCleanupSystem = makeSystem([Bullet, Position], (eid, world) => {
  const pos = getPosition(world, eid);
  if (pos) {
    if (pos.x > 1000 || pos.x < -1000 || pos.y > 1000 || pos.y < -1000) {
      removeEntity(world, eid);
    }
  }
});

export default bulletCleanupSystem;
