/** A concept and its direct prerequisites in the unpruned mastery graph. */
export interface RawGraphNode {
  conceptName: string;
  bloomLevel: number;
  prerequisiteNames: string[];
}