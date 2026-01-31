export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: January 31, 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Irunica Co., Ltd. (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data.
            This Privacy Policy explains how we collect, use, and protect your information when you interact with our email communications
            and personalized landing pages.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>Contact Information:</strong><br />
            Irunica Co., Ltd.<br />
            315, 169-16, Gasan digital 2-ro, Geumcheon-gu, Seoul, Republic of Korea<br />
            Email: <a href="mailto:privacy@irunica.com" className="text-blue-600 hover:underline">privacy@irunica.com</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed mb-3">We collect the following types of information:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>Business Contact Information:</strong> Company name, email address, website URL, business phone number</li>
            <li><strong>Publicly Available Information:</strong> Business information sourced from public directories, websites, and business listings</li>
            <li><strong>Website Visit Data:</strong> When you visit our personalized landing pages, we collect: IP address, browser type, device information, pages viewed, time spent on pages, referring URL</li>
            <li><strong>Communication Data:</strong> Email opens, clicks, and responses to our business communications</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-3">We use your information for the following purposes:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>Business Development:</strong> To send you personalized business proposals and partnership opportunities</li>
            <li><strong>Service Delivery:</strong> To provide customized landing pages showcasing relevant product information</li>
            <li><strong>Communication:</strong> To respond to your inquiries and facilitate business discussions</li>
            <li><strong>Analytics:</strong> To understand engagement and improve our outreach effectiveness</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            <strong>Legal Basis (GDPR):</strong> We process your data based on our legitimate business interests in developing
            partnerships and promoting our services. You have the right to object to this processing at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Sharing and Third Parties</h2>
          <p className="text-gray-700 leading-relaxed mb-3">We share your information with the following third-party service providers:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>Smartlead:</strong> Email delivery and campaign management platform</li>
            <li><strong>Google Cloud Platform:</strong> Data storage (Firestore) and hosting infrastructure</li>
            <li><strong>Google Gemini AI:</strong> AI-powered content generation for personalized communications</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            All third-party processors are contractually required to protect your data and use it only for the specified purposes.
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">
            We retain your business contact information for up to 90 days from the last interaction or until you request deletion.
            After this period, your data is automatically deleted from our systems. We may retain certain data longer if required by law
            or for legitimate legal purposes (e.g., contract disputes, compliance audits).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Your Rights</h2>

          {/* Quick Access Button */}
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-blue-900 font-semibold mb-2">Exercise Your Rights Now</p>
            <a
              href="/privacy/request"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Data Request →
            </a>
          </div>

          <p className="text-gray-700 leading-relaxed mb-3">You have the following rights regarding your personal data:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>Right to Unsubscribe:</strong> Click the unsubscribe link in any email we send you</li>
            <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Right to Restrict Processing:</strong> Request limitation of how we use your data</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
            <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            To exercise any of these rights, you can:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
            <li><strong>Email us:</strong> <a href="mailto:privacy@irunica.com" className="text-blue-600 hover:underline">privacy@irunica.com</a></li>
            <li><strong>Self-Service Data Deletion:</strong> Submit a deletion request via API:
              <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 font-mono text-xs">
                POST https://email-sender-53995941986.asia-northeast3.run.app/api/data-deletion<br/>
                Content-Type: application/json<br/>
                Body: &#123;&quot;email&quot;: &quot;your@email.com&quot;&#125;
              </div>
            </li>
            <li><strong>Self-Service Data Access:</strong> Request your data via API:
              <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 font-mono text-xs">
                POST https://email-sender-53995941986.asia-northeast3.run.app/api/data-access<br/>
                Content-Type: application/json<br/>
                Body: &#123;&quot;email&quot;: &quot;your@email.com&quot;&#125;
              </div>
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            We will respond to email requests within 30 days. API requests are processed immediately.
            If you are in the EU, you also have the right to lodge a complaint with your local data protection authority.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement industry-standard security measures to protect your data, including encryption in transit (HTTPS/TLS),
            access controls, secure cloud infrastructure (Google Cloud Platform), and regular security audits. However, no method of
            transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. International Data Transfers</h2>
          <p className="text-gray-700 leading-relaxed">
            Your data may be transferred to and processed in countries outside your country of residence, including South Korea and
            the United States. We ensure that appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) approved
            by the European Commission for EU data transfers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Cookies and Tracking</h2>
          <p className="text-gray-700 leading-relaxed">
            Our personalized landing pages use minimal tracking to record page visits and engagement. We do not use third-party advertising
            cookies. By using our landing pages, you consent to this limited tracking for analytics purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Children&apos;s Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Our services are directed at businesses and business professionals. We do not knowingly collect information from individuals
            under the age of 18. If we learn that we have collected such information, we will delete it immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the &quot;Last Updated&quot;
            date at the top of this page. Continued use of our services after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about this Privacy Policy or how we handle your data, please contact us:
          </p>
          <div className="mt-3 text-gray-700">
            <strong>Irunica Co., Ltd.</strong><br />
            Privacy Department<br />
            315, 169-16, Gasan digital 2-ro, Geumcheon-gu, Seoul, Republic of Korea<br />
            Email: <a href="mailto:privacy@irunica.com" className="text-blue-600 hover:underline">privacy@irunica.com</a><br />
            Website: <a href="https://irunica.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">irunica.com</a>
          </div>
        </section>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            © 2026 Irunica Co., Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
