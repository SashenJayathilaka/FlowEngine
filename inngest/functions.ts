import { getExecutor } from "@/features/execution/lib/executor-registry";
import prisma from "@/lib/db";
import { NodeType } from "@/lib/generated/prisma";
import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { topologicalSort } from "./utils";
import { httpRequestChannel } from "./channels/http-request";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0, // TODO: remove when production ready
  },
  { event: "workflows/execute.workflow", channels: [httpRequestChannel()] },

  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("No workflow ID provided");
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: { nodes: true, connections: true },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    let context = event.data.initialData || {};

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish,
      });
    }

    return {
      workflowId,
      result: context,
    };
  }
);
