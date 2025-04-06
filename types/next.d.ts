import type { Route } from 'next';

declare module 'next' {
  interface Route extends String {}
}