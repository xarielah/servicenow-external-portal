export const transformTemplate = (item: any) => {
  return {
    id: item.sys_id,
    system_id: item.u_id,
    name: item.name,
    description: item.short_description,
  };
};
