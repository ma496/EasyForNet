"use client";

import * as React from "react";
import AnimateHeight from "react-animate-height";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type TreeNode = {
  id: string | number;
  label: string;
  children?: TreeNode[];
  data?: any;
};

interface TreeViewProps {
  data: TreeNode[];
  className?: string;
  contentClassName?: string;
  defaultExpandedIds?: (string | number)[];
  defaultSelectedIds?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  onNodeClick?: (node: TreeNode) => void;
  enableSelection?: boolean;
  expandAll?: boolean;
}

type SelectionState = {
  [key: string | number]: boolean;
};

interface TreeViewItemProps extends TreeNode {
  level: number;
  defaultExpanded?: boolean;
  contentClassName?: string;
  selectedState: SelectionState;
  intermediateState: Set<string | number>;
  onSelectionChange: (id: string | number, checked: boolean) => void;
  onNodeClick?: (node: TreeNode) => void;
  getDescendantIds: (node: TreeNode) => (string | number)[];
  getAncestorIds: (id: string | number) => (string | number)[];
  enableSelection: boolean;
}

const TreeViewItem = ({
  id,
  label,
  children,
  level,
  data,
  defaultExpanded = false,
  contentClassName,
  selectedState,
  intermediateState,
  onSelectionChange,
  onNodeClick,
  getDescendantIds,
  getAncestorIds,
  enableSelection,
  defaultExpandedIds,
  expandAll,
}: TreeViewItemProps & { defaultExpandedIds: (string | number)[], expandAll?: boolean }) => {
  const [isOpen, setIsOpen] = React.useState(defaultExpanded);
  const [height, setHeight] = React.useState<"auto" | number>(
    defaultExpanded ? "auto" : 0
  );

  const hasChildren = children && children.length > 0;
  const isSelected = selectedState[id] || false;
  const isIntermediate = intermediateState.has(id);

  const toggleOpen = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
      setHeight(isOpen ? 0 : "auto");
    }
  };

  const handleClick = () => {
    onNodeClick?.({ id, label, children, data });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onSelectionChange(id, checked);
  };

  React.useEffect(() => {
    if (expandAll || defaultExpanded) {
      setIsOpen(true);
      setHeight("auto");
    }
  }, [expandAll, defaultExpanded]);

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium",
          "hover:bg-accent hover:text-accent-foreground"
        )}
        style={{ paddingInlineStart: `${level * 1}rem` }}
      >
        <div className="flex items-center gap-2">
          {enableSelection && (
            <input
              type="checkbox"
              checked={isSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate = isIntermediate && !isSelected;
                }
              }}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300"
            />
          )}
          {hasChildren && (
            <button
              onClick={toggleOpen}
              className="flex items-center justify-center w-4"
            >
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
          {!hasChildren && <span className="w-4" />}
          <span onClick={handleClick} className="cursor-pointer">
            {label}
          </span>
        </div>
      </div>
      {hasChildren && (
        <AnimateHeight
          duration={300}
          height={height}
          className={cn("overflow-hidden", contentClassName)}
        >
          <div>
            {children.map((child) => (
              <TreeViewItem
                key={child.id}
                {...child}
                level={level + 1}
                defaultExpanded={expandAll || defaultExpandedIds.includes(child.id)}
                contentClassName={contentClassName}
                selectedState={selectedState}
                intermediateState={intermediateState}
                onSelectionChange={onSelectionChange}
                onNodeClick={onNodeClick}
                getDescendantIds={getDescendantIds}
                getAncestorIds={getAncestorIds}
                enableSelection={enableSelection}
                defaultExpandedIds={defaultExpandedIds}
                expandAll={expandAll}
              />
            ))}
          </div>
        </AnimateHeight>
      )}
    </div>
  );
};

export const TreeView = ({
  data,
  className,
  contentClassName,
  defaultExpandedIds = [],
  defaultSelectedIds = [],
  onSelectionChange,
  onNodeClick,
  enableSelection = false,
  expandAll = false,
}: TreeViewProps) => {
  const [selectedState, setSelectedState] = React.useState<SelectionState>(() => {
    const state: SelectionState = {};
    defaultSelectedIds.forEach((id) => {
      state[id] = true;
    });
    return state;
  });
  const [intermediateState, setIntermediateState] = React.useState<Set<string | number>>(new Set());

  // Create a map of all nodes for easy access
  const nodeMap = React.useMemo(() => {
    const map = new Map<string | number, TreeNode>();
    const addToMap = (node: TreeNode) => {
      map.set(node.id, node);
      if (node.children) {
        node.children.forEach(addToMap);
      }
    };
    data.forEach(addToMap);
    return map;
  }, [data]);

  // Function to get all descendant IDs of a node
  const getDescendantIds = React.useCallback((node: TreeNode): (string | number)[] => {
    const descendants: (string | number)[] = [];

    const traverse = (currentNode: TreeNode) => {
      if (currentNode.children) {
        currentNode.children.forEach(child => {
          descendants.push(child.id);
          traverse(child);
        });
      }
    };

    traverse(node);
    return descendants;
  }, []);

  // Function to get parent-child relationships
  const parentChildMap = React.useMemo(() => {
    const map = new Map<string | number, string | number>();
    const processNode = (node: TreeNode, parentId?: string | number) => {
      if (parentId !== undefined) {
        map.set(node.id, parentId);
      }
      if (node.children) {
        node.children.forEach(child => processNode(child, node.id));
      }
    };
    data.forEach(node => processNode(node));
    return map;
  }, [data]);

  // Function to get all ancestor IDs of a node
  const getAncestorIds = React.useCallback((id: string | number): (string | number)[] => {
    const ancestors: (string | number)[] = [];
    let currentId = id;
    while (parentChildMap.has(currentId)) {
      const parentId = parentChildMap.get(currentId)!;
      ancestors.push(parentId);
      currentId = parentId;
    }
    return ancestors;
  }, [parentChildMap]);

  // Update intermediate states
  const updateIntermediateStates = React.useCallback(() => {
    const newIntermediateState = new Set<string | number>();

    const processNode = (node: TreeNode): { selected: number; total: number } => {
      if (!node.children || node.children.length === 0) {
        return {
          selected: selectedState[node.id] ? 1 : 0,
          total: 1
        };
      }

      const counts = node.children.map(processNode);
      let totalSelected = counts.reduce((sum, count) => sum + count.selected, 0);
      let totalNodes = counts.reduce((sum, count) => sum + count.total, 0);

      // Add current node's selection to the counts
      if (selectedState[node.id]) {
        totalSelected += 1;
      }
      totalNodes += 1;

      // If some but not all descendants are selected, mark as intermediate
      if (totalSelected > 0 && totalSelected < totalNodes) {
        newIntermediateState.add(node.id);
      }

      return {
        selected: totalSelected,
        total: totalNodes
      };
    };

    data.forEach(node => {
      const result = processNode(node);
      // Also check if the root node itself should be intermediate
      if (result.selected > 0 && result.selected < result.total) {
        newIntermediateState.add(node.id);
      }
    });

    setIntermediateState(newIntermediateState);
  }, [data, selectedState]);

  // Handle selection changes
  const handleSelectionChange = React.useCallback((id: string | number, checked: boolean) => {
    setSelectedState(prev => {
      const newState = { ...prev };
      const targetNode = nodeMap.get(id);

      if (!targetNode) return prev;

      // Update the clicked node
      newState[id] = checked;

      // Update descendants
      const descendants = getDescendantIds(targetNode);
      descendants.forEach(descendantId => {
        newState[descendantId] = checked;
      });

      // Update ancestors
      const ancestors = getAncestorIds(id);
      ancestors.forEach(ancestorId => {
        const ancestorNode = nodeMap.get(ancestorId);
        if (ancestorNode) {
          const descendantIds = getDescendantIds(ancestorNode);
          const allDescendantsSelected = descendantIds.every(
            descId => newState[descId]
          );
          newState[ancestorId] = allDescendantsSelected;
        }
      });

      return newState;
    });
  }, [nodeMap, getDescendantIds, getAncestorIds]);

  // Update intermediate states when selection changes
  React.useEffect(() => {
    updateIntermediateStates();
    const selectedIds = Object.entries(selectedState)
      .filter(([, selected]) => selected)
      .map(([id]) => isNaN(Number(id)) ? id : Number(id));
    onSelectionChange?.(selectedIds);
  }, [selectedState, updateIntermediateStates, onSelectionChange]);

  return (
    <div className={cn("w-full", className)}>
      {data.map((item) => (
        <TreeViewItem
          key={item.id}
          {...item}
          level={1}
          defaultExpanded={expandAll || defaultExpandedIds.includes(item.id)}
          contentClassName={contentClassName}
          selectedState={selectedState}
          intermediateState={intermediateState}
          onSelectionChange={handleSelectionChange}
          onNodeClick={onNodeClick}
          getDescendantIds={getDescendantIds}
          getAncestorIds={getAncestorIds}
          enableSelection={enableSelection}
          defaultExpandedIds={defaultExpandedIds}
          expandAll={expandAll}
        />
      ))}
    </div>
  );
};
