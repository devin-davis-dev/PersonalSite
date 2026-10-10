import { memo, useEffect, useRef } from "react";
import { Box } from "theme-ui";

const Loader = () => {
  const heroBtnBackgroundRef = useRef();
  const intervalRef = useRef();
  const timeoutsRef = useRef([]);

  useEffect(() => {
    const sticks = heroBtnBackgroundRef.current?.children;
    if (!sticks) return;

    const expandStick = (el) => {
      el.style.height = "100%";
      el.style.backgroundColor = "#9d8189";
    };

    const shrinkStick = (el) => {
      el.style.height = "0%";
      el.style.backgroundColor = "#508991";
    };

    let stickState = false;

    const animateSticks = () => {
      stickState = !stickState;

      const delays = [0, 100, 200, 300, 400];
      const stickAction = stickState ? expandStick : shrinkStick;

      delays.forEach((delay, index) => {
        const timeout = setTimeout(() => {
          if (sticks[index]) {
            stickAction(sticks[index]);
          }
        }, delay);
        timeoutsRef.current.push(timeout);
      });
    };

    animateSticks();
    intervalRef.current = setInterval(animateSticks, 1400);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      for (const timeout of timeoutsRef.current) {
        clearTimeout(timeout);
      }
      timeoutsRef.current = [];
    };
  }, []);
  return (
    <Box
      sx={{
        width: "200px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "200px",
        div: {
          width: "10px",
          height: "100%",
          backgroundColor: "white",
          transition: "height .5s ease, background-color .5s ease-in-out",
        },
      }}
      ref={heroBtnBackgroundRef}
    >
      <Box style={{ height: 10, backgroundColor: "#508991" }} />
      <Box style={{ height: 50, backgroundColor: "#508991" }} />
      <Box style={{ height: 80, backgroundColor: "#508991" }} />
      <Box style={{ height: 50, backgroundColor: "#508991" }} />
      <Box style={{ height: 10, backgroundColor: "#508991" }} />
    </Box>
  );
};

export default memo(Loader);
