"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  useReactFlow,
  Panel,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from './button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Loader2, AlertTriangle } from 'lucide-react';

interface SchemaTable {
  name: string;
  columns: string[];
}

interface ErdData {
  schema: {
    fact_table: SchemaTable;
    dimension_tables: SchemaTable[];
  };
  relationships: Record<string, string> | string[];
}

interface JsonReactFlowVisualizerProps {
  jsonData: any;
  className?: string;
}

const tableNodeWidth = 250;
const columnHeight = 25;

const TableNode: React.FC<{ data: { name: string; columns: string[]; isFact: boolean } }> = ({ data }) => {
  const { name, columns, isFact } = data;
  return (
    <div
      className={cn(
        'rounded-lg border-2 bg-background shadow-md overflow-hidden',
        isFact ? 'border-blue-500' : 'border-green-500'
      )}
      style={{ width: tableNodeWidth }}
    >
      <div
        className={cn(
          'p-2 text-center font-bold text-sm',
          isFact ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
        )}
      >
        {name}
      </div>
      <div className="text-xs">
        {(columns || []).map((col) => (
          <div key={col} className="p-2 border-t border-muted-foreground/20">
            {col}
          </div>
        ))}
      </div>
    </div>
  );
};


const nodeTypes = { table: TableNode };

const generateFlowElements = (
  erdData: ErdData
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const { schema, relationships } = erdData;
  const allTables = [schema.fact_table, ...schema.dimension_tables];

  let yPos = 0;

  allTables.forEach((table, index) => {
    const isFact = table.name === schema.fact_table.name;
    const nodeHeight = (table.columns.length + 1) * columnHeight + 10;

    nodes.push({
      id: table.name,
      type: 'table',
      data: { name: table.name, columns: table.columns, isFact },
      position: { x: (index % 3) * (tableNodeWidth + 100), y: yPos },
      style: { height: nodeHeight, width: tableNodeWidth }
    });

    if ((index + 1) % 3 === 0) {
      yPos += nodeHeight + 80;
    }
  });

  const processedRelationships = Array.isArray(relationships)
    ? relationships.reduce((acc, rel) => {
      const parts = rel.split('→').map(p => p.trim());
      if (parts.length === 2) {
        acc[parts[0]] = parts[1];
      }
      return acc;
    }, {} as Record<string, string>)
    : relationships;

  for (const [source, target] of Object.entries(processedRelationships)) {
    const [sourceTable, sourceCol] = source.split('.');
    const [targetTable, targetCol] = target.split('.');

    edges.push({
      id: `e-${sourceTable}-${targetTable}-${sourceCol}`,
      source: sourceTable,
      target: targetTable,
      markerEnd: { type: MarkerType.ArrowClosed },
      label: `${sourceCol} -> ${targetCol}`,
      labelStyle: { fontSize: 10, fill: 'hsl(var(--foreground))' },
      style: { stroke: 'hsl(var(--primary))' },
    });
  }

  return { nodes, edges };
};

const JsonReactFlowVisualizer: React.FC<JsonReactFlowVisualizerProps> = ({ jsonData, className }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fitView } = useReactFlow();

useEffect(() => {
  setIsLoading(true);
  setError(null);
  try {
    const data = jsonData;
    console.log("jsonData:", data);
    if (!data || !data.nodes || !data.edges) {
      throw new Error("Invalid data structure");
    }
    setNodes(data.nodes);
    setEdges(data.edges);
  } catch (e: any) {
    console.error("Error processing JSON for React Flow:", e);
    setError(`Failed to process JSON: ${e.message}`);
  } finally {
    setIsLoading(false);
  }
}, [jsonData, setNodes, setEdges]);


  const handleResetView = useCallback(() => {
    fitView({ padding: 0.2, duration: 300 });
  }, [fitView]);

  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 100);
    }
  }, [nodes, fitView]);

  if (isLoading) {
    return (
      <Card className={cn("p-4 text-center", className)}>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Generating ER Diagram...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("p-4 bg-destructive/10 text-destructive", className)}>
        <CardHeader className="!p-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-5 w-5" />
            Visualization Error
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs !p-2 whitespace-pre-wrap">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("h-[600px] w-full", className)}>
      <CardContent className="p-0 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2, duration: 300 }}
          className="bg-muted/30"
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls />
          <Panel position="top-right">
            <Button onClick={handleResetView} variant="outline" size="sm" className="shadow-md">
              <RefreshCw size={14} className="mr-1" /> Reset View
            </Button>
          </Panel>
        </ReactFlow>
      </CardContent>
    </Card>
  );
};

JsonReactFlowVisualizer.displayName = "JsonReactFlowVisualizer";

const JsonReactFlowVisualizerWrapper: React.FC<JsonReactFlowVisualizerProps> = (props) => (
  <ReactFlowProvider>
    <JsonReactFlowVisualizer {...props} />
  </ReactFlowProvider>
);

export { JsonReactFlowVisualizerWrapper as JsonReactFlowVisualizer };
