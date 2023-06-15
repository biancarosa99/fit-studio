import React, { useEffect, useRef } from "react";
import { useGoogleMap } from "@react-google-maps/api";

const MapControl = (props) => {
  const map = useGoogleMap();
  const ref = useRef();
  useEffect(() => {
    if (map && ref) {
      map.controls[window.google.maps.ControlPosition[props.position]].push(
        ref.current
      );
    }
  }, [map, ref, props.position]);
  return <div ref={ref}>{props.children}</div>;
};

export default MapControl;
