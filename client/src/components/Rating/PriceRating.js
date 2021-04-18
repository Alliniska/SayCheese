import React, { Fragment, useState } from 'react'

const PriceRating = ({price, setPrice}) => {
    const [hover, setHover] = useState(null);

    return (
        <Fragment>
            <div className="flexboxHorizontal">
                {[...Array(5)].map((sign, i) => {
                    const priceValue = i + 1;

                    return (
                        <label style={{cursor:"pointer"}} key={priceValue}>
                            <input type="radio" name="rating" value={priceValue} onChange={e => setPrice(e.target.value)}/>
                            <p onMouseEnter={() => setHover(priceValue)} onMouseLeave={() => setHover(null)} style={{fontSize:"32px" ,color:priceValue <= (hover || price) ? "#F8B530" : "#443D3A"}}>£</p>
                        </label>
                )})}
                
            </div>
        </Fragment>
    )
}

export default PriceRating;