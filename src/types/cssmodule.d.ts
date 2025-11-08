// src/types/cssmodule.d.ts  (또는 src/vite-env.d.ts)
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
