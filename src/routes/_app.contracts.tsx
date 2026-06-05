import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/contracts")({
  beforeLoad: () => {
    throw redirect({ to: "/children" });
  },
});
