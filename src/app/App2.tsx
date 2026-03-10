import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { BenefitsSection } from './components/BenefitsSection';
import { IngredientSection } from './components/IngredientSection';
import { ProductSection2 } from './components/ProductSection2';
import { ValueSection } from './components/ValueSection';
import { HowToUseSection } from './components/HowToUseSection';
import {FAQSection} from './components/FAQSection';
import { AboutSection } from './components/AboutSection';
import { MethodSection } from './components/MethodSection';
import { ScienceSection } from './components/ScienceSection';
import { ProductSection } from './components/ProductSection';
import { OriginSection } from './components/OrigenSection';
import { PurchaseSection } from './components/PurchaseSection';
import { Footer } from './components/Footer';

export default function App12() {
  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      <Header />
      
      <main>
        <div id="hero">
          <HeroSection />
        </div>
        
         <div id="value">
          <ValueSection />
        </div>

         <div id="benefits">
          <BenefitsSection />
        </div>

         <div id="ingredient">
          <IngredientSection />
        </div>

        <div id="product2">
          <ProductSection2 />
        </div>

        <div id="howto">
          <HowToUseSection />
        </div>

        <div id="faq">
          <FAQSection />
        </div>
        
        <div id="method">
          <MethodSection />
        </div>
        
        <div id="about">
          <AboutSection />
        </div>
        
        <div id="science">
          <ScienceSection />
        </div>
        
        <div id="product">
          <ProductSection />
        </div>
        
        <div id="origin">
          <OriginSection />
        </div>

       <section id="purchase" className="scroll-mt-[80px]">
          <PurchaseSection />
        </section>
        
      </main>
      <Footer />
    </div>
  );
}
