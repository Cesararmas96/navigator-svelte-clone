import { setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import { generateUID } from '../common/common';

export const initInstances = () => {
  const storeWidgetInstances = writable<any[]>([]);
  setContext('widgetInstances', storeWidgetInstances);
}

export const addInstance = (instances: Writable<any[]>, newInstance: any) => {
  const instanceConfig = deepClone(newInstance);
  instanceConfig.id = `widget-${generateUID()}`;
  instanceConfig.uid = `widget-${generateUID()}`;
  instanceConfig.temp = true;
  instanceConfig.title = newInstance.title + ' (temp)';
  instanceConfig.master_filtering = true;

  instances.update(instances => [...instances, instanceConfig]);
}

export const removeInstance = (instances: Writable<any[]>, instanceId: string) => {
  instances.update(is => is.filter(instance => instance.id !== instanceId));
}

const deepClone = (obj: any) => {
  if (obj === null) return null;
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    key =>
      (clone[key] =
        typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  );
  if (Array.isArray(obj)) {
    clone.length = obj.length;
    return Array.from(clone);
  }
  return clone;
};

