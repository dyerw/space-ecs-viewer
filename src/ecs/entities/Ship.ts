import { addComponent, addEntity, defineComponent } from "bitecs";
import { World } from "..";
import { Vec2 } from "../../math";
import { addAcceleration } from "../components/Acceleration";
import { addCourse } from "../components/Course";
import { addEngine } from "../components/Engine";
import { addMass } from "../components/Mass";
import { addPosition } from "../components/Position";
import { addRender, Shape } from "../components/Render";
import { addRotation } from "../components/Rotation";
import { addRotationSpeed } from "../components/RotationSpeed";
import { addVelocity } from "../components/Velocity";

export const Ship = defineComponent();
type ShipCreateParams = {
  position: Vec2;
  velocity: Vec2;
  mass: number;
};
export const createShip = (world: World, params: ShipCreateParams): number => {
  console.info(`Creating ship at (${params.position.x}, ${params.position.y})`);
  const eid = addEntity(world);
  addComponent(world, Ship, eid);
  const { position, velocity, mass } = params;

  addPosition(world, eid, position);
  addVelocity(world, eid, velocity);
  addAcceleration(world, eid, { x: 0, y: 0 });

  addRotation(world, eid, 0);
  addRotationSpeed(world, eid, 0.174533);
  addMass(world, eid, mass);
  addEngine(world, eid, { maxForce: 2, percent: 0 });

  addRender(world, eid, Shape.Triangle, 0xffffff, 5);
  // addShooter

  addCourse(world, eid, { x: 0, y: 0 }, { x: 0, y: 1 });

  return eid;
};
