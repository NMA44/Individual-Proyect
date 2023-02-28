import { NavLink } from "react-router-dom";
import "./landingPage.css";
import video from "./assets/perro.mp4";

export default function LandingPage() {
  return (
    <>
      <div className="vid">
        <div className="overlay"></div>
        <video src={video} autoPlay muted loop />
      </div>
      <div className="container">
        <div className="center">
          <NavLink to="/home">
            <button class="btn">
              <svg
                width="180px"
                height="60px"
                viewBox="0 0 180 60"
                class="border"
              >
                <polyline
                  points="179,1 179,59 1,59 1,1 179,1"
                  class="bg-line"
                />
                <polyline
                  points="179,1 179,59 1,59 1,1 179,1"
                  class="hl-line"
                />
              </svg>
              <span>Dog Breeds</span>
            </button>
          </NavLink>
        </div>
      </div>
    </>
  );
}
