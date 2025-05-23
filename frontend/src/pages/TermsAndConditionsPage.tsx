import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsAndConditionsPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Header with Logo */}
      <header className="py-6 border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
          <img src="/images/logo.jpeg" alt="Logo" className="h-16" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>

        <section className="mb-8">
          <p className="text-gray-700 mb-4">
            Welcome to Elite Trading Hub. These terms and conditions outline the rules and
            regulations for the use of our website.
          </p>
          <p className="text-gray-700 mb-4">
            By accessing this website, we assume you accept these terms and conditions in full. Do
            not continue to use Elite Trading Hub website if you do not accept all of the terms and
            conditions stated on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Interpretation and Definitions</h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <p className="text-gray-700">
              The following terminology applies to these Terms and Conditions, Privacy Statement,
              and Disclaimer Notice and any or all Agreements: "Client", "You", and "Your" refers
              to you, the person accessing this website and accepting the Company's terms and
              conditions. "The Company", "Ourselves", "We", "Our", and "Us", refers to Elite
              Trading Hub. "Party", "Parties", or "Us", refers to both the Client and ourselves, or
              either the Client or ourselves. All terms refer to the offer, acceptance, and
              consideration of payment necessary to undertake the process of our assistance to the
              Client in the most appropriate manner, whether by formal meetings of a fixed duration,
              or any other means, for the express purpose of meeting the Client's needs in respect
              of provision of the Company's stated services/products, in accordance with and subject
              to, prevailing law of Nigeria. Any use of the above terminology or other words in the
              singular, plural, capitalization, and/or he/she or they, are taken as interchangeable
              and therefore as referring to the same.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Use of Cookies</h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <p className="text-gray-700">
              We employ the use of cookies. By using Elite Trading Hub website you consent to the
              use of cookies in accordance with Firepips Elite Trading Hub privacy policy.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Intellectual Property Rights</h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <p className="text-gray-700 mb-4">
              Unless otherwise stated, Elite Trading Hub and/or its licensors own the intellectual
              property rights for all material on Elite Trading Hub. All intellectual property
              rights are reserved. You may view and/or print pages from
              https://www.Elitetradinghubcom for your own personal use subject to restrictions set
              in these terms and conditions.
            </p>
            <p className="text-gray-700 font-medium mb-2">You must not:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Republish material from https://www.Elitetradinghub.com</li>
              <li>Sell, rent, or sub-license material from https://www.Elitetradinghub.com</li>
              <li>Reproduce, duplicate, or copy material from https://www.Elitetradinghub.com</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Hyperlinking to Our Content</h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <p className="text-gray-700 mb-4">
              The following organizations may link to our website without prior written approval:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Government agencies</li>
              <li>Search engines</li>
              <li>News organizations</li>
              <li>Online directory distributors</li>
            </ul>
            <p className="text-gray-700 font-medium mt-4 mb-2">You must not:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Link to our website in any way that suggests any form of association, approval, or
                endorsement on our part where none exists
              </li>
              <li>
                Use any Elite Trading Hub logo or trademarks displayed on the website without
                express written permission
              </li>
              <li>Frame or create browser or border environment around our content</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Reservation of Rights</h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <p className="text-gray-700">
              We reserve the right to request that you remove all links or any particular link to
              our website. You agree to immediately remove all links to our website upon request. We
              also reserve the right to amend these terms and conditions and its linking policy at
              any time. By continuing to link to our website, you agree to be bound to and follow
              these linking terms and conditions.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Risk Warning</h2>
            <p className="text-gray-700">
              Trading forex and financial instruments carries a high level of risk and may not be
              suitable for all investors. Before deciding to trade, you should carefully consider
              your investment objectives, level of experience, and risk appetite. The possibility
              exists that you could sustain a loss of some or all of your initial investment and
              therefore you should not invest money that you cannot afford to lose.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <p className="text-gray-700">
              If you have any queries regarding any of our terms, please contact us at
              info@Elitetradinghub.com
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsAndConditionsPage;