import { createFileRoute } from "@tanstack/react-router";
import LogiBarcode from "./logi-v21";

export const Route = createFileRoute("/")({ component: LogiBarcode });
