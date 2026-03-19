import { z } from "zod";

// News schema
export const NewsSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
  image: z.string().url().optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
});

export type NewsFormData = z.infer<typeof NewsSchema>;

// Event schema
export const EventSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  type: z.enum(["FESTIVAL", "ASSEMBLY", "TRAINING", "PROJECTION", "CONFERENCE", "WORKSHOP"]),
  venue: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  image: z.string().url().optional().or(z.literal("")),
  maxAttendees: z.coerce.number().positive().optional(),
  isPublished: z.boolean().default(false),
});

export type EventFormData = z.infer<typeof EventSchema>;

// Film schema
export const FilmSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  titleOriginal: z.string().optional(),
  synopsis: z.string().optional(),
  duration: z.coerce.number().positive().optional(),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  genre: z.string().optional(),
  language: z.string().optional(),
  poster: z.string().url().optional().or(z.literal("")),
  trailerUrl: z.string().url().optional().or(z.literal("")),
  isPublished: z.boolean().default(true),
});

export type FilmFormData = z.infer<typeof FilmSchema>;

// Job schema
export const JobSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  type: z.enum(["EMPLOI", "CASTING", "APPEL_PROJET", "STAGE", "FORMATION"]),
  location: z.string().optional(),
  isRemote: z.boolean().default(false),
  salary: z.string().optional(),
  deadline: z.coerce.date().optional(),
  requirements: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export type JobFormData = z.infer<typeof JobSchema>;
