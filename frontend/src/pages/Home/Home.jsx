import React, { useState } from 'react'
import './Home.scss'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import Healthy from '../../components/Healthy/Healthy'
import HealthyDisplay from '../../components/HealthyDisplay/HealthyDisplay'
const Home = () => {

    const [category, setCategory] = React.useState("All");
    const [categoryhealth, setCategoryHealth] = useState('All');

    return (
        <div>
            <Header />
            <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category} />
            <Healthy categoryhealth={categoryhealth} setCategoryHealth={setCategoryHealth} />
            <HealthyDisplay categoryhealth={categoryhealth} />
        </div>
    )
}

export default Home