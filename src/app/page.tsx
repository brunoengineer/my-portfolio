import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Stack from '@/components/Stack';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main data-testid="home-page">
      <Navbar />
      <Hero />
      <Projects />
      <Stack />
      <Footer />
    </main>
  );
}
