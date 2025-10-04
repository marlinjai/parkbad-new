// EmptyStatePlaceholder.tsx - Verbesserte Version
"use client";

import Link from "next/link";
import { useState } from "react";
import Modal from "../Footer_Components/Modals";

interface EmptyStatePlaceholderProps {
  onNewsletterSignup?: (email: string) => Promise<void>;
}

export default function EmptyStatePlaceholder({ onNewsletterSignup }: EmptyStatePlaceholderProps) {
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
        setMessage("✨ Bestätigungs-E-Mail wurde versendet! Bitte prüfen Sie Ihr E-Mail-Postfach und bestätigen Sie Ihre Anmeldung.");
        setEmail("");
        setPrivacyAccepted(false);
      }
    } catch (error: any) {
      // Show the actual API error message if available
      const errorMessage = error.message || "Es gab ein Problem bei der Anmeldung. Bitte versuchen Sie es später erneut.";
      setMessage(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center mt-36">
      {/* Headline */}
      <h2 className="text-3xl sm:text-5xl font-semibold text-brand-colour-light mb-6">
        Gerade gibt es keine aktuellen Veranstaltungen
      </h2>

      {/* Subheadline / Info */}
      <p className="text-lg text-gray-300 mb-10 max-w-xl">
        Doch schon bald warten wieder neue Highlights auf Sie. 
        Schauen Sie bald wieder vorbei oder melden Sie sich für unseren Newsletter an um nichts zu verpassen.
      </p>

      {/* Newsletter Signup */}
      <div className="w-full max-w-md mb-12">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ihre E-Mail-Adresse eingeben"
              required
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-colour-dark focus:border-transparent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSubmitting || !email || !privacyAccepted}
              className="px-6 py-3 bg-brand-colour-dark text-white rounded-lg font-semibold hover:bg-brand-colour-dark/90 focus:outline-none focus:ring-2 focus:ring-brand-colour-dark focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Wird gesendet..." : "Jetzt anmelden"}
            </button>
          </div>

          {/* Privacy Checkbox */}
          <div className="flex items-start space-x-2 text-left text-sm text-gray-300">
            <input
              type="checkbox"
              id="privacy-empty-state"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              required
              className="mt-1 w-4 h-4 text-brand-colour-dark border-gray-300 rounded focus:ring-brand-colour-dark"
            />
            <label htmlFor="privacy-empty-state">
              Ich habe die{" "}
              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="underline hover:text-brand-colour-dark transition-colors"
              >
                Datenschutzerklärung
              </button>{" "}
              gelesen und akzeptiere sie.
            </label>
          </div>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm font-medium ${
              message.includes("versendet") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* Past Events Link */}
      <div className="mb-10">
        <Link
          href="/Neuigkeiten&Events"
          className="inline-block text-brand-colour-light underline-offset-4 hover:underline transition"
        >
          Vergangene Beiträge & Veranstaltungen ansehen
        </Link>
      </div>

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <Modal 
          id="newsletter-privacy" 
          onClose={() => setShowPrivacyModal(false)} 
        />
      )}
    </div>
  );
}
