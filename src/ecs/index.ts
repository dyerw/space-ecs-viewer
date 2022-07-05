import { createWorld, defineQuery, pipe, hasComponent } from "bitecs";
import { getRandomInt } from "../math";
import { Render } from "./graphics";
import { accelerationSystem, movementSystem, Position } from "./physics";
import {
  bulletShipCollisionSystem,
  createShip,
  engineSystem,
  getEnginePct,
  getRotation,
  moveToPointSystem,
  movingToPointSystem,
  Ship,
  shootingSystem,
} from "./ships";

export type World = {
  time: { delta: number };
};

export type System = (w: World) => World;

const pipeline = pipe(
  movingToPointSystem,
  moveToPointSystem,
  movementSystem,
  engineSystem,
  accelerationSystem,
  // shootingSystem,
  bulletShipCollisionSystem
);

export type Renderable = {
  eid: number;
  x: number;
  y: number;
} & (
  | { type: "ship"; rotation: number; enginePct: number }
  | { type: "bullet" }
);

const renderQuery = defineQuery<World>([Position, Render]);
export const startECS = () => {
  const world = createWorld({
    time: { delta: 0 },
  });

  // Create 100 random ships with random velocities
  const ships = 200;
  for (let i = 0; i < ships; i++) {
    const x = getRandomInt(-200, 200);
    const y = getRandomInt(-200, 200);
    const vx = Math.random() * 2 - 1;
    const vy = Math.random() * 2 - 1;
    createShip(world, { x, y }, { x: vx, y: vy });
  }

  return (delta: number): Renderable[] => {
    world.time.delta = delta;
    pipeline(world);
    const ents = renderQuery(world);
    const positions = [];
    for (const eid of ents) {
      const isShip = hasComponent(world, Ship, eid);
      const extra = isShip
        ? ({
            type: "ship",
            rotation: getRotation(eid),
            enginePct: getEnginePct(eid),
          } as const)
        : ({ type: "bullet" } as const);
      const pos: Renderable = {
        eid,
        x: Position.x[eid],
        y: Position.y[eid],
        ...extra,
      };
      positions.push(pos);
    }
    return positions;
  };
};
