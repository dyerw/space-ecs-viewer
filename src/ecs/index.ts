import { createWorld, pipe } from "bitecs";
import { getRandomInt } from "../math";
import { addMoveToPointCommand } from "./components/MoveToPointCommand";
import { addTarget } from "./components/Targeting";
import { createShip } from "./entities/Ship";
import { getRenderList, Renderable } from "./render";
import systems from "./systems";

export type World = {
  time: { delta: number };
};

export type System = (w: World) => World;

const pipeline = pipe(...systems);

const randomPosVel = () => {
  const x = getRandomInt(-200, 200);
  const y = getRandomInt(-200, 200);
  const vx = Math.random() * 4 - 2;
  const vy = Math.random() * 4 - 2;
  return {
    position: { x, y },
    velocity: { x: vx, y: vy },
  };
};
export const startECS = () => {
  const world = createWorld({
    time: { delta: 0 },
  });

  const s1 = createShip(world, {
    ...randomPosVel(),
    mass: 200,
  });
  const s2 = createShip(world, {
    ...randomPosVel(),
    mass: 200,
  });
  // addMoveToPointCommand(world, s1, { x: 0, y: 0 });
  addTarget(world, s1, s2);
  addTarget(world, s2, s1);

  return (delta: number): Renderable[] => {
    world.time.delta = delta;
    pipeline(world);
    return getRenderList(world);
  };
};
