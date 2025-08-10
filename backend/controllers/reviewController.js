import Tour from "../models/Tour.js"
import Review from "../models/Review.js"

export const createReview = async (req, res) => {
    try {
        const tourId = req.params.tourId
        const { username, reviewText, rating } = req.body;
        const newReview = new Review({ tour: tourId, username, reviewText, rating })
        const savedReview = await newReview.save();
        // res.json(savedReview);

        //after creating a new review now update the reviews array of the tour
        // await Tour.findByIdAndUpdate(tourId, {
        //     $push: { reviews: savedReview._id }
        // }, { new: true });

        res.status(200).json({ success: true, message: "Review Submitted", data: savedReview });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err, });
    }
}

