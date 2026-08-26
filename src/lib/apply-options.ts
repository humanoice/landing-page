/**
 * Option codes for the application form's pick-lists.
 *
 * Shared by the form (renders them), the server action (validates against them)
 * and i18n (labels them) so the stored codes can't drift from what's offered.
 * `languages` is stored as-is in students.languages (checked against 'th'/'en'
 * in db/schema.sql); the other two land in students.background as arrays.
 */
export const LANGUAGES = ["th", "en"] as const;
// Languages plus Linux and ROS — the label calls them "languages & tools" for that reason.
export const PROGRAMMING_LANGUAGES = [
  "python",
  "cpp",
  "plc",
  "javascript",
  "linux",
  "ros",
] as const;
export const SKILLS = ["electronics", "mechanics", "cad", "ml"] as const;

export type Language = (typeof LANGUAGES)[number];
export type ProgrammingLanguage = (typeof PROGRAMMING_LANGUAGES)[number];
export type Skill = (typeof SKILLS)[number];
