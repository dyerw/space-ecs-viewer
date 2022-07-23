import { Application, Graphics, Container, Point } from "pixi.js";
import { startECS } from "./ecs";
import { Shape } from "./ecs/components/Render";

const app = new Application({
  width: 1000,
  height: 800,
  backgroundColor: 0x000011,
  resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);
console.log("Added PIXI View");

const stepECS = startECS();

const transformPos = <T extends { x: number; y: number }>(pos: T): T => ({
  ...pos,
  x: pos.x + app.screen.width / 2,
  y: pos.y + app.screen.height / 2,
});

const circles = [{ x: 0, y: 0 }].map(transformPos);

const originGraphics = new Graphics();
originGraphics.beginFill(0xff0000);
circles.forEach((c) => {
  originGraphics.drawCircle(c.x, c.y, 2);
});
originGraphics.endFill();
app.stage.addChild(originGraphics);

const containers: Record<number, Container> = {};

app.ticker.add((delta) => {
  const entities = stepECS(delta).map((r) => ({
    ...r,
    position: { ...transformPos(r.position) },
  }));
  for (const e of entities) {
    if (!(e.eid in containers)) {
      const container = new Container();
      const graphics = new Graphics();
      if (e.shape === Shape.Triangle) {
        graphics.beginFill(e.color);
        graphics.drawPolygon([
          new Point(0, e.size),
          new Point(e.size / 3, 0),
          new Point(-1 * (e.size / 3), 0),
        ]);
        graphics.endFill();
        container.pivot = new Point(0, 1.67);
      }
      if (e.shape === Shape.Circle) {
        graphics.beginFill(e.color);
        graphics.drawCircle(0, 0, e.size);
        graphics.endFill();
      }
      container.addChild(graphics);
      app.stage.addChild(container);
      containers[e.eid] = container;
    }
    containers[e.eid].rotation = e.rotation - Math.PI / 2;
    containers[e.eid].x = e.position.x;
    containers[e.eid].y = e.position.y;
    const scale = e.size / e.originalSize;
    console.log(scale);
    containers[e.eid].scale = { x: scale, y: scale };
  }
  //Clenanup removed entities
  const drawnEids = entities.map((e) => e.eid);
  const removedEntities = Object.keys(containers)
    .map((k) => parseInt(k))
    .filter((k) => !drawnEids.includes(k));

  for (const e of removedEntities) {
    const container = containers[e];
    container.destroy();
  }
});
