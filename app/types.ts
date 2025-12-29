import * as z from "zod";

export type StepName =
  | "Setup"
  | "Attendees"
  | "Questions"
  | "Agenda"
  | "Documents"
  | "Zoom"
  | "Review";

export type Step = {
  name: StepName;
  enabled: boolean;
};
