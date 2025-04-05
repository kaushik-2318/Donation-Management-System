import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 border">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              At Samarthan Kriya, we take your privacy seriously. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our platform.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us when you:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Register for an account</li>
              <li>Make a donation</li>
              <li>Create a fundraising campaign</li>
              <li>Contact our customer support</li>
              <li>Subscribe to our newsletter</li>
            </ul>
            <p>
              This information may include your name, email address, phone number, address, payment information, and any
              other information you choose to provide.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process donations and send receipts</li>
              <li>Communicate with you about campaigns, events, and other news</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. Sharing of Information</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>NGOs and campaign organizers when you make a donation</li>
              <li>Service providers who perform services on our behalf</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p>We will never sell your personal information to third parties.</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. Security</h2>
            <p>
              We take reasonable measures to help protect your personal information from loss, theft, misuse, and
              unauthorized access, disclosure, alteration, and destruction.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Choices</h2>
            <p>
              You can access, update, or delete your account information at any time by logging into your account
              settings. You can also opt out of receiving promotional emails by following the instructions in those
              emails.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Cookies</h2>
            <p>
              We use cookies and similar technologies to collect information about your browsing activities and to
              distinguish you from other users of our website. You can set your browser to refuse all or some browser
              cookies, but this may prevent you from using some features of our website.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
            <p>
              Our services are not directed to children under 13, and we do not knowingly collect personal information
              from children under 13. If we learn that we have collected personal information from a child under 13, we
              will take steps to delete that information.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@samarthankriya.org.</p>

            <p className="mt-8 text-sm text-gray-500">Last Updated: March 15, 2023</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

