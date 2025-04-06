
import { Navbar, Footer, Services, PriceTicker } from './components';

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <PriceTicker />
      </div>
    <Main/>
    <Services />
    <Footer />
   </div>
  );
}

export default App;
