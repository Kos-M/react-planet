// prettier-ignore
import { ClickAwayListener } from '@mui/base';
import * as React from "react";
import { ReactElement } from "react";
import useResizeObserver from "use-resize-observer";
import { DragableContainer } from "./DragableContainer";
import { Orbit } from "./Orbit";
import { Satellite } from "./Satellite";
import styles from './styles/planet.module.scss';

const DEFAULT_MASS = 1;
const DEFAULT_TENSTION = 500;
const DEFAULT_FRICTION = 17;
const DEFAULT_ROTATION = 0;
const DEFAULT_RADIUS = 100;

interface Props {
  centerContent?: React.ReactNode;
  children?: React.ReactNode;
  open?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  mass?: number;
  tension?: number;
  friction?: number;
  orbitClassname?: string;
  orbitRadius?: number;
  rotation?: number;
  hideOrbit?: boolean;
  autoClose?: boolean;
  onClose?: (
    e: React.MouseEvent<Document | HTMLDivElement, MouseEvent>
  ) => void;
  dragablePlanet?: boolean;
  dragRadiusPlanet?: number;
  dragableSatellites?: boolean;
  dragRadiusSatellites?: number;
  bounceRadius?: number;
  bounce?: boolean;
  bounceOnOpen?: boolean;
  bounceOnClose?: boolean;
  bounceDirection?: "TOP" | "BOTTOM" | "LEFT" | "RIGHT";
  satelliteOrientation?: "DEFAULT" | "INSIDE" | "OUTSIDE" | "READABLE";
}

export function Planet(props: Props) {
  const {
    centerContent,
    children,
    open,
    onClick,
    mass,
    tension,
    friction,
    orbitRadius,
    rotation,
    orbitClassname,
    hideOrbit,
    onClose,
    autoClose,
    dragablePlanet,
    dragRadiusPlanet,
    dragableSatellites,
    dragRadiusSatellites,
    bounceRadius,
    bounce,
    bounceOnOpen,
    bounceOnClose,
    bounceDirection,
    satelliteOrientation,
  } = props;

  // const useStyles = makeStyles({
  //   root: {
  //     position: "relative",
  //   },
  //
  //   planetContent: {
  //     position: "absolute",
  //     zIndex: 1,
  //   },
  // });
  // const ref = React.useRef();
  const { ref, height = 0, width = 0 } = useResizeObserver();
  const [_open, setOpen] = React.useState(!!open);

  React.useEffect(() => {
    setOpen(!!open);
  }, [open]);

  var satellites: ReactElement<any>[] = [];
  var satelliteCount = React.Children.count(children);
  React.Children.forEach(children, (c, i) => {
    satellites[i] = (
      <Satellite
        key={i}
        index={i}
        open={_open}
        satelliteCount={satelliteCount}
        planetHeight={height}
        planetWidth={width}
        mass={mass ? mass : DEFAULT_MASS}
        friction={friction ? friction : DEFAULT_FRICTION}
        tension={tension ? tension : DEFAULT_TENSTION}
        orbitRadius={orbitRadius ? orbitRadius : DEFAULT_RADIUS}
        rotation={rotation ? rotation : DEFAULT_ROTATION}
        dragable={!!dragableSatellites}
        dragRadius={dragRadiusSatellites}
        orientation={satelliteOrientation}
      >
        {c}
      </Satellite>
    );
  });

  const onPlanet = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (onClick) {
      onClick(e);
    } else {
      if (_open && autoClose) {
        setOpen(false);
        if (onClose) {
          onClose(e);
        }
      } else {
        setOpen(true);
      }
    }
  };

  const onClickAway = (e: React.MouseEvent<Document, MouseEvent>) => {
    if (autoClose) {
      setOpen(false);
    }

    if (onClose && _open) {
      onClose(e);
    }
  };

  return (
    <ClickAwayListener onClickAway={onClickAway as unknown as (event: MouseEvent | TouchEvent) => void}>
      <div className={styles.root}>
        {!hideOrbit && (
          <Orbit
            open={_open}
            orbitClassname={orbitClassname}
            planetHeight={height}
            planetWidth={width}
            mass={mass ? mass : DEFAULT_MASS}
            friction={friction ? friction : DEFAULT_FRICTION}
            tension={tension ? tension : DEFAULT_TENSTION}
            orbitRadius={orbitRadius ? orbitRadius : DEFAULT_RADIUS}
          />
        )}
        <>{satellites}</>
        <div className={styles.planetContent} onClick={onPlanet}>
          <DragableContainer
            on={
              !!dragablePlanet || !!bounce || !!bounceOnOpen || !!bounceOnClose
            }
            dragable={!!dragablePlanet}
            dragRadius={dragRadiusPlanet}
            open={_open}
            bounceRadius={bounceRadius}
            bounceOnOpen={(bounce && !!!bounceOnClose) || bounceOnOpen}
            bounceOnClose={(bounce && !!!bounceOnOpen) || bounceOnClose}
            bounceDirection={bounceDirection}
          >
            <div ref={ref as any}>{centerContent}</div>
          </DragableContainer>
        </div>
      </div>
    </ClickAwayListener>
  );
}

// const useStyles = makeStyles({
//   root: {
//     position: "relative",
//   },
//
//   planetContent: {
//     position: "absolute",
//     zIndex: 1,
//   },
// });
