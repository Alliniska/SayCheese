import React, { Fragment, useState } from 'react'

const StarRating = ({rating, setRating}) => {
    const [hover, setHover] = useState(null);

    return (
        <Fragment>
            <div className="flexboxHorizontal">
                {[...Array(5)].map((star, i) => {
                    const ratingValue = i + 1;

                    return (
                        <label key={ratingValue}>
                            <input type="radio" name="rating" value={ratingValue} onChange={e => setRating(e.target.value)}/>
                            <div className="fa fa-cheese ratingIcon" onMouseEnter={() => setHover(ratingValue)} onMouseLeave={() => setHover(null)} style={{color:ratingValue <= (hover || rating) ? "#F8B530" : "#443D3A"}}/>
                        </label>
                )})}
                
            </div>
        </Fragment>
    )
}

export default StarRating;