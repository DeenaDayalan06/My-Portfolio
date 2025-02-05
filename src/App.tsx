import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, Linkedin, Mail, ExternalLink, Code2, Palette, Rocket, Menu, X, Phone } from 'lucide-react';
import axios from 'axios';

// Types
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

interface Skill {
  id: number;
  category: string;
  skills: string[];
}

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

function App() {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combined refs for scroll and visibility
  const [skillsRef, skillsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [projectsRef, projectsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [contactRef, contactInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Scroll handler
  const scrollToSection = (ref: any) => {
    setIsMenuOpen(false);
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, skillsRes] = await Promise.all([
          axios.get('http://localhost:3000/api/projects'),
          axios.get('http://localhost:3000/api/skills')
        ]);
        setProjects(projectsRes.data);
        setSkills(skillsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Form handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    try {
      await axios.post('http://localhost:3000/api/contact', formData);
      setFormStatus({
        type: 'success',
        message: 'Message sent successfully! I will get back to you soon.'
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation setup
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [heroRef, heroInView] = useInView({ triggerOnce: true });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const letterAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    },
    hover: {
      y: -20,
      scale: 1.2,
      rotateY: 180,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 300
      }
    }
  };

  const name = "Deena Dayalan A".split("");
  const colors = [
    "from-pink-500 to-violet-500",
    "from-violet-500 to-indigo-500",
    "from-indigo-500 to-blue-500",
    "from-blue-500 to-cyan-500",
    "from-cyan-500 to-teal-500",
    "from-teal-500 to-green-500",
    "from-green-500 to-emerald-500",
    "from-emerald-500 to-pink-500"
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen relative">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text"
            >
              DDA
            </motion.div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {[
                { name: 'Skills', ref: skillsRef },
                { name: 'Projects', ref: projectsRef },
                { name: 'Contact', ref: contactRef }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.ref)}
                  className="text-gray-300 hover:text-white transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
          className="md:hidden overflow-hidden bg-gray-900/90 backdrop-blur-sm"
        >
          <div className="px-4 py-2 space-y-2">
            {[
              { name: 'Skills', ref: skillsRef },
              { name: 'Projects', ref: projectsRef },
              { name: 'Contact', ref: contactRef }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.ref)}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>
        </motion.div>
      </nav>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.5, 1]
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="min-h-screen flex items-center justify-center px-4 relative pt-16"
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            className="mb-6 flex justify-center space-x-2 flex-wrap"
            variants={staggerChildren}
          >
            {name.map((letter, index) => (
              <motion.span
                key={index}
                variants={letterAnimation}
                whileHover="hover"
                className={`text-7xl font-bold inline-block bg-gradient-to-r ${colors[index % colors.length]} text-transparent bg-clip-text transform-gpu`}
                style={{
                  textShadow: "0 0 20px rgba(192, 132, 252, 0.2)",
                  perspective: "1000px"
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01]
            }}
          >
            <motion.p 
              className="text-2xl mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
              variants={fadeInUp}
              animate={{
                backgroundPosition: ["0%", "100%"],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            >
              Front-End Developer
            </motion.p>
          </motion.div>
          <motion.div 
            className="flex justify-center space-x-6"
            variants={staggerChildren}
          >
            {[
              { Icon: Github, href: "https://github.com" },
              { Icon: Linkedin, href: "https://linkedin.com" },
              { Icon: Mail, href: "mailto:contact@example.com" },
              { Icon: Phone, href: "tel:+916374651107" }
            ].map(({ Icon, href }, index) => (
              <motion.a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors relative group"
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.2,
                  rotate: [0, -10, 10, -10, 0],
                  transition: {
                    duration: 0.5
                  }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={24} />
                <motion.span
                  className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"
                  style={{ translateX: "-50%" }}
                />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        ref={skillsRef}
        initial="hidden"
        animate={skillsInView ? "visible" : "hidden"}
        variants={staggerChildren}
        className="py-20 px-4 bg-gray-900/50 backdrop-blur-sm mt-16"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold mb-12 text-center"
            variants={fadeInUp}
          >
            Skills & Expertise
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skills.map((category, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors duration-300"
                whileHover={{ y: -10 }}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  {index === 0 && <Code2 className="w-12 h-12 mb-4 text-blue-400 group-hover:text-blue-300 transition-colors" />}
                  {index === 1 && <Rocket className="w-12 h-12 mb-4 text-blue-400 group-hover:text-blue-300 transition-colors" />}
                  {index === 2 && <Palette className="w-12 h-12 mb-4 text-blue-400 group-hover:text-blue-300 transition-colors" />}
                </motion.div>
                <h3 className="text-xl font-bold mb-4">{category.category}</h3>
                <ul className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.li 
                      key={skillIndex} 
                      className="text-gray-400 flex items-center space-x-2"
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span>{skill}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        ref={projectsRef}
        initial="hidden"
        animate={projectsInView ? "visible" : "hidden"}
        variants={staggerChildren}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold mb-12 text-center"
            variants={fadeInUp}
          >
            Featured Projects
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative bg-gray-800 rounded-lg overflow-hidden"
                whileHover={{ y: -10 }}
              >
                <div className="relative overflow-hidden">
                  <motion.img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <div className="p-6 relative">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <motion.span 
                        key={tagIndex}
                        className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "#3B82F6"
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        ref={contactRef}
        initial="hidden"
        animate={contactInView ? "visible" : "hidden"}
        variants={staggerChildren}
        className="py-20 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold mb-12 text-center"
            variants={fadeInUp}
          >
            Get In Touch
          </motion.h2>

          {/* Contact Info */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            <a
              href="tel:+916374651107"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Phone size={20} />
              <span>+91 6374651107</span>
            </a>
            <a
              href="mailto:deenadurai03@gmail.com"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Mail size={20} />
              <span>deenadurai03@gmail.com</span>
            </a>
          </motion.div>

          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                placeholder="Your message..."
              />
            </div>
            {formStatus.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  formStatus.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                }`}
              >
                {formStatus.message}
              </motion.div>
            )}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium 
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-600'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
          </motion.form>
        </div>
      </motion.section>
    </div>
  );
}

export default App;