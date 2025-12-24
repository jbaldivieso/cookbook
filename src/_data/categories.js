import navigation from './navigation.js';

export default function() {
  const nav = navigation();
  const categories = [];

  function flatten(items) {
    for (const item of items) {
      if (item.isCategory) {
        categories.push(item);
        flatten(item.children);
      }
    }
  }

  flatten(nav);
  return categories;
}
