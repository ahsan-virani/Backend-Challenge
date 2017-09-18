module.exports = {
  createCacheKeyFromFilters(prefix, params) {
    return prefix.concat('$')
      .concat(params.reduce((acc, cur) => ''.concat(acc)
        .concat('$')
        .concat(cur)));
  },

  getFiltersFromCacheKey(key) {
    const filters = key.split('$');
    return {
      prefix: filters[0],
      params: filters.slice(1)
    }
  }
}
