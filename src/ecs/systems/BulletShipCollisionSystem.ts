import { defineQuery, removeEntity } from "bitecs";
import { World } from "..";
import { circlesOverlap } from "../../math";
import { Collider, getCollider } from "../components/Colliider";
import { getPosition, Position } from "../components/Position";
import { Bullet } from "../entities/Bullet";
import { Ship } from "../entities/Ship";
import { makeSystem } from "../util";

const bulletQuery = defineQuery<World>([Bullet, Collider, Position]);

const bulletShipCollisionSystem = makeSystem(
  [Ship, Collider, Position],
  (eid, world) => {
    const shipPos = getPosition(world, eid);
    const shipCollider = getCollider(world, eid);
    if (shipPos && shipCollider) {
      const bulletEnts = bulletQuery(world);
      for (const beid of bulletEnts) {
        const bulletPos = getPosition(world, beid);
        const bulletCollider = getCollider(world, beid);
        if (bulletPos && bulletCollider) {
          const shipR = shipCollider.radius;
          const bulletR = bulletCollider.radius;
          if (
            circlesOverlap(
              { center: shipPos, r: shipR },
              { center: bulletPos, r: bulletR }
            )
          ) {
            // TODO: Handle more complicated damage model
            removeEntity(world, eid);
            removeEntity(world, beid);
          }
        }
      }
    }
  }
);

export default bulletShipCollisionSystem;
