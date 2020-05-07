import React from 'react';
import { observable, action } from 'mobx';
import { Stage, Layer, Circle, Line,  Group } from 'react-konva';
import { observer } from 'mobx-react';
import Konva from 'konva';
import { Context } from 'konva/types/Context';

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

  private stageRef = React.createRef<Stage>();
  private pupilRef = React.createRef<Konva.Circle>();
  private irisRef = React.createRef<Konva.Circle>();

  private stageDimensions = {
    x: 0,
    y: 0,
  };

  @action
  public componentDidMount() {
    this.height = this.ref.current?.offsetHeight || 800;
    this.width = this.ref.current?.offsetWidth || 700;

    const relativeMouse = this.stageRef.current?.getStage().getPointerPosition();
    this.stageDimensions.x = relativeMouse?.x || 0;
    this.stageDimensions.y = relativeMouse?.y || 0;
  }

  private handleIrisMove = (newX: number, newY: number) => {
    this.handleMove(newX, newY, this.irisRef);
  }

  private handlePupilMove = (newX: number, newY: number) => {
    this.handleMove(newX, newY, this.pupilRef);
  }

  private handleMove = (newX: number, newY: number, ref: React.RefObject<Konva.Circle>) => {
    if (!newX || !newY) return;
    const {x, y} = center;
    
    const xdiff = newX - x;
    const ydiff = newY - y;

    const xFlip = xdiff > 0 ? 1 : -1;
    const yFlip = ydiff > 0 ? 1 : -1;

    const xMove = (xdiff === 0 ? 0 : Math.log(Math.abs(xdiff))) / Math.log(10) * 5 * xFlip;
    const yMove = (ydiff === 0 ? 0 : Math.log(Math.abs(ydiff))) / Math.log(10) * 5 * yFlip;

    const finalX = Math.min(5, xMove);
    const finalY = Math.min(5, yMove);

    ref.current?.to({
      x: x + finalX,
      y: y + finalY,
    });
  }

  private handleMouseMove = () => {
    const relativeMouse = this.stageRef.current?.getStage().getPointerPosition();

    if (!relativeMouse) return;

    this.handleIrisMove(relativeMouse.x, relativeMouse.y);
    this.handlePupilMove(relativeMouse.x, relativeMouse.y);
  }

  private line: Konva.Line= new Konva.Line({
    points: [10,50, 70,75, 130,50, 70,25],
    tension: 0.35,
    closed: true,
  })

  private clipFn = (ctx: Context) => {
    this.line.drawScene(ctx.canvas, undefined, true, undefined);
  }

  public render() {
    const {x, y} = center;
    return (
      <div ref={this.ref}>
        <Stage ref={this.stageRef} style={{border: '1px solid black'}} width={150} height={100} onMouseMove={this.handleMouseMove}>
          <Layer>
            <Group
              clipFunc={this.clipFn}>
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
            </Group>
            <Group>
              <Line
                points={[10,50, 70,75, 130,50, 70,25]}
                tension={0.35}
                closed
                stroke="black"
              />              
            </Group>
          </Layer>
        </Stage>
      </div>
    );
  }
}