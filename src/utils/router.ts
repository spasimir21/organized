import { Signal } from './signal';

class Router<TRoute> {
  public readonly onRouteChanged = new Signal<[route: TRoute | null]>();

  private _currentRoute: TRoute | null;
  private history: TRoute[] = [];

  get currentRoute(): TRoute {
    return this._currentRoute as TRoute;
  }

  get canGoBack(): boolean {
    return this.history.length > 1;
  }

  pushRoute(route: TRoute): TRoute {
    this._currentRoute = route;
    this.history.push(route);
    this.onRouteChanged.send(route);
    return route;
  }

  popRoute(): TRoute | null {
    const poppedRoute = this.history.pop() ?? null;
    this._currentRoute = this.history[this.history.length - 1] ?? null;
    this.onRouteChanged.send(this._currentRoute);
    return poppedRoute;
  }

  refreshRoute() {
    this.onRouteChanged.send(this._currentRoute);
  }
}

export { Router };
