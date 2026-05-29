"use client";

import { useRouter } from "next/navigation";
import {
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  useMemo,
  useRef,
  useState,
} from "react";

export type RelationshipGraphTone = "source" | "legacy" | "critical" | "neutral";

export type RelationshipGraphEntry = {
  kind: string;
  title: string;
};

export type RelationshipGraphRelation = {
  id: string;
  label: string;
  related: {
    kind: string;
    title: string;
    url: string;
  };
  tone: RelationshipGraphTone;
};

type ViewBox = {
  height: number;
  width: number;
  x: number;
  y: number;
};

const graphWidth = 1040;
const graphHeight = 620;
const initialViewBox: ViewBox = {
  x: 0,
  y: 0,
  width: graphWidth,
  height: graphHeight,
};
const minWidth = 520;
const maxWidth = 1420;
const graphCenter = { x: graphWidth / 2, y: graphHeight / 2 };
const centerNode = { width: 230, height: 86 };
const relationNode = { width: 196, height: 82 };

export function RelationshipGraph({
  entry,
  relations,
}: {
  entry: RelationshipGraphEntry;
  relations: RelationshipGraphRelation[];
}) {
  const router = useRouter();
  const [viewBox, setViewBox] = useState<ViewBox>(initialViewBox);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const positionedRelations = useMemo(
    () =>
      relations.map((relation, index) => ({
        relation,
        ...getGraphPosition(index, relations.length),
      })),
    [relations],
  );

  function resetView() {
    setViewBox(initialViewBox);
  }

  function zoomBy(factor: number) {
    setViewBox((current) => {
      const nextWidth = clamp(current.width * factor, minWidth, maxWidth);
      const nextHeight = nextWidth * (initialViewBox.height / initialViewBox.width);
      const centerX = current.x + current.width / 2;
      const centerY = current.y + current.height / 2;

      return {
        width: nextWidth,
        height: nextHeight,
        x: centerX - nextWidth / 2,
        y: centerY - nextHeight / 2,
      };
    });
  }

  function startPan(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.button !== 0) return;
    dragRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function pan(event: ReactPointerEvent<SVGSVGElement>) {
    if (!dragRef.current) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const dx = ((event.clientX - dragRef.current.x) / bounds.width) * viewBox.width;
    const dy =
      ((event.clientY - dragRef.current.y) / bounds.height) * viewBox.height;

    dragRef.current = { x: event.clientX, y: event.clientY };
    setViewBox((current) => ({
      ...current,
      x: current.x - dx,
      y: current.y - dy,
    }));
  }

  function stopPan(event: ReactPointerEvent<SVGSVGElement>) {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function wheelZoom(event: ReactWheelEvent<SVGSVGElement>) {
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? 0.9 : 1.1);
  }

  return (
    <div className="wiki-relation-graph-frame">
      <div className="wiki-relation-graph-controls" aria-label="Graph controls">
        <button
          aria-label="Zoom in"
          onClick={() => zoomBy(0.84)}
          title="Zoom in"
          type="button"
        >
          +
        </button>
        <button
          aria-label="Zoom out"
          onClick={() => zoomBy(1.18)}
          title="Zoom out"
          type="button"
        >
          -
        </button>
        <button
          aria-label="Reset graph view"
          onClick={resetView}
          title="Reset view"
          type="button"
        >
          Fit
        </button>
      </div>

      <svg
        aria-label={`${entry.title} relationship graph`}
        className="wiki-relation-graph"
        onPointerCancel={stopPan}
        onPointerDown={startPan}
        onPointerLeave={stopPan}
        onPointerMove={pan}
        onPointerUp={stopPan}
        onWheel={wheelZoom}
        role="img"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
      >
        <rect
          className="wiki-relation-graph-hitarea"
          height={viewBox.height}
          width={viewBox.width}
          x={viewBox.x}
          y={viewBox.y}
        />

        {positionedRelations.map(({ relation, x, y }) => (
          <line
            key={relation.id}
            x1={graphCenter.x}
            x2={x}
            y1={graphCenter.y}
            y2={y}
            className={`is-${relation.tone}`}
          />
        ))}

        <foreignObject
          height={centerNode.height}
          width={centerNode.width}
          x={graphCenter.x - centerNode.width / 2}
          y={graphCenter.y - centerNode.height / 2}
        >
          <div className="wiki-relation-graph-center">
            <span>{entry.kind}</span>
            <strong>{entry.title}</strong>
          </div>
        </foreignObject>

        {positionedRelations.map(({ relation, x, y }) => (
          <foreignObject
            height={relationNode.height}
            key={relation.id}
            width={relationNode.width}
            x={x - relationNode.width / 2}
            y={y - relationNode.height / 2}
          >
            <button
              aria-label={`Open ${relation.related.title}`}
              className={`wiki-relation-graph-node is-${relation.tone}`}
              onClick={() => router.push(relation.related.url)}
              onPointerDown={(event) => event.stopPropagation()}
              type="button"
            >
              <span>{relation.label}</span>
              <strong>{relation.related.title}</strong>
              <em>{relation.related.kind}</em>
            </button>
          </foreignObject>
        ))}

        {relations.length === 0 ? (
          <foreignObject
            height="72"
            width="260"
            x={graphCenter.x - 130}
            y={graphCenter.y + 70}
          >
            <p className="wiki-relation-graph-empty">
              No relations yet.
            </p>
          </foreignObject>
        ) : null}
      </svg>
    </div>
  );
}

function getGraphPosition(index: number, total: number) {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
  const radiusX = 360;
  const radiusY = 220;

  return {
    x: graphCenter.x + Math.cos(angle) * radiusX,
    y: graphCenter.y + Math.sin(angle) * radiusY,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
