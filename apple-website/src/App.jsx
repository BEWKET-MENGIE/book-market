import React from "react";
import Header from "./Component/Apple/Header/Header";
import Section1 from "./Component/Apple/Section/Section1/Section1";
import Section2 from "./Component/Apple/Section/Section2/Section2";
import Section3 from "./Component/Apple/Section/Section3/Section3";
import Section4 from "./Component/Apple/Section/Section4/Section4";
import Section5 from "./Component/Apple/Section/Section5/Section5";
import Section6 from "./Component/Apple/Section/Section6/Section6";
import Footer from "./Component/Apple/Footer/Footer";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Footer />
    </div>
  );
}

export default App;