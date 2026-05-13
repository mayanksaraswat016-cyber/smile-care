'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Users, Calendar, UserCheck, ThumbsUp } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: 12400,
    suffix: '+',
    label: 'Patients Served',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    icon: Calendar,
    value: 18,
    suffix: ' yrs',
    label: 'Years of Excellence',
    color: 'text-navy-600',
    bg: 'bg-navy-50',
  },
  {
    icon: UserCheck,
    value: 8,
    suffix: '',
    label: 'Expert Dentists',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    icon: ThumbsUp,
    value: 98,
    suffix: '%',
    label: 'Patient Satisfaction',
    color: 'text-navy-600',
    bg: 'bg-navy-50',
  },
];

function useCountUp(target: number, duration: number = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

function StatItem({ stat }: { stat: (typeof stats)[0] }) {
  const { count, ref } = useCountUp(stat.value);
  return (
    <div ref={ref} className="flex flex-col items-center text-center px-6 py-8 group">
      <div
        className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}
      >
        <stat.icon size={22} className={stat.color} />
      </div>
      <div className={`text-3xl xl:text-4xl font-bold tabular-nums ${stat.color} mb-1`}>
        {count.toLocaleString()}
        {stat.suffix}
      </div>
      <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="bg-white shadow-nav relative z-10">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-100">
          {stats.map((stat) => (
            <StatItem key={`stat-${stat.label}`} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
