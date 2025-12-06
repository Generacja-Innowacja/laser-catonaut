import { Outlet, Scripts } from "react-router";

import "@gi/athena/athena.css";
import StarsBackground from "./components/StarsBackground/StarsBackground";
import "./index.css";

export default function App() {
  return (
    <html lang="en">
      <head>
        <title>Laser Cat</title>
        <link
          href="https://unpkg.com/nes.css@2.3.0/css/nes.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Press+Start+2P"
          rel="stylesheet"
        />
      </head>
      <body className="is-dark w-full h-screen flex justify-center items-center">
        <StarsBackground className="absolute top-0 left-0 w-full h-screen z-[-1]" />
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
