import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Stack from '@/components/Stack';
import Tests from '@/components/Tests';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main data-testid="home-page">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Stack />
      <Tests />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
