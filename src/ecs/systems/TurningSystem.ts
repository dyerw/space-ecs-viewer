import { removeComponent } from "bitecs";
import {
  DesiredRotation,
  getDesiredRotation,
} from "../components/DesiredRotation";
import { getRotation, Rotation, setRotation } from "../components/Rotation";
import { getRotationSpeed, RotationSpeed } from "../components/RotationSpeed";
import { makeSystem } from "../util";

const turningSystem = makeSystem(
  [Rotation, DesiredRotation, RotationSpeed],
  (eid, world) => {
    const {
      time: { delta },
    } = world;
    const rotation = getRotation(world, eid)?.radians;
    const desiredRotation = getDesiredRotation(world, eid)?.radians;
    const rotationSpeed = getRotationSpeed(world, eid)?.radiansPerTick;
    if (
      rotation !== undefined &&
      desiredRotation !== undefined &&
      rotationSpeed != undefined
    ) {
      const tickRotation = delta * rotationSpeed;

      const rotationDiff = rotation - desiredRotation;
      if (Math.abs(rotationDiff) <= tickRotation) {
        setRotation(world, eid, desiredRotation);
        removeComponent(world, DesiredRotation, eid);
      } else if (rotationDiff < 0) {
        setRotation(world, eid, rotation + tickRotation);
      } else {
        setRotation(world, eid, rotation - tickRotation);
      }
    }
  }
);

export default turningSystem;
