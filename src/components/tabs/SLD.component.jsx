// import React, { useRef, useEffect } from 'react';

// export const SLD = ({ data, live }) => {
//   const circlePaths = useRef([]);

//   useEffect(() => {
//     if (!data?.svg_content) return;
//     const paths = document.querySelectorAll('.svg-container svg path');
//     const found = [];
//     paths.forEach((path) => {
//       const d = path.getAttribute('d');
//       const id = path.getAttribute('id');
//       const isCircleLike = /c 0,100\.239\d*/.test(d) && d.includes('181.5');
//       if (isCircleLike && id) {
//         found.push(id);
//       }
//     });
//     circlePaths.current = found;
//   }, [data]);

//   useEffect(() => {
//     if (!live?.sensors || !data?.svg_content) return;

//     const applyStyles = () => {
//       circlePaths?.current.forEach((targetId) => {
//         const sensor = live?.sensors.find((item) => item.id === targetId);
//         if (sensor) {
//           const el = document.getElementById(sensor.id);
//           if (el) {
//             if (sensor.val === 1) {
//               el.style.fill = 'green';
//             } else if (sensor.val === 2) {
//               el.style.fill = 'red';
//             } else {
//               el.style.fill = 'blue';
//             }
//           } else {
//             el.style.fill = 'gray';
//           }
//         }
//       });
//     };
//     setTimeout(applyStyles, 100);
//   }, [live]);

//   useEffect(() => {
//     if (!data?.svg_content) return;

//     circlePaths.current.forEach((id) => {
//       const el = document.getElementById(id);
//       if (el) el.classList.add('clickable-path');
//     });
//   }, [data?.svg_content]);

//   // 2️⃣ Add click listener
//   useEffect(() => {
//     const handleClick = (e) => {
//       const id = e.target.id;
//       console.log('Clicked path:', id);
//       alert(`You clicked ${id}`);
//     };

//     const elements = document.querySelectorAll('.svg-container path.clickable-path');
//     elements.forEach((el) => el.addEventListener('click', handleClick));

//     return () => {
//       elements.forEach((el) => el.removeEventListener('click', handleClick));
//     };
//   }, [data?.svg_content]);

//   console.log(circlePaths.current);
//   console.log('svg', data?.svg_content);
//   return <div className="svg-container" dangerouslySetInnerHTML={{ __html: data?.svg_content }} />;
// };

import React, { useEffect, useRef, useState } from 'react';
import Modal from '../shared/Modal';

export const SLD = ({ data, live }) => {
  const containerRef = useRef(null);
  const circlePaths = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPathId, setSelectedPathId] = useState(null);

  const handleSave = () => {
    console.log('Data saved!');
    setIsModalOpen(false);
  };

  // 1️⃣ Inject SVG into container + detect circle-like paths
  useEffect(() => {
    if (!data?.svg_content || !containerRef.current) return;

    containerRef.current.innerHTML = data.svg_content;

    // detect paths after SVG is injected
    const paths = containerRef.current.querySelectorAll('svg path');
    const found = [];
    paths.forEach((path) => {
      const d = path.getAttribute('d');
      const id = path.getAttribute('id');
      // example detection logic for circle-like paths
      const isCircleLike = /c 0,100\.239\d*/.test(d) && d.includes('181.5');
      if (isCircleLike && id) {
        found.push(id);

        // make path clickable
        path.classList.add('clickable-path');
        path.onclick = null; // remove previous listener
        path.addEventListener('click', () => {
          // 2️⃣ Add click listener
          console.log(`Clicked path: ${id}`);
          setIsModalOpen(true);
          setSelectedPathId(id);
        });
      }
    });

    circlePaths.current = found; // store IDs for reference
  }, [data?.svg_content, live]);

  // 2️⃣ Update color based on live sensor data
  useEffect(() => {
    if (!live || !containerRef.current) return;

    live.sensors?.forEach((sensor) => {
      const pathEl = containerRef.current.querySelector(`#${sensor.id}`);
      if (pathEl && sensor.color) {
        pathEl.style.fill = sensor.color;
      }
    });
  }, [live]);

  return (
    <div className="relative min-h-screen">
      {/* SVG Container */}
      <div ref={containerRef} className="svg-container w-full overflow-auto" />
      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={selectedPathId}
      >
        <form>
          <div className="form-floating">
            <textarea
              className="form-control"
              placeholder="Leave a comment here"
              id="floatingTextarea"
              style={{ height: '100px' }}
            ></textarea>
            <label htmlFor="floatingTextarea">Comments</label>
          </div>
        </form>
      </Modal>
    </div>
  );
};
