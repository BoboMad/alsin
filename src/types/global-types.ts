export type APIErrorResponse = {
  message: string;
  errors?: Record<string, string[]>; // Optional for form validation errors
};

export type MessageResponse = {
  message: string;
};