import { lazy } from "react";

const variantSections = new Map([["eva", lazy(() => import("sections/src/evidence/EVA/Body"))]]);

export default variantSections;
