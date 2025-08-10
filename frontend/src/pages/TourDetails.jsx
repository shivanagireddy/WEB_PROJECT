import React, { useEffect, useRef, useState, useContext } from 'react'
import '../styles/tour-details.css'
import { Container, Row, Col, Form, ListGroup } from 'reactstrap'
import { Await, useParams } from 'react-router-dom'

import calculateAvgRating from '../utils/avgRating'
import avatar from '../assets/images/avatar.jpg'
import Booking from '../components/Booking/Booking'
import Newsletter from '../shared/Newsletter'
import useFetch from './../hooks/useFetch'
import { BASE_URL } from './../utils/config'
import { AuthContext } from './../context/AuthContext'
import { toast, ToastContainer } from 'react-toastify'
// import Review from "../../../backend/models/Review.js"

const TourDetails = () => {

    const { id } = useParams();
    const reviewMsgRef = useRef("");
    const [tourRating, setTourRating] = useState(null);
    const { user } = useContext(AuthContext);

    //Now using static data at first
    //const tour = tourData.find(tour=> tour.id === id)
    //fetch data from database

    const { data: tour, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);
    //destructive properties

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [tour]);

    const { photo, title, desc, price, address, reviews, city, distance, maxGroupSize } = tour;

    const { totalRating, avgRating } = calculateAvgRating(reviews);

    //date format
    const options = { day: 'numeric', month: 'long', year: 'numeric' };


    //submit button
    const submitHandler = async e => {
        e.preventDefault();
        const reviewText = reviewMsgRef.current.value;
        console.log(reviewText);
        console.log(id);
        console.log(user.data.username);
        console.log(tourRating);

        try {
            if (!user || user === undefined || user === null) {
                toast.warn('Please sign in')
            }

            const reviewObj = {
                username: user.data.username,
                reviewText,
                rating: tourRating
            }
            const username = user?.username;
            // const rating = tourRating;
            const res = await fetch(`${BASE_URL}/review/${id}`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(reviewObj)
            })

            const result = await res.json();

            if (!res.ok) {
                //alert("heyyy");
                return alert(result.message);
            }
            alert(result.message)

            // const review = new Review({
            //     reviewText, rating, username, productId: id
            // })
            // const savedReview = await review.save();
            // res.json(savedReview);

        } catch (err) {
            alert(err.message);
        }

    };



    return <>
        <section>
            <Container>
                {
                    loading && <h4 className='text-center pt-5'>Loading.............</h4>
                }
                {
                    error && <h4 className='text-center pt-5'>{error}</h4>
                }
                {
                    !loading && !error && (<Row>
                        <Col lg='8'>
                            <div className='tour__content'>
                                <img src={photo} alt="" />
                                <div className='tour__info'>
                                    <h2>{title}</h2>
                                    <div className='d-flex align-items-center gap-5'>
                                        <span className='tour__rating d-flex align-items-center gap-1'>
                                            <i className="ri-star-fill"></i>{avgRating === 0 ? null : avgRating}
                                            {totalRating === 0 ? ('Not rated') : (<span>({reviews?.length})</span>)}
                                        </span>

                                        <span>
                                            <i className="ri-map-pin-user-fill"></i> {address}

                                        </span>

                                    </div>
                                    <div className='tour__extra-details'>
                                        <span><i className="ri-map-pin-2-fill"></i> {city} </span>
                                        <span><i className="ri-money-dollar-circle-line"></i> {price} /per person </span>
                                        <span><i className="ri-pin-distance-line"></i> {distance} k/m </span>
                                        <span><i className="ri-group-2-line"></i> {maxGroupSize} People </span>
                                    </div>
                                    <h5>Description</h5>
                                    <p>{desc}</p>
                                </div>
                                {/*------------------------Tour Reviews-------------------------------------- */}
                                <div className="tour__reviews mt-4">
                                    <h4>Reviews ({reviews?.length} reviews)</h4>
                                    <Form onSubmit={submitHandler}>
                                        <div className='d-flex align-items-center gap-3 mb-4 rating__group'>
                                            <span onClick={() => setTourRating(1)}>
                                                1 <i className="ri-star-fill"></i></span>
                                            <span onClick={() => setTourRating(2)}>
                                                2 <i className="ri-star-fill"></i></span>
                                            <span onClick={() => setTourRating(3)}>
                                                3 <i className="ri-star-fill"></i></span>
                                            <span onClick={() => setTourRating(4)}>
                                                4 <i className="ri-star-fill"></i></span>
                                            <span onClick={() => setTourRating(5)}>
                                                5 <i className="ri-star-fill"></i></span>
                                        </div>
                                        <div className="review__input">
                                            <input type='text' ref={reviewMsgRef} placeholder='share your thoughts' required />
                                            <button className='btn primary__btn text-white' type='submit'>
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                    <ListGroup className='user__reviews'>
                                        {reviews?.map(review => (
                                            <div className='review__item'>
                                                <img src={avatar} alt='' />

                                                <div className='w-100'>
                                                    <div className='d-flex align-items-center justify-content-between'>
                                                        <div>
                                                            <h5>{review.username}</h5>
                                                            <p>{new Date(review.createdAt).toLocaleDateString("en-US", options)}</p>
                                                        </div>
                                                        <span className='d-flex align-items-center'>
                                                            {review.rating}<i className="ri-star-fill"></i>
                                                        </span>
                                                    </div>
                                                    <h6>{review.reviewText}</h6>
                                                </div>
                                            </div>
                                        ))}
                                    </ListGroup>
                                </div>

                                {/*-------------------------------------------------------------------------- */}
                            </div>
                        </Col>
                        <Col lg='4'>
                            <Booking tour={tour} avgRating={avgRating} />
                        </Col>
                    </Row>)
                }
            </Container>
        </section>
        <Newsletter />
    </>

}

export default TourDetails;