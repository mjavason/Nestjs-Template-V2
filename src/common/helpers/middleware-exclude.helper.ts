import { RequestMethod } from '@nestjs/common';

export function excludeAll(routes: string[]) {
  return routes.map((route) => ({ path: route, method: RequestMethod.ALL }));
}

export function excludePost(routes: string[]) {
  return routes.map((route) => ({ path: route, method: RequestMethod.POST }));
}

export function excludeGet(routes: string[]) {
  return routes.map((route) => ({ path: route, method: RequestMethod.GET }));
}

export function excludeDelete(routes: string[]) {
  return routes.map((route) => ({ path: route, method: RequestMethod.DELETE }));
}
