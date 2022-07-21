import { addComponent, defineComponent, hasComponent } from "bitecs";
import { World } from "..";
import { Vec2 } from "../../math";
import { Vector2 } from "../types";
import { safeUpdateComponent } from "../util";

/**
 * A course is a desired destination location
 */
type CourseT = {
  destination: Vec2;
  targetVelocity: Vec2;
};

export const Course = defineComponent({
  destination: Vector2,
  targetVelocity: Vector2,
});
export const setCourse = (
  world: World,
  eid: number,
  destination: Vec2,
  targetVelocity: Vec2
) => {
  safeUpdateComponent(world, eid, Course, (p) => {
    p.destination.x[eid] = destination.x;
    p.destination.y[eid] = destination.y;
    p.targetVelocity.x[eid] = targetVelocity.x;
    p.targetVelocity.y[eid] = targetVelocity.y;
  });
};
export const getCourse = (world: World, eid: number): CourseT | undefined => {
  if (hasComponent(world, Course, eid)) {
    return {
      destination: {
        x: Course.destination.x[eid],
        y: Course.destination.y[eid],
      },
      targetVelocity: {
        x: Course.targetVelocity.x[eid],
        y: Course.targetVelocity.y[eid],
      },
    };
  }
  return undefined;
};
export const addCourse = (
  world: World,
  eid: number,
  destination: Vec2,
  targetVelocity: Vec2
) => {
  if (!hasComponent(world, Course, eid)) {
    addComponent(world, Course, eid);
  }
  setCourse(world, eid, destination, targetVelocity);
};
