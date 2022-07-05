import { Component, defineQuery } from "bitecs";
import { System, World } from ".";

export function makeSystem<Q extends readonly Component[]>(
  query: Q,
  f: (eid: number, components: readonly [...Q], world: World) => void
): System {
  const q = defineQuery<World>([...query]);
  return (w) => {
    const ents = q(w);
    for (const eid of ents) {
      f(eid, query, w);
    }
    return w;
  };
}
