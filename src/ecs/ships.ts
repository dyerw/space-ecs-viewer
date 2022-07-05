import {
  Types,
  defineComponent,
  addEntity,
  addComponent,
  defineQuery,
  removeEntity,
  removeComponent,
} from "bitecs";
import {
  Acceleration,
  addAcceleration,
  addPosition,
  addVelocity,
  getPosition,
  getVelocity,
  Mass,
  Position,
  setAcceleration,
  Vector2,
  Velocity,
} from "./physics";
import {
  add,
  distance,
  getRandomInt,
  norm,
  normOfRotation,
  scale,
  subtract,
  Vec2,
} from "../math";
import { World } from ".";
import { addRender } from "./graphics";
import { makeSystem } from "./util";

const Engine = defineComponent({ maxForce: Types.f32, percent: Types.f32 });
export const getEnginePct = (eid: number) => Engine.percent[eid];
const Rotation = defineComponent({ radians: Types.f32 });
export const getRotation = (eid: number) => Rotation.radians[eid];

// Commands
const MoveTo = defineComponent(Vector2);
const getDestination = (eid: number): Vec2 => ({
  x: MoveTo.x[eid],
  y: MoveTo.y[eid],
});
const MovingTo = defineComponent(Vector2);

const ShootingState = { cooldown: Types.f32, currentCooldown: Types.f32 };
const Shooter = defineComponent(ShootingState);

export const Ship = defineComponent();
const Bullet = defineComponent({ collisionRadius: Types.f32 });

export const createShip = (world: World, pos: Vec2, velocity: Vec2) => {
  const eid = addEntity(world);
  addPosition(world, eid, pos);
  addVelocity(world, eid, velocity);
  addAcceleration(world, eid, { x: 0, y: 0 });
  addRender(world, eid);

  addComponent(world, Ship, eid);
  addComponent(world, Shooter, eid);
  addComponent(world, Mass, eid);
  addComponent(world, Rotation, eid);
  addComponent(world, Engine, eid);

  addComponent(world, MoveTo, eid);

  MoveTo.x[eid] = 0;
  MoveTo.y[eid] = 0;

  Rotation.radians[eid] = 0;

  Mass.value[eid] = 100;

  Engine.maxForce[eid] = 3;
  Engine.percent[eid] = 0;

  Acceleration.x[eid] = 0;
  Acceleration.y[eid] = 0;

  Position.x[eid] = pos.x;
  Position.y[eid] = pos.y;

  Shooter.cooldown[eid] = 30;
  Shooter.currentCooldown[eid] = 30;
};

export const createBullet = (
  world: World,
  position: Vec2,
  velocity: Vec2,
  collisionRadius: number
) => {
  const eid = addEntity(world);
  addPosition(world, eid, position);
  addVelocity(world, eid, velocity);
  addRender(world, eid);
  addComponent(world, Bullet, eid);
  Bullet.collisionRadius[eid] = collisionRadius;
};

export const shootingSystem = makeSystem(
  [Shooter, Rotation, Position, Velocity],
  (eid, _components, world) => {
    const {
      time: { delta },
    } = world;

    Shooter.currentCooldown[eid] -= delta;

    const cooldown = Shooter.currentCooldown[eid];
    if (cooldown <= 0) {
      Shooter.currentCooldown[eid] = Shooter.cooldown[eid];
      const pos = getPosition(eid);
      const shooterVelocity = getVelocity(eid);
      const rotation = Rotation.radians[eid];
      const unitVec = normOfRotation(rotation);
      const muzzleVelocity = scale(unitVec, 5);

      const velocity = add(shooterVelocity, muzzleVelocity);
      const initialPosition = add(pos, scale(velocity, 2));
      createBullet(world, initialPosition, velocity, 3);
    }
  }
);

export const engineSystem = makeSystem(
  [Engine, Acceleration, Rotation, Mass],
  (eid, _components, _world) => {
    const engineMaxForce = Engine.maxForce[eid];
    const enginePercent = Engine.percent[eid];
    const rotation = Rotation.radians[eid];

    const mass = Mass.value[eid];
    const force = enginePercent * engineMaxForce;
    const acceleration = force / mass;

    const aVec = scale(normOfRotation(rotation), acceleration);
    setAcceleration(eid, aVec);
  }
);

const bulletQuery = defineQuery<World>([Bullet]);
export const bulletShipCollisionSystem = makeSystem(
  [Ship, Position],
  (eid, _components, world) => {
    const bulletEnts = bulletQuery(world);
    const shipPos = getPosition(eid);
    for (const beid of bulletEnts) {
      const bulletPos = getPosition(beid);
      const collisionRadius = Bullet.collisionRadius[beid];
      const d = distance(shipPos, bulletPos);
      if (d <= collisionRadius) {
        removeEntity(world, eid);
        removeEntity(world, beid);
      }
    }
  }
);

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

export const moveToPointSystem = makeSystem(
  [Rotation, MoveTo, Engine, Position, Mass],
  (eid, _components, world) => {
    const position = getPosition(eid);
    const velocity = getVelocity(eid);
    const destination = getDestination(eid);
    const mass = Mass.value[eid];
    const maxForce = Engine.maxForce[eid];
    console.log("Moving to ", JSON.stringify(destination));

    // Bezier curve control points
    const p0 = position;
    const time = findTimeToPoint(p0, destination, maxForce / mass, velocity);
    // Solving for the first derivative
    // in terms of frames/ticks
    // P_1 = (v + P_0) / 2
    const p1 = add(p0, scale(velocity, time / 2));
    const p2 = destination;

    // Solving for second derivative
    // P''(t) = 2(P_2 - 2P_1 + P_0)
    const a = scale(add(subtract(p2, scale(p1, 2)), p0), 2);

    let rotation = Math.atan(a.y / a.x);
    if (a.x < 0) {
      rotation += Math.PI;
    }

    Engine.percent[eid] = 1;
    Rotation.radians[eid] = rotation;

    removeComponent(world, MoveTo, eid);
    addComponent(world, MovingTo, eid);
    MovingTo.x[eid] = destination.x;
    MovingTo.y[eid] = destination.y;
  }
);

// By default ships just cut their engine when they reach
// their destination
export const movingToPointSystem = makeSystem(
  [MovingTo, Engine, Position],
  (eid, _c, world) => {
    const pos = getPosition(eid);
    const destination = { x: MovingTo.x[eid], y: MovingTo.y[eid] };
    const d = distance(pos, destination);
    if (d <= 5) {
      console.log("Shutting off engine");
      Engine.percent[eid] = 0;
      removeComponent(world, MovingTo, eid);
      addComponent(world, MoveTo, eid);
      MoveTo.x[eid] = getRandomInt(-200, 200);
      MoveTo.y[eid] = getRandomInt(-200, 200);
    }
  }
);

// export const bulletCleanupSystem = //....
