import React, { useEffect, useRef } from "react";
import { Image as KonvaImage, Transformer, Group, Circle, Text } from "react-konva";

interface OverlayProps {
  shapeProps: any;
  isSelected: boolean;
  image: HTMLImageElement;
  onSelect: () => void;
  onChange: (newAttrs: any) => void;
  onDelete: () => void;
}

export const OverlayControl: React.FC<OverlayProps> = ({
  shapeProps,
  isSelected,
  image,
  onSelect,
  onChange,
  onDelete,
}) => {
  const trRef = useRef<any>(null);
  const groupRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Group
        ref={groupRef}
        {...shapeProps}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = groupRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, shapeProps.width * scaleX),
            height: Math.max(5, shapeProps.height * scaleY),
            rotation: node.rotation(),
          });
        }}
      >
        <KonvaImage
          image={image}
          width={shapeProps.width}
          height={shapeProps.height}
        />
        {isSelected && (
          <Group
            x={shapeProps.width}
            y={0}
            onClick={(e) => {
              e.cancelBubble = true;
              onDelete();
            }}
            onTap={(e) => {
              e.cancelBubble = true;
              onDelete();
            }}
          >
            <Circle radius={12} fill="#ef4444" stroke="white" strokeWidth={2} />
            <Text
              text="✕"
              fontSize={14}
              fontStyle="bold"
              fill="white"
              align="center"
              verticalAlign="middle"
              offsetX={5}
              offsetY={6}
            />
          </Group>
        )}
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};
