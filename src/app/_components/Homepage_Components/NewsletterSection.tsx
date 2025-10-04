// NewsletterSection.tsx - Dedicated newsletter signup section for homepage
"use client";

import { useState } from "react";
import Modal from "../Footer_Components/Modals";

interface NewsletterSectionProps {
  onNewsletterSignup?: (email: string) => Promise<void>;
}

export default function NewsletterSection({ onNewsletterSignup }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting || !privacyAccepted) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      if (onNewsletterSignup) {
        await onNewsletterSignup(email);
        setMessage("Bestätigungs-E-Mail wurde versendet! Bitte prüfen Sie Ihr E-Mail-Postfach und bestätigen Sie Ihre Anmeldung.");
        setEmail("");
        setPrivacyAccepted(false);
      }
    } catch (error: any) {
      // Show the actual API error message if available
      const errorMessage = error.message || "Es gab ein Problem bei der Anmeldung. Bitte versuchen Sie es später erneut.";
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-transparent py-16 mb-32 px-6 relative">
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 "></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Icon/Visual Element */}
        <div className="mb-6">
          <svg 
            className="w-16 h-16 mx-auto text-white drop-shadow-lg" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
            />
          </svg>
        </div>

        {/* Heading - High contrast white text with shadow */}
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
          Abonnieren Sie unseren Newsletter
        </h3>
        
        {/* Description - Improved contrast */}
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md leading-relaxed">
          Erhalten Sie aktuelle Neuigkeiten, Veranstaltungen und exklusive Angebote 
          vom Parkbad Gütersloh direkt in Ihr Postfach.
        </p>

        {/* Newsletter Form - Enhanced visibility */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ihre E-Mail-Adresse"
                required
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-white/20 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white focus:bg-white disabled:opacity-50 text-gray-900 placeholder:text-gray-500 shadow-lg"
              />
              <button
                type="submit"
                disabled={isSubmitting || !email || !privacyAccepted}
                className="px-8 py-3 bg-white text-brand-colour-dark rounded-lg font-semibold hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? "Anmelden..." : "Anmelden"}
              </button>
            </div>

            {/* Privacy Checkbox */}
            <div className="flex items-start space-x-2 text-left text-sm text-white/90">
              <input
                type="checkbox"
                id="privacy-newsletter"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                required
                className="mt-1 w-4 h-4 text-brand-colour-dark border-white/30 rounded focus:ring-white bg-white/20"
              />
              <label htmlFor="privacy-newsletter" className="drop-shadow-sm">
                Ich habe die{" "}
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="underline hover:text-white transition-colors"
                >
                  Datenschutzerklärung
                </button>{" "}
                gelesen und akzeptiere sie.
              </label>
            </div>
          </form>
          
          {message && (
            <p className={`text-sm font-medium drop-shadow-md mt-3 ${message.includes("versendet") ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}
        </div>

        {/* Privacy Note - Better contrast */}
        <p className="text-sm text-white/70 mt-4 drop-shadow-sm max-w-lg mx-auto leading-relaxed">
          Ihre E-Mail-Adresse wird nur für den Newsletter verwendet und nicht an Dritte weitergegeben. 
          Sie können sich jederzeit wieder abmelden.
        </p>
      </div>

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <Modal 
          id="newsletter-privacy" 
          onClose={() => setShowPrivacyModal(false)} 
        />
      )}
    </section>
  );
}