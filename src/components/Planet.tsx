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
const DEFAULT_ORBIT_SEPARATION = 50;

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
  perOrbitSatellites?: number;
  maxFirstOrbitSatellites?: number;
  orbitSeparation?: number;
  makeSpace?: boolean;
  satelliteClassname?: string;
  linkLineClassname?: string;
  showLinks?: boolean;
  minOrbitSeparation?: number;
  orbitSeparationCoeff?: number;
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
    maxFirstOrbitSatellites,
    perOrbitSatellites,
    orbitSeparation,
    makeSpace,
    satelliteClassname,
    linkLineClassname,
    showLinks,
    minOrbitSeparation,
    orbitSeparationCoeff
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
  const orbits: ReactElement<any>[] = [];
  let satellites: ReactElement<any>[] = [];
  let satelliteCount = React.Children.count(children);


  let orbitIndex = 0;
  let currentOrbitCount = perOrbitSatellites ? Math.min(perOrbitSatellites, satelliteCount) : (maxFirstOrbitSatellites ? Math.min(maxFirstOrbitSatellites, satelliteCount) : satelliteCount);
  let prevOrbitCount = 0;
  let currentOrbitRadius = orbitRadius || DEFAULT_RADIUS;
  let currentRotation = rotation || DEFAULT_ROTATION;


  const INITIAL_SEPARATION_ANGLE = 2*Math.PI / currentOrbitCount;
  const SEPARATION_DIST = currentOrbitRadius*INITIAL_SEPARATION_ANGLE


  React.Children.forEach(children, (c, i) => {
    if (currentOrbitCount) {
      if (i >= prevOrbitCount + currentOrbitCount) {
        orbits.push(
            <div>
              {!hideOrbit && (
                  <Orbit
                      open={_open}
                      orbitClassname={orbitClassname}
                      planetHeight={height}
                      planetWidth={width}
                      mass={mass ? mass : DEFAULT_MASS}
                      friction={friction ? friction : DEFAULT_FRICTION}
                      tension={tension ? tension : DEFAULT_TENSTION}
                      orbitRadius={currentOrbitRadius}
                  />
              )}
              {satellites}
            </div>
        );
        orbitIndex += 1;
        satellites = [];
        prevOrbitCount += currentOrbitCount
        const minSeparation = minOrbitSeparation ?
          Math.max(minOrbitSeparation, ((orbitSeparation || DEFAULT_ORBIT_SEPARATION) / (2+((orbitSeparationCoeff || 0.8)*orbitIndex)))) :
          (orbitSeparation || DEFAULT_ORBIT_SEPARATION) / 2;
        currentOrbitRadius += minSeparation;

        const circ = 2*Math.PI*currentOrbitRadius;
        currentOrbitCount = perOrbitSatellites ? perOrbitSatellites : Math.min((satelliteCount - prevOrbitCount), Math.floor(circ / SEPARATION_DIST));
        currentRotation = currentRotation + (180 / currentOrbitCount);
      }
    }

    satellites.push(
      <Satellite
        key={`${orbitIndex}_${i}`}
        index={(i-prevOrbitCount)}
        open={_open}
        satelliteCount={currentOrbitCount}
        planetHeight={height}
        planetWidth={width}
        mass={mass ? mass : DEFAULT_MASS}
        friction={friction ? friction : DEFAULT_FRICTION}
        tension={tension ? tension : DEFAULT_TENSTION}
        orbitRadius={currentOrbitRadius}
        rotation={currentRotation}
        dragable={!!dragableSatellites}
        dragRadius={dragRadiusSatellites}
        orientation={satelliteOrientation}
        satelliteClassname={satelliteClassname}
        linkLineClassname={linkLineClassname}
        showLinks={showLinks}
        orbitIndex={orbitIndex}
      >
        {c}
      </Satellite>
    );
  });

  orbits.push(
      <div>
        {!hideOrbit && (
            <Orbit
                open={_open}
                orbitClassname={orbitClassname}
                planetHeight={height}
                planetWidth={width}
                mass={mass ? mass : DEFAULT_MASS}
                friction={friction ? friction : DEFAULT_FRICTION}
                tension={tension ? tension : DEFAULT_TENSTION}
                orbitRadius={currentOrbitRadius}
            />
        )}
        {satellites}
      </div>
  );

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
      <div style={{
        ...(makeSpace && {width: `${currentOrbitRadius*2}px`, height: `${currentOrbitRadius*2}px`})
      }} className={styles.root}>
        {/*<div className={styles.linkWrapper}>*/}
        {/*<svg width={2*currentOrbitRadius} height={1} className={styles.links}>*/}
        {/*  <line x1={currentOrbitRadius} y1={currentOrbitRadius} x2="350" y2="350" stroke="black"></line>*/}
        {/*</svg>*/}
        {/*  </div>*/}
        <div style={{
          ...(makeSpace && {transform: `translate(${currentOrbitRadius - (width/2)}px, ${currentOrbitRadius - (height/2)}px)`})
        }}>
        {orbits}
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
