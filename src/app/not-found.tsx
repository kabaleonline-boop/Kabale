// src/app/not-found.tsx
import { redirect } from 'next/navigation';

export default function GlobalNotFound() {
  // Instantly redirects any broken link, old indexed page, or 404 to the home page
  redirect('/');
}