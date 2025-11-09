import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useEffect, useState } from "react";

interface UseNodeStatusProps {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

export const useNodeStatus = ({
  nodeId,
  channel,
  topic,
  refreshToken,
}: UseNodeStatusProps) => {
  const [status, setStatus] = useState<NodeStatus>("initial");
  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  useEffect(() => {
    if (!data?.length) {
      return;
    }

    const latestMessage = data
      .filter(
        (msg) =>
          msg.kind === "data" &&
          msg.channel === channel &&
          msg.topic === topic &&
          msg.data.nodeId === nodeId
      )
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      })[0];

    if (latestMessage && latestMessage.kind === "data") {
      setStatus(latestMessage.data.status as NodeStatus);
    }
  }, [data, nodeId, channel, topic]);

  return status;
};
