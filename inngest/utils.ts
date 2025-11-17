import { Connection, Node } from "@/lib/generated/prisma";
import { createId } from "@paralleldrive/cuid2";
import toposort from "toposort";
import { inngest } from "./client";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  if (connections.length === 0) {
    return nodes;
  }

  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId,
    conn.toNodeId,
  ]);

  const connectedNodeId = new Set<string>();
  for (const conn of connections) {
    connectedNodeId.add(conn.fromNodeId);
    connectedNodeId.add(conn.toNodeId);
  }

  for (const node of nodes) {
    if (!connectedNodeId.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  let sortedNodeIts: string[];
  try {
    sortedNodeIts = toposort(edges);

    sortedNodeIts = [...new Set(sortedNodeIts)];
  } catch (e) {
    if (e instanceof Error && e.message.includes("Cyclic")) {
      throw new Error(`Workflow has cyclic dependencies`);
    }
    throw e;
  }

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  return sortedNodeIts.map((id) => nodeMap.get(id)!).filter(Boolean);
};

export const sendWorkflowExecutionEvent = async (data: {
  workflowId: string;
  [key: string]: any;
}) => {
  return inngest.send({
    name: "workflows/execute.workflow",
    data,
    id: createId(),
  });
};
