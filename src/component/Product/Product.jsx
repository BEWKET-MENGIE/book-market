import { Component } from 'react'
import './Product.css'
import ProductCard from '../ProductCard/ProductCard'
import  bookInfo  from '../Constant/constant.js'

class Product extends Component {
  

  render() {
    return ( 
      <div className="container">
       
        {bookInfo.map((item) => {
          const { color, title, imgLink, price, description } = item;
          return(
          <ProductCard 
            color={color}
            title={title}
            imgLink={imgLink}
            price={price}
            description={description}
          /> 
        )
        })}
      </div>  

    )
  }

}

export default Product;