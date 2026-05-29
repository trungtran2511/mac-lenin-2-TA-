import CinematicHero from "../components/home/CinematicHero";
import MainContent from "../components/home/MainContent";
import Footer from "../components/home/Footer";

function HomePage() {
  return (
    <div id="page">
      {/* Cinematic Hero Section */}
      <CinematicHero />

      {/* Content Sections */}
      <MainContent />

      {/* Footer */}
      <Footer />

      <a
        href="#page"
        className="sr-only sr-only-focusable"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        Scroll to top
      </a>
    </div>
  );
}

export default HomePage;
