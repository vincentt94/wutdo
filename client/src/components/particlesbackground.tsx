import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadBubblesPreset } from "tsparticles-preset-bubbles";
import type { Engine } from "tsparticles-engine";

export default function ParticlesBackground() {
  const customInit = useCallback(async (engine: Engine) => {
    await loadBubblesPreset(engine);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    >
      <Particles
        id="tsparticles"
        init={customInit}
        options={{
          preset: "bubbles",
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 100, density: { enable: true, value_area: 800 } },
            color: {
                value: [
                  "#AF7A38",   // warm bronze (your primary accent)
                  "#E6CEA1",   // soft gold
                  "#F0D6B2",   // pale almond beige
                  "#B88B4A",   // warm tan
                  "#DAB892",   // light caramel
                  "#E9C46A"    // mellow sunflower
                ]
              },            opacity: { value: 0.4, random: true },
            size: { value: { min: 4, max: 10 }, random: true },
            move: {
              enable: true,
              speed: 2.2,
              direction: "top",
              straight: false,
              outModes: { default: "out" },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: false },
              onClick: { enable: false },
            },
          },
        }}
      />
    </div>
  );
}
