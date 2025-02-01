"use client";

import { CareerRoadmap, RoadmapStep } from '@/utils/types';
import { useCallback, useState } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface RoadmapChartProps {
    roadmap: CareerRoadmap;
}

// const nodeWidth = 200;
// const nodeHeight = 100;

function createNodesAndEdges(steps: RoadmapStep[], parentId: string | null = null, depth: number = 0): [Node[], Edge[]] {
    let nodes: Node[] = [];
    let edges: Edge[] = [];

    steps.forEach((step, index) => {
        const nodeId = step.id;
        const yOffset = depth * 100;
        const xOffset = index * 200;

        nodes.push({
            id: nodeId,
            type: 'default',
            position: { x: xOffset, y: yOffset },
            data: { 
                label: step.title,
                description: step.description 
            }
        });

        if (parentId) {
            edges.push({
                id: `e${parentId}-${nodeId}`,
                source: parentId,
                target: nodeId,
                type: 'smoothstep',
                animated: true,
                markerEnd: { type: MarkerType.ArrowClosed },
            });
        }

        if (Array.isArray(step.children) && step.children.length > 0) {
            const [childNodes, childEdges] = createNodesAndEdges(step.children, nodeId, depth + 1);
            nodes = nodes.concat(childNodes);
            edges = edges.concat(childEdges);
        }
    });

    return [nodes, edges];
}

export function RoadmapChart({ roadmap }: RoadmapChartProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const onInit = useCallback(() => {
        const [initialNodes, initialEdges] = createNodesAndEdges(roadmap.steps);
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [roadmap, setNodes, setEdges]);

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    }, []);

    return (
        <div className="flex flex-col h-[800px]">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onInit={onInit}
                onNodeClick={onNodeClick}
                fitView
            >
                <Controls />
                <Background />
            </ReactFlow>
            {selectedNode && (
                <div className="bg-white p-4 mt-4 rounded shadow">
                    <h3 className="text-lg font-bold">{selectedNode.data.label}</h3>
                    <p>{selectedNode.data.description}</p>
                </div>
            )}
        </div>
    );
}