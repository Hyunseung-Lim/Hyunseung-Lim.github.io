import React, { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import { BibtexCard } from '../../../Components/BibtexCard/BibtexCard';
import { useTheme } from '../../../contexts/ThemeContext';
import { PanoramaDiagram, PANORAMA_DIAGRAM_ASSETS } from './diagram';
import { ProjectLinks } from '../../../Components/ProjectLinks/ProjectLinks';
import { SegmentedControl } from '../../../Components/SegmentedButton/segmentedbutton';
import { PageLoadGuard } from '../../../Components/PageLoader/PageLoadGuard';
import './Panorama.css';

const parseNumericValue = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return NaN;
  const cleaned = value.replace(/[^\d.-]/g, '');
  return cleaned ? Number.parseFloat(cleaned) : NaN;
};

const normalizeModeKey = (mode) => {
  if (typeof mode !== 'string') return 'default';
  return mode.trim().toLowerCase();
};

const isBaselineLabel = (label) => {
  if (typeof label !== 'string') return false;
  return label.toLowerCase().includes('baseline');
};

const getTotalBenchmarkColumnLeaders = (results) => {
  const leaders = {};
  const metrics = ['par4pc', 'pi4pc', 'noc4pc'];
  const modes = ['zeroShot', 'cot'];

  metrics.forEach((metric) => {
    modes.forEach((mode) => {
      let bestValue = Number.NEGATIVE_INFINITY;
      let bestIndex = -1;

      results.forEach((row, rowIndex) => {
        if (isBaselineLabel(row.name)) {
          return;
        }
        const numericValue = parseNumericValue(row[metric][mode]);
        if (Number.isNaN(numericValue)) return;
        if (numericValue > bestValue) {
          bestValue = numericValue;
          bestIndex = rowIndex;
        }
      });

      if (bestIndex !== -1) {
        leaders[`${metric}-${mode}`] = bestIndex;
      }
    });
  });

  return leaders;
};

const getDetailedBenchmarkColumnLeaders = (entries, customColumnCount = 3, accuracyColumnCount = 3) => {
  const createLeaderBuckets = (count) => Array.from({ length: count }, () => ({}));
  const leaders = {
    custom: createLeaderBuckets(customColumnCount),
    accuracy: createLeaderBuckets(accuracyColumnCount)
  };

  entries.forEach((entry, entryIndex) => {
    if (isBaselineLabel(entry.model)) {
      return;
    }
    entry.rows.forEach((row, rowIndex) => {
      const modeKey = normalizeModeKey(row.mode);
      row.custom.forEach((value, columnIndex) => {
        if (columnIndex >= leaders.custom.length) return;
        const numericValue = parseNumericValue(value);
        if (Number.isNaN(numericValue)) return;
        const currentLeader = leaders.custom[columnIndex][modeKey];
        if (!currentLeader || numericValue > currentLeader.value) {
          leaders.custom[columnIndex][modeKey] = { entryIndex, rowIndex, value: numericValue };
        }
      });

      row.accuracy.forEach((value, columnIndex) => {
        if (columnIndex >= leaders.accuracy.length) return;
        const numericValue = parseNumericValue(value);
        if (Number.isNaN(numericValue)) return;
        const currentLeader = leaders.accuracy[columnIndex][modeKey];
        if (!currentLeader || numericValue > currentLeader.value) {
          leaders.accuracy[columnIndex][modeKey] = { entryIndex, rowIndex, value: numericValue };
        }
      });
    });
  });

  return leaders;
};

const isDetailedColumnLeader = (leaders, section, columnIndex, modeKey, entryIndex, rowIndex) => {
  const columnLeaders = leaders[section][columnIndex];
  if (!columnLeaders) return false;
  const leader = columnLeaders[modeKey];
  return Boolean(leader && leader.entryIndex === entryIndex && leader.rowIndex === rowIndex);
};

export const PanoramaProject = () => {
  const projectData = PROJECTS.panorama;
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(null, themeMode);
  const { isDark } = useTheme();
  const [isExampleOpen, setIsExampleOpen] = useState(false);
  const [benchmarkFilter, setBenchmarkFilter] = useState('total');
  const benchmarkTasks = [
    {
      key: 'par4pc',
      title: 'Prior Art Retrieval for Patent Claims (PAR4PC)',
      description:
        'Select the document(s) from a pool of candidate prior-art documents that must be consulted to determine whether the target claim should be rejected.'
    },
    {
      key: 'pi4pc',
      title: 'Paragraph Identification for Patent Claims (PI4PC)',
      description:
        'Given a claim and a prior-art document, identify the paragraph number within the document that should be compared with the claim when assessing patentability.'
    },
    {
      key: 'noc4pc',
      title: 'Novelty and Non-Obviousness Classification for Patent Claims (NOC4PC)',
      description:
        'Given a claim and the cited prior-art documents with the relevant paragraphs, determine whether the claim is novel and non-obvious in relation to that prior art.'
    }
  ];
  const benchmarkSegments = [
    { label: 'Total', value: 'total' },
    { label: 'PAR4PC', value: 'par4pc' },
    { label: 'PI4PC', value: 'pi4pc' },
    { label: 'NOC4PC', value: 'noc4pc' }
  ];
  const benchmarkResults = [
    {
      name: 'Baseline (random)',
      par4pc: { zeroShot: '5.63', cot: '—' },
      pi4pc: { zeroShot: '27.10', cot: '—' },
      noc4pc: { zeroShot: '32.33', cot: '—' }
    },
    {
      name: 'GPT-4o',
      par4pc: { zeroShot: '47.34', cot: '56.95' },
      pi4pc: { zeroShot: '63.33', cot: '62.62' },
      noc4pc: { zeroShot: '34.69', cot: '32.19' }
    },
    {
      name: 'Claude 3.7 Sonnet',
      par4pc: { zeroShot: '40.12', cot: '40.29' },
      pi4pc: { zeroShot: '57.33', cot: '60.55' },
      noc4pc: { zeroShot: '35.84', cot: '45.40' }
    },
    {
      name: 'Gemini 2.0 flash',
      par4pc: { zeroShot: '37.56', cot: '43.61' },
      pi4pc: { zeroShot: '61.96', cot: '61.72' },
      noc4pc: { zeroShot: '21.06', cot: '31.79' },
      groupBreakAfter: true
    },
    {
      name: 'Llama-3.1-8B-Instruct',
      par4pc: { zeroShot: '13.45', cot: '37.99' },
      pi4pc: { zeroShot: '9.61', cot: '0.00' },
      noc4pc: { zeroShot: '15.71', cot: '19.56' }
    },
    {
      name: 'Qwen2.5-7B-Instruct',
      par4pc: { zeroShot: '66.11', cot: '67.42' },
      pi4pc: { zeroShot: '29.25', cot: '48.41' },
      noc4pc: { zeroShot: '28.92', cot: '20.31' }
    },
    {
      name: 'EXAONE-3.5-7.8B-Instruct',
      par4pc: { zeroShot: '0.00', cot: '22.52' },
      pi4pc: { zeroShot: '44.55', cot: '41.34' },
      noc4pc: { zeroShot: '15.00', cot: '24.99' }
    },
    {
      name: 'Gemma-3-12B-Instruct',
      par4pc: { zeroShot: '56.47', cot: '77.30' },
      pi4pc: { zeroShot: '44.34', cot: '31.11' },
      noc4pc: { zeroShot: '32.54', cot: '17.67' }
    },
    {
      name: 'Qwen2.5-32B-Instruct',
      par4pc: { zeroShot: '68.94', cot: '55.05' },
      pi4pc: { zeroShot: '60.55', cot: '59.94' },
      noc4pc: { zeroShot: '26.88', cot: '33.85' }
    },
    {
      name: 'EXAONE-3.5-32B-Instruct',
      par4pc: { zeroShot: '51.46', cot: '44.93' },
      pi4pc: { zeroShot: '49.40', cot: '51.06' },
      noc4pc: { zeroShot: '23.05', cot: '28.47' }
    },
    {
      name: 'Gemma-3-27B-Instruct',
      par4pc: { zeroShot: '50.19', cot: '55.36' },
      pi4pc: { zeroShot: '54.66', cot: '56.22' },
      noc4pc: { zeroShot: '24.00', cot: '22.45' },
      groupBreakAfter: true
    },
    {
      name: 'QWQ-32B',
      par4pc: { zeroShot: '—', cot: '59.03' },
      pi4pc: { zeroShot: '—', cot: '58.98' },
      noc4pc: { zeroShot: '—', cot: '34.73' }
    },
    {
      name: 'EXAONE-Deep-32B',
      par4pc: { zeroShot: '—', cot: '42.59' },
      pi4pc: { zeroShot: '—', cot: '35.80' },
      noc4pc: { zeroShot: '—', cot: '21.23' }
    }
  ];
  const visibleBenchmarks =
    benchmarkFilter === 'total'
      ? []
      : benchmarkTasks.filter((task) => task.key === benchmarkFilter);
  const par4pcDetailedResults = [
    {
      model: 'baseline',
      rows: [{ mode: '—', custom: ['5.63', '3.76', '6.94'], accuracy: ['0.54', '1.45', '0.74'] }]
    },
    {
      model: 'GPT-4o',
      rows: [
        { mode: 'ZS', custom: ['47.34', '82.41', '33.52'], accuracy: ['48.69', '79.8', '26.63'] },
        { mode: 'CoT', custom: ['56.95', '86.37', '45.11'], accuracy: ['51.04', '73.6', '34.81'] }
      ]
    },
    {
      model: 'Claude-3.7-Sonnet',
      rows: [
        { mode: 'ZS', custom: ['40.12', '75.33', '26.46'], accuracy: ['45.48', '75.94', '23.94'] },
        { mode: 'CoT', custom: ['40.29', '75.21', '26.75'], accuracy: ['46.31', '75.86', '25.43'] }
      ]
    },
    {
      model: 'Gemini-2.0-Flash',
      rows: [
        { mode: 'ZS', custom: ['37.56', '65.61', '26.51'], accuracy: ['38.88', '62.28', '22.21'] },
        { mode: 'CoT', custom: ['43.61', '58.11', '33.14'], accuracy: ['34.50', '51.89', '21.96'] }
      ]
    },
    {
      model: 'Llama-3.1-8B-Instruct',
      rows: [
        { mode: 'ZS', custom: ['13.45', '16.09', '11.38'], accuracy: ['0.00', '0.00', '0.00'] },
        { mode: 'CoT', custom: ['37.99', '47.15', '31.37'], accuracy: ['0.00', '0.00', '0.00'] }
      ]
    },
    {
      model: 'Qwen2.5-7B-Instruct',
      rows: [
        { mode: 'ZS', custom: ['66.11', '64.25', '66.93'], accuracy: ['33.05', '56.83', '16.06'] },
        { mode: 'CoT', custom: ['67.42', '66.14', '67.97'], accuracy: ['34.43', '58.34', '17.37'] }
      ]
    },
    {
      model: 'EXAONE-3.5-7.8B-Instruct',
      rows: [
        { mode: 'ZS', custom: ['0.00', '0.00', '0.00'], accuracy: ['5.42', '7.63', '3.70'] },
        { mode: 'CoT', custom: ['22.52', '29.46', '17.50'], accuracy: ['0.00', '0.00', '0.00'] }
      ]
    },
    {
      model: 'Gemma-3-12B-Instruct',
      rows: [
        { mode: 'ZS', custom: ['56.47', '54.61', '57.37'], accuracy: ['29.49', '48.62', '15.76'] },
        { mode: 'CoT', custom: ['77.30', '75.27', '78.42'], accuracy: ['30.73', '44.43', '20.54'] }
      ]
    },
    {
      model: 'Qwen2.5-32B-Instruct',
      rows: [
        {
          mode: 'ZS',
          custom: ['68.94', '85.08', '57.48'],
          accuracy: ['47.2', '58.93', '38.75']
        },
        { mode: 'CoT', custom: ['55.05', '78.44', '38.54'], accuracy: ['46.41', '75.94', '25.49'] }
      ]
    },
    {
      model: 'EXAONE-3.5-32B-Instruct',
      rows: [
        { mode: 'ZS', custom: ['51.46', '61.3', '44.26'], accuracy: ['31.66', '39.56', '26.09'] },
        { mode: 'CoT', custom: ['44.93', '66.47', '29.61'], accuracy: ['36.74', '62.20', '18.57'] }
      ]
    },
    {
      model: 'Gemma-3-27B-Instruct',
      rows: [
        { mode: 'ZS', custom: ['50.19', '71.02', '35.48'], accuracy: ['42.30', '70.33', '22.45'] },
        { mode: 'CoT', custom: ['55.36', '75.44', '41.21'], accuracy: ['44.85', '70.49', '26.69'] }
      ],
      groupBreakAfter: true
    },
    {
      model: 'QWQ-32B',
      rows: [{ mode: 'CoT', custom: ['59.03', '81.80', '42.93'], accuracy: ['48.33', '75.10', '29.36'] }]
    },
    {
      model: 'EXAONE-Deep-32B',
      rows: [{ mode: 'CoT', custom: ['42.59', '62.35', '28.52'], accuracy: ['36.86', '61.15', '19.58'] }]
    }
  ];
  const pi4pcDetailedResults = [
    {
      model: 'baseline',
      rows: [{ mode: '—', custom: ['27.10', '28.46', '26.49'], accuracy: ['19.83', '19.84', '19.82'] }]
    },
    {
      model: 'GPT-4o',
      rows: [
        { mode: 'ZS', custom: ['63.33', '64.93', '62.83'], accuracy: ['56.06', '56.68', '55.96'] },
        { mode: 'CoT', custom: ['62.62', '63.41', '62.47'], accuracy: ['55.73', '55.61', '55.96'] }
      ]
    },
    {
      model: 'Claude-3.7-Sonnet',
      rows: [
        { mode: 'ZS', custom: ['57.33', '60.00', '56.20'], accuracy: ['51.59', '53.72', '50.69'] },
        { mode: 'CoT', custom: ['60.55', '62.78', '59.59'], accuracy: ['54.09', '55.70', '53.39'] }
      ]
    },
    {
      model: 'Gemini-2.0-Flash',
      rows: [
        { mode: 'ZS', custom: ['61.96', '63.86', '61.19'], accuracy: ['55.61', '57.31', '54.90'] },
        { mode: 'CoT', custom: ['61.72', '62.83', '61.30'], accuracy: ['54.67', '55.52', '54.32'] }
      ]
    },
    {
      model: 'Llama-3.1-8B-Instruct',
      rows: [
        { mode: 'ZS', custom: ['9.61', '10.13', '9.48'], accuracy: ['7.88', '8.61', '7.62'] },
        { mode: 'CoT', custom: ['0.00', '0.00', '0.00'], accuracy: ['0.00', '0.00', '0.00'] }
      ]
    },
    {
      model: 'Qwen2.5-7B-Instruct',
      rows: [
        { mode: 'ZS', custom: ['29.25', '32.51', '27.76'], accuracy: ['23.96', '26.37', '22.86'] },
        { mode: 'CoT', custom: ['48.41', '50.72', '47.30'], accuracy: ['39.71', '40.00', '39.52'] }
      ]
    },
    {
      model: 'EXAONE-3.5-7.8B-Instruct',
      rows: [
        { mode: 'ZS', custom: ['44.55', '46.73', '43.64'], accuracy: ['35.98', '36.05', '36.02'] },
        { mode: 'CoT', custom: ['41.34', '44.71', '39.85'], accuracy: ['34.16', '35.78', '33.45'] }
      ]
    },
    {
      model: 'Gemma-3-12B-Instruct',
      rows: [
        { mode: 'ZS', custom: ['44.34', '45.34', '44.09'], accuracy: ['36.74', '36.59', '37.00'] },
        { mode: 'CoT', custom: ['31.11', '31.75', '31.08'], accuracy: ['26.16', '26.55', '26.33'] }
      ]
    },
    {
      model: 'Qwen2.5-32B-Instruct',
      rows: [
        { mode: 'ZS', custom: ['60.55', '61.79', '60.06'], accuracy: ['53.29', '53.81', '53.08'] },
        { mode: 'CoT', custom: ['59.94', '61.97', '59.13'], accuracy: ['52.44', '53.90', '51.84'] }
      ]
    },
    {
      model: 'EXAONE-3.5-32B-Instruct',
      rows: [
        { mode: 'ZS', custom: ['49.40', '50.99', '48.74'], accuracy: ['41.21', '41.17', '41.29'] },
        { mode: 'CoT', custom: ['51.06', '53.36', '50.09'], accuracy: ['43.09', '43.77', '42.84'] }
      ]
    },
    {
      model: 'Gemma-3-27B-Instruct',
      rows: [
        { mode: 'ZS', custom: ['54.66', '56.82', '53.79'], accuracy: ['46.53', '47.35', '46.26'] },
        { mode: 'CoT', custom: ['56.22', '58.43', '55.29'], accuracy: ['48.94', '50.85', '48.12'] }
      ]
    },
    {
      model: 'QWQ-32B',
      rows: [{ mode: 'CoT', custom: ['58.98', '60.11', '58.71'], accuracy: ['52.66', '53.26', '52.61'] }]
    },
    {
      model: 'EXAONE-Deep-32B',
      rows: [{ mode: 'CoT', custom: ['35.80', '36.17', '35.74'], accuracy: ['30.99', '30.48', '31.33'] }]
    }
  ];
  const noc4pcDetailedResults = [
    {
      model: 'Baseline (random)',
      rows: [
        {
          mode: '—',
          custom: ['32.33', '16.80', '16.68', '16.65'],
          accuracy: ['33.46', '33.71', '33.39', '33.30']
        }
      ]
    },
    {
      model: 'GPT-4o',
      rows: [
        {
          mode: 'ZS',
          custom: ['34.69', '13.21', '28.45', '5.72'],
          accuracy: ['46.60', '24.70', '74.47', '9.38']
        },
        {
          mode: 'CoT',
          custom: ['32.19', '11.67', '12.88', '27.99'],
          accuracy: ['33.18', '21.22', '23.95', '72.36']
        }
      ]
    },
    {
      model: 'Claude-3.7-Sonnet',
      rows: [
        {
          mode: 'ZS',
          custom: ['35.84', '27.01', '16.84', '8.90'],
          accuracy: ['39.91', '68.11', '33.79', '15.41']
        },
        {
          mode: 'CoT',
          custom: ['45.40', '21.83', '23.25', '17.23'],
          accuracy: ['48.27', '48.68', '53.54', '34.84']
        }
      ]
    },
    {
      model: 'Gemini-2.0-Flash',
      rows: [
        {
          mode: 'ZS',
          custom: ['21.06', '31.96', '4.89', '1.63'],
          accuracy: ['31.14', '92.09', '7.91', '2.51']
        },
        {
          mode: 'CoT',
          custom: ['31.79', '22.67', '16.59', '8.83'],
          accuracy: ['34.80', '51.52', '33.12', '15.27']
        }
      ]
    },
    {
      model: 'Llama-3.1-8B-Instruct',
      rows: [
        {
          mode: 'ZS',
          custom: ['15.71', '49.79', '1.16', '0.00'],
          accuracy: ['29.26', '99.16', '1.17', '0.00']
        },
        {
          mode: 'CoT',
          custom: ['19.56', '29.67', '19.81', '0.08'],
          accuracy: ['35.68', '80.22', '24.71', '0.17']
        }
      ]
    },
    {
      model: 'Qwen2.5-7B-Instruct',
      rows: [
        {
          mode: 'ZS',
          custom: ['28.92', '100.00', '0.00', '0.00'],
          accuracy: ['14.95', '100.00', '0.00', '0.00']
        },
        {
          mode: 'CoT',
          custom: ['20.31', '10.92', '2.89', '22.69'],
          accuracy: ['28.36', '27.94', '6.13', '83.08']
        }
      ]
    },
    {
      model: 'EXAONE-3.5-7.8B-Instruct',
      rows: [
        {
          mode: 'ZS',
          custom: ['15.00', '100.00', '0.70', '0.00'],
          accuracy: ['28.95', '100.00', '0.70', '0.00']
        },
        {
          mode: 'CoT',
          custom: ['24.99', '12.87', '14.11', '10.04'],
          accuracy: ['35.02', '34.65', '39.30', '25.13']
        }
      ]
    },
    {
      model: 'Gemma-3-12B-Instruct',
      rows: [
        {
          mode: 'ZS',
          custom: ['32.54', '23.63', '22.66', '1.63'],
          accuracy: ['42.34', '54.92', '51.48', '2.51']
        },
        {
          mode: 'CoT',
          custom: ['17.67', '22.89', '6.50', '1.42'],
          accuracy: ['32.39', '84.41', '14.93', '2.18']
        }
      ]
    },
    {
      model: 'Qwen2.5-32B-Instruct',
      rows: [
        {
          mode: 'ZS',
          custom: ['26.88', '3.34', '30.86', '3.69'],
          accuracy: ['46.15', '5.28', '86.27', '5.86']
        },
        {
          mode: 'CoT',
          custom: ['33.85', '20.29', '10.48', '23.78'],
          accuracy: ['33.53', '43.76', '18.65', '55.44']
        }
      ]
    },
    {
      model: 'EXAONE-3.5-32B-Instruct',
      rows: [
        {
          mode: 'ZS',
          custom: ['23.05', '15.47', '21.59', '0.00'],
          accuracy: ['32.87', '30.22', '47.90', '0.00']
        },
        {
          mode: 'CoT',
          custom: ['28.47', '25.42', '18.15', '1.00'],
          accuracy: ['37.03', '61.64', '37.41', '1.53']
        }
      ]
    },
    {
      model: 'Gemma-3-27B-Instruct',
      rows: [
        {
          mode: 'ZS',
          custom: ['24.00', '24.61', '14.53', '0.88'],
          accuracy: ['31.24', '58.51', '27.87', '1.34']
        },
        {
          mode: 'CoT',
          custom: ['22.45', '32.05', '6.20', '1.63'],
          accuracy: ['32.45', '92.57', '10.25', '2.51']
        }
      ]
    },
    {
      model: 'QWQ-32B',
      rows: [
        {
          mode: 'CoT',
          custom: ['34.73', '24.06', '9.14', '22.52'],
          accuracy: ['34.90', '56.47', '15.90', '51.01']
        }
      ]
    },
    {
      model: 'EXAONE-Deep-32B',
      rows: [
        {
          mode: 'CoT',
          custom: ['21.23', '22.47', '8.03', '3.03'],
          accuracy: ['35.89', '82.02', '19.59', '6.49']
        }
      ]
    }
  ];
  const resourceLinks = [
    { type: 'paper', href: 'https://proceedings.neurips.cc/paper_files/paper/2025/hash/4aab82c8d6b77c0b6b010145c1bfcdd3-Abstract-Datasets_and_Benchmarks_Track.html' },
    { type: 'github', href: 'https://github.com/LGAI-Research/PANORAMA' },
    { type: 'dataset', href: 'https://huggingface.co/datasets/LG-AI-Research/PANORAMA' }
  ];
  const pageAssets = Array.from(
    new Set(
      [
        `${process.env.PUBLIC_URL}/projects/panorama/neurips.png`,
        `${process.env.PUBLIC_URL}/projects/panorama/neurips_dark.png`,
        `${process.env.PUBLIC_URL}/projects/panorama/curation.png`,
        `${process.env.PUBLIC_URL}/icons/github.svg`,
        `${process.env.PUBLIC_URL}/icons/github_dark.svg`,
        `${process.env.PUBLIC_URL}/icons/huggingface-color.svg`,
        ...PANORAMA_DIAGRAM_ASSETS
      ].filter(Boolean)
    )
  );

  const totalBenchmarkLeaders = getTotalBenchmarkColumnLeaders(benchmarkResults);
  const par4pcColumnLeaders = getDetailedBenchmarkColumnLeaders(par4pcDetailedResults);
  const pi4pcColumnLeaders = getDetailedBenchmarkColumnLeaders(pi4pcDetailedResults);
  const noc4pcColumnLeaders = getDetailedBenchmarkColumnLeaders(noc4pcDetailedResults, 4, 4);

  const loaderMessage = `Loading ${projectData.title}...`;

  return (
    <PageLoadGuard assets={pageAssets} message={loaderMessage}>
      <div className={`${pageClassName} project-page--panorama`}>
        <Topbar hideThemeToggle={shouldHideThemeToggle} />

        <div className="project-container" ref={setScrollRoot}>
        <header className="project-header">
          <div className="project-header__fade-block project-fade-block" ref={fadeInRef}>
            <h1 className="project-title">{projectData.title}</h1>
            {projectData.subtitle && <p className="project-subtitle">{projectData.subtitle}</p>}
          </div>
          <div className="project-meta-info">
            {projectData.period && (
              <div className="project-period-section project-fade-block" ref={fadeInRef}>
                <div className="meta-label">Period</div>
                <div className="meta-value">{projectData.period}</div>
              </div>
            )}
            {projectData.projectType && (
              <div className="project-type-section project-fade-block" ref={fadeInRef}>
                <div className="meta-label">Project Type</div>
                <div className="meta-value">{projectData.projectType}</div>
              </div>
            )}
            <div
              className="project-awards-section project-fade-block"
              aria-label="Conference badge"
              ref={fadeInRef}
            >
              <img
                src={
                  isDark
                    ? `${process.env.PUBLIC_URL}/projects/panorama/neurips_dark.png`
                    : `${process.env.PUBLIC_URL}/projects/panorama/neurips.png`
                }
                alt="NeurIPS 2025"
                className="project-award-badge"
                loading="lazy"
              />
            </div>
          </div>
          <ProjectLinks links={resourceLinks} className="project-fade-block" fadeRef={fadeInRef} />
        </header>

        <div
          className="project-divider project-divider--header project-fade-block"
          role="presentation"
          aria-hidden="true"
          ref={fadeInRef}
        />

        <main className="project-content">
          <section className="project-section project-section__fade" ref={fadeInRef}>
            <p className="section-text panorama-body project-fade-block" ref={fadeInRef}>
              We construct{' '}
              <strong>PANORAMA</strong>, a dataset of 8,143 U.S. patent examination records that preserves the full decision trails,
              including original applications, all cited references, Non-Final Rejections, and Notices of Allowance. Also,{' '}
              <strong>PANORAMA</strong> decomposes the trails into sequential benchmarks that emulate patent professionals' patent review
              processes and allow researchers to examine large language models' capabilities at each step of them.
            </p>
          </section>

          <section className="project-section project-section__fade panorama-diagram-section" ref={fadeInRef}>
            <PanoramaDiagram fadeRef={fadeInRef} isDark={isDark} />
            <p
              className="section-text section-text--small panorama-diagram-caption project-fade-block"
              ref={fadeInRef}
            >
              The overview of the PANORAMA dataset and benchmark construction. The PANORAMA dataset is constructed
              from documents appearing in patent examination. It comprises patent documents and office actions, such as
              non-final rejections. The benchmark tasks are designed to emulate the sequential nature of the patent
              examination process.
            </p>
          </section>

          <div
            className="project-divider project-fade-block"
            role="presentation"
            aria-hidden="true"
            ref={fadeInRef}
          />

          <h2 className="section-title project-fade-block" ref={fadeInRef}>
            PANORAMA Dataset
          </h2>
          <section className="project-section project-section__fade panorama-dataset-section" ref={fadeInRef}>
            <div className="panorama-table-wrapper project-fade-block" ref={fadeInRef}>
              <table className="panorama-table">
                <colgroup>
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Description</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Metadata</td>
                    <td>Metadata of patent application and office actions</td>
                    <td>JSON</td>
                  </tr>
                  <tr>
                    <td>Title</td>
                    <td>Title of the invention</td>
                    <td>STRING</td>
                  </tr>
                  <tr>
                    <td>Abstract</td>
                    <td>A brief summary of the invention and its purpose</td>
                    <td>STRING</td>
                  </tr>
                  <tr>
                    <td>Initial Claims</td>
                    <td>Initial claims in the patent application (claims prior to receiving a non-final rejection)</td>
                    <td>STRING[]</td>
                  </tr>
                  <tr>
                    <td>Final Claims</td>
                    <td>Final claims in the patent application (claims prior to receiving a Notice of Allowance)</td>
                    <td>STRING[]</td>
                  </tr>
                  <tr>
                    <td>Specification</td>
                    <td>Specification document of the invention, which includes background and detailed description</td>
                    <td>STRING</td>
                  </tr>
                  <tr>
                    <td>Drawing</td>
                    <td>Drawings of the invention</td>
                    <td>PDF</td>
                  </tr>
                  <tr>
                    <td>Non-Final Rejection</td>
                    <td>Non-final rejection document of the application</td>
                    <td>STRING</td>
                  </tr>
                  <tr>
                    <td>Notice of Allowance</td>
                    <td>Notice of allowance document of the application</td>
                    <td>STRING</td>
                  </tr>
                  <tr>
                    <td>Cited Patents</td>
                    <td>
                      Cited patents mentioned in non-final rejection documents (each cited patent JSON includes title,
                      abstract, claims, specification, and drawing)
                    </td>
                    <td>JSON</td>
                  </tr>
                  <tr className="panorama-table__interactive-row">
                    <td
                      className="panorama-table__interactive-cell panorama-table__interactive-cell--column"
                      onClick={() => setIsExampleOpen((prev) => !prev)}
                    >
                      Parsed Non-Final Rejection
                    </td>
                    <td className="panorama-table__interactive-cell" onClick={() => setIsExampleOpen((prev) => !prev)}>
                      Data parsed from the non-final rejection document into whether the claim was rejected
                      (<code>isRejected</code>), the legal basis code (<code>sectionCode</code>), cited prior arts
                      (<code>citedPatents</code>), and the rejection reasons (<code>reason</code>)
                    </td>
                    <td className="panorama-table__interactive-cell" onClick={() => setIsExampleOpen((prev) => !prev)}>
                      JSON
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                className={`panorama-table__example${isExampleOpen ? ' is-open' : ''}`}
                aria-hidden={!isExampleOpen}
              >
                <p className="panorama-table__example-title">Example of Parsed Non-Final Rejection</p>
                <pre>
{`{
"claims": [
  {
    "claimNumber": 1,
    "parentClaim": -1,
    "isReject": true,
    "reasons": [
      {
        "sectionCode": 102,
        "citedPatents": [
          {
            "patentNum": "US 20070159740",
            "text": [112, 113, 114, 115, 116, 117, 118, 119],
            "img": ["12"]
          }
        ],
        "reason": "Regarding claim 1, Williams teaches a power cord..."
      }
    ]
  },
  {
    "claimNumber": 2,
    "parentClaim": 1,
    "isReject": true,
    "reasons": [
      {
        "sectionCode": 102,
        "citedPatents": [
          {
            "patentNum": "US 20070159740",
            "text": [120, 121],
            "img": ["12"]
          }
        ],
        "reason": "Regarding claim 2, Williams teaches the power cord, with leakage current detection and interruption device of claim 1,..."
      }
    ]
  },
  // ... additional items with same structure
]
}`}
                </pre>
              </div>
            </div>
          </section>

          <section className="project-section project-section__fade panorama-dataset-curation" ref={fadeInRef}>
            <h2 className="section-title panorama-dataset-curation__title project-fade-block" ref={fadeInRef}>
              Dataset Curation
            </h2>
            <div className="panorama-curation-figure project-fade-block" ref={fadeInRef}>
              <img
                src={`${process.env.PUBLIC_URL}/projects/panorama/curation.png`}
                alt="PANORAMA dataset curation pipeline overview"
                loading="lazy"
              />
            </div>
            <div className="panorama-subsection project-fade-block" ref={fadeInRef}>
              <h3 className="panorama-subsection__title">Data Collection</h3>
              <p className="section-text section-text--small panorama-subsection__body">
                We built a customized pipeline to accurately map USPTO data across multiple APIs and collect only the
                first Non-Final Rejection per application to avoid redundancy. From each rejection, we extracted
                examiner-cited patents via regex and retrieved their abstracts, specifications, claims (via patent_client),
                and drawings (via the USPTO ODP beta API). We also gathered application metadata and initial/final claims
                around the rejection and allowance documents, saving most fields in JSON with specifications and drawings
                stored separately (12,839 entries total).
              </p>
            </div>

            <div className="panorama-subsection project-fade-block" ref={fadeInRef}>
              <h3 className="panorama-subsection__title">Parsing Non-Final Rejection Documents</h3>
              <p className="section-text section-text--small panorama-subsection__body">
                We parsed Non-Final Rejection documents into claim-level data, since examiners evaluate patentability claim by claim,
                labeling each claim as rejected or accepted and recording the grounds for the decision. Using GPT-4o, we classified
                claims by legal basis (§101/§102/§103/§112) and, for §102/§103, extracted cited prior art, supporting paragraphs,
                referenced figure elements, and the full written rationale. We then systematically refined the outputs to fix missing
                or inconsistent evidence, producing a final dataset of 8,143 claim-level entries.
              </p>
            </div>
          </section>
          <div
            className="project-divider project-fade-block"
            role="presentation"
            aria-hidden="true"
            ref={fadeInRef}
          />

          <section className="project-section project-section__fade panorama-benchmark-tasks" ref={fadeInRef}>
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              Benchmark Tasks
            </h2>
            <p className="section-text section-text--small panorama-subsection__body project-fade-block" ref={fadeInRef}>
              We divide patent examination into three benchmark tasks (PAR4PC, PI4PC, NOC4PC) that replicate the main steps taken by
              real-world examiners using the PANORAMA dataset, especially the parsed Non-Final Rejection. Our benchmarks primarily focus on patent
              examination under §102 (novelty) and §103 (non-obviousness), where patentability is decided by comparing the claim with
              the prior art.
            </p>
            <p className="section-text section-text--small panorama-subsection__body project-fade-block" ref={fadeInRef}>
              We established baseline performance by evaluating 12 LLMs spanning proprietary, open-source, and reasoning models across
              the benchmark tasks using two prompting strategies: zero-shot and chain-of-thought (CoT). Reasoning models were evaluated
              only in the CoT setting.
            </p>
            <div className="panorama-benchmark-toggle project-fade-block" ref={fadeInRef}>
              <SegmentedControl
                name="panorama-benchmark-toggle"
                segments={benchmarkSegments}
                value={benchmarkFilter}
                callback={setBenchmarkFilter}
              />
            </div>
            {benchmarkFilter === 'total' ? (
              <div className="panorama-benchmark-table-wrapper project-fade-block" ref={fadeInRef}>
                <table className="panorama-benchmark-table">
                  <thead>
                    <tr>
                      <th rowSpan="2">Model</th>
                      <th colSpan="2">PAR4PC</th>
                      <th colSpan="2">PI4PC</th>
                      <th colSpan="2">NOC4PC</th>
                    </tr>
                    <tr>
                      <th>Zero-shot</th>
                      <th>CoT</th>
                      <th>Zero-shot</th>
                      <th>CoT</th>
                      <th>Zero-shot</th>
                      <th>CoT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benchmarkResults.map((row, index) => {
                      const rowClassNames = ['panorama-benchmark-table__row'];
                      if (row.groupBreakAfter) {
                        rowClassNames.push('panorama-benchmark-table__row--divider');
                      }
                      if (index === 0) {
                        rowClassNames.push('panorama-benchmark-table__row--baseline');
                      }
                      return (
                        <tr key={row.name} className={rowClassNames.join(' ')}>
                          <td className="panorama-benchmark-table__model">{row.name}</td>
                          {['par4pc', 'pi4pc', 'noc4pc'].map((metric) => {
                            return (
                              <React.Fragment key={`${row.name}-${metric}`}>
                                <td
                                  className={
                                    totalBenchmarkLeaders[`${metric}-zeroShot`] === index
                                      ? 'panorama-benchmark-table__value panorama-benchmark-table__value--highlight'
                                      : 'panorama-benchmark-table__value'
                                  }
                                >
                                  {row[metric].zeroShot}
                                </td>
                                <td
                                  className={
                                    totalBenchmarkLeaders[`${metric}-cot`] === index
                                      ? 'panorama-benchmark-table__value panorama-benchmark-table__value--highlight'
                                      : 'panorama-benchmark-table__value'
                                  }
                                >
                                  {row[metric].cot}
                                </td>
                              </React.Fragment>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="panorama-benchmark-caption">
                  Performance comparison of 12 LLMs across three tasks. The baseline score is the average of 20 trials of random
                  responses.
                </p>
              </div>
            ) : (
              visibleBenchmarks.map((task) => (
                <article key={task.key} className="panorama-benchmark-card project-fade-block" ref={fadeInRef}>
                  <h3 className="panorama-subsection__title">{task.title}</h3>
                  <p className="section-text section-text--small panorama-subsection__body">{task.description}</p>
                  {task.key === 'par4pc' && (
                    <div className="panorama-benchmark-table-wrapper panorama-benchmark-table-wrapper--compact">
                      <table className="panorama-benchmark-table panorama-benchmark-table--compact">
                        <thead>
                          <tr>
                            <th rowSpan="2">Model</th>
                            <th rowSpan="2">Mode</th>
                            <th colSpan="3">Custom Score</th>
                            <th colSpan="3">(Exact Match) Accuracy</th>
                          </tr>
                          <tr>
                            <th>All</th>
                            <th>§102 only</th>
                            <th>§103 only</th>
                            <th>All</th>
                            <th>§102 only</th>
                            <th>§103 only</th>
                          </tr>
                        </thead>
                        <tbody>
                          {par4pcDetailedResults.map((entry, entryIndex) => (
                            <React.Fragment key={entry.model}>
                              {entry.rows.map((rowData, rowIndex) => {
                                const modeKey = normalizeModeKey(rowData.mode);
                                return (
                                  <tr
                                    key={`${entry.model}-${rowData.mode}`}
                                    className={
                                      rowIndex === entry.rows.length - 1 && entry.groupBreakAfter
                                        ? 'panorama-benchmark-table__row panorama-benchmark-table__row--divider'
                                        : 'panorama-benchmark-table__row'
                                    }
                                  >
                                  {rowIndex === 0 ? (
                                    <td className="panorama-benchmark-table__model" rowSpan={entry.rows.length}>
                                      {entry.model}
                                    </td>
                                  ) : null}
                                  <td className="panorama-benchmark-table__mode">{rowData.mode}</td>
                                  {rowData.custom.map((value, idx) => (
                                    <td
                                      key={`${entry.model}-${rowData.mode}-custom-${idx}`}
                                      className={
                                        isDetailedColumnLeader(
                                          par4pcColumnLeaders,
                                          'custom',
                                          idx,
                                          modeKey,
                                          entryIndex,
                                          rowIndex
                                        )
                                          ? 'panorama-benchmark-table__value panorama-benchmark-table__value--highlight'
                                          : 'panorama-benchmark-table__value'
                                      }
                                    >
                                      {value}
                                    </td>
                                  ))}
                                  {rowData.accuracy.map((value, idx) => (
                                    <td
                                      key={`${entry.model}-${rowData.mode}-acc-${idx}`}
                                      className={
                                        isDetailedColumnLeader(
                                          par4pcColumnLeaders,
                                          'accuracy',
                                          idx,
                                          modeKey,
                                          entryIndex,
                                          rowIndex
                                        )
                                          ? 'panorama-benchmark-table__value panorama-benchmark-table__value--highlight'
                                          : 'panorama-benchmark-table__value'
                                      }
                                    >
                                      {value}
                                    </td>
                                  ))}
                                </tr>
                                );
                              })}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {task.key === 'pi4pc' && (
                    <div className="panorama-benchmark-table-wrapper panorama-benchmark-table-wrapper--compact">
                      <table className="panorama-benchmark-table panorama-benchmark-table--compact">
                        <thead>
                          <tr>
                            <th rowSpan="2">Model</th>
                            <th rowSpan="2">Mode</th>
                            <th colSpan="3">Custom Score</th>
                            <th colSpan="3">(Exact Match) Accuracy</th>
                          </tr>
                          <tr>
                            <th>All</th>
                            <th>§102 only</th>
                            <th>§103 only</th>
                            <th>All</th>
                            <th>§102 only</th>
                            <th>§103 only</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pi4pcDetailedResults.map((entry, entryIndex) => (
                            <React.Fragment key={entry.model}>
                              {entry.rows.map((rowData, rowIndex) => {
                                const modeKey = normalizeModeKey(rowData.mode);
                                return (
                                  <tr
                                    key={`${entry.model}-${rowData.mode}`}
                                    className={
                                      rowIndex === entry.rows.length - 1 && entry.groupBreakAfter
                                        ? 'panorama-benchmark-table__row panorama-benchmark-table__row--divider'
                                        : 'panorama-benchmark-table__row'
                                    }
                                  >
                                    {rowIndex === 0 ? (
                                      <td className="panorama-benchmark-table__model" rowSpan={entry.rows.length}>
                                        {entry.model}
                                      </td>
                                    ) : null}
                                    <td className="panorama-benchmark-table__mode">{rowData.mode}</td>
                                  {rowData.custom.map((value, idx) => (
                                    <td
                                      key={`${entry.model}-${rowData.mode}-custom-${idx}`}
                                      className={
                                        isDetailedColumnLeader(
                                          pi4pcColumnLeaders,
                                          'custom',
                                          idx,
                                          modeKey,
                                          entryIndex,
                                          rowIndex
                                        )
                                          ? 'panorama-benchmark-table__value panorama-benchmark-table__value--highlight'
                                          : 'panorama-benchmark-table__value'
                                      }
                                    >
                                      {value}
                                      </td>
                                    ))}
                                  {rowData.accuracy.map((value, idx) => (
                                    <td
                                      key={`${entry.model}-${rowData.mode}-acc-${idx}`}
                                      className={
                                        isDetailedColumnLeader(
                                          pi4pcColumnLeaders,
                                          'accuracy',
                                          idx,
                                          modeKey,
                                          entryIndex,
                                          rowIndex
                                        )
                                          ? 'panorama-benchmark-table__value panorama-benchmark-table__value--highlight'
                                          : 'panorama-benchmark-table__value'
                                      }
                                    >
                                      {value}
                                      </td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {task.key === 'noc4pc' && (
                    <div className="panorama-benchmark-table-wrapper panorama-benchmark-table-wrapper--compact">
                      <table className="panorama-benchmark-table panorama-benchmark-table--compact">
                        <thead>
                          <tr>
                            <th rowSpan="2">Model</th>
                            <th rowSpan="2">Mode</th>
                            <th colSpan="4">Custom Score</th>
                            <th colSpan="4">(Exact Match) Accuracy</th>
                          </tr>
                          <tr>
                            <th>Overall</th>
                            <th>§102 only</th>
                            <th>§103 only</th>
                            <th>Allow</th>
                            <th>Overall</th>
                            <th>§102 only</th>
                            <th>§103 only</th>
                            <th>Allow</th>
                          </tr>
                        </thead>
                        <tbody>
                          {noc4pcDetailedResults.map((entry, entryIndex) => (
                            <React.Fragment key={entry.model}>
                              {entry.rows.map((rowData, rowIndex) => {
                                const modeKey = normalizeModeKey(rowData.mode);
                                return (
                                  <tr
                                    key={`${entry.model}-${rowData.mode}`}
                                    className={
                                      rowIndex === entry.rows.length - 1 && entry.groupBreakAfter
                                        ? 'panorama-benchmark-table__row panorama-benchmark-table__row--divider'
                                        : 'panorama-benchmark-table__row'
                                    }
                                  >
                                    {rowIndex === 0 ? (
                                      <td className="panorama-benchmark-table__model" rowSpan={entry.rows.length}>
                                        {entry.model}
                                      </td>
                                    ) : null}
                                    <td className="panorama-benchmark-table__mode">{rowData.mode}</td>
                                    {rowData.custom.map((value, idx) => (
                                      <td
                                        key={`${entry.model}-${rowData.mode}-custom-${idx}`}
                                        className={
                                          isDetailedColumnLeader(
                                            noc4pcColumnLeaders,
                                            'custom',
                                            idx,
                                            modeKey,
                                            entryIndex,
                                            rowIndex
                                          )
                                            ? 'panorama-benchmark-table__value panorama-benchmark-table__value--highlight'
                                            : 'panorama-benchmark-table__value'
                                        }
                                      >
                                        {value}
                                      </td>
                                    ))}
                                    {rowData.accuracy.map((value, idx) => (
                                      <td
                                        key={`${entry.model}-${rowData.mode}-acc-${idx}`}
                                        className={
                                          isDetailedColumnLeader(
                                            noc4pcColumnLeaders,
                                            'accuracy',
                                            idx,
                                            modeKey,
                                            entryIndex,
                                            rowIndex
                                          )
                                            ? 'panorama-benchmark-table__value panorama-benchmark-table__value--highlight'
                                            : 'panorama-benchmark-table__value'
                                        }
                                      >
                                        {value}
                                      </td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </article>
              ))
            )}
          </section>
          <div
            className="project-divider project-fade-block"
            role="presentation"
            aria-hidden="true"
            ref={fadeInRef}
          />

          <section className="project-section project-section__fade" ref={fadeInRef}>
            <h2 className="section-title project-fade-block" ref={fadeInRef}>BibTeX</h2>
            <BibtexCard
              ref={fadeInRef}
              className="project-fade-block"
              text={`@inproceedings{NEURIPS2025_4aab82c8,
 author = {Lim, Hyunseung and Nam, Sooyohn and Na, Sungmin and Cho, Ji Yong and Yang, June Yong and Shin, Hyungyu and Lee, Yoonjoo and Kim, Juho and Lee, Moontae and Hong, Hwajung},
 booktitle = {Advances in Neural Information Processing Systems},
 editor = {D. Belgrave and C. Zhang and H. Lin and L. Montoya and R. Pascanu and P. Koniusz and M. Ghassemi and N. Chen},
 pages = {},
 publisher = {Curran Associates, Inc.},
 title = {PANORAMA: A Dataset and Benchmarks Capturing Decision Trails and Rationales in Patent Examination},
 url = {https://proceedings.neurips.cc/paper_files/paper/2025/file/4aab82c8d6b77c0b6b010145c1bfcdd3-Paper-Datasets_and_Benchmarks_Track.pdf},
 volume = {38},
 year = {2025}
}`}
            />
          </section>
        </main>
        </div>

        <Footer />
      </div>
    </PageLoadGuard>
  );
};
