import type { StaticImageData } from "next/image";
import generic1 from "../../public/class/generic1.jpg";
import hardware4 from "../../public/class/hardware4.jpg";
import programming2 from "../../public/class/programming2.jpg";
import programming5 from "../../public/class/programming5.jpg";
import factory from "../../public/factory.jpg";
import kids from "../../public/kids.jpeg";
import university from "../../public/university.webp";
import type { EducationSegment } from "@/lib/i18n";

/**
 * Real photos from our classes (public/class). Static imports so next/image knows
 * the dimensions and can blur-up while they load. Only what a page renders is
 * imported — every entry costs a blur placeholder at build time.
 */
export const CLASS_PHOTOS = {
  groupWithRobots: hardware4,
  demoAtStand: generic1,
  codeAlong: programming2,
  presenting: programming5,
};

/** One real photo per private-training segment — the home card and the segment page header. */
export const SEGMENT_PHOTOS: Record<EducationSegment, StaticImageData> = {
  factory,
  school: university,
  kids,
};
