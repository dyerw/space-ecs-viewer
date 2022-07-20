import { addComponent, defineComponent, addEntity } from "bitecs";
import { World } from "../";
import { Vec2 } from "../../math";
import { addCollider } from "../components/Colliider";
import { addPosition } from "../components/Position";
import { addRender, Shape } from "../components/Render";
import { addVelocity } from "../components/Velocity";

export const Bullet = defineComponent();
export const createBullet = (
  world: World,
  position: Vec2,
  velocity: Vec2,
  collisionRadius: number
) => {
  const eid = addEntity(world);
  addComponent(world, Bullet, eid);
  addPosition(world, eid, position);
  addVelocity(world, eid, velocity);
  addRender(world, eid, Shape.Circle, 0xff00bb, 3);
  addCollider(world, eid, collisionRadius);
};
