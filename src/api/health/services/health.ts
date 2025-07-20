export default () => ({
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  },
}); 