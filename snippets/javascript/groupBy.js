// @codetype easy | Group a list of objects by a computed key
export function groupBy(items, getKey) {
  return items.reduce((groups, item) => {
    const key = getKey(item);
    (groups[key] ||= []).push(item);
    return groups;
  }, {});
}

const people = [{ name: 'Ana', team: 'web' }, { name: 'Budi', team: 'api' }];
console.log(groupBy(people, (p) => p.team));
