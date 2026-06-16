import Layout from "@/components/layout/Layout";
import About1 from "@/components/sections/About1";
import Banner1 from "@/components/sections/Banner1";
import Blog1 from "@/components/sections/Blog1";
import Brand1 from "@/components/sections/Brand1";
import Categories2 from "@/components/sections/Categories2";
import Course1 from "@/components/sections/Course1";
import Cta1 from "@/components/sections/Cta1";
import Mentors1 from "@/components/sections/Mentors1";
import Newsletter1 from "@/components/sections/Newsletter1";
import Testimonial1 from "@/components/sections/Testimonial1";
import Fact2 from "@/components/sections/Fact2";
import React, { useEffect, useState } from "react";
import { firebase } from "../Firebase/config";
import Preloader from "@/components/elements/Preloader";
import { toast } from "react-toastify";
import Hero from "@/components/Hero";
import WhyChooseus from "@/components/WhyChooseus";
import Testimonial from "@/components/Testimonial";

export default function Home1({courses,loading}) {


  return (
    <>
      {/* {loading ? (
        <Preloader />
      ) : (
        <Layout headerStyle={1} footerStyle={1}>
          <Hero/>
  
          <WhyChooseus/>
          <Testimonial/>
   
        </Layout>
      )} */}
           <Layout headerStyle={1} footerStyle={1}>
          <Hero/>
  
          <WhyChooseus/>
          <Testimonial/>
   
        </Layout>
    </>
  );
}
