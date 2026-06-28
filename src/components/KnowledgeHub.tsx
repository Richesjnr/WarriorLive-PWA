/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Calendar, Award, CheckCircle2, FlaskConical, ShieldAlert, Zap } from 'lucide-react';

interface Milestone {
  year: string;
  title: string;
  description: string;
  type: 'discovery' | 'clinical' | 'policy' | 'therapy';
  quote?: string;
  source?: string;
}

const milestones: Milestone[] = [
  {
    year: '1910',
    title: 'First Western Medical Description',
    description: 'Chicago physician James B. Herrick publishes the first description of sickled cells, discovered in a blood sample of a 20-year-old dental student from Grenada, Walter Clement Noel. The term "sickle cell anemia" is coined.',
    type: 'discovery',
    quote: '“The shape of the reds was very irregular, but what especially attracted attention was the large number of thin, elongated, sickle-shaped, and crescent-shaped forms.”',
    source: 'Dr. James B. Herrick'
  },
  {
    year: '1933',
    title: 'Distinction of Trait vs. Disease',
    description: 'Scientists conduct a landmark study including 2,500 African Americans, establishing that sickle cell trait (carrier state) and homozygous sickle cell disease are separate and distinct clinical conditions.',
    type: 'discovery'
  },
  {
    year: '1934',
    title: 'Vessel Blockage Discovery',
    description: 'Research suggests that painful sickle cell "crises" result directly from the blockages of small blood vessels by rigid sickle-shaped red cells, preventing microvascular perfusion.',
    type: 'discovery'
  },
  {
    year: '1940',
    title: 'Oxygen Exchange Mechanism',
    description: 'Physiologists discover that the exchange of oxygen for carbon dioxide in small vessels triggers red blood cells to sickle and obstruct local blood flow.',
    type: 'discovery'
  },
  {
    year: '1948',
    title: 'Inheritance & Fetal Hemoglobin Roles',
    description: 'Dr. James Neel is funded by the newly established National Heart Institute to study how SCD is passed from parents to children. Research reveals that newborns are protected from sickling due to high levels of fetal hemoglobin (HbF) in their blood.',
    type: 'discovery',
    quote: '“There are many things yet to be learned about sickle cell anemia.”',
    source: 'Editorial, Journal of the National Medical Association'
  },
  {
    year: '1949',
    title: 'The First "Molecular Disease"',
    description: 'Dr. Linus Pauling and colleagues discover that sickle cell disease is caused by an abnormal hemoglobin protein molecule. This marks the historic coining of the term "molecular disease" in medicine. Additionally, inheritance patterns are verified: two genes are required for the disease, while one gene produces the asymptomatic trait.',
    type: 'discovery'
  },
  {
    year: '1953',
    title: 'Hemoglobin Electrophoresis Developed',
    description: 'A revolutionary diagnostic blood test, hemoglobin electrophoresis, is developed to definitively identify and distinguish sickle cell disease, trait, and other abnormal hemoglobin variants.',
    type: 'discovery'
  },
  {
    year: '1954',
    title: 'Malaria Protection Link',
    description: 'Researchers find that having the sickle cell trait provides strong evolutionary protection against severe malaria. This explains why the sickle gene is highly prevalent in geographic regions historically plagued by malaria.',
    type: 'discovery'
  },
  {
    year: '1957',
    title: 'Amino Acid Substitution Unveiled',
    description: 'SCD is proven to be the first genetic disorder with a known molecular basis, demonstrated when scientists trace the defect to a single amino acid substitution (glutamic acid replaced by valine) in the beta-globin chain.',
    type: 'discovery'
  },
  {
    year: '1963',
    title: 'Hemoglobin 3D Structure Resolved',
    description: 'Dr. Max Perutz deciphers the full three-dimensional structure of the hemoglobin protein using X-ray crystallography, a monumental 20-year effort that earned him the Nobel Prize in 1967.',
    type: 'discovery'
  },
  {
    year: '1972',
    title: 'National Sickle Cell Anemia Control Act',
    description: 'Presidential signing establishes voluntary screening, clinical education, genetic counseling, and intensive research. Dr. Roland Scott plays a leading advocacy role.',
    type: 'policy'
  },
  {
    year: '1973',
    title: 'Neonatal Filter Paper Screening',
    description: 'Scientists develop neonatal screening methods using dried blood spots on filter paper, paving the way for universal infant testing.',
    type: 'clinical'
  },
  {
    year: '1978',
    title: 'Cooperative Study of SCD (CSSCD)',
    description: 'The NHLBI launches a massive multicenter study tracking over 4,000 patients from infancy to adulthood, establishing the definitive natural history and clinical course of SCD.',
    type: 'clinical'
  },
  {
    year: '1984',
    title: 'Hydroxyurea and First Transplant Cure',
    description: 'Clinical researchers show that Hydroxyurea increases fetal hemoglobin (HbF) levels, offering a potential chemical therapy. Concurrently, the first successful bone marrow transplant is performed, curing a young child with leukemia and underlying sickle cell disease.',
    type: 'therapy'
  },
  {
    year: '1986',
    title: 'Prophylactic Penicillin Breakthrough',
    description: 'The landmark Prophylaxis with Oral Penicillin in Children with Sickle Cell (PROPS) study proves that early oral penicillin reduces fatal Streptococcus pneumoniae infections by 84% in infants.',
    type: 'clinical'
  },
  {
    year: '1995',
    title: 'Hydroxyurea Efficacy Confirmed',
    description: 'The Multicenter Study of Hydroxyurea (MSH) shows a dramatic 50% reduction in painful vaso-occlusive crises, acute chest syndrome episodes, and hospitalizations, establishing it as the first frontline therapy for adults.',
    type: 'therapy',
    quote: '“The compelling benefits of hydroxyurea warrant increased adoption of this drug as a frontline therapy in adults with sickle cell disease.”',
    source: 'Dr. Otis Brawley, NIH Panel Chair'
  },
  {
    year: '1997',
    title: 'Stroke Prevention Trial (STOP)',
    description: 'The landmark STOP trial proves that chronic blood transfusions in children identified at high risk for stroke via transcranial Doppler (TCD) ultrasound reduces the risk of initial stroke by 90%.',
    type: 'clinical'
  },
  {
    year: '2003',
    title: 'Survival Benefits Documented',
    description: 'Long-term follow-up studies confirm that hydroxyurea therapy significantly improves overall survival rates in adult sickle cell patients.',
    type: 'therapy'
  },
  {
    year: '2017',
    title: 'FDA Approves L-Glutamine',
    description: 'The FDA approves L-glutamine (Endari) for patients aged 5 and older to reduce oxidative stress and decrease the frequency of painful crises, the first new SCD drug approved in nearly 20 years.',
    type: 'therapy'
  },
  {
    year: '2019',
    title: 'Oxbryta and Adakveo Approvals',
    description: 'The FDA approves Voxelotor (Oxbryta), which binds to hemoglobin to prevent sickling directly, and Crizanlizumab (Adakveo), a monoclonal antibody that targets P-selectin to prevent red cells from sticking to blood vessels.',
    type: 'therapy'
  },
  {
    year: '2023',
    title: 'The Era of CRISPR Gene Therapy',
    description: 'In a historic milestone, the FDA approves the first cell-based gene therapies—Casgevy (using CRISPR/Cas9 gene editing) and Lyfgenia (using a lentiviral vector)—to cure sickle cell disease in patients aged 12 and older by modifying their autologous stem cells to produce fetal hemoglobin.',
    type: 'therapy'
  }
];

export default function KnowledgeHub() {
  const [filter, setFilter] = useState<string>('all');

  const filteredMilestones = milestones.filter(m => filter === 'all' || m.type === filter);

  return (
    <div className="space-y-6" id="knowledge_hub_section">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h2 className="font-sans font-bold text-2xl text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Clinical & Research Milestones
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          A scientific timeline detailing the evolution of sickle cell disease care, from Walter Noel’s description in 1910 to modern gene-editing breakthroughs.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'discovery', 'clinical', 'therapy', 'policy'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer capitalize ${
              filter === t
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm shadow-indigo-100 dark:shadow-none'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
            }`}
          >
            {t === 'all' ? 'Show All' : t}
          </button>
        ))}
      </div>

      {/* Timeline Wrapper */}
      <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 md:ml-6 pl-6 md:pl-8 py-2 space-y-8">
        {filteredMilestones.map((m, idx) => {
          let badgeColor = 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/50';
          let TypeIcon = FlaskConical;

          if (m.type === 'clinical') {
            badgeColor = 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/50';
            TypeIcon = CheckCircle2;
          } else if (m.type === 'therapy') {
            badgeColor = 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200/60 dark:border-purple-800/50';
            TypeIcon = Zap;
          } else if (m.type === 'policy') {
            badgeColor = 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/50';
            TypeIcon = Award;
          }

          return (
            <motion.div
              key={m.year + '-' + idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="relative group"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[43px] md:-left-[51px] top-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-full h-8 w-8 flex items-center justify-center shadow-xs transition-colors group-hover:border-indigo-500">
                <span className="font-mono text-[10px] font-bold text-slate-800 dark:text-slate-300">{m.year}</span>
              </div>

              {/* Milestone Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-indigo-100 dark:hover:border-indigo-500 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-0.5 rounded">
                    {m.year}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1 ${badgeColor}`}>
                    <TypeIcon className="h-3 w-3" />
                    {m.type}
                  </span>
                </div>

                <h3 className="font-sans font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight leading-snug">
                  {m.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                  {m.description}
                </p>

                {m.quote && (
                  <div className="mt-4 pl-3 border-l-2 border-indigo-500/30 dark:border-indigo-500/50 italic text-slate-600 dark:text-slate-300 text-xs py-1">
                    <p className="font-serif leading-relaxed">{m.quote}</p>
                    {m.source && <p className="font-sans text-[10px] text-slate-400 dark:text-slate-500 mt-1 not-italic">— {m.source}</p>}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
