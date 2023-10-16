import { setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import { generateUID } from '../common/common';

export const initInstances = () => {
  const storeWidgetInstances = writable<any[]>([]);
  setContext('widgetInstances', storeWidgetInstances);
}

export const addInstance = (widget: Writable<any>, newInstance: any) => {
  const instanceConfig = structuredClone(newInstance);
  const uuid = `widget-${generateUID()}`
  instanceConfig.id = uuid;
  instanceConfig.uid = uuid;
  instanceConfig.temp = true;
  instanceConfig.title = newInstance.title;
  instanceConfig.widget_slug = uuid;
  // instanceConfig.master_filtering = true;
  delete instanceConfig.instance_loaded;
  delete instanceConfig.loaded;
  delete instanceConfig.fetch;

  widget.update(w => {
    w.instances.push(instanceConfig)
    return w;
  });
  return instanceConfig;
}

export const removeInstance = (widget: Writable<any>, instanceSlug: string) => {
  widget.update(w => {
    w.instances = w.instances.filter((instance: any) => instance.widget_slug !== instanceSlug)
    return w;
  });
}

export const clearInstances = (widget: Writable<any>) => {
  widget.update(w => {
    w.instances = []
    return w;
  });
}

