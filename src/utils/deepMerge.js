// src/utils/deepMerge.js
export const deepMerge = (target, source) => {
    for (const key in source) {
      if (source[key] instanceof Object) {
        if (!target[key]) target[key] = {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  };
  