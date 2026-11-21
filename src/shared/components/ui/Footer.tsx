import { cacheLife } from "next/cache";

export default async function Footer() {
  "use cache";
  cacheLife("days");

  return (
    <footer className="text-center p-10">
      <p>Todos Los Derechos Reservados Panther {new Date().getFullYear()}</p>
    </footer>
  );
}
