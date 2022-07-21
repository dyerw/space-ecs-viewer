import { removeComponent } from "bitecs";
import { add, angleMagFromVec, norm, scale, subtract, Vec2 } from "../../math";
import { Engine, getEngine, setEngine } from "../components/Engine";
import { getMass, Mass } from "../components/Mass";
import {
  getMoveToPointCommand,
  MoveToPointCommand,
} from "../components/MoveToPointCommand";
import { addMovingTo } from "../components/MovingToPoint";
import { getPosition, Position } from "../components/Position";
import { Rotation, setRotation } from "../components/Rotation";
import { getVelocity } from "../components/Velocity";
import { makeSystem } from "../util";

const findTimeToPoint = (p0: Vec2, p3: Vec2, a: number, v: Vec2) => {
  // Coordinate transform in terms of origin at p1
  const p3_ = subtract(p0, p3);
  const v_ = scale(v, -1);

  let T = 0;
  let S = norm(p3_);
  let R = 0;
  while (R < S) {
    T++;
    S = norm(subtract(p3_, scale(v_, T)));
    R = a * (Math.pow(T, 2) / 2);
  }
  return T;
};

const moveToPointSystem = makeSystem(
  [Rotation, MoveToPointCommand, Engine, Position, Mass],
  (eid, world) => {
    const position = getPosition(world, eid);
    const velocity = getVelocity(world, eid);
    const mtpCmd = getMoveToPointCommand(world, eid);
    const engine = getEngine(world, eid);
    const mass = getMass(world, eid);
    if (position && velocity && mtpCmd && engine && mass) {
      // Bezier curve control points
      const P_0 = position;
      const P_2 = mtpCmd.destination;
      const maxA = engine.maxForce / mass;
      const time = findTimeToPoint(P_0, P_2, maxA, velocity);

      // Solving for the first derivative
      // in terms of frames/ticks
      // P_1 = (v + P_0) / 2
      const P_1 = add(P_0, scale(velocity, time / 2));

      // Solving for second derivative
      // P''(t) = 2(P_2 - 2P_1 + P_0)
      const a = scale(add(subtract(P_2, scale(P_1, 2)), P_0), 2);

      const rotation = angleMagFromVec(a).radians;

      setEngine(world, eid, { percent: 1 });
      setRotation(world, eid, rotation);

      removeComponent(world, MoveToPointCommand, eid);
      addMovingTo(world, eid, P_2);
    }
  }
);

export default moveToPointSystem;
