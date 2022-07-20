import { createWorld, pipe } from "bitecs";
import { getRandomInt } from "../math";
import { createShip } from "./entities/Ship";
import { getRenderList, Renderable } from "./render";
import systems from "./systems";

export type World = {
  time: { delta: number };
};

export type System = (w: World) => World;

const pipeline = pipe(...systems);

export const startECS = () => {
  const world = createWorld({
    time: { delta: 0 },
  });

  // Create 100 random ships with random velocities
  const ships = 1;
  for (let i = 0; i < ships; i++) {
    const x = getRandomInt(-200, 200);
    const y = getRandomInt(-200, 200);
    const vx = Math.random() * 4 - 2;
    const vy = Math.random() * 4 - 2;
    createShip(world, {
      position: { x, y },
      velocity: { x: vx, y: vy },
      mass: 100,
    });
  }

  return (delta: number): Renderable[] => {
    world.time.delta = delta;
    pipeline(world);
    return getRenderList(world);
  };
};
