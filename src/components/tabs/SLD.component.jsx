import React, {useRef, useEffect } from "react";

export const SLD = ({data,live}) => {

const circlePaths = useRef([]);

  useEffect(() => {
    if (!data?.svg_content) return;
      const paths = document.querySelectorAll('.svg-container svg path');
      const found = [];
      paths.forEach(path => {
        const d = path.getAttribute('d');
        const id = path.getAttribute('id');
        const isCircleLike = /c 0,100\.239\d*/.test(d) && d.includes('181.5');
        if (isCircleLike && id) {
          found.push(id);
          
        }
      });
      circlePaths.current = found;
      
  }, [data]);

useEffect(() => {
    if (!live?.sensors || !data?.svg_content) return;

    const applyStyles = () => {
      circlePaths?.current.forEach((targetId) => {
        const sensor = live?.sensors.find((item) => item.id === targetId);
        if (sensor) {
          const el = document.getElementById(sensor.id);
          if (el) {
            if (sensor.val === 1) {
              el.style.fill = "green";
            } else if (sensor.val === 2) {
              el.style.fill = "red";
            } else {
              el.style.fill = "blue";
            }
          }else{
            el.style.fill = "gray";
          }
        }
      });
    };
    setTimeout(applyStyles, 100); 
  }, [live]);

return (<div className="svg-container" dangerouslySetInnerHTML={{ __html: data?.svg_content }} />);

};
