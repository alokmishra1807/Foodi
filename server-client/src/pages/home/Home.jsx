import React from 'react'
import Banner from '../../components/Banner'
import Categores from './Categories'
import SpecialDishes from './Specialdishes'
import Testimonials from './Testimonial'
import OurServices from './Oursevices'

const Home = () => {
  return (
    <div>
       <Banner/>
       <Categores/>
       <SpecialDishes/>
       <Testimonials/>
       <OurServices/>
    </div>
  )
}

export default Home