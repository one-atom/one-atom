export function nodeDependencyExits(dep: string): boolean {
  try {
    require.resolve(dep);
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return false;
    }

    throw new Error(error);
  }

  return true;
}
