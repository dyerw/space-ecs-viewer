import { removeEntity } from "bitecs";
import { Dissipating, getDissipating } from "../components/Dissipating";
import { getRender, Render, setRender } from "../components/Render";
import { makeSystem } from "../util";

const dissipationSystem = makeSystem([Render, Dissipating], (eid, world) => {
  const {
    time: { delta },
  } = world;
  const render = getRender(world, eid);
  const dissipating = getDissipating(world, eid);
  if (render !== undefined && dissipating !== undefined) {
    if (render.size <= dissipating.rate * delta) {
      removeEntity(world, eid);
    } else {
      console.log("shrink");
      console.log(dissipating);
      console.log(render.size - dissipating.rate * delta);
      setRender(eid, {
        size: render.size - dissipating.rate * delta,
      });
    }
  }
});

export default dissipationSystem;
