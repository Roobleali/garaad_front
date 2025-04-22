interface NodeData {
  isComplete: boolean;
  isActive: boolean;
}

export const useNodeStatus = (data: NodeData) => {
  const status = data.isComplete
    ? "completed"
    : data.isActive
    ? "current"
    : "locked";
  return { status };
};
