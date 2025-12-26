import { Component } from 'react'
import Header from './component/Header/Header.jsx'
import Product from './component/Product/Product.jsx'
import Footer from './component/Footer/Footer.jsx'   
import TesteComponent from './component/testeComponent/TesteComponent.jsx'
class App extends Component {
  render() {
    return (
      <div>
      <Header />
        <Product />
        <TesteComponent />
      <Footer />
      </div>
    )
  }
}



export default App
