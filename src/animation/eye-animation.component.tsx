import React from 'react';
import { observable, action } from 'mobx';
import { Stage, Layer, Circle, Line, Text } from 'react-konva';
import { observer } from 'mobx-react';
import { KonvaEventObject } from 'konva/types/Node';
import Konva from 'konva';

const center = {
  x: 70,
  y: 50,
};

@observer
export class EyeAnimation extends React.Component{
  private ref = React.createRef<HTMLDivElement>();

  @observable
  private height: number | undefined;

  @observable
  private width: number | undefined;

  private pupilRef = React.createRef<Konva.Circle>();
  private irisRef = React.createRef<Konva.Circle>();

  @action
  public componentDidMount() {
    this.height = this.ref.current?.offsetHeight || 800;
    this.width = this.ref.current?.offsetWidth || 700;
  }

  private handleIrisMove = (newX: number, newY: number) => {
    if (!newX || !newY) return;
    const {x, y} = center;

    const xdiff = newX / x;
    const ydiff = newY / y;

    const xFlip = xdiff < 1 ? 1 : -1;
    const yFlip = ydiff >= 1 ? 1 : -1;

    const finalX = x + (xdiff === 0 ? 0 : Math.log(Math.abs(xdiff))) * 10 * xFlip;
    const finalY = y + (ydiff === 0 ? 0 : Math.log(Math.abs(ydiff))) * 10 * yFlip;

    this.irisRef.current?.to({
      x: finalX,
      y: finalY,
    });
    console.log(finalX, finalY);
  }

  private handlePupilMove = (newX: number, newY: number) => {
    if (!newX || !newY) return;
    const {x, y} = center;
    
    const xdiff = newX / x;
    const ydiff = newY / y;

    const xFlip = xdiff < 1 ? 1 : -1;
    const yFlip = ydiff >= 1 ? 1 : -1;

    const finalX = x + (xdiff === 0 ? 0 : Math.log(Math.abs(xdiff))) * 10 * xFlip;
    const finalY = y + (ydiff === 0 ? 0 : Math.log(Math.abs(ydiff))) * 10 * yFlip;

    this.pupilRef.current?.to({
      x: finalX,
      y: finalY,
    });
  }

  private handleMouseMove = (event: KonvaEventObject<MouseEvent>) => {
    const { clientX: x, clientY: y } = event.evt;
    this.handleIrisMove(x, y);
    this.handlePupilMove(x, y);
  }

  public render() {
    const {x, y} = center;
    return (
      <div ref={this.ref}>
        <Stage style={{border: '1px solid black'}} width={150} height={100} onMouseMove={this.handleMouseMove}>
          <Layer>
            <Text
              text={`${this.pupilRef.current?.x}. ${this.pupilRef?.current?.y}`}
              fontSize={16}
            />
            <Circle
              radius={24}
              x={x}
              y={y}
              ref={this.irisRef}
              stroke="black"
              fill="brown"
            />
            <Circle
              radius={11}
              x={x}
              y={y}
              ref={this.pupilRef}
              stroke="black"
              fill="black"
            />
          </Layer>
          <Layer>
            <Line
              points={[10,50, 70,75, 130,50, 70,25]}
              tension={0.35}
              closed
              stroke="black"
            />
          </Layer>
        </Stage>
      </div>
    );
  }
}