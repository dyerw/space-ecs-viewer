import { addComponent, defineComponent, Types } from "bitecs";
import { System, World } from ".";
import { Vec2 } from "../math";
import { makeSystem } from "./util";

export const Vector2 = { x: Types.f32, y: Types.f32 };

export const Position = defineComponent(Vector2);
export const addPosition = (world: World, eid: number, pos: Vec2) => {
  addComponent(world, Position, eid);
  Position.x[eid] = pos.x;
  Position.y[eid] = pos.y;
};
export const getPosition = (eid: number): Vec2 => ({
  x: Position.x[eid],
  y: Position.y[eid],
});

export const Velocity = defineComponent(Vector2);
export const addVelocity = (world: World, eid: number, vel: Vec2) => {
  addComponent(world, Velocity, eid);
  Velocity.x[eid] = vel.x;
  Velocity.y[eid] = vel.y;
};
export const getVelocity = (eid: number): Vec2 => ({
  x: Velocity.x[eid],
  y: Velocity.y[eid],
});

export const Acceleration = defineComponent(Vector2);
export const setAcceleration = (eid: number, acc: Vec2) => {
  Acceleration.x[eid] = acc.x;
  Acceleration.y[eid] = acc.y;
};
export const addAcceleration = (world: World, eid: number, acc: Vec2) => {
  addComponent(world, Acceleration, eid);
  setAcceleration(eid, acc);
};

export const Mass = defineComponent({ value: Types.f32 });

export const movementSystem: System = makeSystem(
  [Position, Velocity],
  (eid, components) => {
    const [pos, vel] = components;
    pos.x[eid] += vel.x[eid];
    pos.y[eid] += vel.y[eid];
  }
);

export const accelerationSystem: System = makeSystem(
  [Velocity, Acceleration],
  (eid, components) => {
    const [vel, acc] = components;
    vel.x[eid] += acc.x[eid];
    vel.y[eid] += acc.y[eid];
  }
);
