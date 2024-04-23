import React from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="flex flex-col items-center bg-gray-50">
      <div className="max-w-screen-xl px-4 py-32 mx-auto lg:flex">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Manager Your Expense
            <strong className="font-extrabold text-primary sm:block">
              {" "}
              Control your Money.{" "}
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            Start Creating your budget and save ton of money
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              className="block w-full px-12 py-3 text-sm font-medium text-white rounded shadow bg-primary hover:bg-blue-900 focus:outline-none focus:ring active:bg-blue-900 sm:w-auto"
              href="/sign-in"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      <Image
        src="/dashboard.png"
        alt="dashboard"
        width={1000}
        height={700}
        className="mb-5 border-2 -mt-9 rounded-xl"
      />
    </section>
  );
};

export default Hero;
