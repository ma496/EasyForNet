"use client";

import * as React from "react";
import AnimateHeight from "react-animate-height";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
  data?: any;
};

interface TreeViewProps {
  data: TreeNode[];
  className?: string;
  contentClassName?: string;
  defaultExpandedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onNodeClick?: (node: TreeNode) => void;
  enableSelection?: boolean;
  expandAll?: boolean;
}

type SelectionState = {
  [key: string]: boolean;
};

interface TreeViewItemProps extends TreeNode {
  level: number;
  defaultExpanded?: boolean;
  contentClassName?: string;
  selectedState: SelectionState;
  intermediateState: Set<string>;
  onSelectionChange: (id: string, checked: boolean) => void;
  onNodeClick?: (node: TreeNode) => void;
  getDescendantIds: (node: TreeNode) => string[];
  getAncestorIds: (id: string) => string[];
  enableSelection: boolean;
  defaultExpandedIds: string[];
  expandAll?: boolean;
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
}: TreeViewItemProps) => {
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
    e.stopPropagation();
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
  // Simplified state management
  const [selectedState, setSelectedState] = React.useState<SelectionState>(() => {
    const state: SelectionState = {};
    defaultSelectedIds.forEach((id) => {
      state[id] = true;
    });
    return state;
  });
  const [intermediateState, setIntermediateState] = React.useState<Set<string>>(new Set());

  // Track defaultSelectedIds changes
  React.useEffect(() => {
    const newState: SelectionState = {};
    defaultSelectedIds.forEach((id) => {
      newState[id] = true;
    });
    setSelectedState(newState);
  }, [defaultSelectedIds]);

  // Simplified node mapping
  const nodeMap = React.useMemo(() => {
    const map = new Map<string, TreeNode>();
    const addToMap = (node: TreeNode) => {
      map.set(node.id, node);
      if (node.children) {
        node.children.forEach(addToMap);
      }
    };
    data.forEach(addToMap);
    return map;
  }, [data]);

  // Simplified descendant and ancestor functions
  const getDescendantIds = React.useCallback((node: TreeNode): string[] => {
    const descendants: string[] = [];
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

  const parentChildMap = React.useMemo(() => {
    const map = new Map<string, string>();
    const processNode = (node: TreeNode, parentId?: string) => {
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

  const getAncestorIds = React.useCallback((id: string): string[] => {
    const ancestors: string[] = [];
    let currentId = id;
    while (parentChildMap.has(currentId)) {
      const parentId = parentChildMap.get(currentId)!;
      ancestors.push(parentId);
      currentId = parentId;
    }
    return ancestors;
  }, [parentChildMap]);

  // Simplified selection handler
  const handleSelectionChange = React.useCallback((id: string, checked: boolean) => {
    setSelectedState(prev => {
      const newState = { ...prev };
      newState[id] = checked;

      // Handle descendants
      const node = nodeMap.get(id);
      if (node) {
        getDescendantIds(node).forEach(descendantId => {
          newState[descendantId] = checked;
        });
      }

      // Handle ancestors - check if all siblings are selected
      const ancestors = getAncestorIds(id);
      ancestors.forEach(ancestorId => {
        const ancestorNode = nodeMap.get(ancestorId);
        if (ancestorNode && ancestorNode.children) {
          // Check if all children are checked to update parent state
          const allChildrenSelected = ancestorNode.children.every(
            child => newState[child.id] === true
          );
          newState[ancestorId] = allChildrenSelected;
        }
      });

      return newState;
    });
  }, [nodeMap, getDescendantIds, getAncestorIds]);

  // Calculate intermediate states separately
  React.useEffect(() => {
    const newIntermediateState = new Set<string>();
    const stateUpdates: { [key: string]: boolean } = {};

    const processNode = (node: TreeNode): { checked: number, total: number } => {
      if (!node.children || node.children.length === 0) {
        return { checked: selectedState[node.id] ? 1 : 0, total: 1 };
      }

      // Calculate counts from children
      const counts = node.children.map(processNode);
      const checkedCount = counts.reduce((sum, count) => sum + count.checked, 0);
      const totalCount = counts.reduce((sum, count) => sum + count.total, 0);

      // If all children are checked, ensure parent is also checked
      if (checkedCount === totalCount && totalCount > 0 && !selectedState[node.id]) {
        stateUpdates[node.id] = true;
      }
      // If some children are checked but not all, mark as intermediate
      else if (checkedCount > 0 && checkedCount < totalCount) {
        newIntermediateState.add(node.id);
      }

      return {
        checked: (selectedState[node.id] || stateUpdates[node.id]) ? totalCount : checkedCount,
        total: totalCount
      };
    };

    data.forEach(processNode);

    // Apply state updates if needed
    if (Object.keys(stateUpdates).length > 0) {
      setSelectedState(prev => ({ ...prev, ...stateUpdates }));
    }

    setIntermediateState(newIntermediateState);
  }, [data, selectedState]);

  // Notify parent of selection changes
  React.useEffect(() => {
    const selectedIds = Object.entries(selectedState)
      .filter(([, selected]) => selected)
      .map(([id]) => id);
    onSelectionChange?.(selectedIds);
  }, [selectedState]);

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
