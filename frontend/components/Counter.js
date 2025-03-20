"use client";
import CountUp from "react-countup";

export default function Counter({ end }) {
  return <CountUp end={end} scrollSpyOnce />;
}
