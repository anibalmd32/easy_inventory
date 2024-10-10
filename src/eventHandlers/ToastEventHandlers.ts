/** Types */
interface Deps {
  toast: any;
}

interface EventConfig {
  title: string;
  description?: string;
  duration?: number;
}

/** Event handler class */
export default class ToastEventHandlers {
  private deps: Deps;

  constructor(deps: Deps) {
    this.deps = deps;
  }

  public trigger(config: EventConfig) {
    this.deps.toast({
      title: config.title,
      description: config.description,
      duration: config.duration,
      variant: 'default',
    });
  }

  public success(config: EventConfig) {
    this.deps.toast({
      title: config.title,
      description: config.description,
      duration: config.duration,
      variant: 'secondary',
    });
  }

  public error(config: EventConfig) {
    this.deps.toast({
      title: config.title,
      description: config.description,
      duration: config.duration,
      variant: 'destructive',
    });
  }
}
