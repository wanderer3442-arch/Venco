'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState, useEffect } from 'react';
import {
  Download,
  Mail,
  ChevronDown,
  Eye,
  Activity,
  TrendingUp,
  Dumbbell,
  Utensils,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useStore } from '@/lib/store-context';
import { allFoods } from '@/lib/food-database';
import { exercises as allExercises } from '@/lib/exercise-database';
import jsPDF from 'jspdf';
import { useSubscription } from '@/lib/subscription-context';
import Link from 'next/link';

const timePeriods = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Year to Date'];

const sections = [
  { id: 'exercise', label: 'Exercise Plan', icon: Dumbbell, defaultChecked: true },
  { id: 'nutrition', label: 'Meal Plan & Macros', icon: Utensils, defaultChecked: true },
  { id: 'health', label: 'Health Statistics', icon: Activity, defaultChecked: true },
  { id: 'body', label: 'Body Metrics', icon: TrendingUp, defaultChecked: true },
];

const dayLabels: Record<string, string> = {
  Monday: 'Push',
  Tuesday: 'Pull',
  Wednesday: 'Legs',
  Thursday: 'Upper',
  Friday: 'Lower',
  Saturday: 'Full Body',
  Sunday: 'Rest',
};

export default function ExportReportsPage() {
  const { user } = useAuth();
  const { profile, meals, exercises: exerciseLogs, bodyMetrics, calculations, workoutPlan } = useStore();
  const { hasFeature } = useSubscription();
  const [timePeriod, setTimePeriod] = useState('Last 30 Days');
  const [showDropdown, setShowDropdown] = useState(false);
  const [checkedSections, setCheckedSections] = useState<Record<string, boolean>>({
    exercise: true,
    nutrition: true,
    health: true,
    body: true,
  });
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');
  const [generating, setGenerating] = useState(false);
  const [includeMacros, setIncludeMacros] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const hasDownloadAccess = hasFeature('download_reports');

  const toggleSection = (id: string) => {
    setCheckedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const avgCalories = meals.length > 0
    ? Math.round(meals.reduce((sum: number, m: any) => sum + (m.calories || 0), 0) / Math.max(meals.length, 1))
    : 0;

  // Group exercises by day for the plan
  const planDays = workoutPlan ? (() => {
    const grouped: Record<string, any[]> = {};
    workoutPlan.exercises.forEach((ex: any) => {
      if (!grouped[ex.day]) grouped[ex.day] = [];
      grouped[ex.day].push(ex);
    });
    return Object.entries(grouped).map(([day, exercises]) => ({
      day,
      label: dayLabels[day] || day,
      exercises,
    }));
  })() : [];

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 15;

    // === DOCUMENT HEADER ===
    doc.setFillColor(0, 108, 73);
    doc.rect(0, 0, pageWidth, 50, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('Gym at Home', 20, 22);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('CLINICAL GRADE PLAN', 20, 30);
    doc.text(`Prepared: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, 20, 37);
    doc.text('Based on your profile, goals, and tracked data', 20, 43);

    // Client info on right
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Client: ${user?.username || 'N/A'}`, pageWidth - 20, 22, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Period: ${timePeriod}`, pageWidth - 20, 30, { align: 'right' });
    if (profile?.goal) {
      doc.text(`Goal: ${profile.goal === 'lose' ? 'Fat Loss' : profile.goal === 'gain' ? 'Muscle Growth' : 'General Fitness'}`, pageWidth - 20, 37, { align: 'right' });
    }
    doc.text(`Age: ${profile?.age || 'N/A'} | Height: ${profile?.height || 'N/A'}cm | Weight: ${profile?.weight || 'N/A'}kg`, pageWidth - 20, 44, { align: 'right' });

    y = 60;

    // === EXERCISE PLAN ===
    if (checkedSections.exercise) {
      doc.setFillColor(0, 108, 73);
      doc.rect(15, y - 5, 4, 12, 'F');
      doc.setTextColor(0, 108, 73);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Exercise Plan', 24, y + 4);
      y += 14;

      if (planDays.length > 0) {
        // Table
        doc.setFillColor(245, 247, 250);
        doc.rect(15, y, pageWidth - 30, 8, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text('DAY', 18, y + 5.5);
        doc.text('FOCUS', 45, y + 5.5);
        doc.text('EXERCISES', 75, y + 5.5);
        doc.text('VOLUME', 145, y + 5.5);
        y += 9;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        planDays.forEach((dp, i) => {
          if (i % 2 === 0) {
            doc.setFillColor(250, 250, 255);
            doc.rect(15, y - 2, pageWidth - 30, 8, 'F');
          }
          doc.text(dp.day, 18, y + 4);
          doc.text(dp.label, 45, y + 4);
          const exNames = dp.exercises.slice(0, 3).map((e: any) => e.exerciseName).join(', ');
          doc.text(exNames.substring(0, 45), 75, y + 4);
          doc.text(`${dp.exercises[0]?.sets || 3} Sets x ${dp.exercises[0]?.reps || 10} Reps`, 145, y + 4);
          y += 8;
        });
        y += 5;

        // Workout Notes
        if (includeNotes) {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(100, 100, 100);
          doc.text('Trainer Notes: Warm up 5-10 min before each session. Rest 60-90s between sets. Focus on form over weight.', 18, y);
          y += 12;
        }
      } else {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        doc.text('No workout plan generated yet. Visit Exercises page to create one.', 24, y);
        y += 12;
      }
    }

    // === MEAL PLAN & MACROS ===
    if (checkedSections.nutrition) {
      doc.setFillColor(0, 88, 190);
      doc.rect(15, y - 5, 4, 12, 'F');
      doc.setTextColor(0, 88, 190);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Meal Plan & Macros', 24, y + 4);
      y += 14;

      const targetCals = calculations?.targetCalories || 0;
      const targetProtein = calculations?.protein || 0;
      const targetCarbs = calculations?.carbs || 0;
      const targetFat = calculations?.fat || 0;
      const hydration = calculations?.hydration || 0;

      // Macro cards
      const cardWidth = (pageWidth - 50) / 3;
      doc.setFillColor(240, 243, 250);
      doc.roundedRect(15, y, cardWidth, 20, 3, 3, 'F');
      doc.roundedRect(20 + cardWidth, y, cardWidth, 20, 3, 3, 'F');
      doc.roundedRect(25 + cardWidth * 2, y, cardWidth, 20, 3, 3, 'F');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('TARGET CALORIES', 18, y + 8);
      doc.text('PROTEIN GOAL', 23 + cardWidth, y + 8);
      doc.text('HYDRATION', 28 + cardWidth * 2, y + 8);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 108, 73);
      doc.text(`${targetCals.toLocaleString()} kcal`, 18, y + 16);
      doc.setTextColor(0, 88, 190);
      doc.text(`${targetProtein}g`, 23 + cardWidth, y + 16);
      doc.setTextColor(133, 83, 0);
      doc.text(`${hydration}L/day`, 28 + cardWidth * 2, y + 16);
      y += 28;

      // Macro breakdown
      if (includeMacros) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        // Pie chart representation
        doc.setFillColor(0, 108, 73);
        doc.circle(35, y + 10, 10, 'F');
        doc.setFillColor(0, 88, 190);
        doc.circle(35, y + 10, 6, 'F');
        doc.setFillColor(133, 83, 0);
        doc.circle(35, y + 10, 3, 'F');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('40% Carbs', 55, y + 6);
        doc.text(`(${targetCarbs}g)`, 80, y + 6);
        doc.text('30% Protein', 55, y + 12);
        doc.text(`(${targetProtein}g)`, 85, y + 12);
        doc.text('30% Fats', 55, y + 18);
        doc.text(`(${targetFat}g)`, 78, y + 18);

        // Color dots
        doc.setFillColor(0, 108, 73);
        doc.circle(50, y + 4.5, 2, 'F');
        doc.setFillColor(0, 88, 190);
        doc.circle(50, y + 10.5, 2, 'F');
        doc.setFillColor(133, 83, 0);
        doc.circle(50, y + 16.5, 2, 'F');
        y += 25;
      }

      // Weekly Nutrition Overview
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(133, 83, 0);
      doc.text('Weekly Nutrition Overview', 24, y);
      y += 8;

      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dayWidth = (pageWidth - 40) / 7;
      days.forEach((day, i) => {
        const x = 15 + i * dayWidth;
        doc.setFillColor(245, 247, 250);
        doc.roundedRect(x, y, dayWidth - 3, 15, 2, 2, 'F');
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text(day, x + (dayWidth - 3) / 2, y + 5, { align: 'center' });
        // Mini bars
        doc.setFillColor(0, 108, 73);
        doc.rect(x + 3, y + 8, (dayWidth - 9) * 0.8, 1.5, 'F');
        doc.setFillColor(0, 88, 190);
        doc.rect(x + 3, y + 10.5, (dayWidth - 9) * 0.5, 1.5, 'F');
      });
      y += 20;

      // Meal suggestions
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Breakfast:', 18, y);
      doc.setFont('helvetica', 'normal');
      doc.text('Oatmeal with Berries & Whey', 40, y);
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Lunch:', 18, y);
      doc.setFont('helvetica', 'normal');
      doc.text('Grilled Chicken & Quinoa Salad', 35, y);
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Dinner:', 18, y);
      doc.setFont('helvetica', 'normal');
      doc.text('Baked Salmon with Asparagus', 36, y);
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Snacks:', 18, y);
      doc.setFont('helvetica', 'normal');
      doc.text('Greek Yogurt, Almonds', 38, y);
      y += 10;

      // Recent logged meals
      if (meals.length > 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 88, 190);
        doc.text('Recently Logged Meals:', 18, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        meals.slice(-6).forEach((m: any) => {
          doc.setFontSize(8);
          doc.text(`${m.loggedAt?.split('T')[0] || ''}`, 18, y);
          doc.text(`${m.foodName || 'N/A'}`, 45, y);
          doc.text(`${m.calories || 0} kcal`, 130, y);
          y += 5;
        });
        y += 5;
      }
    }

    // === HEALTH STATISTICS ===
    if (checkedSections.health) {
      doc.setFillColor(0, 108, 73);
      doc.rect(15, y - 5, 4, 12, 'F');
      doc.setTextColor(0, 108, 73);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Health Statistics Overview', 24, y + 4);
      y += 14;

      const stats = [
        { label: 'Resting Heart Rate', value: '62 bpm', color: [133, 83, 0] },
        { label: 'Average Sleep', value: '7.2 hrs', color: [0, 88, 190] },
        { label: 'Blood Pressure', value: '118/76', color: [186, 26, 26] },
      ];

      const statWidth = (pageWidth - 50) / 3;
      stats.forEach((stat, i) => {
        const x = 15 + i * (statWidth + 5);
        doc.setFillColor(245, 247, 250);
        doc.roundedRect(x, y, statWidth, 22, 3, 3, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(stat.label.toUpperCase(), x + 5, y + 8);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(stat.color[0], stat.color[1], stat.color[2]);
        doc.text(stat.value, x + 5, y + 17);
      });
      y += 30;
    }

    // === BODY METRICS ===
    if (checkedSections.body && bodyMetrics.length > 0) {
      doc.setFillColor(0, 108, 73);
      doc.rect(15, y - 5, 4, 12, 'F');
      doc.setTextColor(0, 108, 73);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Body Metrics Trends', 24, y + 4);
      y += 14;

      // Table
      doc.setFillColor(245, 247, 250);
      doc.rect(15, y, pageWidth - 30, 8, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('DATE', 18, y + 5.5);
      doc.text('WEIGHT', 55, y + 5.5);
      doc.text('HEIGHT', 90, y + 5.5);
      doc.text('BMI', 125, y + 5.5);
      y += 9;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      bodyMetrics.slice(-7).forEach((b: any, i) => {
        if (i % 2 === 0) {
          doc.setFillColor(250, 250, 255);
          doc.rect(15, y - 2, pageWidth - 30, 7, 'F');
        }
        doc.text(b.date || '', 18, y + 3);
        doc.text(`${b.weight || 0} kg`, 55, y + 3);
        doc.text(`${b.height || 0} cm`, 90, y + 3);
        const bmi = b.weight && profile?.height ? (b.weight / ((profile.height / 100) ** 2)).toFixed(1) : '--';
        doc.text(bmi, 125, y + 3);
        y += 7;
      });
      y += 5;
    }

    // === DOCUMENT FOOTER ===
    const footerY = pageHeight - 15;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by Gym at Home Analytics Engine', 15, footerY);
    doc.text('Confidential - For personal use only', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Page 1 of 1', pageWidth - 15, footerY, { align: 'right' });

    doc.save(`gym-at-home-plan-${user?.username || 'user'}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateCSV = () => {
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const toRow = (arr: string[]) => arr.map(escape).join(',');
    const rows: string[] = [];
    rows.push(toRow(['Gym at Home - Clinical Grade Plan']));
    rows.push(toRow(['Client', user?.username || 'N/A', '', '', '']));
    rows.push(toRow(['Generated', new Date().toLocaleDateString(), '', '', '']));
    rows.push(toRow(['Period', timePeriod, '', '', '']));
    rows.push(toRow(['', '', '', '', '']));

    if (checkedSections.exercise && planDays.length > 0) {
      rows.push(toRow(['EXERCISE PLAN', '', '', '', '']));
      rows.push(toRow(['Day', 'Focus', 'Exercises', 'Sets x Reps', '']));
      planDays.forEach((dp) => {
        rows.push(toRow([
          dp.day,
          dp.label,
          dp.exercises.map((e: any) => e.exerciseName).join(', '),
          `${dp.exercises[0]?.sets || 3}x${dp.exercises[0]?.reps || 10}`,
          '',
        ]));
      });
      rows.push(toRow(['', '', '', '', '']));
    }

    if (checkedSections.nutrition) {
      rows.push(toRow(['MEAL PLAN & MACROS', '', '', '', '']));
      rows.push(toRow(['Target Calories', `${calculations?.targetCalories } kcal`, '', '', '']));
      rows.push(toRow(['Protein', `${calculations?.protein || 0}g`, '', '', '']));
      rows.push(toRow(['Carbs', `${calculations?.carbs || 0}g`, '', '', '']));
      rows.push(toRow(['Fats', `${calculations?.fat || 0}g`, '', '', '']));
      rows.push(toRow(['', '', '', '', '']));
      rows.push(toRow(['Recent Meals', '', '', '', '']));
      meals.slice(-10).forEach((m: any) => {
        rows.push(toRow([m.loggedAt?.split('T')[0] || '', m.foodName || '', `${m.calories || 0} kcal`, '', '']));
      });
      rows.push(toRow(['', '', '', '', '']));
    }

    if (checkedSections.body && bodyMetrics.length > 0) {
      rows.push(toRow(['BODY METRICS', '', '', '', '']));
      rows.push(toRow(['Date', 'Weight (kg)', 'Height (cm)', '', '']));
      bodyMetrics.forEach((b: any) => {
        rows.push(toRow([b.date || '', String(b.weight || ''), String(b.height || ''), '', '']));
      });
    }

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gym-at-home-plan-${user?.username || 'user'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    setGenerating(true);
    setTimeout(() => {
      if (format === 'csv') {
        generateCSV();
      } else {
        generatePDF();
      }
      setGenerating(false);
    }, 600);
  };

  if (!hasDownloadAccess) {
    return (
      <DashboardLayout title="Download Hub" subtitle="Export your personalized fitness and nutrition protocol">
        <div className="max-w-7xl mx-auto pb-8">
          <div className="bg-surface rounded-2xl border border-outline-variant p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-headline-lg font-bold text-on-surface mb-2">
              Download Reports Feature
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-6 max-w-md mx-auto">
              Export detailed health reports, meal plans, and exercise protocols with a Pro subscription.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/choose-plan"
                className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                Upgrade to Pro
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-surface-container text-on-surface rounded-xl font-medium hover:bg-surface-container-high transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Download Hub" subtitle="Export your personalized fitness and nutrition protocol">
      <div className="max-w-7xl mx-auto pb-8">
        <div className="mb-8">
          <h1 className="text-headline-lg font-bold text-on-surface tracking-tight mb-2">Download Hub</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            Export your personalized fitness and nutrition protocol. Select your format and data preferences below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 xl:col-span-9 order-2 lg:order-1">
            <div className="bg-surface-container-low rounded-xl p-6 flex items-center justify-center min-h-[800px] overflow-hidden relative">
              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6c7a71 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

              <div className="bg-surface-container-lowest w-full max-w-3xl aspect-[1/1.414] rounded-sm relative z-10 p-8 md:p-12 flex flex-col scale-95 md:scale-100 transform origin-top transition-transform hover:scale-[1.02] duration-300" style={{ boxShadow: '0 20px 40px -10px rgba(11, 28, 48, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.8)' }}>
                <div className="flex justify-between items-start border-b-2 border-primary/20 pb-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-2xl">V</div>
                    <div>
                      <h3 className="text-headline-md font-bold text-on-surface">Gym at Home Protocol</h3>
                      <p className="text-label-md text-on-surface-variant uppercase tracking-widest text-xs">Clinical Grade Plan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-label-md font-bold text-on-surface">Client: {user?.username || 'N/A'}</p>
                    <p className="text-label-md text-on-surface-variant">{timePeriod}</p>
                    {profile?.goal && (
                      <p className="text-secondary mt-1 bg-secondary-fixed/50 inline-block px-2 py-0.5 rounded text-xs">
                        Goal: {profile.goal === 'lose' ? 'Fat Loss' : profile.goal === 'gain' ? 'Muscle Growth' : 'General Fitness'}
                      </p>
                    )}
                  </div>
                </div>

                {checkedSections.exercise && (
                  <div className="mb-10">
                    <h4 className="text-body-lg font-bold text-on-surface border-l-4 border-primary pl-3 mb-4 flex items-center gap-2">
                      <Dumbbell className="w-5 h-5 text-primary" />
                      Exercise Plan
                    </h4>
                    {planDays.length > 0 ? (
                      <div className="border border-outline-variant/40 rounded-lg overflow-hidden mb-4">
                        <table className="w-full text-sm text-left text-on-surface">
                          <thead className="text-xs text-on-surface-variant bg-surface-container uppercase">
                            <tr>
                              <th className="px-4 py-3 font-semibold">Day</th>
                              <th className="px-4 py-3 font-semibold">Focus</th>
                              <th className="px-4 py-3 font-semibold">Exercises</th>
                              <th className="px-4 py-3 font-semibold">Volume</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-outline-variant/30">
                            {planDays.map((dp) => (
                              <tr key={dp.day} className="bg-surface-container-lowest">
                                <td className="px-4 py-3 font-medium">{dp.day}</td>
                                <td className="px-4 py-3">
                                  <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-1 rounded text-xs">{dp.label}</span>
                                </td>
                                <td className="px-4 py-3">{dp.exercises.slice(0, 2).map((e: any) => e.exerciseName).join(', ')}</td>
                                <td className="px-4 py-3">{dp.exercises[0]?.sets || 3} Sets x {dp.exercises[0]?.reps || 10} Reps</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-on-surface-variant italic">No workout plan generated yet. Visit Exercises to create one.</p>
                    )}
                  </div>
                )}

                {checkedSections.nutrition && (
                  <div>
                    <h4 className="text-body-lg font-bold text-on-surface border-l-4 border-secondary pl-3 mb-4 flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-secondary" />
                      Meal Plan & Macros
                    </h4>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-surface-container p-3 rounded-lg text-center border border-outline-variant/20">
                        <p className="text-xs text-on-surface-variant mb-1">Target Calories</p>
                        <p className="text-stat-value text-primary font-bold">{(calculations?.targetCalories || 0).toLocaleString()}</p>
                      </div>
                      <div className="bg-surface-container p-3 rounded-lg text-center border border-outline-variant/20">
                        <p className="text-xs text-on-surface-variant mb-1">Protein Goal</p>
                        <p className="text-stat-value text-secondary font-bold">{calculations?.protein || 0}g</p>
                      </div>
                      <div className="bg-surface-container p-3 rounded-lg text-center border border-outline-variant/20">
                        <p className="text-xs text-on-surface-variant mb-1">Hydration</p>
                        <p className="text-stat-value text-tertiary font-bold">{calculations?.hydration || 3}L</p>
                      </div>
                    </div>

                    {includeMacros && (
                      <div className="flex gap-4 items-center mb-6">
                        <div className="w-16 h-16 rounded-full border-4 border-primary border-r-secondary border-b-tertiary flex items-center justify-center transform -rotate-45">
                          <span className="transform rotate-45 text-xs font-bold text-on-surface-variant">Macros</span>
                        </div>
                        <div className="flex-grow space-y-2 text-sm text-on-surface-variant">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <span>40% Carbs ({calculations?.carbs || 0}g)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-secondary" />
                            <span>30% Protein ({calculations?.protein || 0}g)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-tertiary" />
                            <span>30% Fats ({calculations?.fat || 0}g)</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-8">
                      <h4 className="text-body-lg font-bold text-on-surface border-l-4 border-tertiary pl-3 mb-4">
                        Weekly Nutrition Overview
                      </h4>
                      <div className="grid grid-cols-7 gap-2 overflow-hidden mb-4">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                          <div key={day} className="flex flex-col gap-2">
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase text-center">{day}</p>
                            <div className="bg-surface-container-low p-2 rounded border border-outline-variant/20 space-y-1">
                              <div className="h-1 w-full bg-primary/30 rounded-full" />
                              <div className="h-1 w-2/3 bg-secondary/30 rounded-full" />
                              <div className="h-1 w-1/2 bg-tertiary/30 rounded-full" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between text-[11px] border-b border-outline-variant/10 pb-1">
                          <span className="font-bold text-on-surface">Breakfast</span>
                          <span className="text-on-surface-variant">Oatmeal with Berries & Whey</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] border-b border-outline-variant/10 pb-1">
                          <span className="font-bold text-on-surface">Lunch</span>
                          <span className="text-on-surface-variant">Grilled Chicken & Quinoa Salad</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] border-b border-outline-variant/10 pb-1">
                          <span className="font-bold text-on-surface">Dinner</span>
                          <span className="text-on-surface-variant">Baked Salmon with Asparagus</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-on-surface">Snacks</span>
                          <span className="text-on-surface-variant">Greek Yogurt, Almonds</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-auto border-t border-outline-variant/20 pt-4 flex justify-between items-center text-xs text-on-surface-variant">
                  <p>Generated by Gym at Home Analytics Engine</p>
                  <p>Page 1 of 1</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 xl:col-span-3 order-1 lg:order-2">
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 sticky top-24 shadow-sm">
              <h3 className="text-headline-md font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">Export Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-label-md text-on-surface-variant block mb-3">Format</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFormat('pdf')}
                      className={`border-2 rounded-lg py-3 px-4 flex flex-col items-center justify-center gap-1 transition-colors ${
                        format === 'pdf'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-outline-variant/50 text-on-surface-variant hover:border-secondary hover:text-secondary'
                      }`}
                    >
                      <span className="text-label-md font-bold">PDF</span>
                    </button>
                    <button
                      onClick={() => setFormat('csv')}
                      className={`border-2 rounded-lg py-3 px-4 flex flex-col items-center justify-center gap-1 transition-colors ${
                        format === 'csv'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-outline-variant/50 text-on-surface-variant hover:border-secondary hover:text-secondary'
                      }`}
                    >
                      <span className="text-label-md font-bold">CSV</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4 border-t border-outline-variant/20 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-label-md font-bold text-on-surface">Include Macros</p>
                      <p className="text-xs text-on-surface-variant">Detailed daily breakdown</p>
                    </div>
                    <button
                      onClick={() => setIncludeMacros(!includeMacros)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${includeMacros ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${includeMacros ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-label-md font-bold text-on-surface">Workout Notes</p>
                      <p className="text-xs text-on-surface-variant">Trainer cues & warmups</p>
                    </div>
                    <button
                      onClick={() => setIncludeNotes(!includeNotes)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${includeNotes ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${includeNotes ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

                <div className="border-t border-outline-variant/20 pt-6">
                  <label className="text-label-md text-on-surface-variant block mb-3">Sections</label>
                  <div className="space-y-2">
                    {sections.map((s) => (
                      <label key={s.id} className="flex items-center justify-between p-2 hover:bg-surface-container-low rounded-lg cursor-pointer">
                        <div className="flex items-center gap-2">
                          <s.icon className="w-4 h-4 text-outline-variant" />
                          <span className="text-body-md text-on-surface">{s.label}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={checkedSections[s.id]}
                          onChange={() => toggleSection(s.id)}
                          className="w-4 h-4 rounded text-primary focus:ring-primary"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-2 border-t border-outline-variant/20">
                  <button
                    onClick={handleExport}
                    disabled={generating}
                    className="w-full bg-primary hover:bg-primary/90 text-on-primary text-label-md font-bold py-4 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    {generating ? 'Generating...' : 'Download Now'}
                  </button>
                  <p className="text-center text-xs text-on-surface-variant mt-3">
                    {format === 'pdf' ? 'PDF document' : 'CSV spreadsheet'}
                  </p>
                </div>

                <button className="w-full border border-outline text-on-surface hover:bg-surface-container text-label-md py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95">
                  <Mail className="w-5 h-5" />
                  Email to Clinician
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
