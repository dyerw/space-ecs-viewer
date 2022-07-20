import {
  Component,
  ComponentType,
  defineQuery,
  hasComponent,
  ISchema,
} from "bitecs";
import { System, World } from ".";

export function makeSystem<Q extends readonly Component[]>(
  query: Q,
  f: (eid: number, world: World) => void
): System {
  const q = defineQuery<World>([...query]);
  return (w) => {
    const ents = q(w);
    for (const eid of ents) {
      f(eid, w);
    }
    return w;
  };
}

export const safeUpdateComponent = <T extends ISchema>(
  world: World,
  eid: number,
  component: ComponentType<T>,
  f: (c: ComponentType<T>) => void
): void => {
  if (hasComponent(world, component, eid)) {
    f(component);
  } else {
    // FIXME: How do i log the component name here
    console.warn(`Attempting to update non-existant component on ${eid}`);
  }
};
