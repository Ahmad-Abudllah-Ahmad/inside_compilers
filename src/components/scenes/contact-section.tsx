'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Three.js
const Antigravity = dynamic(() => import('../ui/Antigravity'), { ssr: false });

const galaxyStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(1deg); }
    66% { transform: translateY(5px) rotate(-1deg); }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
`;

const contactMethods = [
  {
    icon: '📧',
    label: 'Email',
    value: 'inside.compiler@gmail.com',
    href: 'mailto:inside.compiler@gmail.com',
  },
  {
    icon: '📱',
    label: 'Phone',
    value: '+92 307 9632007',
    href: 'tel:+923079632007',
  },
  {
    icon: '💬',
    label: 'WhatsApp',
    value: 'Chat with us',
    href: 'https://wa.me/923079632007',
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    project: '',
    budget: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);

    // Auto hide after 5 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Shake animation for errors
      const errorFields = Object.keys(errors);
      errorFields.forEach(fieldName => {
        const field = formRef.current?.querySelector(`[name="${fieldName}"]`);
        if (field) {
          const tl = gsap.timeline();
          tl.to(field, { x: -10, duration: 0.1, ease: 'power2.inOut' })
            .to(field, { x: 10, duration: 0.1, ease: 'power2.inOut' })
            .to(field, { x: -10, duration: 0.1, ease: 'power2.inOut' })
            .to(field, { x: 10, duration: 0.1, ease: 'power2.inOut' })
            .to(field, { x: 0, duration: 0.1, ease: 'power2.inOut' });
        }
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formElement = formRef.current;
      if (!formElement) throw new Error('Form not found');

      const formDataToSend = new FormData(formElement);

      const response = await fetch('https://formsubmit.co/inside.compiler@gmail.com', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        showNotification('✅ Message sent successfully! We&apos;ll get back to you soon.', 'success');

        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          project: '',
          budget: '',
          message: '',
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showNotification('❌ Failed to send message. Please try again or contact us directly.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: galaxyStyles }} />
      <section
        id="contact"
        ref={sectionRef}
        className="py-[var(--section-padding)] relative overflow-hidden flex items-center justify-center"
        style={{ background: '#000000', minHeight: '100vh', contain: 'layout style paint' }}
      >
        {/* Antigravity Background - visible on all screens */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: -1, willChange: 'transform', transform: 'translateZ(0)' }}>
          <Antigravity
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
            count={isMobile ? 200 : 400}
            magnetRadius={8}
            ringRadius={6}
            waveSpeed={0.2}
            waveAmplitude={0.5}
            particleSize={isMobile ? 0.2 : 0.3}
            lerpSpeed={0.05}
            color="#6366F1"
            autoAnimate={true}
            particleVariance={0.5}
            rotationSpeed={0.1}
            depthFactor={0.5}
            pulseSpeed={1}
            particleShape="box"
            fieldStrength={5}
          />
        </div>

        {/* Mobile gradient fallback */}


        <div
          className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col items-center justify-center text-center"
        >
          <h2
            ref={titleRef}
            className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center mb-6 sm:mb-8 px-4"
          >
            <span className="astloch-regular">L</span>et&apos;s <span className="astloch-regular">B</span>uild <span className="text-accent-cyan"><span className="astloch-regular">T</span>ogether</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-text-secondary text-center mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            Ready to transform your ideas into reality? Get in touch with us to discuss your project
            and discover how we can help you achieve your goals.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start justify-items-center lg:justify-items-start w-full max-w-5xl mx-auto px-2 sm:px-4">
            {/* Contact Information */}
            <div className="space-y-4 sm:space-y-6 w-full max-w-72 sm:max-w-none mx-auto lg:mx-0">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center lg:text-left">Get In Touch</h3>

              <div className="flex flex-col gap-3 sm:gap-4 items-center lg:items-stretch">
                {contactMethods.map((method) => (
                  <a
                    key={method.label}
                    href={method.href}
                    className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-surface/40 backdrop-blur-md rounded-xl border border-white/10 hover:border-accent-cyan/40 transition-all duration-300 hover:bg-surface/60"
                  >
                    <div className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                      {method.icon}
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-sm sm:text-base font-semibold text-accent-cyan">{method.label}</div>
                      <div className="text-sm sm:text-base text-text-secondary group-hover:text-text transition-colors duration-200">
                        {method.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Office Hours */}
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-surface/40 backdrop-blur-md rounded-xl border border-white/10">
                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-accent-lime text-center lg:text-left">Office Hours</h4>
                <div className="space-y-2 text-sm sm:text-base text-text-secondary text-center lg:text-left">
                  <div>Monday - Friday: 9:00 AM - 6:00 PM (EST)</div>
                  <div>Saturday: 10:00 AM - 2:00 PM (EST)</div>
                  <div>Sunday: Closed</div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form
              ref={formRef}
              action="https://formsubmit.co/inside.compiler@gmail.com"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-6 w-full max-w-72 sm:max-w-none mx-auto lg:mx-0"
            >
              {/* FormSubmit.co configuration */}
              <input type="hidden" name="_subject" value="New Contact Form Submission from Inside Compilers" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="form-field relative">
                  <label htmlFor="name" className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-center sm:text-left">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-surface/95 border border-transparent rounded-lg focus:outline-none transition-all duration-200 ${errors.name
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'hover:bg-surface/90'
                      }`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="form-field relative">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-center sm:text-left">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-surface/95 border border-transparent rounded-lg focus:outline-none transition-all duration-200 ${errors.email
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'hover:bg-surface/90'
                      }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="form-field relative">
                  <label htmlFor="company" className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-center sm:text-left">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-surface/95 border border-transparent hover:bg-surface/90 focus:outline-none transition-all duration-200 rounded-lg"
                    placeholder="Your Company"
                  />
                </div>

                <div className="form-field relative">
                  <label htmlFor="budget" className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-center sm:text-left">
                    Project Budget
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-surface/95 border border-transparent hover:bg-surface/90 focus:outline-none transition-all duration-200 rounded-lg"
                  >
                    <option value="">Select Budget Range</option>
                    <option value="5k-15k">$5K - $15K</option>
                    <option value="15k-50k">$15K - $50K</option>
                    <option value="50k-100k">$50K - $100K</option>
                    <option value="100k+">$100K+</option>
                  </select>
                </div>
              </div>

              <div className="form-field relative">
                <label htmlFor="project" className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-center sm:text-left">
                  Project Type
                </label>
                <select
                  id="project"
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-surface/95 border border-transparent hover:bg-surface/90 focus:outline-none transition-all duration-200 rounded-lg"
                >
                  <option value="">Select project type</option>
                  <option value="web-development">Web Development</option>
                  <option value="automation">Automation Solutions</option>
                  <option value="ai-integration">AI Integration</option>
                  <option value="e-commerce">E-commerce</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-field relative">
                <label htmlFor="message" className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-center sm:text-left">
                  Project Description *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-surface/95 border border-transparent rounded-lg focus:outline-none transition-all duration-200 resize-vertical ${errors.message
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'hover:bg-surface/90'
                    }`}
                  placeholder="Tell us about your project, goals, and requirements..."
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-2px py-2 sm:py-3 px-4 sm:px-6 text-sm font-medium rounded-full border transition-all duration-300 ${isSubmitting
                  ? 'bg-transparent border-white/30 text-white/50 cursor-not-allowed'
                  : 'bg-transparent border-white text-white hover:bg-white/10 hover:scale-105'
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    <span>Sending Message...</span>
                  </div>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Popup Notification */}
        {showPopup && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowPopup(false)}
            />
            <div className={`relative max-w-md w-full p-6 rounded-xl shadow-2xl transform transition-all duration-300 ${popupType === 'success'
              ? 'bg-gradient-to-br from-green-500 to-accent-lime'
              : 'bg-gradient-to-br from-red-500 to-red-600'
              }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${popupType === 'success' ? 'bg-white/20' : 'bg-white/20'
                    }`}>
                    {popupType === 'success' ? '✅' : '❌'}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {popupType === 'success' ? 'Success!' : 'Error!'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                {popupMessage}
              </p>
              <div className={`mt-4 h-1 rounded-full bg-white/20 overflow-hidden ${popupType === 'success' ? 'bg-white/20' : 'bg-white/20'
                }`}>
                <div
                  className="h-full bg-white/60 animate-pulse"
                  style={{
                    animation: 'shrink 5s linear forwards'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Custom CSS for popup animation */}
        <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      </section>
    </>
  );
}
