import group1 from "../../public/class/group1.jpg";
import hardware1 from "../../public/class/hardware1.jpg";
import hardware2 from "../../public/class/hardware2_vertical.jpg";
import hardware4 from "../../public/class/hardware4.jpg";
import hardware5 from "../../public/class/hardware5_vertical.jpg";
import generic1 from "../../public/class/generic1.jpg";
import programming2 from "../../public/class/programming2.jpg";
import programming3 from "../../public/class/programming3.jpg";
import programming4 from "../../public/class/programming4.jpg";

/**
 * Real photos from our classes (public/class). Static imports so next/image knows
 * the dimensions and can blur-up while they load.
 */
export const CLASS_PHOTOS = {
  group: group1,
  groupWithRobots: hardware4,
  wiring: hardware1,
  buildBench: hardware2,
  legAssembly: hardware5,
  demoAtStand: generic1,
  codeAlong: programming2,
  lecture: programming3,
  presenting: programming4,
};
