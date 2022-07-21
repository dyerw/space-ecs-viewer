import { removeComponent } from "bitecs";
import { distance, getRandomInt } from "../../math";
import { Engine, setEngine } from "../components/Engine";
import { addMoveToPointCommand } from "../components/MoveToPointCommand";
import { getMovingTo, MovingTo } from "../components/MovingToPoint";
import { getPosition, Position } from "../components/Position";
import { makeSystem } from "../util";

const movingToPointSystem = makeSystem(
  [MovingTo, Engine, Position],
  (eid, world) => {
    const pos = getPosition(world, eid);
    const destination = getMovingTo(world, eid);
    if (pos && destination) {
      const d = distance(pos, destination);
      if (d <= 10) {
        console.log("Finding new point")
        setEngine(world, eid, { percent: 0 });
        Engine.percent[eid] = 0;
        removeComponent(world, MovingTo, eid);
        const newX = getRandomInt(-200, 200);
        const newY = getRandomInt(-200, 200);
        addMoveToPointCommand(world, eid, { x: newX, y: newY });
      }
    }
  }
);

export default movingToPointSystem;
