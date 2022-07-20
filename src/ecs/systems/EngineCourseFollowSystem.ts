import { removeComponent } from "bitecs";
import {
  accelerationOfCubicBezierCurve,
  angleMagFromVec,
  distance,
  projectVelocity,
} from "../../math";
import { Course, getCourse } from "../components/Course";
import { Engine, getEngine, setEngine } from "../components/Engine";
import { getMass, Mass } from "../components/Mass";
import { getPosition, Position } from "../components/Position";
import { setRotation } from "../components/Rotation";
import { getVelocity, Velocity } from "../components/Velocity";
import { makeSystem } from "../util";

const engineCourseFollowSystem = makeSystem(
  [Course, Engine, Position, Velocity, Mass],
  (eid, world) => {
    const course = getCourse(world, eid);
    const engine = getEngine(world, eid);
    const position = getPosition(world, eid);
    const velocity = getVelocity(world, eid);
    const mass = getMass(world, eid);
    if (course && engine && position && velocity && mass) {
      const maxA = engine.maxForce / mass;
      let estimatedArrivalTime = 1;
      let currentMag = 99999999;
      let currentRot = 0;
      while (currentMag > maxA && estimatedArrivalTime < 10000) {
        const p0 = position;
        const p1 = projectVelocity(p0, velocity, estimatedArrivalTime / 3);
        const p3 = course.destination;
        const p2 = projectVelocity(
          p3,
          course.targetVelocity,
          -1 * (estimatedArrivalTime / 3)
        );

        const a = accelerationOfCubicBezierCurve(p0, p1, p2, p3, 0);
        const { radians, mag } = angleMagFromVec(a);
        currentMag = mag / Math.pow(estimatedArrivalTime, 2);
        currentRot = radians;
        estimatedArrivalTime += 1;
      }
      console.log({ maxA, currentMag, estimatedArrivalTime });

      setEngine(world, eid, { percent: 1 });
      setRotation(world, eid, currentRot);
      if (distance(position, course.destination) < 2) {
        removeComponent(world, Course, eid);
        setEngine(world, eid, { percent: 0 });
      }
    }
  }
);

export default engineCourseFollowSystem;
