import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundAnimation from "@/components/background-animation"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundAnimation />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 border">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              Welcome to Samarthan Kriya. These Terms of Service govern your use of our website and services.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Samarthan Kriya, you agree to be bound by these Terms of Service. If you do not
              agree to all the terms and conditions, you may not access or use our services.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Description of Service</h2>
            <p>
              Samarthan Kriya is a platform that connects donors with NGOs and individuals in need. We facilitate
              donations and provide tools for fundraising campaigns.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p>
              To use certain features of our service, you must register for an account. You are responsible for
              maintaining the confidentiality of your account information and for all activities that occur under your
              account.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. User Conduct</h2>
            <p>
              You agree not to use our service for any illegal or unauthorized purpose. You must not, in the use of the
              service, violate any laws in your jurisdiction.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Donations and Payments</h2>
            <p>
              When you make a donation through our platform, you agree to provide accurate and complete payment
              information. We use secure payment processors to handle transactions, but we are not responsible for any
              issues with payment processing.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Fees</h2>
            <p>
              Samarthan Kriya may charge a small fee to cover operational costs. These fees will be clearly disclosed
              before any transaction is completed.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Content Ownership</h2>
            <p>
              Users retain ownership of all content they submit to the platform. By submitting content, you grant
              Samarthan Kriya a worldwide, non-exclusive license to use, reproduce, and display the content in
              connection with the service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to our services at our sole
              discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to
              other users, us, or third parties, or for any other reason.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will provide notice of significant changes by
              posting the new Terms of Service on our website and updating the "Last Updated" date.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at contact@samarthankriya.org.
            </p>

            <p className="mt-8 text-sm text-gray-500">Last Updated: March 15, 2023</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

