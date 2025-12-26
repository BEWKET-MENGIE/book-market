import{Component} from 'react'
import './ProductCard.css'
class ProductCard extends Component {
  
  render() {
    const { color, title, price, description, imgLink } = this.props;
    return (
    
      <div className="product-card">
      <div className={`card-header ${color}`}>
        <h2 className="product-title">{title}</h2>
      </div>
      <div className="product-image">
        <img src={imgLink} alt={title} />
        
      </div>
      <div className="product-content">
            <h1 className="product-price">{price}</h1>
        <p className="product-description">
          {description}   
        </p>
      </div>
      <div className="add-to-cart">
        <button className="add-to-cart-button" type='submit'>Add to Cart</button>
      </div>
        </div>  
      
    )
  }
}

export default ProductCard
