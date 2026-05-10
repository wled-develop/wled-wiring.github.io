import { useStore } from '@xyflow/react';

export const useSelectedElementsCount = () => (
  useStore((state) => (
    state.nodes.filter((node) => node.selected).length +
    state.edges.filter((edge) => edge.selected).length
  ))
);
