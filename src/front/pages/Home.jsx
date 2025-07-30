import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Hero from "../components/ComponentsHome/Hero";
import Features from "../components/ComponentsHome/Features";
import Jumbotron from "../components/ComponentsHome/Jumbotron";
import Info from "../components/ComponentsHome/Info";
import Testimonial from "../components/ComponentsHome/Testimonial";
import CallToAction from "../components/ComponentsHome/CallToAction";
import Contact from "../components/ComponentsHome/Contact";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-5">
        <Hero />
        <Features />
        <Jumbotron />
        <Info />
        <Testimonial />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Home;